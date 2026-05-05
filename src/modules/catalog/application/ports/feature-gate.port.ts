/**
 * Archivo: feature-gate.port.ts
 * Responsabilidad: Definir el puerto para validar acceso a features premium por plan de suscripción.
 * Tipo: lógica
 *
 * Cada use case que dependa de un plan pregunta a este puerto antes de ejecutarse.
 * Hoy se inyecta un adaptador que siempre permite el acceso (AlwaysAllowedFeatureGate).
 * Cuando exista billing real, se reemplaza por un adaptador que consulte el plan activo.
 */

export type FeatureName = "menu_management" | "analytics" | "integrations";

export interface FeatureGatePort {
  /**
   * Devuelve true si el restaurante tiene acceso a la feature indicada.
   * @pure — no produce efectos secundarios directos, pero puede leer estado externo.
   */
  isFeatureAllowed(restaurantId: string, feature: FeatureName): Promise<boolean>;
}
