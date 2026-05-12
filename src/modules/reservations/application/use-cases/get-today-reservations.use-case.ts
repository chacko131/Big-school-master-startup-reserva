/**
 * Archivo: get-today-reservations.use-case.ts
 * Responsabilidad: Obtener las reservas del día para un restaurante, enriquecidas con datos del guest.
 * Tipo: lógica
 */

import { type GuestRepository } from "../ports/guest-repository.port";
import { type ReservationRepository } from "../ports/reservation-repository.port";
import {
  type GetTodayReservationsInput,
  type GetTodayReservationsOutput,
  type ReservationWithGuest,
} from "../dtos/get-today-reservations.dto";

export class GetTodayReservations {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    private readonly guestRepository: GuestRepository
  ) {}

  //-aqui empieza funcion execute y es para obtener reservas del dia con datos del guest-//
  /**
   * Obtiene reservas activas del día y enriquece cada una con el nombre del guest.
   * @sideEffect
   */
  async execute(input: GetTodayReservationsInput): Promise<GetTodayReservationsOutput> {
    const startOfDay = new Date(input.date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(input.date);
    endOfDay.setHours(23, 59, 59, 999);

    const reservations = await this.reservationRepository.findByRestaurantAndDateRange(
      input.restaurantId,
      startOfDay,
      endOfDay
    );

    const guestIds = [...new Set(reservations.map((r) => r.guestId))];

    const guests = await Promise.all(
      guestIds.map((guestId) => this.guestRepository.findById(guestId))
    );

    const guestMap = new Map(
      guests
        .filter((g) => g !== null)
        .map((g) => [g.id, g])
    );

    const enrichedReservations: ReservationWithGuest[] = reservations.map((reservation) => {
      const primitives = reservation.toPrimitives();
      const guest = guestMap.get(primitives.guestId);


      return {
        id: primitives.id,
        guestId: primitives.guestId,
        guestFullName: guest?.fullName ?? "Desconocido",
        guestPhone: guest?.phone ?? "",
        partySize: primitives.partySize,
        startAt: primitives.startAt,
        endAt: primitives.endAt,
        status: primitives.status,
        specialRequests: primitives.specialRequests,
      };
    });

    return {
      reservations: enrichedReservations,
      totalCount: enrichedReservations.length,
    };
  }
  //-aqui termina funcion execute y se va autilizar en el dashboard de reservas-//
}
