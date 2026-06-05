/**
 * Archivo: layout.tsx
 * Responsabilidad: Envolver las páginas del dashboard con el shell compartido de navegación.
 * Tipo: UI
 */

import type { ReactNode } from "react";
import Link from "next/link";
import { notFound, redirect, unstable_rethrow } from "next/navigation";
import { headers } from "next/headers";
import { T } from "@/components/T";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { getCatalogInfrastructure } from "@/modules/catalog/infrastructure/catalog-infrastructure";
import { getCurrentUser } from "@/modules/auth/get-current-user";
import { getUsersInfrastructure } from "@/modules/users/infrastructure/users-infrastructure";
import { getBillingInfrastructure } from "@/modules/billing/infrastructure/billing-infrastructure";
import { GetRestaurantAccessLevel } from "@/modules/billing/application/use-cases/GetRestaurantAccessLevel/get-restaurant-access-level.use-case";
import { type AccessLevelResult } from "@/modules/billing/domain/value-objects/access-level";
import { type PlanFeatureKey } from "@/modules/billing/domain/value-objects/plan-features";
import { type DashboardSectionKey, getDashboardActiveNavigationDefinition } from "@/constants/dashboard";

interface DashboardLayoutProps {
  children: ReactNode;
}

//-aqui empieza funcion getOnboardingCompletionRedirect y es para validar el acceso al dashboard-//
/**
 * Determina si el onboarding mínimo está completo antes de renderizar el dashboard.
 * Valida identidad desde Clerk + membership activa en lugar de cookie.
 * @sideEffect
 */
async function getOnboardingCompletionRedirect(): Promise<void> {
  const user = await getCurrentUser();

  if (user === null) {
    redirect("/sign-in?redirect_url=/dashboard");
  }

  const { membershipRepository } = getUsersInfrastructure();
  const memberships = await membershipRepository.findActiveByUserId(user.id);

  if (memberships.length === 0) {
    redirect("/onboarding/restaurant");
  }

  const restaurantId = memberships[0]!.toPrimitives().restaurantId;

  try {
    const catalogInfrastructure = getCatalogInfrastructure();
    const restaurant = await catalogInfrastructure.restaurantRepository.findById(restaurantId);

    if (restaurant === null) {
      redirect("/onboarding/restaurant");
    }

    const restaurantSettings = await catalogInfrastructure.restaurantSettingsRepository.findByRestaurantId(restaurantId);

    if (restaurantSettings === null) {
      redirect(`/onboarding/settings?restaurantId=${restaurantId}`);
    }

    const diningTables = await catalogInfrastructure.diningTableRepository.findByRestaurantId(restaurantId);

    if (diningTables.length === 0) {
      redirect(`/onboarding/tables?restaurantId=${restaurantId}`);
    }
  } catch (error) {
    unstable_rethrow(error);
    throw error;
  }
}
//-aqui termina funcion getOnboardingCompletionRedirect y se va autilizar en el layout-//

//-aqui empieza pagina DashboardLayout y es para aplicar el shell compartido al segmento dashboard-//
/**
 * Renderiza el layout compartido del dashboard.
 */
export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  try {
    await getOnboardingCompletionRedirect();
  } catch (error) {
    unstable_rethrow(error);

    return (
      <main className="flex min-h-screen items-center justify-center bg-surface px-6 py-16 text-on-surface">
        <div className="w-full max-w-xl rounded-[28px] border border-outline-variant/20 bg-surface-container-lowest p-10 shadow-[0_20px_40px_rgba(26,28,28,0.04)]">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
            <T>Error de acceso</T>
          </p>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-primary">
            <T>No hemos podido cargar tu dashboard.</T>
          </h1>
          <p className="mt-4 text-sm leading-7 text-on-surface-variant md:text-base">
            <T>Ha ocurrido un problema inesperado validando la configuración inicial de tu restaurante. Vuelve al onboarding e inténtalo de nuevo.</T>
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-on-primary transition-all hover:opacity-90" href="/onboarding/restaurant">
              <T>Volver al onboarding</T>
            </Link>
            <Link className="inline-flex items-center justify-center rounded-lg bg-surface-container-highest px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-on-surface transition-colors hover:bg-surface-container-high" href="/">
              <T>Ir al inicio</T>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  //-aqui empieza calculo del nivel de acceso y es para determinar que puede hacer el restaurante-//
  /**
   * Consulta la suscripción del restaurante y calcula el nivel de acceso.
   * - FULL: acceso total según plan.
   * - GRACE: funciona pero con aviso.
   * - READ_ONLY: solo puede ver datos, no crear ni editar.
   * - SUSPENDED: solo ve billing.
   * @sideEffect
   */
  const accessLevel: AccessLevelResult = await (async () => {
    const user = await getCurrentUser();
    if (user === null) return null;

    const { membershipRepository } = getUsersInfrastructure();
    const memberships = await membershipRepository.findActiveByUserId(user.id);
    if (memberships.length === 0) return null;

    const restaurantId = memberships[0]!.toPrimitives().restaurantId;
    const { subscriptionRepository } = getBillingInfrastructure();
    const useCase = new GetRestaurantAccessLevel(subscriptionRepository);
    return await useCase.execute({ restaurantId });
  })() ?? {
    level: "suspended" as const,
    planId: null,
    allowedFeatures: new Set<PlanFeatureKey>(["home", "billing", "settings"]),
    isTrialActive: false,
    remainingTrialDays: 0,
    daysUntilNextPhase: null,
    canWrite: false,
    message: "No se encontró una suscripción activa.",
  };
  //-aqui termina calculo del nivel de acceso-//

  //-aqui empieza calculo de allowedKeys y es para filtrar el sidebar segun plan + permisos del usuario-//
  /**
   * Calcula las secciones visibles combinando dos filtros:
   * 1. Filtro de plan: las secciones que incluye el plan contratado (access level).
   * 2. Filtro de rol: las secciones que el owner ha habilitado para el rol del usuario.
   *
   * - Propietario (RESTAURANT_OWNER): solo se filtra por plan, no por permisos de rol.
   * - Resto de roles: se aplica la intersección de ambos filtros.
   * @sideEffect
   */
  const allowedKeys = await (async (): Promise<ReadonlySet<DashboardSectionKey>> => {
    // Convertimos las features del plan (PlanFeatureKey) a DashboardSectionKey
    // Son las mismas strings, pero los tipos son independientes por diseño.
    const planKeys = new Set<DashboardSectionKey>();
    for (const feature of accessLevel.allowedFeatures) {
      planKeys.add(feature as DashboardSectionKey);
    }

    const user = await getCurrentUser();
    if (user === null) return planKeys;

    const { membershipRepository, rolePagePermissionRepository } = getUsersInfrastructure();
    const memberships = await membershipRepository.findActiveByUserId(user.id);
    if (memberships.length === 0) return planKeys;

    const membership = memberships[0]!.toPrimitives();

    // El propietario no tiene restricciones de rol, solo de plan
    if (membership.role === "RESTAURANT_OWNER") {
      planKeys.add("billing");
      planKeys.add("settings");
      planKeys.add("service");
      // El backoffice de costeo solo es visible con Plan Pro (o durante el trial)
      if (accessLevel.planId === "pro" || accessLevel.isTrialActive) {
        planKeys.add("menu");
      }
      return planKeys;
    }

    // Para otros roles, intersectamos las features del plan con los permisos del rol
    const permissions = await rolePagePermissionRepository.findByRestaurant(membership.restaurantId);
    const visible = new Set<DashboardSectionKey>(["home"]);
    for (const p of permissions) {
      if (p.role === membership.role && p.canView) {
        const pageKey = p.pageKey as DashboardSectionKey;
        // Solo incluimos la sección si también está permitida por el plan
        if (planKeys.has(pageKey)) {
          visible.add(pageKey);
        }
      }
    }
    // Billing y settings siempre accesibles independientemente del rol
    visible.add("billing");
    visible.add("settings");
    return visible;
  })();
  //-aqui termina calculo de allowedKeys-//

  //-aqui empieza guard de ruta y es para bloquear acceso directo por URL a secciones sin permiso-//
  /**
   * Si el usuario intenta acceder por URL a una sección que no tiene permitida,
   * y además no es una sección siempre accesible, devolvemos 404.
   * @sideEffect
   */
  const requestHeaders = await headers();
  const pathname = requestHeaders.get("x-pathname") ?? requestHeaders.get("x-invoke-path") ?? "";
  const activeKey = getDashboardActiveNavigationDefinition(pathname).key;

  if (!allowedKeys.has(activeKey)) {
    notFound();
  }
  //-aqui termina guard de ruta-//

  return (
    <DashboardShell
      allowedKeys={allowedKeys}
      accessLevel={accessLevel.level}
      accessMessage={accessLevel.message}
      canWrite={accessLevel.canWrite}
      isTrialActive={accessLevel.isTrialActive}
      remainingTrialDays={accessLevel.remainingTrialDays}
      daysUntilNextPhase={accessLevel.daysUntilNextPhase}
    >
      {children}
    </DashboardShell>
  );
}
//-aqui termina pagina DashboardLayout-//
