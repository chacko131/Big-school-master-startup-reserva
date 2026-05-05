/**
 * Archivo: create-reservation-full.use-case.ts
 * Responsabilidad: Orquestar la creación completa de una reserva desde el flujo público:
 *   find-or-create guest → validar disponibilidad → crear reserva → auto-confirmar si aplica.
 * Tipo: lógica
 */

import { Guest } from "../../domain/entities/guest.entity";
import { Reservation } from "../../domain/entities/reservation.entity";
import { type GuestRepository } from "../ports/guest-repository.port";
import { type ReservationRepository } from "../ports/reservation-repository.port";
import { type RestaurantSettingsRepository } from "../ports/restaurant-settings-repository.port";
import {
  type CreateReservationFullInput,
  type CreateReservationFullOutput,
} from "../dtos/create-reservation-full.dto";
import { NoAvailabilityError } from "../errors/no-availability.error";

export class CreateReservationFull {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    private readonly guestRepository: GuestRepository,
    private readonly restaurantSettingsRepository: RestaurantSettingsRepository
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
    const settings = await this.restaurantSettingsRepository.findByRestaurantId(
      input.restaurantId
    );

    if (settings === null) {
      throw new Error("Restaurant settings not found.");
    }

    const settingsPrimitives = settings.toPrimitives();
    const durationMinutes = settingsPrimitives.defaultReservationDurationMinutes;
    const cancellationHours = settingsPrimitives.cancellationWindowHours;
    const approvalMode = settingsPrimitives.reservationApprovalMode;

    const endAt = new Date(input.startAt.getTime() + durationMinutes * 60 * 1000);
    const cancellationDeadlineAt = new Date(
      input.startAt.getTime() - cancellationHours * 60 * 60 * 1000
    );

    const existingReservations =
      await this.reservationRepository.findByRestaurantAndDateRange(
        input.restaurantId,
        input.startAt,
        endAt
      );

    if (existingReservations.length > 0) {
      const hasConflict = existingReservations.some((r) => {
        const rStart = r.startAt.getTime();
        const rEnd = r.endAt.getTime();
        const cStart = input.startAt.getTime();
        const cEnd = endAt.getTime();

        return rStart < cEnd && rEnd > cStart;
      });

      if (hasConflict) {
        throw new NoAvailabilityError(input.startAt);
      }
    }

    const guest = await this.findOrCreateGuest(input);

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
    }

    const persisted = await this.reservationRepository.save(reservation);

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

  //-aqui empieza funcion findOrCreateGuest y es para buscar o crear un guest por teléfono-//
  /**
   * Busca un guest existente por restaurante+teléfono o crea uno nuevo.
   * @sideEffect
   */
  private async findOrCreateGuest(
    input: CreateReservationFullInput
  ): Promise<Guest> {
    const existingGuest = await this.guestRepository.findByRestaurantAndPhone(
      input.restaurantId,
      input.guestPhone
    );

    if (existingGuest !== null) {
      return existingGuest;
    }

    const newGuest = Guest.create({
      id: crypto.randomUUID(),
      restaurantId: input.restaurantId,
      fullName: input.guestFullName,
      phone: input.guestPhone,
      email: input.guestEmail ?? null,
    });

    return this.guestRepository.save(newGuest);
  }
  //-aqui termina funcion findOrCreateGuest y se va autilizar en execute-//
}
