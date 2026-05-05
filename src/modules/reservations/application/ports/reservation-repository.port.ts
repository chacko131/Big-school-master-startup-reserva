/**
 * Archivo: reservation-repository.port.ts
 * Responsabilidad: Definir el puerto de persistencia para reservas.
 * Tipo: lógica
 */

import { Reservation } from "../../domain/entities/reservation.entity";

export interface ReservationRepository {
  findById(id: string): Promise<Reservation | null>;
  findByRestaurantAndDateRange(
    restaurantId: string,
    from: Date,
    to: Date
  ): Promise<Reservation[]>;
  findByGuestId(guestId: string): Promise<Reservation[]>;
  save(reservation: Reservation): Promise<Reservation>;
}
