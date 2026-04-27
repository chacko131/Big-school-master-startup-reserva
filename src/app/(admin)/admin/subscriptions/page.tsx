/**
 * Archivo: page.tsx
 * Responsabilidad: Renderizar la vista MVP de suscripciones del panel SaaS.
 * Tipo: UI
 */

import { T } from "@/components/T";
import { OnboardingIcon } from "@/components/onboarding/OnboardingIcon";

interface SubscriptionMetricDefinition {
  label: string;
  value: string;
  caption: string;
  tone: "primary" | "secondary" | "surface" | "warning";
}

interface SubscriptionPlanDefinition {
  name: string;
  price: string;
  restaurants: string;
  churn: string;
}

interface SubscriptionInvoiceDefinition {
  invoice: string;
  restaurant: string;
  status: string;
  amount: string;
}

interface SubscriptionAlertDefinition {
  title: string;
  description: string;
}

const subscriptionMetricDefinitions: ReadonlyArray<SubscriptionMetricDefinition> = [
  {
    label: "MRR total",
    value: "€34.8k",
    caption: "ingreso recurrente mensual",
    tone: "primary",
  },
  {
    label: "Planes activos",
    value: "3",
    caption: "Starter, Growth y Pro",
    tone: "secondary",
  },
  {
    label: "Pagos fallidos",
    value: "2",
    caption: "requieren revisión manual",
    tone: "surface",
  },
  {
    label: "Renovaciones hoy",
    value: "11",
    caption: "suscripciones programadas",
    tone: "warning",
  },
] as const;

const subscriptionPlanDefinitions: ReadonlyArray<SubscriptionPlanDefinition> = [
  {
    name: "Starter",
    price: "€49",
    restaurants: "42 restaurantes",
    churn: "1.8% churn",
  },
  {
    name: "Growth",
    price: "€89",
    restaurants: "63 restaurantes",
    churn: "0.9% churn",
  },
  {
    name: "Pro",
    price: "€149",
    restaurants: "23 restaurantes",
    churn: "0.4% churn",
  },
] as const;

const subscriptionInvoiceDefinitions: ReadonlyArray<SubscriptionInvoiceDefinition> = [
  {
    invoice: "INV-2041",
    restaurant: "Casa Luma",
    status: "Pagada",
    amount: "€89",
  },
  {
    invoice: "INV-2042",
    restaurant: "Taquería Norte",
    status: "Pendiente",
    amount: "€49",
  },
  {
    invoice: "INV-2043",
    restaurant: "Mareas del Sur",
    status: "Fallida",
    amount: "€149",
  },
] as const;

const subscriptionAlertDefinitions: ReadonlyArray<SubscriptionAlertDefinition> = [
  {
    title: "Cobros fallidos",
    description: "Reintentar las renovaciones que quedaron en error de tarjeta.",
  },
  {
    title: "Migraciones de plan",
    description: "Validar upgrades manuales solicitados por el equipo de ventas.",
  },
  {
    title: "Renovación masiva",
    description: "Supervisar el lote de renovaciones que vence hoy.",
  },
] as const;

//-aqui empieza funcion getSubscriptionToneClassName y es para pintar el tono de las metricas-//
/**
 * Devuelve la clase de tono para una métrica de suscripciones.
 *
 * @pure
 */
function getSubscriptionToneClassName(tone: SubscriptionMetricDefinition["tone"]): string {
  switch (tone) {
    case "primary":
      return "bg-primary text-on-primary";
    case "secondary":
      return "bg-secondary-container text-secondary";
    case "surface":
      return "bg-surface-container-low text-on-surface";
    case "warning":
      return "bg-warning-container text-warning";
    default:
      return "bg-surface-container-low text-on-surface";
  }
}
//-aqui termina funcion getSubscriptionToneClassName-//

//-aqui empieza componente SubscriptionMetricCard y es para mostrar una metrica de billing-//
interface SubscriptionMetricCardProps {
  label: string;
  value: string;
  caption: string;
  tone: SubscriptionMetricDefinition["tone"];
}

/**
 * Renderiza una tarjeta de métrica del panel de suscripciones.
 *
 * @pure
 */
function SubscriptionMetricCard({ label, value, caption, tone }: SubscriptionMetricCardProps) {
  return (
    <article className={`rounded-[24px] px-5 py-6 shadow-sm ${getSubscriptionToneClassName(tone)}`}>
      <p className="text-[10px] font-bold uppercase tracking-[0.22em] opacity-80">
        <T>{label}</T>
      </p>
      <p className="mt-3 text-4xl font-black tracking-tight">
        <T>{value}</T>
      </p>
      <p className="mt-2 text-sm leading-5 opacity-80">
        <T>{caption}</T>
      </p>
    </article>
  );
}
//-aqui termina componente SubscriptionMetricCard-//

//-aqui empieza componente SubscriptionAlertRail y es para listar alertas de billing-//
/**
 * Renderiza las alertas y tareas de suscripción.
 *
 * @pure
 */
function SubscriptionAlertRail() {
  return (
    <section className="rounded-[28px] border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-sm">
      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
        <T>Alertas</T>
      </p>
      <h2 className="mt-2 text-2xl font-black tracking-tight text-primary">
        <T>Seguimiento de billing</T>
      </h2>

      <div className="mt-6 space-y-4">
        {subscriptionAlertDefinitions.map((alertDefinition) => (
          <article className="rounded-2xl bg-surface-container-low p-4" key={alertDefinition.title}>
            <h3 className="text-sm font-bold text-on-surface">
              <T>{alertDefinition.title}</T>
            </h3>
            <p className="mt-1 text-sm leading-6 text-on-surface-variant">
              <T>{alertDefinition.description}</T>
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
//-aqui termina componente SubscriptionAlertRail-//

//-aqui empieza pagina AdminSubscriptionsPage y es para supervisar billing-//
/**
 * Renderiza la vista de suscripciones del panel admin.
 */
export default function AdminSubscriptionsPage() {
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
              <T>Supervisa el estado de los planes, cobros, renovaciones y fallos de facturación de los restaurantes.</T>
            </p>
          </div>

          <div className="rounded-[24px] bg-white/10 p-5 backdrop-blur-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-primary/70">
              <T>Resumen operativo</T>
            </p>
            <p className="mt-3 text-sm leading-6 text-on-primary/85">
              <T>Esta pantalla servirá más adelante como el centro de control del modelo de monetización del SaaS.</T>
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {subscriptionMetricDefinitions.map((metricDefinition) => (
          <SubscriptionMetricCard
            caption={metricDefinition.caption}
            key={metricDefinition.label}
            label={metricDefinition.label}
            tone={metricDefinition.tone}
            value={metricDefinition.value}
          />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-8 xl:grid-cols-[1.35fr_0.95fr]">
        <div className="rounded-[28px] border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
            <T>Planes</T>
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-primary">
            <T>Distribución actual</T>
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {subscriptionPlanDefinitions.map((planDefinition) => (
              <article className="rounded-2xl bg-surface-container-low p-4" key={planDefinition.name}>
                <p className="text-lg font-black tracking-tight text-primary">
                  <T>{planDefinition.name}</T>
                </p>
                <p className="mt-2 text-3xl font-black tracking-tight text-on-surface">
                  <T>{planDefinition.price}</T>
                </p>
                <p className="mt-1 text-sm text-on-surface-variant">
                  <T>{planDefinition.restaurants}</T>
                </p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                  <T>{planDefinition.churn}</T>
                </p>
              </article>
            ))}
          </div>

          <div className="mt-6 overflow-hidden rounded-[24px] border border-outline-variant/20">
            <div className="grid grid-cols-4 gap-4 border-b border-outline-variant/20 bg-surface-container-low px-4 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
              <span>
                <T>Invoice</T>
              </span>
              <span>
                <T>Restaurante</T>
              </span>
              <span>
                <T>Estado</T>
              </span>
              <span>
                <T>Importe</T>
              </span>
            </div>
            <div className="divide-y divide-outline-variant/20 bg-surface-container-lowest">
              {subscriptionInvoiceDefinitions.map((invoiceDefinition) => (
                <div className="grid grid-cols-4 gap-4 px-4 py-4 text-sm" key={invoiceDefinition.invoice}>
                  <span className="font-semibold text-on-surface">
                    {invoiceDefinition.invoice}
                  </span>
                  <span className="text-on-surface-variant">
                    <T>{invoiceDefinition.restaurant}</T>
                  </span>
                  <span className="font-semibold text-primary">
                    <T>{invoiceDefinition.status}</T>
                  </span>
                  <span className="font-semibold text-on-surface">
                    <T>{invoiceDefinition.amount}</T>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <SubscriptionAlertRail />
      </section>

      <button className="inline-flex w-fit items-center gap-2 rounded-full border border-outline-variant/20 px-4 py-2 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-low" type="button">
        <OnboardingIcon name="payments" className="h-4 w-4" />
        <T>Exportar billing</T>
      </button>
    </>
  );
}
//-aqui termina pagina AdminSubscriptionsPage-//
