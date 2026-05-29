/**
 * Archivo: AnalyticsMetricsGrid.tsx
 * Responsabilidad: Renderizar las tarjetas de métricas principales del restaurante a partir de datos reales del backend.
 * Tipo: UI
 */

import { T } from "@/components/T";
import { type RestaurantAnalyticsSummary } from "@/modules/reservations/application/dtos/get-restaurant-analytics.dto";

export interface AnalyticsMetricsGridProps {
  summary: RestaurantAnalyticsSummary;
}

//-aqui empieza funcion getAnalyticsMetricClassName y es para colorear las tarjetas principales-//
/**
 * Devuelve las clases visuales de una métrica de analítica.
 *
 * @pure
 */
function getAnalyticsMetricClassName(tone: "primary" | "secondary" | "surface" | "warning"): string {
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
function getAnalyticsMetricLabelClassName(tone: "primary" | "secondary" | "surface" | "warning"): string {
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

//-aqui empieza componente AnalyticsMetricsGrid y es para mostrar las métricas principales-//
/**
 * Renderiza las métricas resumidas reales de analítica.
 *
 * @pure
 */
export function AnalyticsMetricsGrid({ summary }: AnalyticsMetricsGridProps) {
  const metrics = [
    {
      label: "Reservas registradas",
      value: summary.totalReservations.toString(),
      caption: `${summary.completedCount} completadas/en mesa`,
      tone: "primary" as const,
    },
    {
      label: "Comensales esperados",
      value: summary.totalCovers.toString(),
      caption: `Promedio de ${summary.averagePartySize} por mesa`,
      tone: "secondary" as const,
    },
    {
      label: "Tasa de No-show",
      value: `${summary.noShowRate}%`,
      caption: `${summary.noShowCount} clientes no se presentaron`,
      tone: "warning" as const,
    },
    {
      label: "Tasa de cancelación",
      value: `${summary.cancellationRate}%`,
      caption: `${summary.cancelledCount} reservas canceladas`,
      tone: "surface" as const,
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <article
          className={`rounded-[24px] p-6 shadow-sm ${getAnalyticsMetricClassName(metric.tone)}`}
          key={metric.label}
        >
          <p className={`text-xs font-bold uppercase tracking-[0.22em] ${getAnalyticsMetricLabelClassName(metric.tone)}`}>
            <T>{metric.label}</T>
          </p>
          <p className="mt-4 text-4xl font-black tracking-tight">
            <T>{metric.value}</T>
          </p>
          <p className={`mt-2 text-sm leading-6 ${getAnalyticsMetricLabelClassName(metric.tone)}`}>
            <T>{metric.caption}</T>
          </p>
        </article>
      ))}
    </section>
  );
}
//-aqui termina componente AnalyticsMetricsGrid-//
