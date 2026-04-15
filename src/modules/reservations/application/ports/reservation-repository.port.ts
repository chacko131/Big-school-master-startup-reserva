/**
 * Archivo: reservation-repository.port.ts
 * Responsabilidad: Definir el puerto de persistencia para reservas.
 * Tipo: lógica
 */

import { Reservation } from "../../domain/entities/reservation.entity";

export interface ReservationRepository {
  findById(id: string): Promise<Reservation | null>;
  save(reservation: Reservation): Promise<Reservation>;
}
