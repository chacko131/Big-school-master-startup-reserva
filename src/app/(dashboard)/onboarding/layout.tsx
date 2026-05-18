/**
 * Archivo: layout.tsx
 * Responsabilidad: Aislar el onboarding autenticado del shell comercial y prepararlo para reglas propias.
 * Tipo: UI
 */

import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/modules/auth/get-current-user";
import { getUsersInfrastructure } from "@/modules/users/infrastructure/users-infrastructure";

interface OnboardingLayoutProps {
  children: ReactNode;
}

//-aqui empieza layout de onboarding autenticado y es para separar la configuracion inicial del tenant-//
/**
 * Layout base del onboarding protegido del restaurante.
 * Guard 1: si no hay sesión activa → /sign-in.
 * Guard 2: si el usuario ya tiene un restaurante asignado → /dashboard (onboarding ya completado).
 */
export default async function OnboardingLayout({ children }: OnboardingLayoutProps) {
  const user = await getCurrentUser();

  if (user === null) {
    redirect("/sign-in?redirect_url=/onboarding/restaurant");
  }

  const { membershipRepository } = getUsersInfrastructure();
  const memberships = await membershipRepository.findActiveByUserId(user.id);

  if (memberships.length > 0) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
//-aqui termina layout de onboarding autenticado-//
