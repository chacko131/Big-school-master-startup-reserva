/**
 * Archivo: restaurant-settings-validation.error.ts
 * Responsabilidad: Representar errores de validación del dominio RestaurantSettings.
 * Tipo: lógica
 */

export class RestaurantSettingsValidationError extends Error {
  constructor(
    public readonly fieldName: string,
    message: string = "is invalid.",
  ) {
    super(`RestaurantSettings ${fieldName} ${message}`);
    this.name = "RestaurantSettingsValidationError";
  }
}
