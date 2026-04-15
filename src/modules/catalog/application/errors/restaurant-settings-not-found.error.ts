/**
 * Archivo: restaurant-settings-not-found.error.ts
 * Responsabilidad: Representar el error de aplicación cuando la configuración del restaurante no existe.
 * Tipo: lógica
 */

export class RestaurantSettingsNotFoundError extends Error {
  constructor(public readonly restaurantId: string) {
    super(`Restaurant settings for ${restaurantId} were not found.`);
    this.name = "RestaurantSettingsNotFoundError";
  }
}
