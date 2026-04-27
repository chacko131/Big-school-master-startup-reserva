/**
 * Archivo: page.tsx
 * Responsabilidad: Renderizar la vista operativa de facturación y suscripción dentro del dashboard.
 * Tipo: UI
 */

import Link from "next/link";
import { T } from "@/components/T";
import { OnboardingIcon } from "@/components/onboarding/OnboardingIcon";

interface BillingMetricDefinition {
  label: string;
  value: string;
  caption: string;
  tone: "primary" | "secondary" | "surface" | "warning";
}

interface BillingFeatureDefinition {
  label: string;
  description: string;
}

interface BillingInvoiceDefinition {
  number: string;
  issuedAt: string;
  period: string;
  amount: string;
  status: string;
  statusTone: "paid" | "pending" | "overdue";
}

interface BillingPaymentMethodDefinition {
  label: string;
  brand: string;
  last4: string;
  expiry: string;
  primary: boolean;
}

interface BillingActivityDefinition {
  time: string;
  title: string;
  description: string;
}

interface BillingUsageDefinition {
  label: string;
  value: string;
  progress: number;
}

const billingMetricDefinitions: ReadonlyArray<BillingMetricDefinition> = [
  {
    label: "MRR activo",
    value: "€1.240",
    caption: "ingreso recurrente mensual",
    tone: "primary",
  },
  {
    label: "Próxima renovación",
    value: "12 Nov",
    caption: "facturación automática preparada",
    tone: "secondary",
  },
  {
    label: "Facturas pendientes",
    value: "2",
    caption: "requieren revisión manual",
    tone: "warning",
  },
  {
    label: "Cobro recuperado",
    value: "98%",
    caption: "éxito en intentos de pago",
    tone: "surface",
  },
] as const;

const billingFeatureDefinitions: ReadonlyArray<BillingFeatureDefinition> = [
  {
    label: "Reservas ilimitadas",
    description: "Sin topes artificiales para el flujo operativo de la sala.",
  },
  {
    label: "Clientes y CRM",
    description: "Historial, etiquetas y actividad conectada al servicio diario.",
  },
  {
    label: "Facturas automáticas",
    description: "Cobro programado con trazabilidad de cada intento de pago.",
  },
  {
    label: "Acceso multiusuario",
    description: "Equipo con permisos para sala, cocina y administración.",
  },
] as const;

const billingInvoiceDefinitions: ReadonlyArray<BillingInvoiceDefinition> = [
  {
    number: "INV-1048",
    issuedAt: "12 Oct 2026",
    period: "Octubre 2026",
    amount: "€129",
    status: "Pagada",
    statusTone: "paid",
  },
  {
    number: "INV-1049",
    issuedAt: "12 Nov 2026",
    period: "Noviembre 2026",
    amount: "€129",
    status: "Pendiente",
    statusTone: "pending",
  },
  {
    number: "INV-1050",
    issuedAt: "12 Dic 2026",
    period: "Diciembre 2026",
    amount: "€129",
    status: "Programada",
    statusTone: "pending",
  },
  {
    number: "INV-1019",
    issuedAt: "12 Sep 2026",
    period: "Septiembre 2026",
    amount: "€129",
    status: "Atrasada",
    statusTone: "overdue",
  },
] as const;

const billingPaymentMethodDefinitions: ReadonlyArray<BillingPaymentMethodDefinition> = [
  {
    label: "Tarjeta principal",
    brand: "Visa",
    last4: "4242",
    expiry: "08/28",
    primary: true,
  },
  {
    label: "Método secundario",
    brand: "Mastercard",
    last4: "1881",
    expiry: "01/27",
    primary: false,
  },
] as const;

const billingActivityDefinitions: ReadonlyArray<BillingActivityDefinition> = [
  {
    time: "08:20",
    title: "Cobro confirmado",
    description: "La renovación mensual quedó sincronizada con el método principal.",
  },
  {
    time: "10:05",
    title: "Factura enviada",
    description: "Se notificó al equipo administrativo la factura del próximo ciclo.",
  },
  {
    time: "12:40",
    title: "Intento fallido recuperado",
    description: "El reintento automático resolvió un pago temporalmente rechazado.",
  },
] as const;

const billingUsageDefinitions: ReadonlyArray<BillingUsageDefinition> = [
  {
    label: "Reservas usadas",
    value: "1.840 / 2.000",
    progress: 92,
  },
  {
    label: "Clientes activos",
    value: "842 / 1.000",
    progress: 84,
  },
  {
    label: "Integraciones conectadas",
    value: "4 / 5",
    progress: 80,
  },
] as const;

//-aqui empieza funcion getBillingMetricClassName y es para colorear cada tarjeta resumen-//
/**
 * Devuelve las clases visuales de una tarjeta de métrica de facturación.
 *
 * @pure
 */
function getBillingMetricClassName(tone: BillingMetricDefinition["tone"]): string {
  if (tone === "primary") {
    return "bg-primary text-on-primary";
  }

  if (tone === "secondary") {
    return "bg-secondary-container text-on-secondary-container";
  }

  if (tone === "warning") {
    return "bg-tertiary-fixed text-on-tertiary-fixed";
  }

  return "bg-surface-container-lowest text-on-surface";
}
//-aqui termina funcion getBillingMetricClassName-//

//-aqui empieza funcion getBillingMetricLabelClassName y es para ajustar el tono del texto secundario-//
/**
 * Devuelve las clases del texto auxiliar de una métrica.
 *
 * @pure
 */
function getBillingMetricLabelClassName(tone: BillingMetricDefinition["tone"]): string {
  if (tone === "primary") {
    return "text-white/70";
  }

  if (tone === "secondary") {
    return "text-on-secondary-container/75";
  }

  if (tone === "warning") {
    return "text-on-tertiary-fixed/75";
  }

  return "text-on-surface-variant";
}
//-aqui termina funcion getBillingMetricLabelClassName-//

//-aqui empieza funcion getBillingInvoiceStatusClassName y es para pintar el estado de cada factura-//
/**
 * Devuelve las clases del estado de una factura.
 *
 * @pure
 */
function getBillingInvoiceStatusClassName(statusTone: BillingInvoiceDefinition["statusTone"]): string {
  if (statusTone === "paid") {
    return "bg-secondary-container text-on-secondary-container";
  }

  if (statusTone === "overdue") {
    return "bg-error-container text-on-error-container";
  }

  return "bg-tertiary-fixed text-on-tertiary-fixed";
}
//-aqui termina funcion getBillingInvoiceStatusClassName-//

//-aqui empieza componente BillingMetricCard y es para mostrar las métricas de suscripción-//
/**
 * Renderiza una tarjeta con el estado resumido de la facturación.
 *
 * @pure
 */
function BillingMetricCard({ label, value, caption, tone }: BillingMetricDefinition) {
  return (
    <article className={`rounded-[24px] p-6 shadow-sm ${getBillingMetricClassName(tone)}`}>
      <p className={`text-xs font-bold uppercase tracking-[0.22em] ${getBillingMetricLabelClassName(tone)}`}>
        <T>{label}</T>
      </p>
      <p className="mt-4 text-4xl font-black tracking-tight">
        <T>{value}</T>
      </p>
      <p className={`mt-2 text-sm leading-6 ${getBillingMetricLabelClassName(tone)}`}>
        <T>{caption}</T>
      </p>
    </article>
  );
}
//-aqui termina componente BillingMetricCard-//

//-aqui empieza componente BillingToolbar y es para presentar el resumen principal de facturacion-//
/**
 * Renderiza la cabecera operativa de la vista de facturación.
 *
 * @pure
 */
function BillingToolbar() {
  return (
    <section className="flex flex-col gap-6 rounded-[28px] bg-surface-container-lowest p-8 shadow-sm md:flex-row md:items-end md:justify-between md:p-10">
      <div className="max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
          <T>Facturación y suscripción</T>
        </p>
        <h2 className="mt-4 text-5xl font-black tracking-tighter text-primary md:text-6xl">
          <T>Controla el plan y los cobros del restaurante.</T>
        </h2>
        <p className="mt-4 max-w-xl text-on-surface-variant md:text-lg md:leading-8">
          <T>
            Revisa el estado de la suscripción, la actividad de cobro y el histórico de facturas sin salir del panel operativo.
          </T>
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-surface-container-highest px-6 py-2.5 text-sm font-bold text-on-surface transition-colors hover:bg-surface-container-high" type="button">
          <OnboardingIcon name="contentCopy" className="h-4 w-4" />
          <T>Exportar factura</T>
        </button>
        <Link className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-on-primary transition-colors hover:opacity-90" href="/dashboard/settings">
          <OnboardingIcon name="settings" className="h-4 w-4" />
          <T>Ajustar suscripción</T>
        </Link>
      </div>
    </section>
  );
}
//-aqui termina componente BillingToolbar-//

//-aqui empieza componente BillingPlanSummary y es para resumir el plan activo-//
/**
 * Renderiza el bloque con el plan activo y sus beneficios.
 *
 * @pure
 */
function BillingPlanSummary() {
  return (
    <section className="overflow-hidden rounded-[28px] bg-surface-container-lowest shadow-sm">
      <div className="flex flex-col gap-6 border-b border-outline-variant/10 p-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary-container px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-on-secondary-container">
            <OnboardingIcon name="payments" className="h-4 w-4" />
            <T>Plan activo</T>
          </div>
          <h3 className="mt-4 text-3xl font-black tracking-tight text-primary md:text-4xl">
            <T>Plan Operativo Pro</T>
          </h3>
          <p className="mt-3 text-sm leading-7 text-on-surface-variant md:text-base md:leading-8">
            <T>
              Diseñado para restaurantes con alto volumen de reservas, métricas de conversión y control de cobro automatizado.
            </T>
          </p>
        </div>

        <div className="rounded-[24px] bg-primary p-6 text-on-primary shadow-sm lg:min-w-[220px]">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/60">
            <T>Precio mensual</T>
          </p>
          <p className="mt-3 text-4xl font-black tracking-tight">€129</p>
          <p className="mt-2 text-sm text-white/75">
            <T>Renovación automática cada 30 días</T>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 p-8 lg:grid-cols-2">
        <div>
          <h4 className="text-lg font-bold text-on-surface">
            <T>Beneficios incluidos</T>
          </h4>
          <div className="mt-5 space-y-4">
            {billingFeatureDefinitions.map((featureDefinition) => (
              <div className="flex gap-4 rounded-2xl bg-surface-container-low px-4 py-4" key={featureDefinition.label}>
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary-container text-secondary">
                  <OnboardingIcon name="checkCircle" className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-primary">
                    <T>{featureDefinition.label}</T>
                  </p>
                  <p className="mt-1 text-sm leading-6 text-on-surface-variant">
                    <T>{featureDefinition.description}</T>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] bg-surface-container-low p-6">
          <h4 className="text-lg font-bold text-on-surface">
            <T>Resumen de ciclo</T>
          </h4>
          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between rounded-2xl bg-surface-container-lowest px-4 py-3">
              <span className="text-sm text-on-surface-variant">
                <T>Próxima renovación</T>
              </span>
              <span className="text-sm font-bold text-on-surface">
                <T>12 Nov 2026</T>
              </span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-surface-container-lowest px-4 py-3">
              <span className="text-sm text-on-surface-variant">
                <T>Método de cobro</T>
              </span>
              <span className="text-sm font-bold text-on-surface">
                <T>Visa · · · · 4242</T>
              </span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-surface-container-lowest px-4 py-3">
              <span className="text-sm text-on-surface-variant">
                <T>Estado</T>
              </span>
              <span className="inline-flex rounded-full bg-secondary-container px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-on-secondary-container">
                <T>Activo</T>
              </span>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-outline-variant/10 bg-white p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                  <T>Contrato SaaS</T>
                </p>
                <p className="mt-1 text-sm font-semibold text-on-surface">
                  <T>Documento operativo actualizado</T>
                </p>
              </div>
              <button className="rounded-full bg-surface-container-low px-3 py-2 text-sm font-bold text-on-surface-variant transition-colors hover:bg-surface-container-high" type="button">
                <T>Ver</T>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
//-aqui termina componente BillingPlanSummary-//

//-aqui empieza componente BillingInvoiceTable y es para mostrar el historial de facturas-//
/**
 * Renderiza la tabla con el histórico de facturas.
 *
 * @pure
 */
function BillingInvoiceTable() {
  return (
    <section className="overflow-hidden rounded-[28px] bg-surface-container-lowest shadow-sm">
      <div className="flex items-center justify-between gap-4 border-b border-outline-variant/10 px-8 py-6">
        <div>
          <h3 className="text-xl font-black tracking-tight text-primary md:text-2xl">
            <T>Historial de facturas</T>
          </h3>
          <p className="mt-1 text-sm text-on-surface-variant">
            <T>Revisa el ciclo de cobro y descarga los documentos necesarios para contabilidad.</T>
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-on-primary transition-opacity hover:opacity-90" type="button">
          <OnboardingIcon name="save" className="h-4 w-4" />
          <T>Registrar pago</T>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead className="bg-surface-container-low">
            <tr>
              <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                <T>Factura</T>
              </th>
              <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                <T>Emitida</T>
              </th>
              <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                <T>Periodo</T>
              </th>
              <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                <T>Importe</T>
              </th>
              <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                <T>Estado</T>
              </th>
              <th className="px-8 py-4 text-right text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                <T>Acción</T>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {billingInvoiceDefinitions.map((invoiceDefinition) => (
              <tr className="transition-colors hover:bg-surface-container-high" key={invoiceDefinition.number}>
                <td className="px-8 py-5">
                  <div>
                    <p className="text-sm font-bold text-primary">
                      <T>{invoiceDefinition.number}</T>
                    </p>
                    <p className="mt-1 text-xs text-on-surface-variant">
                      <T>Documento fiscal</T>
                    </p>
                  </div>
                </td>
                <td className="px-8 py-5 text-sm font-medium text-on-surface">
                  <T>{invoiceDefinition.issuedAt}</T>
                </td>
                <td className="px-8 py-5 text-sm font-medium text-on-surface">
                  <T>{invoiceDefinition.period}</T>
                </td>
                <td className="px-8 py-5 text-sm font-bold text-on-surface">
                  <T>{invoiceDefinition.amount}</T>
                </td>
                <td className="px-8 py-5">
                  <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${getBillingInvoiceStatusClassName(invoiceDefinition.statusTone)}`}>
                    <T>{invoiceDefinition.status}</T>
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                  <button className="text-xl leading-none text-on-surface-variant transition-colors hover:text-primary" type="button" aria-label="Más acciones">
                    ⋯
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
//-aqui termina componente BillingInvoiceTable-//

//-aqui empieza componente BillingPaymentMethodRail y es para listar los metodos de pago-//
/**
 * Renderiza el rail con métodos de cobro registrados.
 *
 * @pure
 */
function BillingPaymentMethodRail() {
  return (
    <section className="rounded-[28px] bg-surface-container-lowest p-8 shadow-sm">
      <div className="flex items-center gap-2">
        <OnboardingIcon name="payments" className="h-5 w-5 text-secondary" />
        <h3 className="text-lg font-bold text-on-surface">
          <T>Métodos de cobro</T>
        </h3>
      </div>

      <div className="mt-6 space-y-4">
        {billingPaymentMethodDefinitions.map((paymentMethodDefinition) => (
          <article className="rounded-2xl bg-surface-container-low p-5" key={`${paymentMethodDefinition.brand}-${paymentMethodDefinition.last4}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                  <T>{paymentMethodDefinition.label}</T>
                </p>
                <p className="mt-2 text-base font-black tracking-tight text-primary">
                  <T>{paymentMethodDefinition.brand}</T>
                </p>
                <p className="mt-1 text-sm text-on-surface-variant">
                  <T>{`···· ${paymentMethodDefinition.last4}`}</T>
                </p>
              </div>
              {paymentMethodDefinition.primary ? (
                <span className="inline-flex rounded-full bg-secondary-container px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-on-secondary-container">
                  <T>Principal</T>
                </span>
              ) : (
                <span className="inline-flex rounded-full bg-surface-container-high px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-on-surface-variant">
                  <T>Secundario</T>
                </span>
              )}
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-on-surface-variant">
              <span>
                <T>Vence</T>
              </span>
              <span className="font-semibold text-on-surface">
                <T>{paymentMethodDefinition.expiry}</T>
              </span>
            </div>
          </article>
        ))}
      </div>

      <button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-bold text-on-primary transition-opacity hover:opacity-90" type="button">
        <OnboardingIcon name="contentCopy" className="h-4 w-4" />
        <T>Añadir método</T>
      </button>
    </section>
  );
}
//-aqui termina componente BillingPaymentMethodRail-//

//-aqui empieza componente BillingUsagePanel y es para visualizar el consumo del plan-//
/**
 * Renderiza el bloque de uso del plan y actividad reciente.
 *
 * @pure
 */
function BillingUsagePanel() {
  return (
    <section className="rounded-[28px] bg-surface-container-lowest p-8 shadow-sm">
      <h3 className="text-lg font-bold text-on-surface">
        <T>Uso del plan</T>
      </h3>
      <div className="mt-6 space-y-5">
        {billingUsageDefinitions.map((usageDefinition) => (
          <div key={usageDefinition.label}>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-on-surface-variant">
                <T>{usageDefinition.label}</T>
              </span>
              <span className="text-sm font-bold text-on-surface">
                <T>{usageDefinition.value}</T>
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-container-high">
              <div className="h-full rounded-full bg-primary" style={{ width: `${usageDefinition.progress}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 border-t border-outline-variant/10 pt-8">
        <div className="flex items-center gap-2">
          <OnboardingIcon name="schedule" className="h-5 w-5 text-secondary" />
          <h4 className="text-base font-bold text-on-surface">
            <T>Actividad reciente</T>
          </h4>
        </div>

        <div className="mt-5 space-y-4">
          {billingActivityDefinitions.map((activityDefinition) => (
            <div className="flex gap-4" key={`${activityDefinition.time}-${activityDefinition.title}`}>
              <div className="w-16 shrink-0 rounded-full bg-surface-container-low px-3 py-2 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
                {activityDefinition.time}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-primary">
                  <T>{activityDefinition.title}</T>
                </p>
                <p className="mt-1 text-sm leading-6 text-on-surface-variant">
                  <T>{activityDefinition.description}</T>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
//-aqui termina componente BillingUsagePanel-//

//-aqui empieza componente BillingSummaryRail y es para combinar contexto y acciones-//
/**
 * Renderiza el bloque lateral con estado y accesos rápidos.
 *
 * @pure
 */
function BillingSummaryRail() {
  return (
    <section className="space-y-6 rounded-[28px] bg-primary p-8 text-on-primary shadow-sm">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/60">
          <T>Estado de cuenta</T>
        </p>
        <h3 className="mt-3 text-3xl font-black tracking-tight">
          <T>Suscripción sana</T>
        </h3>
        <p className="mt-3 text-sm leading-7 text-white/75">
          <T>Los cobros están sincronizados y no hay alertas críticas abiertas en el ciclo actual.</T>
        </p>
      </div>

      <div className="space-y-4 rounded-[24px] bg-white/10 p-5 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-white/75">
            <T>Próximo cobro</T>
          </span>
          <span className="text-sm font-bold text-white">
            <T>12 Nov 2026</T>
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-white/75">
            <T>Factura abierta</T>
          </span>
          <span className="text-sm font-bold text-white">
            <T>INV-1049</T>
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-white/75">
            <T>Soporte activo</T>
          </span>
          <span className="text-sm font-bold text-white">
            <T>Incluido</T>
          </span>
        </div>
      </div>

      <div className="rounded-[24px] bg-white/10 p-5 backdrop-blur-sm">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/60">
          <T>Acciones rápidas</T>
        </p>
        <div className="mt-4 space-y-3">
          <button className="flex w-full items-center justify-between rounded-lg bg-white/10 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/15" type="button">
            <span className="inline-flex items-center gap-2">
              <OnboardingIcon name="checkCircle" className="h-4 w-4" />
              <T>Confirmar pago</T>
            </span>
            <OnboardingIcon name="arrowForward" className="h-4 w-4" />
          </button>
          <Link className="flex w-full items-center justify-between rounded-lg bg-white/10 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/15" href="/dashboard/settings">
            <span className="inline-flex items-center gap-2">
              <OnboardingIcon name="settings" className="h-4 w-4" />
              <T>Editar reglas</T>
            </span>
            <OnboardingIcon name="arrowForward" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
//-aqui termina componente BillingSummaryRail-//

//-aqui empieza pagina BillingPage y es para mostrar la vista de facturacion del restaurante-//
/**
 * Presenta la vista de facturación y suscripción del dashboard.
 */
export default function BillingPage() {
  return (
    <>
      <BillingToolbar />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {billingMetricDefinitions.map((metricDefinition) => (
          <BillingMetricCard
            caption={metricDefinition.caption}
            key={metricDefinition.label}
            label={metricDefinition.label}
            tone={metricDefinition.tone}
            value={metricDefinition.value}
          />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-8 xl:grid-cols-12">
        <div className="xl:col-span-8 space-y-8">
          <BillingPlanSummary />
          <BillingInvoiceTable />
        </div>

        <div className="xl:col-span-4 space-y-8">
          <BillingSummaryRail />
          <BillingPaymentMethodRail />
          <BillingUsagePanel />
        </div>
      </section>
    </>
  );
}
//-aqui termina pagina BillingPage-//
