/**
 * Archivo: page.tsx
 * Responsabilidad: Renderizar la vista MVP de detalle de un restaurante tenant, incluyendo la sección de facturación.
 * Tipo: UI
 */

import Link from "next/link";
import { T } from "@/components/T";
import { OnboardingIcon } from "@/components/onboarding/OnboardingIcon";
import { RestaurantActivityRail } from "@/components/admin/restaurants/id/RestaurantActivityRail";
import { getCatalogInfrastructure } from "@/modules/catalog/infrastructure/catalog-infrastructure";
import { GetRestaurantAdminDetailsUseCase } from "@/modules/catalog/application/use-cases/get-restaurant-admin-details.use-case";
import { getBillingInfrastructure } from "@/modules/billing/infrastructure/billing-infrastructure";
import { GetBillingHistoryForRestaurant, type GetBillingHistoryForRestaurantOutput } from "@/modules/billing/application/use-cases/GetBillingHistoryForRestaurant/get-billing-history-for-restaurant.use-case";
import { notFound } from "next/navigation";

interface AdminRestaurantDetailPageProps {
  params:
    | {
        restaurantId: string;
      }
    | Promise<{
        restaurantId: string;
      }>;
}

interface RestaurantDetailSectionDefinition {
  title: string;
  description: string;
  value: string;
}

/**
 * Renderiza el detalle de un restaurante del panel admin.
 */
export default async function AdminRestaurantDetailPage({ params }: AdminRestaurantDetailPageProps) {
  const { restaurantId } = await params;
  
  const infrastructure = getCatalogInfrastructure();
  const useCase = new GetRestaurantAdminDetailsUseCase(
    infrastructure.restaurantRepository,
    infrastructure.restaurantSettingsRepository,
    infrastructure.diningTableRepository
  );

  let details;
  try {
    details = await useCase.execute(restaurantId);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    notFound();
  }

  // Obtenemos los detalles de suscripción y el historial de pagos desde el backend con manejo de errores
  let billingHistory: GetBillingHistoryForRestaurantOutput = {
    restaurantId: details.id,
    hasActivePlan: false,
    planId: "none",
    status: "none",
    isTrial: false,
    trialEndsAt: null,
    remainingTrialDays: 0,
    currentPeriodEnd: null,
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    invoices: [],
  };

  try {
    const billingInfrastructure = getBillingInfrastructure();
    const getBillingHistory = new GetBillingHistoryForRestaurant(
      billingInfrastructure.subscriptionRepository,
      billingInfrastructure.billingService
    );
    billingHistory = await getBillingHistory.execute({ restaurantId: details.id });
  } catch (error) {
    console.error("Error al recuperar el historial de facturación para el restaurante:", error);
  }

  const sections: RestaurantDetailSectionDefinition[] = [
    {
      title: "Timezone",
      value: details.timezone,
      description: "Alinea los horarios de reservas y avisos operativos.",
    },
    {
      title: "Ventana de Cancelación",
      value: details.cancellationWindowHours ? `${details.cancellationWindowHours}h` : "No definida",
      description: "Tiempo límite antes de la reserva para cancelar sin penalización.",
    },
    {
      title: "Tipos de Servicio",
      value: details.services.length > 0 ? details.services.join(", ") : "Sin servicios",
      description: "Momentos del día en que el restaurante opera.",
    },
    {
      title: "Aprobación",
      value: details.reservationApprovalMode === "AUTO" ? "Automática" : "Manual",
      description: "Cómo se aceptan las nuevas solicitudes de reserva.",
    },
    {
      title: "Lista de Espera",
      value: details.waitlistMode === "AUTO" ? "Automática" : "Manual",
      description: "Permite a los comensales apuntarse cuando no hay mesas.",
    },
    {
      title: "Mesas Operativas",
      value: String(details.activeTablesCount),
      description: "Cantidad de mesas configuradas en sala.",
    },
  ];

  return (
    <>
      <section className="rounded-[28px] bg-primary px-6 py-8 text-on-primary shadow-sm md:px-8 md:py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-on-primary/70">
              <T>Tenant detail</T>
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">
              <T>{details.name}</T>
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-7 text-on-primary/80">
              <T>Detalle operativo para inspeccionar configuración, facturación, actividad y estado interno del tenant seleccionado.</T>
            </p>
          </div>

          <div className="rounded-[24px] bg-white/10 p-5 backdrop-blur-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-primary/70">
              <T>ID del tenant</T>
            </p>
            <p className="mt-3 break-all text-sm font-semibold text-on-primary">
              {details.id}
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-8 xl:grid-cols-[1.15fr_0.95fr]">
        <div className="rounded-[28px] border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
            <T>Configuración base</T>
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-primary">
            <T>Contexto operativo</T>
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {sections.map((sectionDefinition) => (
              <article className="rounded-2xl bg-surface-container-low p-4" key={sectionDefinition.title}>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                  <T>{sectionDefinition.title}</T>
                </p>
                <p className="mt-2 text-sm font-bold text-on-surface">
                  <T>{sectionDefinition.value}</T>
                </p>
                <p className="mt-1 text-xs text-on-surface-variant">
                  <T>{sectionDefinition.description}</T>
                </p>
              </article>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-on-primary transition-colors hover:opacity-90" href="/admin/restaurants">
              <OnboardingIcon name="arrowForward" className="h-4 w-4 rotate-180" />
              <T>Volver al listado</T>
            </Link>
            <button className="inline-flex items-center gap-2 rounded-full border border-outline-variant/20 px-4 py-2 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-low" type="button">
              <OnboardingIcon name="settings" className="h-4 w-4" />
              <T>Editar datos</T>
            </button>
          </div>
        </div>

        <RestaurantActivityRail />
      </section>

      {/* SECCIÓN MÓDULO BILLING: Facturación, Suscripción e Historial de Cobros */}
      <section className="rounded-[28px] border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-sm mt-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
          <T>Facturación y Pagos</T>
        </p>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-primary">
          <T>Estado de Suscripción y Cobros</T>
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Tarjeta del Plan Actual */}
          <article className="rounded-2xl bg-surface-container-low p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
              <T>Plan Actual</T>
            </p>
            <div className="mt-3 flex items-center gap-2">
              {billingHistory.planId === "pro" && (
                <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  {billingHistory.isTrial ? <T>Prueba Pro</T> : <T>Plan Pro</T>}
                </span>
              )}
              {billingHistory.planId === "basic" && (
                <span className="rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-sm font-bold text-sky-600 dark:text-sky-400">
                  <T>Plan Básico</T>
                </span>
              )}
              {billingHistory.planId === "none" && (
                <span className="rounded-full border border-zinc-500/20 bg-zinc-500/10 px-3 py-1 text-sm font-bold text-zinc-500">
                  <T>Sin Plan Activo</T>
                </span>
              )}
            </div>
            <p className="mt-4 text-xs text-on-surface-variant leading-5">
              {billingHistory.planId === "none" ? (
                <T>Este restaurante no tiene un plan de facturación activo asignado.</T>
              ) : billingHistory.isTrial ? (
                <T>Disfruta de acceso total Pro bajo el periodo de prueba gratuito local de 60 días sin tarjeta.</T>
              ) : (
                <T>Suscripción activa gestionada y sincronizada a través de la pasarela de pagos Stripe.</T>
              )}
            </p>
          </article>

          {/* Tarjeta de Vigencia */}
          <article className="rounded-2xl bg-surface-container-low p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
              <T>Estado y Vigencia</T>
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-lg font-bold text-on-surface capitalize">
                {billingHistory.status === "none" ? <T>Inactivo</T> : billingHistory.status}
              </span>
            </div>
            <p className="mt-4 text-xs text-on-surface-variant leading-5">
              {billingHistory.isTrial && billingHistory.trialEndsAt ? (
                <>
                  <T>Días restantes de prueba:</T>{" "}
                  <strong className="text-emerald-500">
                    {billingHistory.remainingTrialDays}
                  </strong>
                  <br />
                  <T>Finaliza el:</T>{" "}
                  {new Date(billingHistory.trialEndsAt).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </>
              ) : billingHistory.currentPeriodEnd ? (
                <>
                  <T>Próxima facturación el:</T>{" "}
                  {new Date(billingHistory.currentPeriodEnd).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </>
              ) : (
                <T>No se define periodo de facturación próximo.</T>
              )}
            </p>
          </article>

          {/* Tarjeta de IDs Técnicos */}
          <article className="rounded-2xl bg-surface-container-low p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
              <T>Detalles en Pasarela (Stripe)</T>
            </p>
            <div className="mt-4 space-y-3 break-all text-xs">
              <div>
                <span className="font-semibold text-on-surface-variant"><T>Cliente ID:</T></span>
                <p className="font-mono text-[11px] text-on-surface mt-0.5">
                  {billingHistory.stripeCustomerId || <T>No registrado (Trial Local)</T>}
                </p>
              </div>
              <div>
                <span className="font-semibold text-on-surface-variant"><T>Suscripción ID:</T></span>
                <p className="font-mono text-[11px] text-on-surface mt-0.5">
                  {billingHistory.stripeSubscriptionId || <T>No disponible</T>}
                </p>
              </div>
            </div>
          </article>
        </div>

        {/* Tabla de Historial de Transacciones */}
        <div className="mt-8 rounded-2xl bg-surface-container-low p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-on-surface-variant">
            <T>Historial de Transacciones (Facturas Recientes)</T>
          </p>
          <div className="mt-4 overflow-x-auto">
            {billingHistory.invoices.length === 0 ? (
              <div className="py-6 text-center text-sm text-on-surface-variant">
                {billingHistory.planId === "pro" && billingHistory.isTrial ? (
                  <T>Restaurante operando bajo trial gratuito local de 60 días. No se registran facturas en Stripe.</T>
                ) : (
                  <T>No se han registrado transacciones o cobros recientes para este restaurante.</T>
                )}
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant/30 pb-2 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                    <th className="py-2"><T>Fecha</T></th>
                    <th className="py-2"><T>Factura ID</T></th>
                    <th className="py-2"><T>Cantidad</T></th>
                    <th className="py-2"><T>Estado</T></th>
                    <th className="py-2 text-right"><T>Acciones</T></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20 text-xs">
                  {billingHistory.invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-surface-container-high transition-colors">
                      <td className="py-3">
                        {new Date(inv.created).toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-3 font-mono text-[10px] break-all max-w-[150px] lg:max-w-none">{inv.id}</td>
                      <td className="py-3 font-bold text-on-surface">
                        {inv.amount.toLocaleString("es-ES", {
                          style: "currency",
                          currency: inv.currency,
                        })}
                      </td>
                      <td className="py-3">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          inv.status === "paid" 
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" 
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        {inv.pdfUrl ? (
                          <a
                            href={inv.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline"
                          >
                            <T>Descargar PDF</T>
                          </a>
                        ) : (
                          <span className="text-on-surface-variant text-[11px]">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
