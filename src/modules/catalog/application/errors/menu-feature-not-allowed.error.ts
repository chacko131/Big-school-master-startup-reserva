/**
 * Archivo: menu-feature-not-allowed.error.ts
 * Responsabilidad: Representar el error de aplicación cuando un restaurante no tiene acceso a la carta.
 * Tipo: lógica
 */

export class MenuFeatureNotAllowedError extends Error {
  constructor(public readonly restaurantId: string) {
    super(
      `Restaurant ${restaurantId} does not have access to menu management. Upgrade your plan to unlock this feature.`,
    );
    this.name = "MenuFeatureNotAllowedError";
  }
}
