/**
 * Archivo: restaurant-validation.error.ts
 * Responsabilidad: Representar errores de validación del dominio Restaurant.
 * Tipo: lógica
 */

export class RestaurantValidationError extends Error {
  constructor(
    public readonly fieldName: string,
    message: string = "is required.",
  ) {
    super(`Restaurant ${fieldName} ${message}`);
    this.name = "RestaurantValidationError";
  }
}
