/**
 * Archivo: page.tsx
 * Responsabilidad: Renderizar la vista de suscripciones del panel SaaS con datos reales.
 * Tipo: UI
 */

import { T } from "@/components/T";
import { AdminMetricCard } from "@/components/admin/resumen/AdminMetricCard";
import { getAdminSubscriptionsData, type AdminSubscriptionRow } from "./actions";

//-aqui empieza constante pendingItems para TODOs que no podemos extraer aún-//
const pendingItems = [
  {
    title: "MRR total",
    description: "Requiere campo amountCents en schema o sincronización de invoices desde Stripe.",
  },
  {
    title: "Pagos fallidos",
    description: "Requiere tabla de invoices/payments en la base de datos.",
  },
  {
    title: "Facturas globales",
    description: "Requiere tabla de invoices sincronizada vía webhooks de Stripe.",
  },
] as const;
//-aqui termina constante pendingItems-//

//-aqui empieza funcion formatStatus y es para traducir el status a texto legible-//
/**
 * Traduce el SubscriptionStatus a un label legible para la tabla.
 * @pure
 */
function formatStatus(status: string): string {
  const statusLabels: Record<string, string> = {
    active: "Activa",
    trialing: "Trial",
    canceled: "Cancelada",
    past_due: "Pago pendiente",
    incomplete: "Incompleta",
  };

  return statusLabels[status] ?? status;
}
//-aqui termina funcion formatStatus-//

//-aqui empieza funcion formatPlan y es para traducir el planId a texto legible-//
/**
 * @pure
 */
function formatPlan(planId: string, isTrial: boolean, remainingTrialDays: number): string {
  const planLabel = planId === "pro" ? "Pro" : "Basic";
  if (isTrial) return `${planLabel} (trial · ${remainingTrialDays}d)`;
  return planLabel;
}
//-aqui termina funcion formatPlan-//

//-aqui empieza componente SubscriptionTableRow-//
/**
 * Renderiza una fila de la tabla de suscripciones.
 * @pure
 */
function SubscriptionTableRow({ sub }: { sub: AdminSubscriptionRow }) {
  return (
    <div className="grid grid-cols-5 gap-4 px-4 py-4 text-sm">
      <span className="font-semibold text-on-surface">
        {sub.restaurantName ?? "—"}
      </span>
      <span className="font-semibold text-primary">
        <T>{formatPlan(sub.planId, sub.isTrial, sub.remainingTrialDays)}</T>
      </span>
      <span className="text-on-surface-variant">
        <T>{formatStatus(sub.status)}</T>
      </span>
      <span className="text-on-surface-variant">
        {new Date(sub.currentPeriodEnd).toLocaleDateString("es-ES")}
      </span>
      <span className="font-semibold text-on-surface">
        {sub.cancelAtPeriodEnd ? "Cancela al fin" : "Renueva"}
      </span>
    </div>
  );
}
//-aqui termina componente SubscriptionTableRow-//

//-aqui empieza pagina AdminSubscriptionsPage y es para supervisar billing con datos reales-//
/**
 * Renderiza la vista de suscripciones del panel admin con datos reales.
 *
 * TODO: MRR, pagos fallidos y facturas requieren sync de Stripe → BD.
 */
export default async function AdminSubscriptionsPage() {
  const { stats, subscriptions } = await getAdminSubscriptionsData();

  return (
    <>
      <section className="rounded-[28px] bg-primary px-6 py-8 text-on-primary shadow-sm md:px-8 md:py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-on-primary/70">
              <T>Billing B2B</T>
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">
              <T>Control de suscripciones</T>
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-7 text-on-primary/80">
              <T>Vista global de planes, estados y renovaciones de todos los restaurantes de la plataforma.</T>
            </p>
          </div>

          <div className="rounded-[24px] bg-white/10 p-5 backdrop-blur-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-primary/70">
              <T>Estado actual</T>
            </p>
            <p className="mt-3 text-sm leading-6 text-on-primary/85">
              <T>MRR y pagos fallidos requieren sync de Stripe via webhooks. Se muestran como pendientes.</T>
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AdminMetricCard
          label="Suscripciones totales"
          value={String(stats.totalSubscriptions)}
          caption="planes registrados en la plataforma"
          tone="primary"
        />
        <AdminMetricCard
          label="Activas"
          value={String(stats.totalActive)}
          caption="suscripciones con cobro activo"
          tone="secondary"
        />
        <AdminMetricCard
          label="En trial"
          value={String(stats.totalTrialing)}
          caption="restaurantes en periodo de prueba"
          tone="surface"
        />
        <AdminMetricCard
          label="Renovaciones hoy"
          value={String(stats.totalRenewingToday)}
          caption="periodos que terminan hoy"
          tone="warning"
        />
      </section>

      <section className="grid grid-cols-1 gap-8 xl:grid-cols-[1.35fr_0.95fr]">
        <div className="rounded-[28px] border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
            <T>Listado</T>
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-primary">
            <T>Suscripciones activas</T>
          </h2>

          <div className="mt-6 overflow-hidden rounded-[24px] border border-outline-variant/20">
            <div className="grid grid-cols-5 gap-4 border-b border-outline-variant/20 bg-surface-container-low px-4 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
              <span>
                <T>Restaurante</T>
              </span>
              <span>
                <T>Plan</T>
              </span>
              <span>
                <T>Estado</T>
              </span>
              <span>
                <T>Fin periodo</T>
              </span>
              <span>
                <T>Renovación</T>
              </span>
            </div>
            <div className="divide-y divide-outline-variant/20 bg-surface-container-lowest">
              {subscriptions.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-on-surface-variant">
                  <T>No hay suscripciones registradas todavía.</T>
                </div>
              ) : (
                subscriptions.map((sub) => (
                  <SubscriptionTableRow key={sub.id} sub={sub} />
                ))
              )}
            </div>
          </div>
        </div>

        <aside className="rounded-[28px] border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
            <T>Pendiente</T>
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-primary">
            <T>Requiere sync de Stripe</T>
          </h2>

          <div className="mt-6 space-y-4">
            {pendingItems.map((item) => (
              <article className="rounded-2xl bg-surface-container-low p-4" key={item.title}>
                <h3 className="text-sm font-bold text-on-surface">
                  <T>{item.title}</T>
                </h3>
                <p className="mt-1 text-sm leading-6 text-on-surface-variant">
                  <T>{item.description}</T>
                </p>
              </article>
            ))}
          </div>
        </aside>
      </section>
    </>
  );
}
//-aqui termina pagina AdminSubscriptionsPage-//
