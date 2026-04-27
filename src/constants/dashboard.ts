/**
 * Archivo: dashboard.ts
 * Responsabilidad: Centralizar la navegación y los datos base del dashboard operativo.
 * Tipo: lógica
 */

import type { OnboardingIconName } from "@/types/onboarding";

export type DashboardSectionKey =
  | "home"
  | "reservations"
  | "tables"
  | "schedule"
  | "guests"
  | "billing"
  | "analytics"
  | "integrations"
  | "notifications"
  | "team"
  | "settings"

export type DashboardMetricTone = "primary" | "secondary" | "surface";

export interface DashboardNavigationDefinition {
  key: DashboardSectionKey;
  label: string;
  href: string;
  icon: OnboardingIconName;
}

export interface DashboardHomeCardDefinition {
  title: string;
  description: string;
  href: string;
  icon: OnboardingIconName;
  tone: DashboardMetricTone;
}

export interface DashboardMetricDefinition {
  label: string;
  value: string;
  caption: string;
  tone: DashboardMetricTone;
}

export interface DashboardActivityDefinition {
  time: string;
  title: string;
  description: string;
}

export const dashboardNavigationDefinitions: ReadonlyArray<DashboardNavigationDefinition> = [
  {
    key: "home",
    label: "Inicio",
    href: "/dashboard",
    icon: "restaurant",
  },
  {
    key: "reservations",
    label: "Reservas",
    href: "/dashboard/reservations",
    icon: "schedule",
  },
  {
    key: "tables",
    label: "Mesas",
    href: "/dashboard/tables",
    icon: "gridView",
  },
  {
    key: "schedule",
    label: "Calendario",
    href: "/dashboard/schedule",
    icon: "rocketLaunch",
  },
  {
    key: "guests",
    label: "Clientes",
    href: "/dashboard/guests",
    icon: "person",
  },
  {
    key: "billing",
    label: "Facturación",
    href: "/dashboard/billing",
    icon: "payments",
  },

  {
    key: "analytics",
    label: "Analítica",
    href: "/dashboard/analytics",
    icon: "gridView",
  },
  {
    key: "integrations",
    label: "Integraciones",
    href: "/dashboard/integrations",
    icon: "rocketLaunch",
  },
  {
    key: "notifications",
    label: "Notificaciones",
    href: "/dashboard/notifications",
    icon: "help",
  },
  {
    key: "team",
    label: "Equipo",
    href: "/dashboard/team",
    icon: "person",
  },
    {
    key: "settings",
    label: "Configuración",
    href: "/dashboard/settings",
    icon: "settings",
  },
] as const;

export const dashboardHomeCardDefinitions: ReadonlyArray<DashboardHomeCardDefinition> = [
  {
    title: "Reservas del día",
    description: "Revisa la ocupación, confirma reservas y controla el ritmo operativo sin perder contexto.",
    href: "/dashboard/reservations",
    icon: "schedule",
    tone: "primary",
  },
  {
    title: "Mesas y capacidad",
    description: "Ajusta la disposición de la sala y la disponibilidad de asientos en tiempo real.",
    href: "/dashboard/tables",
    icon: "gridView",
    tone: "secondary",
  },
  {
    title: "Configuración rápida",
    description: "Administra reglas, equipo e integraciones desde una vista centralizada.",
    href: "/dashboard/settings",
    icon: "settings",
    tone: "surface",
  },
] as const;

export const dashboardMetricDefinitions: ReadonlyArray<DashboardMetricDefinition> = [
  {
    label: "Reservas activas",
    value: "24",
    caption: "en la jornada de hoy",
    tone: "primary",
  },
  {
    label: "Ocupación media",
    value: "78%",
    caption: "sobre capacidad objetivo",
    tone: "secondary",
  },
  {
    label: "Tiempo medio de rotación",
    value: "42 min",
    caption: "por mesa preparada",
    tone: "surface",
  },
] as const;

export const dashboardActivityDefinitions: ReadonlyArray<DashboardActivityDefinition> = [
  {
    time: "18:00",
    title: "Mesa 04 confirmada",
    description: "La reserva de dos comensales quedó validada y lista para asignación.",
  },
  {
    time: "18:20",
    title: "Grupo de 6 asignado",
    description: "El sistema detectó una combinación óptima de mesas en la terraza.",
  },
  {
    time: "18:45",
    title: "Pago procesado",
    description: "El cobro de la última experiencia quedó sincronizado con facturación.",
  },
] as const;

//-aqui empieza funcion getDashboardActiveNavigationDefinition y es para resolver la seccion activa del dashboard-//
/**
 * Devuelve la navegación activa a partir del pathname actual.
 *
 * @pure
 */
export function getDashboardActiveNavigationDefinition(pathname: string): DashboardNavigationDefinition {
  const dashboardSegment = pathname.split("/")[2] ?? "";
  const activeNavigationDefinition = dashboardNavigationDefinitions.find((navigationDefinition) => navigationDefinition.key === dashboardSegment);

  return activeNavigationDefinition ?? dashboardNavigationDefinitions[0];
}
//-aqui termina funcion getDashboardActiveNavigationDefinition-//

//-aqui empieza funcion getDashboardSectionLabel y es para mostrar el titulo dinamico del encabezado-//
/**
 * Devuelve la etiqueta visible de la sección actual del dashboard.
 *
 * @pure
 */
export function getDashboardSectionLabel(pathname: string): string {
  return getDashboardActiveNavigationDefinition(pathname).label;
}
//-aqui termina funcion getDashboardSectionLabel-//
