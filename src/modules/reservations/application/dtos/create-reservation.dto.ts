/**
 * Archivo: create-reservation.dto.ts
 * Responsabilidad: Definir el contrato de entrada para el caso de uso CreateReservation.
 * Tipo: lógica
 */

export interface CreateReservationDto {
  id: string;
  restaurantId: string;
  guestId: string;
  partySize: number;
  startAt: Date;
  endAt: Date;
  cancellationDeadlineAt?: Date | null;
  specialRequests?: string | null;
  internalNotes?: string | null;
}
