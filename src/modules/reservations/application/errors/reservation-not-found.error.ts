/**
 * Archivo: reservation-not-found.error.ts
 * Responsabilidad: Representar el error de aplicación cuando una reserva no existe.
 * Tipo: lógica
 */

export class ReservationNotFoundError extends Error {
  constructor(public readonly reservationId: string) {
    super(`Reservation ${reservationId} was not found.`);
    this.name = "ReservationNotFoundError";
  }
}
