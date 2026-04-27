/**
 * Archivo: page.tsx
 * Responsabilidad: Renderizar la vista MVP de feature flags del panel SaaS.
 * Tipo: UI
 */

import { T } from "@/components/T";
import { OnboardingIcon } from "@/components/onboarding/OnboardingIcon";

interface FeatureFlagMetricDefinition {
  label: string;
  value: string;
  caption: string;
  tone: "primary" | "secondary" | "surface" | "warning";
}

interface FeatureFlagDefinition {
  name: string;
  status: string;
  description: string;
}

interface FeatureFlagTargetDefinition {
  title: string;
  description: string;
}

const featureFlagMetricDefinitions: ReadonlyArray<FeatureFlagMetricDefinition> = [
  {
    label: "Activas",
    value: "8",
    caption: "flags en producción",
    tone: "primary",
  },
  {
    label: "Rollouts",
    value: "3",
    caption: "despliegues graduales en curso",
    tone: "secondary",
  },
  {
    label: "Desactivadas",
    value: "4",
    caption: "funciones en espera",
    tone: "surface",
  },
  {
    label: "Revisión",
    value: "1",
    caption: "flag con decisión pendiente",
    tone: "warning",
  },
] as const;

const featureFlagDefinitions: ReadonlyArray<FeatureFlagDefinition> = [
  {
    name: "new-analytics-overview",
    status: "Activo",
    description: "Nuevo panel resumen para datos operativos y comerciales.",
  },
  {
    name: "guest-messaging-automation",
    status: "Gradual",
    description: "Automatización de mensajes para recordatorios y cancelaciones.",
  },
  {
    name: "admin-restaurants-audit",
    status: "Activo",
    description: "Mejoras para revisión de tenants y auditoría interna.",
  },
  {
    name: "tables-advanced-modes",
    status: "Desactivado",
    description: "Edición avanzada para planes posteriores del roadmap.",
  },
] as const;

const featureFlagTargetDefinitions: ReadonlyArray<FeatureFlagTargetDefinition> = [
  {
    title: "Rollout gradual",
    description: "Permite abrir una funcionalidad primero a un porcentaje reducido de tenants.",
  },
  {
    title: "Control por rol",
    description: "Más adelante servirá para restringir módulos a perfiles concretos.",
  },
  {
    title: "Seguridad operativa",
    description: "Reduce el riesgo de habilitar código incompleto en producción.",
  },
] as const;

//-aqui empieza funcion getFeatureFlagToneClassName y es para pintar el tono de las metricas-//
/**
 * Devuelve la clase visual para el tono de una métrica de feature flags.
 *
 * @pure
 */
function getFeatureFlagToneClassName(tone: FeatureFlagMetricDefinition["tone"]): string {
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
//-aqui termina funcion getFeatureFlagToneClassName-//

//-aqui empieza componente FeatureFlagMetricCard y es para mostrar una metrica del panel-//
interface FeatureFlagMetricCardProps {
  label: string;
  value: string;
  caption: string;
  tone: FeatureFlagMetricDefinition["tone"];
}

/**
 * Renderiza una tarjeta de métrica del panel de feature flags.
 *
 * @pure
 */
function FeatureFlagMetricCard({ label, value, caption, tone }: FeatureFlagMetricCardProps) {
  return (
    <article className={`rounded-[24px] px-5 py-6 shadow-sm ${getFeatureFlagToneClassName(tone)}`}>
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
//-aqui termina componente FeatureFlagMetricCard-//

//-aqui empieza componente FeatureFlagTargetRail y es para explicar el uso del panel-//
/**
 * Renderiza la ayuda contextual de la superficie de feature flags.
 *
 * @pure
 */
function FeatureFlagTargetRail() {
  return (
    <section className="rounded-[28px] border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-sm">
      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
        <T>Objetivo</T>
      </p>
      <h2 className="mt-2 text-2xl font-black tracking-tight text-primary">
        <T>Gestión progresiva</T>
      </h2>

      <div className="mt-6 space-y-4">
        {featureFlagTargetDefinitions.map((targetDefinition) => (
          <article className="rounded-2xl bg-surface-container-low p-4" key={targetDefinition.title}>
            <h3 className="text-sm font-bold text-on-surface">
              <T>{targetDefinition.title}</T>
            </h3>
            <p className="mt-1 text-sm leading-6 text-on-surface-variant">
              <T>{targetDefinition.description}</T>
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
//-aqui termina componente FeatureFlagTargetRail-//

//-aqui empieza pagina AdminFeatureFlagsPage y es para gestionar habilitaciones progresivas-//
/**
 * Renderiza la vista de feature flags del panel admin.
 */
export default function AdminFeatureFlagsPage() {
  return (
    <>
      <section className="rounded-[28px] bg-secondary-container px-6 py-8 shadow-sm md:px-8 md:py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-on-surface-variant">
              <T>Despliegue controlado</T>
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-primary md:text-5xl">
              <T>Feature flags</T>
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-7 text-on-surface-variant">
              <T>Superficie preparatoria para activar funcionalidades de forma gradual y con control operativo.</T>
            </p>
          </div>

          <div className="rounded-[24px] bg-surface-container-low p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
              <T>Roadmap</T>
            </p>
            <p className="mt-3 text-sm leading-6 text-on-surface-variant">
              <T>Aquí se gestionarán flags por tenant, por rol o por porcentaje de rollout cuando la lógica real esté conectada.</T>
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {featureFlagMetricDefinitions.map((metricDefinition) => (
          <FeatureFlagMetricCard
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
            <T>Flags</T>
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-primary">
            <T>Listado actual</T>
          </h2>

          <div className="mt-6 space-y-4">
            {featureFlagDefinitions.map((flagDefinition) => (
              <article className="rounded-2xl bg-surface-container-low p-4" key={flagDefinition.name}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-sm font-bold text-on-surface">
                    <T>{flagDefinition.name}</T>
                  </h3>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                    <T>{flagDefinition.status}</T>
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-on-surface-variant">
                  <T>{flagDefinition.description}</T>
                </p>
              </article>
            ))}
          </div>
        </div>

        <FeatureFlagTargetRail />
      </section>

      <button className="inline-flex w-fit items-center gap-2 rounded-full border border-outline-variant/20 px-4 py-2 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-low" type="button">
        <OnboardingIcon name="rocketLaunch" className="h-4 w-4" />
        <T>Publicar flag</T>
      </button>
    </>
  );
}
//-aqui termina pagina AdminFeatureFlagsPage-//
