/**
 * Archivo: actions.ts
 * Responsabilidad: Server actions para la vista de suscripciones globales del panel admin.
 * Tipo: servidor
 */

"use server";

import { requireCurrentUser } from "@/modules/auth/get-current-user";
import { getBillingInfrastructure } from "@/modules/billing/infrastructure/billing-infrastructure";
import { getCatalogInfrastructure } from "@/modules/catalog/infrastructure/catalog-infrastructure";
import { GetSubscriptionsPlatformStats } from "@/modules/billing/application/use-cases/GetSubscriptionsPlatformStats/get-subscriptions-platform-stats.use-case";
import { ListPlatformSubscriptions } from "@/modules/billing/application/use-cases/ListPlatformSubscriptions/list-platform-subscriptions.use-case";
import { ListRestaurantsUseCase } from "@/modules/catalog/application/use-cases/list-restaurants.use-case";

//-aqui empieza tipo AdminSubscriptionRow-//
/** Fila enriquecida de suscripción para la tabla del panel admin. */
export interface AdminSubscriptionRow {
  id: string;
  restaurantName: string | null;
  status: string;
  planId: string;
  isTrial: boolean;
  remainingTrialDays: number;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
}
//-aqui termina tipo AdminSubscriptionRow-//

//-aqui empieza tipo AdminSubscriptionsPageData-//
/** Datos completos para renderizar la página de suscripciones admin. */
export interface AdminSubscriptionsPageData {
  stats: {
    totalSubscriptions: number;
    totalActive: number;
    totalTrialing: number;
    totalCanceled: number;
    totalPastDue: number;
    totalRenewingToday: number;
    /** TODO: requiere amountCents en schema o sync desde Stripe. */
    estimatedMrrCents: null;
    /** TODO: requiere tabla de invoices/payments. */
    totalFailedPayments: null;
  };
  subscriptions: AdminSubscriptionRow[];
}
//-aqui termina tipo AdminSubscriptionsPageData-//

//-aqui empieza funcion getAdminSubscriptionsData y es para obtener stats y listado de suscripciones-//
/**
 * Obtiene las métricas agregadas y el listado enriquecido de suscripciones.
 * Orquesta módulos billing + catalog sin acoplarlos entre sí.
 * @sideEffect — lectura de base de datos.
 */
export async function getAdminSubscriptionsData(): Promise<AdminSubscriptionsPageData> {
  const currentUser = await requireCurrentUser();

  if (!currentUser.isSuperAdmin()) {
    throw new Error("FORBIDDEN: se requiere rol SUPER_ADMIN para acceder a datos de suscripciones globales.");
  }

  const billingInfra = getBillingInfrastructure();
  const catalogInfra = getCatalogInfrastructure();

  const getStats = new GetSubscriptionsPlatformStats(billingInfra.subscriptionRepository);
  const listSubs = new ListPlatformSubscriptions(billingInfra.subscriptionRepository);
  const listRestaurants = new ListRestaurantsUseCase(catalogInfra.restaurantRepository);

  const [stats, platformSubs, restaurants] = await Promise.all([
    getStats.execute(),
    listSubs.execute(),
    listRestaurants.execute(),
  ]);

  //-aqui empieza mapa de restaurantId → nombre para enriquecer filas-//
  const restaurantNameMap = new Map<string, string>();
  for (const r of restaurants) {
    restaurantNameMap.set(r.id, r.name);
  }
  //-aqui termina mapa-//

  //-aqui empieza mapeo de suscripciones a filas enriquecidas-//
  const subscriptions: AdminSubscriptionRow[] = platformSubs.map((s) => ({
    id: s.id,
    restaurantName: restaurantNameMap.get(s.restaurantId) ?? null,
    status: s.status,
    planId: s.planId,
    isTrial: s.isTrial,
    remainingTrialDays: s.remainingTrialDays,
    currentPeriodEnd: s.currentPeriodEnd,
    cancelAtPeriodEnd: s.cancelAtPeriodEnd,
    createdAt: s.createdAt,
  }));
  //-aqui termina mapeo-//

  return { stats, subscriptions };
}
//-aqui termina funcion getAdminSubscriptionsData-//
