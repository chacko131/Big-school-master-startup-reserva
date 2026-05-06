/**
 * Archivo: create-reservation-full.use-case.ts
 * Responsabilidad: Orquestar la creación completa de una reserva desde el flujo público:
 *   find-or-create guest → validar disponibilidad → crear reserva → auto-confirmar si aplica.
 * Tipo: lógica
 */

import { Guest } from "../../domain/entities/guest.entity";
import { Reservation } from "../../domain/entities/reservation.entity";
import { type BusinessHoursRepository } from "../ports/business-hours-repository.port";
import { type DiningTableRepository } from "../ports/dining-table-repository.port";
import { type GuestRepository } from "../ports/guest-repository.port";
import { type ReservationRepository } from "../ports/reservation-repository.port";
import { type RestaurantSettingsRepository } from "../ports/restaurant-settings-repository.port";
import {
  type CreateReservationFullInput,
  type CreateReservationFullOutput,
} from "../dtos/create-reservation-full.dto";
import { DuplicateReservationError } from "../errors/duplicate-reservation.error";
import { NoAvailabilityError } from "../errors/no-availability.error";
import { OutsideBusinessHoursError } from "../errors/outside-business-hours.error";

const ALTERNATIVE_SLOTS_COUNT = 3;
const ALTERNATIVE_SLOT_STEP_MINUTES = 30;
const MINUTES_IN_DAY = 24 * 60;

//-aqui empieza funcion parseTimeToMinutes y es para validar y convertir hora HH:MM a minutos-//
/**
 * Valida formato "HH:MM" y convierte a minutos desde medianoche.
 * Lanza error si el formato es inválido o valores fuera de rango.
 * @pure
 */
function parseTimeToMinutes(time: string): number {
  const parts = time.split(":");
  if (parts.length !== 2) {
    throw new Error(`Invalid time format: "${time}". Expected "HH:MM".`);
  }
  const [hoursStr, minutesStr] = parts;
  const hours = Number(hoursStr);
  const minutes = Number(minutesStr);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    throw new Error(`Invalid time format: "${time}". Hours and minutes must be numbers.`);
  }
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    throw new Error(`Invalid time values: "${time}". Hours must be 0-23, minutes 0-59.`);
  }
  return hours * 60 + minutes;
}
//-aqui termina funcion parseTimeToMinutes-//

export class CreateReservationFull {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    private readonly guestRepository: GuestRepository,
    private readonly restaurantSettingsRepository: RestaurantSettingsRepository,
    private readonly diningTableRepository: DiningTableRepository,
    private readonly businessHoursRepository: BusinessHoursRepository
  ) {}

  //-aqui empieza funcion execute y es para orquestar la creación completa de una reserva-//
  /**
   * Ejecuta el flujo completo de creación de reserva desde el lado público.
   * @sideEffect
   */
  // TODO [V2]: Envolver conflict-check + save en una transacción serializable o exclusion constraint
  //  para evitar race condition TOCTOU bajo concurrencia alta (CodeRabbit #5).
  // TODO [V2]: Cuando se implemente asignación de mesas, la verificación de disponibilidad debe
  //  cruzar tableAssignments en vez de contar reservas solapadas (CodeRabbit #8).
  async execute(input: CreateReservationFullInput): Promise<CreateReservationFullOutput> {
    console.log("[CreateReservationFull] START", {
      restaurantId: input.restaurantId,
      guestPhone: input.guestPhone,
      guestFullName: input.guestFullName,
      partySize: input.partySize,
      startAt: input.startAt.toISOString(),
    });

    const settings = await this.restaurantSettingsRepository.findByRestaurantId(
      input.restaurantId
    );

    if (settings === null) {
      console.error("[CreateReservationFull] ERROR settings no encontrados para restaurantId=", input.restaurantId);
      throw new Error("Restaurant settings not found.");
    }

    const settingsPrimitives = settings.toPrimitives();
    const durationMinutes = settingsPrimitives.defaultReservationDurationMinutes;
    const bufferMinutes = settingsPrimitives.reservationBufferMinutes;
    const cancellationHours = settingsPrimitives.cancellationWindowHours;
    const approvalMode = settingsPrimitives.reservationApprovalMode;

    console.log("[CreateReservationFull] settings cargados →", { durationMinutes, bufferMinutes, cancellationHours, approvalMode });

    const endAt = new Date(input.startAt.getTime() + durationMinutes * 60 * 1000);
    const cancellationDeadlineAt = new Date(
      input.startAt.getTime() - cancellationHours * 60 * 60 * 1000
    );

    console.log("[CreateReservationFull] rango calculado →", {
      startAt: input.startAt.toISOString(),
      endAt: endAt.toISOString(),
      cancellationDeadlineAt: cancellationDeadlineAt.toISOString(),
    });

    // --- Validar horario de apertura ---
    const businessHours = await this.businessHoursRepository.findByRestaurantId(input.restaurantId);
    const isWithinBusinessHours = this.isWithinBusinessHours(input.startAt, endAt, businessHours);

    if (!isWithinBusinessHours) {
      console.warn("[CreateReservationFull] OUTSIDE HOURS → reserva fuera del horario de negocio para", input.startAt.toISOString());
      throw new OutsideBusinessHoursError(input.startAt);
    }

    // --- Buffer: el check de solapamiento incluye el buffer de limpieza ---
    const bufferedEndAt = new Date(endAt.getTime() + bufferMinutes * 60 * 1000);

    const existingReservations =
      await this.reservationRepository.findByRestaurantAndDateRange(
        input.restaurantId,
        input.startAt,
        bufferedEndAt
      );

    const activeTables = await this.diningTableRepository.findActiveByRestaurantId(input.restaurantId);
    const totalActiveTables = activeTables.length;

    console.log(`[CreateReservationFull] mesas activas en el restaurante: ${totalActiveTables}`);
    console.log(`[CreateReservationFull] reservas solapadas encontradas: ${existingReservations.length}`);

    const overlappingCount = existingReservations.filter((r) => {
      const rStart = r.startAt.getTime();
      const rEnd = r.endAt.getTime();
      const cStart = input.startAt.getTime();
      const cEnd = bufferedEndAt.getTime();
      return rStart < cEnd && rEnd > cStart;
    }).length;

    console.log(`[CreateReservationFull] reservas que solapan exactamente: ${overlappingCount} / ${totalActiveTables} mesas`);

    if (totalActiveTables === 0 || overlappingCount >= totalActiveTables) {
      const alternatives = await this.findAlternativeSlots(
        input.restaurantId,
        input.startAt,
        durationMinutes,
        bufferMinutes,
        totalActiveTables,
        businessHours
      );

      console.warn("[CreateReservationFull] CONFLICT → sin mesas disponibles para", input.startAt.toISOString(), "| alternativas:", alternatives.map((alt: Date) => alt.toISOString()));
      throw new NoAvailabilityError(input.startAt, alternatives);
    }

    const guest = await this.findOrCreateGuest(input);

    console.log("[CreateReservationFull] guest resuelto →", { guestId: guest.id, fullName: guest.fullName });

    // --- Detectar reserva duplicada del mismo guest en el mismo restaurante y franja ---
    const guestExistingReservations = await this.reservationRepository.findActiveByGuestAndDateRange(
      guest.id,
      input.restaurantId,
      input.startAt,
      bufferedEndAt
    );

    if (guestExistingReservations.length > 0) {
      const conflictId = guestExistingReservations[0].id;
      console.warn("[CreateReservationFull] DUPLICATE → guest ya tiene reserva activa:", conflictId);
      throw new DuplicateReservationError(guest.id, conflictId);
    }

    const reservationId = crypto.randomUUID();

    let reservation = Reservation.create({
      id: reservationId,
      restaurantId: input.restaurantId,
      guestId: guest.id,
      partySize: input.partySize,
      startAt: input.startAt,
      endAt,
      cancellationDeadlineAt,
      specialRequests: input.specialRequests ?? null,
    });

    if (approvalMode === "AUTO") {
      reservation = reservation.confirm();
      console.log("[CreateReservationFull] reserva auto-confirmada (approvalMode=AUTO)");
    } else {
      console.log("[CreateReservationFull] reserva en estado PENDING (approvalMode=MANUAL)");
    }

    const persisted = await this.reservationRepository.save(reservation);

    console.log("[CreateReservationFull] END → reserva persistida", {
      reservationId: persisted.id,
      status: persisted.status,
      startAt: persisted.startAt.toISOString(),
      endAt: persisted.endAt.toISOString(),
    });

    return {
      reservationId: persisted.id,
      guestId: guest.id,
      status: persisted.status,
      startAt: persisted.startAt,
      endAt: persisted.endAt,
      cancellationDeadlineAt: persisted.cancellationDeadlineAt,
    };
  }
  //-aqui termina funcion execute y se va autilizar en server actions del flujo público-//

  //-aqui empieza funcion findAlternativeSlots y es para sugerir horarios cercanos con disponibilidad-//
  /**
   * Busca hasta ALTERNATIVE_SLOTS_COUNT franjas horarias cercanas donde haya mesas libres.
   * Prueba slots hacia adelante y hacia atrás en pasos de ALTERNATIVE_SLOT_STEP_MINUTES.
   * @sideEffect
   */
  private async findAlternativeSlots(
    restaurantId: string,
    requestedStart: Date,
    durationMinutes: number,
    bufferMinutes: number,
    totalActiveTables: number,
    businessHours: { day: string; opensAt: string; closesAt: string; isClosed: boolean }[]
  ): Promise<Date[]> {
    const alternatives: Date[] = [];
    const stepMs = ALTERNATIVE_SLOT_STEP_MINUTES * 60 * 1000;
    const maxAttempts = 12;

    for (let i = 1; i <= maxAttempts && alternatives.length < ALTERNATIVE_SLOTS_COUNT; i++) {
      for (const direction of [1, -1]) {
        if (alternatives.length >= ALTERNATIVE_SLOTS_COUNT) break;

        const candidateStart = new Date(requestedStart.getTime() + direction * i * stepMs);
        const candidateEnd = new Date(candidateStart.getTime() + durationMinutes * 60 * 1000);
        const candidateBufferedEnd = new Date(candidateEnd.getTime() + bufferMinutes * 60 * 1000);

        if (!this.isWithinBusinessHours(candidateStart, candidateEnd, businessHours)) {
          continue;
        }

        const overlapping = await this.reservationRepository.findByRestaurantAndDateRange(
          restaurantId,
          candidateStart,
          candidateBufferedEnd
        );

        const overlappingCount = overlapping.filter((r) => {
          return r.startAt.getTime() < candidateBufferedEnd.getTime() && r.endAt.getTime() > candidateStart.getTime();
        }).length;

        if (overlappingCount < totalActiveTables) {
          alternatives.push(candidateStart);
        }
      }
    }

    return alternatives;
  }

  //-aqui empieza funcion isWithinBusinessHours y es para verificar que la reserva cae dentro del horario del restaurante-//
  /**
   * Verifica que el slot [startAt, endAt] quede completamente dentro de al menos una franja de apertura del día.
   * Soporta franjas nocturnas donde closesAt < opensAt (ej: 20:00 → 02:00).
   * @pure
   */
  private isWithinBusinessHours(
    startAt: Date,
    endAt: Date,
    businessHours: { day: string; opensAt: string; closesAt: string; isClosed: boolean }[]
  ): boolean {
    if (businessHours.length === 0) {
      return true;
    }

    const DAYS_OF_WEEK_MAP = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"] as const;
    const dayName = DAYS_OF_WEEK_MAP[startAt.getDay()];
    const todaySlots = businessHours.filter((bh) => bh.day === dayName && !bh.isClosed);

    if (todaySlots.length === 0) {
      return false;
    }

    const startMinutes = startAt.getHours() * 60 + startAt.getMinutes();
    const endMinutes = endAt.getHours() * 60 + endAt.getMinutes();
    return todaySlots.some((slot) => {
      const openMinutes = parseTimeToMinutes(slot.opensAt);
      let closeMinutes = parseTimeToMinutes(slot.closesAt);

      if (closeMinutes <= openMinutes) {
        closeMinutes += MINUTES_IN_DAY;
      }

      let normalizedStart = startMinutes;
      let normalizedEnd = endMinutes <= startMinutes && endMinutes < openMinutes
        ? endMinutes + MINUTES_IN_DAY
        : endMinutes;

      if (normalizedStart < openMinutes) {
        normalizedStart += MINUTES_IN_DAY;
        normalizedEnd += MINUTES_IN_DAY;
      }

      return normalizedStart >= openMinutes && normalizedEnd <= closeMinutes;
    });
  }
  //-aqui termina funcion isWithinBusinessHours-//
  //-aqui termina funcion findAlternativeSlots-//

  //-aqui empieza funcion findOrCreateGuest y es para buscar o crear un guest por teléfono-//
  /**
   * Busca un guest existente por restaurante+teléfono o crea uno nuevo.
   * @sideEffect
   */
  private async findOrCreateGuest(
    input: CreateReservationFullInput
  ): Promise<Guest> {
    console.log("[CreateReservationFull] findOrCreateGuest buscando phone=", input.guestPhone);

    const existingGuest = await this.guestRepository.findByRestaurantAndPhone(
      input.restaurantId,
      input.guestPhone
    );

    if (existingGuest !== null) {
      console.log("[CreateReservationFull] guest existente encontrado →", { guestId: existingGuest.id, fullName: existingGuest.fullName });
      return existingGuest;
    }

    console.log("[CreateReservationFull] guest no existe → creando nuevo");

    const newGuest = Guest.create({
      id: crypto.randomUUID(),
      restaurantId: input.restaurantId,
      fullName: input.guestFullName,
      phone: input.guestPhone,
      email: input.guestEmail ?? null,
    });

    const saved = await this.guestRepository.save(newGuest);
    console.log("[CreateReservationFull] nuevo guest creado →", { guestId: saved.id, fullName: saved.fullName });
    return saved;
  }
  //-aqui termina funcion findOrCreateGuest y se va autilizar en execute-//
}
