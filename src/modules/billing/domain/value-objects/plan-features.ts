/**
 * Archivo: plan-features.ts
 * Responsabilidad: Definir qué secciones del dashboard incluye cada plan de suscripción.
 * Tipo: lógica
 *
 * Las secciones "always" son accesibles sin importar el plan ni el estado de pago.
 * Las secciones "basic" son las incluidas en el plan básico (y por herencia, en el pro).
 * Las secciones "pro" son exclusivas del plan profesional.
 *
 * IMPORTANTE: Estos valores se usan para filtrar la navegación del dashboard.
 * "home" y "billing" siempre son accesibles porque:
 * - El usuario necesita un punto de entrada (home).
 * - El usuario necesita poder pagar (billing) incluso cuando todo lo demás esté restringido.
 * "settings" es siempre accesible porque el dueño debe poder gestionar su perfil básico.
 */

import { type SubscriptionPlanId } from "../entities/subscription.entity";

/**
 * Claves de secciones del dashboard que pueden controlarse por plan.
 * Coinciden con las claves de navegación del dashboard, pero se definen aquí
 * como un tipo independiente para no acoplar dominio de billing con UI.
 */
export type PlanFeatureKey =
  | "home"
  | "reservations"
  | "tables"
  | "schedule"
  | "guests"
  | "billing"
  | "analytics"
  | "team"
  | "settings";

/** Secciones que siempre son accesibles sin importar plan ni estado de pago. */
const ALWAYS_ACCESSIBLE_FEATURES: ReadonlySet<PlanFeatureKey> = new Set([
  "home",
  "billing",
  "settings",
]);

/** Secciones incluidas en el plan Básico (además de las siempre accesibles). */
const BASIC_EXCLUSIVE_FEATURES: ReadonlySet<PlanFeatureKey> = new Set([
  "reservations",
  "tables",
  "schedule",
  "team",
]);

/** Secciones exclusivas del plan Pro (además de todas las del Básico). */
const PRO_EXCLUSIVE_FEATURES: ReadonlySet<PlanFeatureKey> = new Set([
  "guests",
  "analytics",
]);

//-aqui empieza funcion getFeaturesForPlan y es para resolver las secciones permitidas de un plan-//
/**
 * Devuelve el conjunto completo de secciones a las que tiene acceso un restaurante
 * según su plan activo. Incluye las secciones siempre accesibles.
 *
 * @pure
 */
export function getFeaturesForPlan(planId: SubscriptionPlanId): ReadonlySet<PlanFeatureKey> {
  const features = new Set<PlanFeatureKey>(ALWAYS_ACCESSIBLE_FEATURES);

  for (const feature of BASIC_EXCLUSIVE_FEATURES) {
    features.add(feature);
  }

  if (planId === "pro") {
    for (const feature of PRO_EXCLUSIVE_FEATURES) {
      features.add(feature);
    }
  }

  return features;
}
//-aqui termina funcion getFeaturesForPlan-//

//-aqui empieza funcion getAlwaysAccessibleFeatures y es para saber que secciones nunca se bloquean-//
/**
 * Devuelve las secciones que son accesibles incluso cuando el restaurante
 * está en estado suspendido (no ha pagado). Esto garantiza que siempre
 * pueda ver su home, ir a billing para pagar, y acceder a su perfil básico.
 *
 * @pure
 */
export function getAlwaysAccessibleFeatures(): ReadonlySet<PlanFeatureKey> {
  return ALWAYS_ACCESSIBLE_FEATURES;
}
//-aqui termina funcion getAlwaysAccessibleFeatures-//

//-aqui empieza funcion isProExclusiveFeature y es para verificar si una seccion es exclusiva del plan pro-//
/**
 * Devuelve true si la sección indicada es exclusiva del plan Pro.
 *
 * @pure
 */
export function isProExclusiveFeature(feature: PlanFeatureKey): boolean {
  return PRO_EXCLUSIVE_FEATURES.has(feature);
}
//-aqui termina funcion isProExclusiveFeature-//
