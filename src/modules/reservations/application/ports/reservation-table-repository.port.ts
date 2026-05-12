/**
 * Archivo: reservation-table-repository.port.ts
 * Responsabilidad: Definir el contrato de persistencia para la asignación mesa↔reserva.
 * Tipo: lógica
 */

import { type ReservationTable } from "../../domain/entities/reservation-table.entity";

export interface ReservationTableRepository {
  /**
   * Devuelve los IDs de mesas que tienen reservas activas solapando un rango temporal.
   * Usado para determinar qué mesas están libres al momento de crear una reserva.
   */
  findOccupiedTableIds(restaurantId: string, from: Date, to: Date): Promise<string[]>;

  /**
   * Devuelve las asignaciones mesa↔reserva cuyas reservas se solapan con el rango dado.
   * Usado para construir el timeline diario.
   */
  findByDateRange(
    restaurantId: string,
    from: Date,
    to: Date
  ): Promise<Array<{ reservationId: string; tableId: string }>>;

  /**
   * Persiste una asignación mesa↔reserva.
   */
  save(reservationTable: ReservationTable): Promise<ReservationTable>;
}
