/**
 * Archivo: page.tsx
 * Responsabilidad: Renderizar la vista MVP de analítica operativa dentro del dashboard.
 * Tipo: UI
 */

import Link from "next/link";
import { T } from "@/components/T";
import { OnboardingIcon } from "@/components/onboarding/OnboardingIcon";

interface AnalyticsMetricDefinition {
  label: string;
  value: string;
  caption: string;
  tone: "primary" | "secondary" | "surface" | "warning";
}

interface AnalyticsChannelDefinition {
  label: string;
  share: string;
  trend: string;
  progress: number;
}

interface AnalyticsInsightDefinition {
  time: string;
  title: string;
  description: string;
}

const analyticsMetricDefinitions: ReadonlyArray<AnalyticsMetricDefinition> = [
  {
    label: "Reservas atribuidas",
    value: "74%",
    caption: "procedentes de canales directos",
    tone: "primary",
  },
  {
    label: "Conversión",
    value: "18.4%",
    caption: "de visitas a reserva confirmada",
    tone: "secondary",
  },
  {
    label: "Ticket medio",
    value: "€43",
    caption: "por comensal en los últimos 7 días",
    tone: "surface",
  },
  {
    label: "Alertas",
    value: "3",
    caption: "métricas fuera del objetivo",
    tone: "warning",
  },
] as const;

const analyticsChannelDefinitions: ReadonlyArray<AnalyticsChannelDefinition> = [
  {
    label: "Búsqueda orgánica",
    share: "34%",
    trend: "+8%",
    progress: 34,
  },
  {
    label: "Reservas directas",
    share: "28%",
    trend: "+4%",
    progress: 28,
  },
  {
    label: "Google Maps",
    share: "18%",
    trend: "+2%",
    progress: 18,
  },
  {
    label: "Recurrentes",
    share: "20%",
    trend: "+11%",
    progress: 20,
  },
] as const;

const analyticsInsightDefinitions: ReadonlyArray<AnalyticsInsightDefinition> = [
  {
    time: "09:10",
    title: "Pico de tráfico detectado",
    description: "Las visitas aumentaron antes del mediodía y empujaron reservas de última hora.",
  },
  {
    time: "12:45",
    title: "Mejor canal del día",
    description: "Las reservas directas superaron a las de descubrimiento en un 11%.",
  },
  {
    time: "17:30",
    title: "Oportunidad de optimización",
    description: "La tarifa del turno nocturno mantiene margen para campañas más precisas.",
  },
] as const;

//-aqui empieza funcion getAnalyticsMetricClassName y es para colorear las tarjetas principales-//
/**
 * Devuelve las clases visuales de una métrica de analítica.
 *
 * @pure
 */
function getAnalyticsMetricClassName(tone: AnalyticsMetricDefinition["tone"]): string {
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
//-aqui termina funcion getAnalyticsMetricClassName-//

//-aqui empieza funcion getAnalyticsMetricLabelClassName y es para ajustar el texto auxiliar-//
/**
 * Devuelve las clases del texto secundario de una métrica.
 *
 * @pure
 */
function getAnalyticsMetricLabelClassName(tone: AnalyticsMetricDefinition["tone"]): string {
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
//-aqui termina funcion getAnalyticsMetricLabelClassName-//

//-aqui empieza funcion getAnalyticsPanelBarClassName y es para representar el nivel del canal-//
/**
 * Devuelve el ancho visual de un canal de adquisición.
 *
 * @pure
 */
function getAnalyticsPanelBarClassName(progress: number): string {
  return `${Math.min(100, Math.max(0, progress))}%`;
}
//-aqui termina funcion getAnalyticsPanelBarClassName-//

//-aqui empieza componente AnalyticsToolbar y es para resumir la vista de analitica-//
/**
 * Renderiza la cabecera operativa de analítica.
 *
 * @pure
 */
function AnalyticsToolbar() {
  return (
    <section className="flex flex-col gap-6 rounded-[28px] bg-surface-container-lowest p-8 shadow-sm md:flex-row md:items-end md:justify-between md:p-10">
      <div className="max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
          <T>Analítica operativa</T>
        </p>
        <h2 className="mt-4 text-5xl font-black tracking-tighter text-primary md:text-6xl">
          <T>Observa qué impulsa las reservas.</T>
        </h2>
        <p className="mt-4 max-w-xl text-on-surface-variant md:text-lg md:leading-8">
          <T>
            Este MVP reúne los indicadores principales para validar qué canales y momentos aportan más valor al restaurante.
          </T>
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link className="inline-flex items-center justify-center gap-2 rounded-lg bg-surface-container-highest px-6 py-2.5 text-sm font-bold text-on-surface transition-colors hover:bg-surface-container-high" href="/dashboard/reservations">
          <OnboardingIcon name="schedule" className="h-4 w-4" />
          <T>Ver reservas</T>
        </Link>
        <Link className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-on-primary transition-colors hover:opacity-90" href="/dashboard/integrations">
          <OnboardingIcon name="rocketLaunch" className="h-4 w-4" />
          <T>Ver fuentes</T>
        </Link>
      </div>
    </section>
  );
}
//-aqui termina componente AnalyticsToolbar-//

//-aqui empieza componente AnalyticsMetricsGrid y es para mostrar las métricas principales-//
/**
 * Renderiza las métricas resumidas de analítica.
 *
 * @pure
 */
function AnalyticsMetricsGrid() {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {analyticsMetricDefinitions.map((metricDefinition) => (
        <article className={`rounded-[24px] p-6 shadow-sm ${getAnalyticsMetricClassName(metricDefinition.tone)}`} key={metricDefinition.label}>
          <p className={`text-xs font-bold uppercase tracking-[0.22em] ${getAnalyticsMetricLabelClassName(metricDefinition.tone)}`}>
            <T>{metricDefinition.label}</T>
          </p>
          <p className="mt-4 text-4xl font-black tracking-tight">
            <T>{metricDefinition.value}</T>
          </p>
          <p className={`mt-2 text-sm leading-6 ${getAnalyticsMetricLabelClassName(metricDefinition.tone)}`}>
            <T>{metricDefinition.caption}</T>
          </p>
        </article>
      ))}
    </section>
  );
}
//-aqui termina componente AnalyticsMetricsGrid-//

//-aqui empieza componente AnalyticsChannelsPanel y es para visualizar la adquisición-//
/**
 * Renderiza los canales de adquisición como barras comparativas.
 *
 * @pure
 */
function AnalyticsChannelsPanel() {
  return (
    <section className="rounded-[28px] bg-surface-container-lowest p-8 shadow-sm">
      <div className="flex items-center gap-2">
        <OnboardingIcon name="gridView" className="h-5 w-5 text-secondary" />
        <h3 className="text-lg font-bold text-on-surface">
          <T>Canales principales</T>
        </h3>
      </div>

      <div className="mt-6 space-y-4">
        {analyticsChannelDefinitions.map((channelDefinition) => (
          <div key={channelDefinition.label}>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-semibold text-on-surface">
                <T>{channelDefinition.label}</T>
              </span>
              <span className="text-sm font-bold text-primary">
                <T>{`${channelDefinition.share} · ${channelDefinition.trend}`}</T>
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-container-high">
              <div className="h-full rounded-full bg-primary" style={{ width: getAnalyticsPanelBarClassName(channelDefinition.progress) }} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl bg-surface-container-low p-5">
        <h4 className="text-sm font-bold text-on-surface">
          <T>Lectura rápida</T>
        </h4>
        <p className="mt-2 text-sm leading-6 text-on-surface-variant">
          <T>Las reservas directas mantienen mejor margen y deberían priorizarse en futuras acciones de crecimiento.</T>
        </p>
      </div>
    </section>
  );
}
//-aqui termina componente AnalyticsChannelsPanel-//

//-aqui empieza componente AnalyticsInsightRail y es para resumir alertas y hallazgos-//
/**
 * Renderiza el rail lateral con hallazgos recientes.
 *
 * @pure
 */
function AnalyticsInsightRail() {
  return (
    <section className="rounded-[28px] bg-primary p-8 text-on-primary shadow-sm">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/60">
          <T>Hallazgos</T>
        </p>
        <h3 className="mt-3 text-3xl font-black tracking-tight">
          <T>Decisiones rápidas</T>
        </h3>
        <p className="mt-3 text-sm leading-7 text-white/75">
          <T>Resumen ejecutivo para validar prioridades sin necesidad de abrir una herramienta externa.</T>
        </p>
      </div>

      <div className="mt-6 space-y-4 rounded-[24px] bg-white/10 p-5 backdrop-blur-sm">
        {analyticsInsightDefinitions.map((insightDefinition) => (
          <div className="flex gap-4" key={`${insightDefinition.time}-${insightDefinition.title}`}>
            <div className="w-16 shrink-0 rounded-full bg-white/10 px-3 py-2 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
              {insightDefinition.time}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-white">
                <T>{insightDefinition.title}</T>
              </p>
              <p className="mt-1 text-sm leading-6 text-white/70">
                <T>{insightDefinition.description}</T>
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
//-aqui termina componente AnalyticsInsightRail-//

//-aqui empieza pagina AnalyticsPage y es para mostrar la analitica del restaurante-//
/**
 * Presenta la vista MVP de analítica del dashboard.
 */
export default function AnalyticsPage() {
  return (
    <>
      <AnalyticsToolbar />
      <AnalyticsMetricsGrid />

      <section className="grid grid-cols-1 gap-8 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <AnalyticsChannelsPanel />
        </div>

        <div className="xl:col-span-4">
          <AnalyticsInsightRail />
        </div>
      </section>
    </>
  );
}
//-aqui termina pagina AnalyticsPage-//
