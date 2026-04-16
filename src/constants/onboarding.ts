/**
 * Archivo: onboarding.ts
 * Responsabilidad: Centralizar la configuración visual y de progreso del onboarding.
 * Tipo: lógica
 */

import type { OnboardingStepDefinition, OnboardingStepKey } from "@/types/onboarding";

const ONBOARDING_STEP_BASE: ReadonlyArray<Omit<OnboardingStepDefinition, "status">> = [
  {
    key: "restaurant",
    label: "Restaurante",
    href: "/onboarding/restaurant",
    icon: "storefront",
  },
  {
    key: "settings",
    label: "Configuración",
    href: "/onboarding/settings",
    icon: "settings",
  },
  {
    key: "tables",
    label: "Mesas",
    href: "/onboarding/tables",
    icon: "gridView",
  },
  {
    key: "plan",
    label: "Plan",
    href: "/onboarding/plan",
    icon: "payments",
  },
] as const;

export const ONBOARDING_TOTAL_STEPS = ONBOARDING_STEP_BASE.length;

//-aqui empieza funcion getOnboardingStepNumber y es para resolver la posicion del paso actual-//
/**
 * Obtiene el número visible del paso actual dentro del flujo.
 *
 * @pure
 */
export function getOnboardingStepNumber(currentStepKey: OnboardingStepKey): number {
  const currentIndex = ONBOARDING_STEP_BASE.findIndex((step) => step.key === currentStepKey);

  return currentIndex === -1 ? 1 : currentIndex + 1;
}
//-aqui termina funcion getOnboardingStepNumber-//

//-aqui empieza funcion getOnboardingSteps y es para construir el estado visual del stepper-//
/**
 * Devuelve la colección de pasos con su estado visual calculado.
 *
 * @pure
 */
export function getOnboardingSteps(currentStepKey: OnboardingStepKey): OnboardingStepDefinition[] {
  const currentIndex = ONBOARDING_STEP_BASE.findIndex((step) => step.key === currentStepKey);
  const safeCurrentIndex = currentIndex === -1 ? 0 : currentIndex;

  return ONBOARDING_STEP_BASE.map((step, index) => ({
    ...step,
    status: index < safeCurrentIndex ? "completed" : index === safeCurrentIndex ? "current" : "upcoming",
  }));
}
//-aqui termina funcion getOnboardingSteps-//
