/**
 * Archivo: create-reservation-full.dto.ts
 * Responsabilidad: Definir los contratos de entrada y salida para el caso de uso CreateReservationFull.
 * Tipo: lógica
 */

export interface CreateReservationFullInput {
  restaurantId: string;
  guestFullName: string;
  guestPhone: string;
  guestEmail?: string | null;
  partySize: number;
  startAt: Date;
  specialRequests?: string | null;
}

export interface CreateReservationFullOutput {
  reservationId: string;
  guestId: string;
  status: string;
  startAt: Date;
  endAt: Date;
  cancellationDeadlineAt: Date | null;
}
