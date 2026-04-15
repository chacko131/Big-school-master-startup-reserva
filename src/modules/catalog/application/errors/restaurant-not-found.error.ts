/**
 * Archivo: restaurant-not-found.error.ts
 * Responsabilidad: Representar el error de aplicación cuando un restaurante no existe.
 * Tipo: lógica
 */

export class RestaurantNotFoundError extends Error {
  constructor(public readonly restaurantId: string) {
    super(`Restaurant ${restaurantId} was not found.`);
    this.name = "RestaurantNotFoundError";
  }
}
