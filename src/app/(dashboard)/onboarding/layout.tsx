/**
 * Archivo: layout.tsx
 * Responsabilidad: Aislar el onboarding autenticado del shell comercial y prepararlo para reglas propias.
 * Tipo: UI
 */

import type { ReactNode } from "react";

interface OnboardingLayoutProps {
  children: ReactNode;
}

//-aqui empieza layout de onboarding autenticado y es para separar la configuracion inicial del tenant-//
/**
 * Layout base del onboarding protegido del restaurante.
 */
export default function OnboardingLayout({ children }: OnboardingLayoutProps) {
  return <>{children}</>;
}
//-aqui termina layout de onboarding autenticado-//
