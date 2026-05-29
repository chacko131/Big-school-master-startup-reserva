/**
 * Archivo: access-level.ts
 * Responsabilidad: Calcular el nivel de acceso efectivo de un restaurante según su estado de suscripción.
 * Tipo: lógica
 *
 * Este es el núcleo de la estrategia de degradación progresiva.
 * Toda la app consulta este resultado para saber qué puede hacer el restaurante.
 *
 * Fases:
 *   FULL       → Trial activo O suscripción pagada. Acceso total según su plan.
 *   GRACE      → Trial expiró hace 0-7 días sin pago. Funciona normal pero con aviso.
 *   READ_ONLY  → Trial expiró hace 7-14 días sin pago. Solo puede ver datos, no crear ni editar.
 *   SUSPENDED  → +14 días sin pago. Solo ve la pantalla de billing para pagar.
 */

import { type Subscription, type SubscriptionPlanId } from "../entities/subscription.entity";
import { getFeaturesForPlan, getAlwaysAccessibleFeatures, type PlanFeatureKey } from "./plan-features";

/** Los cuatro niveles posibles de acceso para un restaurante. */
export type AccessLevel = "full" | "grace" | "read_only" | "suspended";

/** Resultado completo del cálculo de acceso. Esto es lo que consume el layout y los server actions. */
export interface AccessLevelResult {
  /** Nivel de acceso actual del restaurante. */
  level: AccessLevel;
  /** Plan que tiene contratado (o el que se asignó durante el trial). null si no tiene suscripción. */
  planId: SubscriptionPlanId | null;
  /** Secciones del dashboard a las que tiene acceso. Varía según plan y nivel. */
  allowedFeatures: ReadonlySet<PlanFeatureKey>;
  /** True si el restaurante está dentro de su periodo de prueba gratuito. */
  isTrialActive: boolean;
  /** Días restantes de trial. 0 si ya expiró o no tiene trial. */
  remainingTrialDays: number;
  /** Días que faltan para pasar a la siguiente fase de degradación. null si no aplica. */
  daysUntilNextPhase: number | null;
  /** True si el restaurante puede crear/editar/eliminar datos (false en read_only y suspended). */
  canWrite: boolean;
  /** Mensaje descriptivo del estado actual para mostrar en banners. */
  message: string;
}

/** Umbrales en días para cada fase de degradación después de expirar el trial. */
const GRACE_PERIOD_DAYS = 7;
const READ_ONLY_PERIOD_DAYS = 14;

//-aqui empieza funcion calculateAccessLevel y es para determinar el estado de acceso de un restaurante-//
/**
 * Calcula el nivel de acceso efectivo de un restaurante a partir de su suscripción.
 *
 * Reglas:
 * 1. Si no tiene suscripción → suspendido (no debería pasar si el onboarding es correcto).
 * 2. Si la suscripción está activa (pagada) → acceso completo según plan.
 * 3. Si la suscripción fue cancelada pero aún no terminó el periodo pagado → acceso completo.
 * 4. Si está en trial activo → acceso completo con todas las features del plan pro.
 * 5. Si el trial expiró y no ha pagado → degradación progresiva según días transcurridos.
 * 6. Si el pago falló (past_due) → gracia para que arregle el método de pago.
 *
 * @pure
 */
export function calculateAccessLevel(subscription: Subscription | null): AccessLevelResult {
  // --- Sin suscripción: caso extremo, no debería ocurrir con onboarding correcto ---
  if (subscription === null) {
    return {
      level: "suspended",
      planId: null,
      allowedFeatures: getAlwaysAccessibleFeatures(),
      isTrialActive: false,
      remainingTrialDays: 0,
      daysUntilNextPhase: null,
      canWrite: false,
      message: "No se encontró una suscripción activa. Activa un plan para comenzar a usar el sistema.",
    };
  }

  const now = new Date();
  const status = subscription.status;
  const planId = subscription.planId;

  // --- Suscripción activa (pagando) → acceso completo ---
  if (status === "active") {
    return {
      level: "full",
      planId,
      allowedFeatures: getFeaturesForPlan(planId),
      isTrialActive: false,
      remainingTrialDays: 0,
      daysUntilNextPhase: null,
      canWrite: true,
      message: `Tu plan ${planId === "pro" ? "Pro" : "Básico"} está activo.`,
    };
  }

  // --- Trial activo → acceso completo con features del plan asignado ---
  // Durante el trial, el restaurante ve TODO (como si fuera Pro) para que pruebe el producto.
  if (subscription.isTrialActive()) {
    const remaining = subscription.getRemainingTrialDays();
    return {
      level: "full",
      planId,
      allowedFeatures: getFeaturesForPlan("pro"),
      isTrialActive: true,
      remainingTrialDays: remaining,
      daysUntilNextPhase: remaining,
      canWrite: true,
      message: remaining <= 7
        ? `Tu periodo de prueba termina en ${remaining} día${remaining !== 1 ? "s" : ""}. Elige un plan para continuar sin interrupciones.`
        : `Estás disfrutando de tu periodo de prueba. Quedan ${remaining} días.`,
    };
  }

  // --- Cancelado pero con periodo pagado vigente → acceso completo hasta que termine ---
  if (status === "canceled" && now < subscription.currentPeriodEnd) {
    const daysLeft = Math.max(0, Math.ceil(
      (subscription.currentPeriodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    ));
    return {
      level: "full",
      planId,
      allowedFeatures: getFeaturesForPlan(planId),
      isTrialActive: false,
      remainingTrialDays: 0,
      daysUntilNextPhase: daysLeft,
      canWrite: true,
      message: `Tu suscripción fue cancelada. Tienes acceso hasta el fin de tu periodo actual (${daysLeft} día${daysLeft !== 1 ? "s" : ""}).`,
    };
  }

  // --- Pago fallido (past_due) → gracia para que arreglen el método de pago ---
  if (status === "past_due") {
    return {
      level: "grace",
      planId,
      allowedFeatures: getFeaturesForPlan(planId),
      isTrialActive: false,
      remainingTrialDays: 0,
      daysUntilNextPhase: GRACE_PERIOD_DAYS,
      canWrite: true,
      message: "Hubo un problema con tu método de pago. Actualízalo desde Facturación para evitar la suspensión del servicio.",
    };
  }

  // --- Trial expirado sin pago → degradación progresiva ---
  const trialEndDate = subscription.trialEndsAt;

  if (trialEndDate !== null) {
    const daysSinceExpiry = Math.floor(
      (now.getTime() - trialEndDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Fase GRACE: 0-7 días después del trial. Todo funciona pero con aviso persistente.
    if (daysSinceExpiry <= GRACE_PERIOD_DAYS) {
      const daysLeft = GRACE_PERIOD_DAYS - daysSinceExpiry;
      return {
        level: "grace",
        planId,
        allowedFeatures: getFeaturesForPlan(planId),
        isTrialActive: false,
        remainingTrialDays: 0,
        daysUntilNextPhase: daysLeft,
        canWrite: true,
        message: `Tu periodo de prueba terminó. Tienes ${daysLeft} día${daysLeft !== 1 ? "s" : ""} para elegir un plan antes de que el acceso se restrinja.`,
      };
    }

    // Fase READ_ONLY: 7-14 días después del trial. Puede ver datos pero no crear/editar.
    if (daysSinceExpiry <= READ_ONLY_PERIOD_DAYS) {
      const daysLeft = READ_ONLY_PERIOD_DAYS - daysSinceExpiry;
      return {
        level: "read_only",
        planId,
        allowedFeatures: getFeaturesForPlan(planId),
        isTrialActive: false,
        remainingTrialDays: 0,
        daysUntilNextPhase: daysLeft,
        canWrite: false,
        message: `Tu cuenta está en modo consulta. Puedes ver tus datos pero no crear ni editar. Activa un plan en ${daysLeft} día${daysLeft !== 1 ? "s" : ""} o tu acceso será suspendido.`,
      };
    }

    // Fase SUSPENDED: +14 días sin pago. Solo ve billing.
    return {
      level: "suspended",
      planId,
      allowedFeatures: getAlwaysAccessibleFeatures(),
      isTrialActive: false,
      remainingTrialDays: 0,
      daysUntilNextPhase: null,
      canWrite: false,
      message: "Tu acceso ha sido suspendido por falta de pago. Tus datos están seguros. Activa un plan para volver a la normalidad.",
    };
  }

  // --- Cancelado y sin periodo vigente ni trial → suspendido ---
  return {
    level: "suspended",
    planId,
    allowedFeatures: getAlwaysAccessibleFeatures(),
    isTrialActive: false,
    remainingTrialDays: 0,
    daysUntilNextPhase: null,
    canWrite: false,
    message: "Tu suscripción no está activa. Activa un plan desde Facturación para continuar.",
  };
}
//-aqui termina funcion calculateAccessLevel-//
