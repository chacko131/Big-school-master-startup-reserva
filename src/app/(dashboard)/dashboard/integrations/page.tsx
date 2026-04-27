/**
 * Archivo: page.tsx
 * Responsabilidad: Renderizar la vista MVP de integraciones del dashboard.
 * Tipo: UI
 */

import Link from "next/link";
import { T } from "@/components/T";
import { OnboardingIcon } from "@/components/onboarding/OnboardingIcon";

interface IntegrationMetricDefinition {
  label: string;
  value: string;
  caption: string;
  tone: "primary" | "secondary" | "surface" | "warning";
}

interface IntegrationDefinition {
  label: string;
  description: string;
  status: string;
  statusTone: "connected" | "available" | "attention";
}

interface IntegrationLogDefinition {
  time: string;
  title: string;
  description: string;
}

const integrationMetricDefinitions: ReadonlyArray<IntegrationMetricDefinition> = [
  {
    label: "Conectadas",
    value: "4",
    caption: "servicios listos para uso operativo",
    tone: "primary",
  },
  {
    label: "Pendientes",
    value: "2",
    caption: "integraciones disponibles por activar",
    tone: "secondary",
  },
  {
    label: "Errores",
    value: "0",
    caption: "sin incidencias en sincronización",
    tone: "surface",
  },
  {
    label: "Requieren revisión",
    value: "1",
    caption: "ajustes manuales recomendados",
    tone: "warning",
  },
] as const;

const integrationDefinitions: ReadonlyArray<IntegrationDefinition> = [
  {
    label: "Stripe",
    description: "Cobros, suscripciones y eventos de facturación.",
    status: "Conectado",
    statusTone: "connected",
  },
  {
    label: "Google Calendar",
    description: "Sincronización de eventos y disponibilidad de servicio.",
    status: "Disponible",
    statusTone: "available",
  },
  {
    label: "Email transaccional",
    description: "Plantillas de confirmación, cancelación y recordatorios.",
    status: "Requiere revisión",
    statusTone: "attention",
  },
  {
    label: "WhatsApp",
    description: "Mensajería para avisos y seguimiento de clientes.",
    status: "En cola",
    statusTone: "available",
  },
] as const;

const integrationLogDefinitions: ReadonlyArray<IntegrationLogDefinition> = [
  {
    time: "08:12",
    title: "Webhook validado",
    description: "Stripe confirmó el último evento sin errores de firma.",
  },
  {
    time: "11:06",
    title: "Calendario sincronizado",
    description: "La disponibilidad del turno de noche se actualizó automáticamente.",
  },
  {
    time: "15:40",
    title: "Plantilla pendiente",
    description: "La plantilla de cancelación requiere revisión antes del despliegue real.",
  },
] as const;

//-aqui empieza funcion getIntegrationStatusClassName y es para colorear el estado de cada conexion-//
/**
 * Devuelve las clases visuales del estado de una integración.
 *
 * @pure
 */
function getIntegrationStatusClassName(statusTone: IntegrationDefinition["statusTone"]): string {
  if (statusTone === "connected") {
    return "bg-secondary-container text-on-secondary-container";
  }

  if (statusTone === "attention") {
    return "bg-tertiary-fixed text-on-tertiary-fixed";
  }

  return "bg-surface-container-highest text-on-surface-variant";
}
//-aqui termina funcion getIntegrationStatusClassName-//

//-aqui empieza funcion getIntegrationMetricClassName y es para colorear las tarjetas principales-//
/**
 * Devuelve las clases de una métrica resumida de integraciones.
 *
 * @pure
 */
function getIntegrationMetricClassName(tone: IntegrationMetricDefinition["tone"]): string {
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
//-aqui termina funcion getIntegrationMetricClassName-//

//-aqui empieza funcion getIntegrationMetricLabelClassName y es para ajustar el texto secundario-//
/**
 * Devuelve el estilo de la descripción auxiliar de una métrica.
 *
 * @pure
 */
function getIntegrationMetricLabelClassName(tone: IntegrationMetricDefinition["tone"]): string {
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
//-aqui termina funcion getIntegrationMetricLabelClassName-//

//-aqui empieza componente IntegrationsToolbar y es para resumir el estado de conexiones-//
/**
 * Renderiza la cabecera operativa de integraciones.
 *
 * @pure
 */
function IntegrationsToolbar() {
  return (
    <section className="flex flex-col gap-6 rounded-[28px] bg-surface-container-lowest p-8 shadow-sm md:flex-row md:items-end md:justify-between md:p-10">
      <div className="max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
          <T>Integraciones</T>
        </p>
        <h2 className="mt-4 text-5xl font-black tracking-tighter text-primary md:text-6xl">
          <T>Conecta los servicios que sostienen el MVP.</T>
        </h2>
        <p className="mt-4 max-w-xl text-on-surface-variant md:text-lg md:leading-8">
          <T>
            Esta pantalla resume las conexiones críticas para validar qué servicios externos deberían convertirse en parte del producto final.
          </T>
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link className="inline-flex items-center justify-center gap-2 rounded-lg bg-surface-container-highest px-6 py-2.5 text-sm font-bold text-on-surface transition-colors hover:bg-surface-container-high" href="/dashboard/settings">
          <OnboardingIcon name="settings" className="h-4 w-4" />
          <T>Configurar</T>
        </Link>
        <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-on-primary transition-colors hover:opacity-90" type="button">
          <OnboardingIcon name="contentCopy" className="h-4 w-4" />
          <T>Probar conexión</T>
        </button>
      </div>
    </section>
  );
}
//-aqui termina componente IntegrationsToolbar-//

//-aqui empieza componente IntegrationsMetricsGrid y es para mostrar el estado resumido-//
/**
 * Renderiza las métricas principales de integraciones.
 *
 * @pure
 */
function IntegrationsMetricsGrid() {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {integrationMetricDefinitions.map((metricDefinition) => (
        <article className={`rounded-[24px] p-6 shadow-sm ${getIntegrationMetricClassName(metricDefinition.tone)}`} key={metricDefinition.label}>
          <p className={`text-xs font-bold uppercase tracking-[0.22em] ${getIntegrationMetricLabelClassName(metricDefinition.tone)}`}>
            <T>{metricDefinition.label}</T>
          </p>
          <p className="mt-4 text-4xl font-black tracking-tight">
            <T>{metricDefinition.value}</T>
          </p>
          <p className={`mt-2 text-sm leading-6 ${getIntegrationMetricLabelClassName(metricDefinition.tone)}`}>
            <T>{metricDefinition.caption}</T>
          </p>
        </article>
      ))}
    </section>
  );
}
//-aqui termina componente IntegrationsMetricsGrid-//

//-aqui empieza componente IntegrationsGrid y es para listar cada conexion-//
/**
 * Renderiza la lista de integraciones disponibles.
 *
 * @pure
 */
function IntegrationsGrid() {
  return (
    <section className="rounded-[28px] bg-surface-container-lowest p-8 shadow-sm">
      <div className="flex items-center gap-2">
        <OnboardingIcon name="rocketLaunch" className="h-5 w-5 text-secondary" />
        <h3 className="text-lg font-bold text-on-surface">
          <T>Servicios conectados</T>
        </h3>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {integrationDefinitions.map((integrationDefinition) => (
          <article className="rounded-2xl bg-surface-container-low p-5" key={integrationDefinition.label}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-primary">
                  <T>{integrationDefinition.label}</T>
                </p>
                <p className="mt-1 text-sm leading-6 text-on-surface-variant">
                  <T>{integrationDefinition.description}</T>
                </p>
              </div>
              <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${getIntegrationStatusClassName(integrationDefinition.statusTone)}`}>
                <T>{integrationDefinition.status}</T>
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
//-aqui termina componente IntegrationsGrid-//

//-aqui empieza componente IntegrationsLogRail y es para mostrar actividad de sincronizacion-//
/**
 * Renderiza el rail con eventos recientes de integración.
 *
 * @pure
 */
function IntegrationsLogRail() {
  return (
    <section className="rounded-[28px] bg-primary p-8 text-on-primary shadow-sm">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/60">
          <T>Actividad</T>
        </p>
        <h3 className="mt-3 text-3xl font-black tracking-tight">
          <T>Eventos recientes</T>
        </h3>
        <p className="mt-3 text-sm leading-7 text-white/75">
          <T>El MVP deja visibles los eventos clave que conviene revisar antes de automatizar por completo.</T>
        </p>
      </div>

      <div className="mt-6 space-y-4 rounded-[24px] bg-white/10 p-5 backdrop-blur-sm">
        {integrationLogDefinitions.map((logDefinition) => (
          <div className="flex gap-4" key={`${logDefinition.time}-${logDefinition.title}`}>
            <div className="w-16 shrink-0 rounded-full bg-white/10 px-3 py-2 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
              {logDefinition.time}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-white">
                <T>{logDefinition.title}</T>
              </p>
              <p className="mt-1 text-sm leading-6 text-white/70">
                <T>{logDefinition.description}</T>
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
//-aqui termina componente IntegrationsLogRail-//

//-aqui empieza pagina IntegrationsPage y es para mostrar integraciones-//
/**
 * Presenta la vista MVP de integraciones del dashboard.
 */
export default function IntegrationsPage() {
  return (
    <>
      <IntegrationsToolbar />
      <IntegrationsMetricsGrid />

      <section className="grid grid-cols-1 gap-8 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <IntegrationsGrid />
        </div>

        <div className="xl:col-span-4">
          <IntegrationsLogRail />
        </div>
      </section>
    </>
  );
}
//-aqui termina pagina IntegrationsPage-//
