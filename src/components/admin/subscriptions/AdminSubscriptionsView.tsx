/**
 * Archivo: AdminSubscriptionsView.tsx
 * Responsabilidad: Renderizar la vista de suscripciones del panel admin como interfaz reutilizable.
 * Tipo: UI
 */

import { T } from "@/components/T";
import { OnboardingIcon } from "@/components/onboarding/OnboardingIcon";
import { AdminMetricCard } from "@/components/admin/resumen/AdminMetricCard";

interface AdminSubscriptionMetricDefinition {
  label: string;
  value: string;
  caption: string;
  tone: "primary" | "secondary" | "surface" | "warning";
}

interface AdminSubscriptionSourceDefinition {
  title: string;
  description: string;
}

interface AdminSubscriptionPendingItemDefinition {
  title: string;
  description: string;
}

interface AdminSubscriptionsViewProps {
  metrics: ReadonlyArray<AdminSubscriptionMetricDefinition>;
  availableSources: ReadonlyArray<AdminSubscriptionSourceDefinition>;
  pendingItems: ReadonlyArray<AdminSubscriptionPendingItemDefinition>;
}

//-aqui empieza componente AdminSubscriptionsView y es para mostrar el bloque principal de suscripciones-//
/**
 * Renderiza el panel visual de suscripciones del admin.
 * @pure
 */
export function AdminSubscriptionsView({
  metrics,
  availableSources,
  pendingItems,
}: AdminSubscriptionsViewProps) {
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
              <T>
                Esta vista está preparada para el control global de planes, cobros y renovaciones, pero hoy solo
                expone la interfaz mientras se conecta la lógica agregada del servidor.
              </T>
            </p>
          </div>

          <div className="rounded-[24px] bg-white/10 p-5 backdrop-blur-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-primary/70">
              <T>Estado actual</T>
            </p>
            <p className="mt-3 text-sm leading-6 text-on-primary/85">
              <T>
                Lo que no exista aún en servidor se muestra como TODO en la interfaz. Lo que ya existe para un
                restaurante concreto se debe reutilizar más adelante, pero todavía no alcanza para este resumen global.
              </T>
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metricDefinition) => (
          <AdminMetricCard
            caption={metricDefinition.caption}
            key={metricDefinition.label}
            label={metricDefinition.label}
            tone={metricDefinition.tone}
            value={metricDefinition.value}
          />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-8 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[28px] border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
            <T>Lo que sí existe hoy</T>
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-primary">
            <T>Fuentes disponibles</T>
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {availableSources.map((sourceDefinition) => (
              <article className="rounded-2xl bg-surface-container-low p-4" key={sourceDefinition.title}>
                <p className="text-sm font-bold text-on-surface">
                  <T>{sourceDefinition.title}</T>
                </p>
                <p className="mt-2 text-sm leading-6 text-on-surface-variant">
                  <T>{sourceDefinition.description}</T>
                </p>
              </article>
            ))}
          </div>
        </div>

        <aside className="rounded-[28px] border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
            <T>Pendiente</T>
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-primary">
            <T>Lo que aún falta en servidor</T>
          </h2>

          <div className="mt-6 space-y-4">
            {pendingItems.map((pendingDefinition) => (
              <article className="rounded-2xl bg-surface-container-low p-4" key={pendingDefinition.title}>
                <h3 className="text-sm font-bold text-on-surface">
                  <T>{pendingDefinition.title}</T>
                </h3>
                <p className="mt-1 text-sm leading-6 text-on-surface-variant">
                  <T>{pendingDefinition.description}</T>
                </p>
              </article>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-dashed border-outline-variant/30 bg-surface-container-low p-4">
            <div className="flex items-start gap-3">
              <OnboardingIcon name="help" className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <p className="text-sm leading-6 text-on-surface-variant">
                <T>
                  Cuando exista una query global de suscripciones, esta vista podrá sustituir los TODO por datos reales
                  sin cambiar la estructura de la interfaz.
                </T>
              </p>
            </div>
          </div>
        </aside>
      </section>
    </>
  );
}
//-aqui termina componente AdminSubscriptionsView-//
