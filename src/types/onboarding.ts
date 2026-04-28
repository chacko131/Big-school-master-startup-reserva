/**
 * Archivo: onboarding.ts
 * Responsabilidad: Definir los contratos tipados para la interfaz del onboarding.
 * Tipo: lógica
 */

export type OnboardingStepKey = "restaurant" | "settings" | "tables" | "plan";

export type OnboardingStepStatus = "completed" | "current" | "upcoming";

export type OnboardingStepIconName = "storefront" | "settings" | "gridView" | "payments";

export type OnboardingChromeIconName =
  | "close"
  | "help"
  | "accountCircle"
  | "expandMore"
  | "save"
  | "arrowForward"
  | "contentCopy"
  | "restaurant"
  | "person"
  | "rocketLaunch"
  | "schedule"
  | "checkCircle";

export type OnboardingIconName = OnboardingStepIconName | OnboardingChromeIconName;

export interface OnboardingStepDefinition {
  key: OnboardingStepKey;
  label: string;
  href: string;
  icon: OnboardingStepIconName;
  status: OnboardingStepStatus;
}

export interface OnboardingActionDefinition {
  label: string;
  href?: string;
  formId?: string;
  icon: Extract<OnboardingChromeIconName, "save" | "arrowForward">;
}
