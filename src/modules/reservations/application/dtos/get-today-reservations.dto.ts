/**
 * Archivo: get-today-reservations.dto.ts
 * Responsabilidad: Definir los contratos de entrada y salida para el caso de uso GetTodayReservations.
 * Tipo: lógica
 */

import { type ReservationStatus } from "../../domain/entities/reservation.entity";

export interface GetTodayReservationsInput {
  restaurantId: string;
  date: Date;
}

export interface ReservationWithGuest {
  id: string;
  guestId: string;
  guestFullName: string;
  guestPhone: string;
  partySize: number;
  startAt: Date;
  endAt: Date;
  status: ReservationStatus;
  specialRequests: string | null;
}

export interface GetTodayReservationsOutput {
  reservations: ReservationWithGuest[];
  totalCount: number;
}
