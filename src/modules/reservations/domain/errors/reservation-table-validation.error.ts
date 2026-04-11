/**
 * Archivo: reservation-table-validation.error.ts
 * Responsabilidad: Representar errores de validación del dominio ReservationTable.
 * Tipo: lógica
 */

export class ReservationTableValidationError extends Error {
  constructor(
    public readonly fieldName: string,
    message: string = "is required.",
  ) {
    super(`ReservationTable ${fieldName} ${message}`);
    this.name = "ReservationTableValidationError";
  }
}
