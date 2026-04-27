/**
 * Archivo: page.tsx
 * Responsabilidad: Renderizar la vista MVP de incidencias del panel SaaS.
 * Tipo: UI
 */

import { T } from "@/components/T";
import { OnboardingIcon } from "@/components/onboarding/OnboardingIcon";

interface IncidentMetricDefinition {
  label: string;
  value: string;
  caption: string;
  tone: "primary" | "secondary" | "surface" | "warning";
}

interface IncidentDefinition {
  title: string;
  severity: string;
  description: string;
  time: string;
}

interface IncidentActionDefinition {
  title: string;
  description: string;
}

const incidentMetricDefinitions: ReadonlyArray<IncidentMetricDefinition> = [
  {
    label: "Abiertas",
    value: "3",
    caption: "incidencias activas",
    tone: "primary",
  },
  {
    label: "Webhooks fallidos",
    value: "2",
    caption: "requieren reintento manual",
    tone: "secondary",
  },
  {
    label: "Resueltas hoy",
    value: "9",
    caption: "casos cerrados por soporte",
    tone: "surface",
  },
  {
    label: "SLA en riesgo",
    value: "1",
    caption: "incidente cercano al límite",
    tone: "warning",
  },
] as const;

const incidentDefinitions: ReadonlyArray<IncidentDefinition> = [
  {
    title: "Webhook de pago fallido",
    severity: "Alta",
    description: "Un evento de Stripe quedó en error temporal y necesita reintento.",
    time: "Hace 12 min",
  },
  {
    title: "Reserva duplicada",
    severity: "Media",
    description: "Se detectó una creación repetida durante un pico de tráfico.",
    time: "Hace 31 min",
  },
  {
    title: "Sincronización tardía",
    severity: "Baja",
    description: "Un tenant no recibió el último sync de mesas a tiempo.",
    time: "Hace 49 min",
  },
] as const;

const incidentActionDefinitions: ReadonlyArray<IncidentActionDefinition> = [
  {
    title: "Reintentar integraciones",
    description: "Forzar la repetición de webhooks y validaciones críticas.",
  },
  {
    title: "Escalar a soporte",
    description: "Notificar a quien resuelve incidencias de plataforma.",
  },
  {
    title: "Registrar causa raíz",
    description: "Guardar contexto para análisis posterior y prevención.",
  },
] as const;

//-aqui empieza funcion getIncidentToneClassName y es para pintar el tono de las metricas-//
/**
 * Devuelve la clase visual para el tono de una métrica de incidencias.
 *
 * @pure
 */
function getIncidentToneClassName(tone: IncidentMetricDefinition["tone"]): string {
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
//-aqui termina funcion getIncidentToneClassName-//

//-aqui empieza componente IncidentMetricCard y es para mostrar una metrica del panel-//
interface IncidentMetricCardProps {
  label: string;
  value: string;
  caption: string;
  tone: IncidentMetricDefinition["tone"];
}

/**
 * Renderiza una tarjeta de métrica del panel de incidencias.
 *
 * @pure
 */
function IncidentMetricCard({ label, value, caption, tone }: IncidentMetricCardProps) {
  return (
    <article className={`rounded-[24px] px-5 py-6 shadow-sm ${getIncidentToneClassName(tone)}`}>
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
//-aqui termina componente IncidentMetricCard-//

//-aqui empieza componente IncidentActionsRail y es para mostrar tareas de resolución-//
/**
 * Renderiza la lista de acciones operativas para incidencias.
 *
 * @pure
 */
function IncidentActionsRail() {
  return (
    <section className="rounded-[28px] border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-sm">
      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
        <T>Acciones</T>
      </p>
      <h2 className="mt-2 text-2xl font-black tracking-tight text-primary">
        <T>Respuesta operativa</T>
      </h2>

      <div className="mt-6 space-y-4">
        {incidentActionDefinitions.map((actionDefinition) => (
          <article className="rounded-2xl bg-surface-container-low p-4" key={actionDefinition.title}>
            <h3 className="text-sm font-bold text-on-surface">
              <T>{actionDefinition.title}</T>
            </h3>
            <p className="mt-1 text-sm leading-6 text-on-surface-variant">
              <T>{actionDefinition.description}</T>
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
//-aqui termina componente IncidentActionsRail-//

//-aqui empieza pagina AdminIncidentsPage y es para revisar problemas de plataforma-//
/**
 * Renderiza la vista de incidencias del panel admin.
 */
export default function AdminIncidentsPage() {
  return (
    <>
      <section className="rounded-[28px] bg-warning-container px-6 py-8 shadow-sm md:px-8 md:py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-on-surface-variant">
              <T>Monitoreo</T>
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-primary md:text-5xl">
              <T>Incidencias y alertas</T>
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-7 text-on-surface-variant">
              <T>Centro de control para errores críticos, webhooks fallidos y problemas que necesitan atención inmediata.</T>
            </p>
          </div>

          <div className="rounded-[24px] bg-surface-container-low p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
              <T>Prioridad</T>
            </p>
            <p className="mt-3 text-sm leading-6 text-on-surface-variant">
              <T>El objetivo de esta superficie es detectar, agrupar y resolver problemas antes de que afecten la operación diaria.</T>
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {incidentMetricDefinitions.map((metricDefinition) => (
          <IncidentMetricCard
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
            <T>Incidentes abiertos</T>
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-primary">
            <T>Lista de seguimiento</T>
          </h2>

          <div className="mt-6 space-y-4">
            {incidentDefinitions.map((incidentDefinition) => (
              <article className="rounded-2xl bg-surface-container-low p-4" key={incidentDefinition.title}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-sm font-bold text-on-surface">
                    <T>{incidentDefinition.title}</T>
                  </h3>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                    <T>{incidentDefinition.severity}</T>
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-on-surface-variant">
                  <T>{incidentDefinition.description}</T>
                </p>
                <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                  {incidentDefinition.time}
                </p>
              </article>
            ))}
          </div>
        </div>

        <IncidentActionsRail />
      </section>

      <button className="inline-flex w-fit items-center gap-2 rounded-full border border-outline-variant/20 px-4 py-2 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-low" type="button">
        <OnboardingIcon name="help" className="h-4 w-4" />
        <T>Escalar incidente</T>
      </button>
    </>
  );
}
//-aqui termina pagina AdminIncidentsPage-//
