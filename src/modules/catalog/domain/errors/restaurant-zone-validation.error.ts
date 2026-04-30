/**
 * Archivo: restaurant-zone-validation.error.ts
 * Responsabilidad: Representar errores de validación del dominio RestaurantZone.
 * Tipo: lógica
 */

export class RestaurantZoneValidationError extends Error {
  constructor(
    public readonly fieldName: string,
    message: string = "is required.",
  ) {
    super(`RestaurantZone ${fieldName} ${message}`);
    this.name = "RestaurantZoneValidationError";
  }
}
