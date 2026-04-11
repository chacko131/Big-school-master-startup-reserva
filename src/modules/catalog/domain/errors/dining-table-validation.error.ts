/**
 * Archivo: dining-table-validation.error.ts
 * Responsabilidad: Representar errores de validación del dominio DiningTable.
 * Tipo: lógica
 */

export class DiningTableValidationError extends Error {
  constructor(
    public readonly fieldName: string,
    message: string = "is required.",
  ) {
    super(`DiningTable ${fieldName} ${message}`);
    this.name = "DiningTableValidationError";
  }
}
