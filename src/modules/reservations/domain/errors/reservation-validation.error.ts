/**
 * Archivo: reservation-validation.error.ts
 * Responsabilidad: Representar errores de validación del dominio Reservation.
 * Tipo: lógica
 */

export class ReservationValidationError extends Error {
  constructor(
    public readonly fieldName: string,
    message: string = "is required.",
  ) {
    super(`Reservation ${fieldName} ${message}`);
    this.name = "ReservationValidationError";
  }
}
