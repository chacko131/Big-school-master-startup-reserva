/**
 * Archivo: TeamMetricsGrid.tsx
 * Responsabilidad: Mostrar las métricas resumidas del equipo (miembros, roles, invitaciones, permisos).
 * Tipo: UI
 */

import { T } from "@/components/T";

export interface TeamMetric {
  label: string;
  value: string;
  caption: string;
  tone: "primary" | "secondary" | "surface" | "warning";
}

interface TeamMetricsGridProps {
  metrics: ReadonlyArray<TeamMetric>;
}

//-aqui empieza funcion getMetricCardClassName y es para colorear cada tarjeta segun su tono-//
/**
 * Devuelve las clases de fondo y texto de una tarjeta de métrica.
 *
 * @pure
 */
function getMetricCardClassName(tone: TeamMetric["tone"]): string {
  if (tone === "primary") return "bg-primary text-on-primary";
  if (tone === "secondary") return "bg-secondary-container text-on-secondary-container";
  if (tone === "warning") return "bg-tertiary-fixed text-on-tertiary-fixed";
  return "bg-surface-container-lowest text-on-surface";
}
//-aqui termina funcion getMetricCardClassName-//

//-aqui empieza funcion getMetricCaptionClassName y es para ajustar el color del texto auxiliar-//
/**
 * Devuelve las clases del texto secundario de una métrica.
 *
 * @pure
 */
function getMetricCaptionClassName(tone: TeamMetric["tone"]): string {
  if (tone === "primary") return "text-white/70";
  if (tone === "secondary") return "text-on-secondary-container/75";
  if (tone === "warning") return "text-on-tertiary-fixed/75";
  return "text-on-surface-variant";
}
//-aqui termina funcion getMetricCaptionClassName-//

//-aqui empieza componente TeamMetricsGrid y es para mostrar el estado resumido del equipo-//
/**
 * Renderiza las métricas principales del equipo en una cuadrícula.
 *
 * @pure
 */
export function TeamMetricsGrid({ metrics }: TeamMetricsGridProps) {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <article
          className={`rounded-[24px] p-6 shadow-sm ${getMetricCardClassName(metric.tone)}`}
          key={metric.label}
        >
          <p className={`text-xs font-bold uppercase tracking-[0.22em] ${getMetricCaptionClassName(metric.tone)}`}>
            <T>{metric.label}</T>
          </p>
          <p className="mt-4 text-4xl font-black tracking-tight">
            {metric.value}
          </p>
          <p className={`mt-2 text-sm leading-6 ${getMetricCaptionClassName(metric.tone)}`}>
            <T>{metric.caption}</T>
          </p>
        </article>
      ))}
    </section>
  );
}
//-aqui termina componente TeamMetricsGrid-//
