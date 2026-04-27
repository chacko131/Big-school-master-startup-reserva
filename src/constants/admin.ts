/**
 * Archivo: admin.ts
 * Responsabilidad: Centralizar la navegación y etiquetas del panel SaaS de administración.
 * Tipo: lógica
 */

import type { OnboardingIconName } from "@/types/onboarding";

export type AdminSectionKey =
  | "overview"
  | "restaurants"
  | "subscriptions"
  | "users"
  | "incidents"
  | "feature-flags";

export interface AdminNavigationDefinition {
  key: AdminSectionKey;
  label: string;
  href: string;
  icon: OnboardingIconName;
}

export const adminNavigationDefinitions: ReadonlyArray<AdminNavigationDefinition> = [
  {
    key: "overview",
    label: "Resumen",
    href: "/admin",
    icon: "settings",
  },
  {
    key: "restaurants",
    label: "Restaurantes",
    href: "/admin/restaurants",
    icon: "storefront",
  },
  {
    key: "subscriptions",
    label: "Suscripciones",
    href: "/admin/subscriptions",
    icon: "payments",
  },
  {
    key: "users",
    label: "Usuarios",
    href: "/admin/users",
    icon: "person",
  },
  {
    key: "incidents",
    label: "Incidencias",
    href: "/admin/incidents",
    icon: "help",
  },
  {
    key: "feature-flags",
    label: "Feature flags",
    href: "/admin/feature-flags",
    icon: "rocketLaunch",
  },
] as const;

//-aqui empieza funcion getAdminActiveNavigationDefinition y es para resolver la seccion activa del panel admin-//
/**
 * Devuelve la navegación activa a partir del pathname actual.
 *
 * @pure
 */
export function getAdminActiveNavigationDefinition(pathname: string): AdminNavigationDefinition {
  const adminSegment = pathname.split("/")[2] ?? "";
  const activeNavigationDefinition = adminNavigationDefinitions.find(
    (navigationDefinition) => navigationDefinition.key === adminSegment,
  );

  return activeNavigationDefinition ?? adminNavigationDefinitions[0];
}
//-aqui termina funcion getAdminActiveNavigationDefinition-//

//-aqui empieza funcion getAdminSectionLabel y es para mostrar la etiqueta activa del panel admin-//
/**
 * Devuelve la etiqueta visible de la sección actual del panel admin.
 *
 * @pure
 */
export function getAdminSectionLabel(pathname: string): string {
  return getAdminActiveNavigationDefinition(pathname).label;
}
//-aqui termina funcion getAdminSectionLabel-//
