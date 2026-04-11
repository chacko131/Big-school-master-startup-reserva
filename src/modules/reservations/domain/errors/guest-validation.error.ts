/**
 * Archivo: guest-validation.error.ts
 * Responsabilidad: Representar errores de validación del dominio Guest.
 * Tipo: lógica
 */

export class GuestValidationError extends Error {
  constructor(
    public readonly fieldName: string,
    message: string = "is required.",
  ) {
    super(`Guest ${fieldName} ${message}`);
    this.name = "GuestValidationError";
  }
}
