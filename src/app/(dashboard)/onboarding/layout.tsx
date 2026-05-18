/**
 * Archivo: layout.tsx
 * Responsabilidad: Aislar el onboarding autenticado del shell comercial y prepararlo para reglas propias.
 * Tipo: UI
 */

import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/modules/auth/get-current-user";
import { getUsersInfrastructure } from "@/modules/users/infrastructure/users-infrastructure";
import { getCatalogInfrastructure } from "@/modules/catalog/infrastructure/catalog-infrastructure";

interface OnboardingLayoutProps {
  children: ReactNode;
}

//-aqui empieza layout de onboarding autenticado y es para separar la configuracion inicial del tenant-//
/**
 * Layout base del onboarding protegido del restaurante.
 * Guard 1: si no hay sesión activa → /sign-in.
 * Guard 2: si el onboarding está COMPLETO (membership + settings + tablas) → /dashboard.
 *   Solo redirigir al dashboard si todo está configurado, no con solo tener membership.
 *   Así se evita el bucle cuando el usuario tiene membership pero le faltan steps del onboarding.
 */
export default async function OnboardingLayout({ children }: OnboardingLayoutProps) {
  const user = await getCurrentUser();

  if (user === null) {
    redirect("/sign-in?redirect_url=/onboarding/restaurant");
  }

  const { membershipRepository } = getUsersInfrastructure();
  const memberships = await membershipRepository.findActiveByUserId(user.id);

  if (memberships.length === 0) {
    return <>{children}</>;
  }

  const restaurantId = memberships[0]!.toPrimitives().restaurantId;
  const { restaurantSettingsRepository, diningTableRepository } = getCatalogInfrastructure();

  const [settings, tables] = await Promise.all([
    restaurantSettingsRepository.findByRestaurantId(restaurantId),
    diningTableRepository.findByRestaurantId(restaurantId),
  ]);

  const onboardingComplete = settings !== null && tables.length > 0;

  if (onboardingComplete) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
//-aqui termina layout de onboarding autenticado-//
