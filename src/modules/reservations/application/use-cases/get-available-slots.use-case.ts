/**
 * Archivo: get-available-slots.use-case.ts
 * Responsabilidad: Calcular los slots horarios disponibles para una fecha y tamaño de grupo dados.
 * Tipo: lógica
 */

import { type DiningTableRepository } from "../ports/dining-table-repository.port";
import { type ReservationRepository } from "../ports/reservation-repository.port";
import { type RestaurantSettingsRepository } from "../ports/restaurant-settings-repository.port";
import {
  type BusinessHoursRepository,
  type BusinessHoursSlot,
} from "../ports/business-hours-repository.port";
import {
  type GetAvailableSlotsInput,
  type GetAvailableSlotsOutput,
  type AvailableSlot,
} from "../dtos/get-available-slots.dto";

const DAYS_OF_WEEK = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
] as const;

export class GetAvailableSlots {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    private readonly diningTableRepository: DiningTableRepository,
    private readonly restaurantSettingsRepository: RestaurantSettingsRepository,
    private readonly businessHoursRepository: BusinessHoursRepository
  ) {}

  //-aqui empieza funcion execute y es para calcular slots disponibles en una fecha dada-//
  /**
   * Calcula los slots horarios disponibles cruzando horarios de apertura,
   * mesas activas, reservas existentes y configuración del restaurante.
   * @pure
   */
  async execute(input: GetAvailableSlotsInput): Promise<GetAvailableSlotsOutput> {
    const [settings, tables, businessHours, existingReservations] =
      await Promise.all([
        this.restaurantSettingsRepository.findByRestaurantId(input.restaurantId),
        this.diningTableRepository.findActiveByRestaurantId(input.restaurantId),
        this.businessHoursRepository.findByRestaurantId(input.restaurantId),
        this.reservationRepository.findByRestaurantAndDateRange(
          input.restaurantId,
          startOfDay(input.date),
          endOfDay(input.date)
        ),
      ]);

    if (settings === null) {
      return { date: input.date, slots: [] };
    }

    const dayName = DAYS_OF_WEEK[input.date.getDay()];
    const todaySlots = businessHours.filter(
      (bh) => bh.day === dayName && !bh.isClosed
    );

    if (todaySlots.length === 0) {
      return { date: input.date, slots: [] };
    }

    const durationMinutes = settings.toPrimitives().defaultReservationDurationMinutes;
    const bufferMinutes = settings.toPrimitives().reservationBufferMinutes;
    const allowCombination = settings.toPrimitives().allowTableCombination;

    const tablesForParty = tables.filter(
      (t) => t.toPrimitives().capacity >= input.partySize
    );

    const combinableTables = allowCombination ? tables : tablesForParty;

    if (combinableTables.length === 0 && tablesForParty.length === 0) {
      return { date: input.date, slots: [] };
    }

    const availableSlots: AvailableSlot[] = [];

    const totalTablesForParty = tablesForParty.length;
    const totalCombinableCapacity = allowCombination
      ? combinableTables.reduce((sum, t) => sum + t.toPrimitives().capacity, 0)
      : 0;

    for (const businessSlot of todaySlots) {
      const slotCandidates = generateTimeSlots(
        input.date,
        businessSlot,
        durationMinutes,
        bufferMinutes
      );

      for (const candidate of slotCandidates) {
        const conflictingCount = existingReservations.filter((r) => {
          const rStart = r.startAt.getTime();
          const rEnd = r.endAt.getTime();
          const cStart = candidate.startAt.getTime();
          const cEnd = candidate.endAt.getTime();

          return rStart < cEnd && rEnd > cStart;
        }).length;

        const freeTablesCount = totalTablesForParty - conflictingCount;

        if (freeTablesCount > 0) {
          availableSlots.push({
            startAt: candidate.startAt,
            endAt: candidate.endAt,
            availableTables: freeTablesCount,
          });
        } else if (allowCombination && totalCombinableCapacity >= input.partySize) {
          const totalConflictingSeats = existingReservations
            .filter((r) => {
              const rStart = r.startAt.getTime();
              const rEnd = r.endAt.getTime();
              const cStart = candidate.startAt.getTime();
              const cEnd = candidate.endAt.getTime();

              return rStart < cEnd && rEnd > cStart;
            })
            .reduce((sum, r) => sum + r.partySize, 0);

          const remainingCapacity = totalCombinableCapacity - totalConflictingSeats;

          if (remainingCapacity >= input.partySize) {
            availableSlots.push({
              startAt: candidate.startAt,
              endAt: candidate.endAt,
              availableTables: 1,
            });
          }
        }
      }
    }

    return { date: input.date, slots: availableSlots };
  }
  //-aqui termina funcion execute y se va autilizar en el frontend de reservas-//
}

//-aqui empieza funcion generateTimeSlots y es para generar candidatos de horario-//
/**
 * Genera slots candidatos dentro de una franja de apertura.
 * Soporta horarios nocturnos donde closesAt < opensAt (ej: 20:00 → 02:00).
 * @pure
 */
function generateTimeSlots(
  date: Date,
  businessSlot: BusinessHoursSlot,
  durationMinutes: number,
  bufferMinutes: number
): { startAt: Date; endAt: Date }[] {
  const slots: { startAt: Date; endAt: Date }[] = [];

  const [openH, openM] = businessSlot.opensAt.split(":").map(Number);
  const [closeH, closeM] = businessSlot.closesAt.split(":").map(Number);

  const openMinutes = openH * 60 + openM;
  let closeMinutes = closeH * 60 + closeM;

  if (closeMinutes <= openMinutes) {
    closeMinutes += 24 * 60;
  }

  const stepMinutes = 30;
  const totalBlockMinutes = durationMinutes + bufferMinutes;
  const MINUTES_IN_DAY = 24 * 60;

  for (
    let minuteOffset = openMinutes;
    minuteOffset + totalBlockMinutes <= closeMinutes;
    minuteOffset += stepMinutes
  ) {
    const normalizedStart = minuteOffset % MINUTES_IN_DAY;
    const startAt = new Date(date);
    startAt.setHours(Math.floor(normalizedStart / 60), normalizedStart % 60, 0, 0);
    if (minuteOffset >= MINUTES_IN_DAY) {
      startAt.setDate(startAt.getDate() + 1);
    }

    const endOffset = minuteOffset + durationMinutes;
    const normalizedEnd = endOffset % MINUTES_IN_DAY;
    const endAt = new Date(date);
    endAt.setHours(Math.floor(normalizedEnd / 60), normalizedEnd % 60, 0, 0);
    if (endOffset >= MINUTES_IN_DAY) {
      endAt.setDate(endAt.getDate() + 1);
    }

    slots.push({ startAt, endAt });
  }

  return slots;
}
//-aqui termina funcion generateTimeSlots y se va autilizar en GetAvailableSlots-//

//-aqui empieza funcion startOfDay y es para obtener el inicio del dia-//
/**
 * Devuelve el inicio del día (00:00:00.000).
 * @pure
 */
function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);

  return d;
}
//-aqui termina funcion startOfDay y se va autilizar en execute-//

//-aqui empieza funcion endOfDay y es para obtener el final del dia-//
/**
 * Devuelve el final del día (23:59:59.999).
 * @pure
 */
function endOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);

  return d;
}
//-aqui termina funcion endOfDay y se va autilizar en execute-//
