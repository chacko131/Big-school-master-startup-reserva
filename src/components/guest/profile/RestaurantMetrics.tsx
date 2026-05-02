/**
 * Archivo: RestaurantMetrics.tsx
 * Responsabilidad: Mostrar las métricas y descripción del restaurante.
 * Tipo: UI
 */

import { T } from "@/components/T";
import { PublicIcon } from "@/components/public/PublicIcon";

interface Metric {
  label: string;
  value: string;
  hint: string;
  icon: "star" | "payments" | "distance" | "restaurant";
}

interface RestaurantMetricsProps {
  description: string;
  metrics: ReadonlyArray<Metric>;
}

//-aqui empieza funcion RestaurantMetrics y es para mostrar métricas del restaurante-//
/**
 * @pure
 */
export function RestaurantMetrics({ description, metrics }: RestaurantMetricsProps) {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
        <T>Un Legado Gastronómico</T>
      </h2>
      <p className="max-w-2xl font-body text-base leading-relaxed text-on-surface-variant sm:text-lg">
        <T>{description}</T>
      </p>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {metrics.map((metric) => (
          <article className="space-y-2 rounded-xl bg-surface-container-low p-4 sm:p-6" key={metric.label}>
            <PublicIcon name={metric.icon} className="h-5 w-5 text-secondary sm:h-6 sm:w-6" />
            <div className="text-2xl font-bold sm:text-3xl">{metric.value}</div>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant sm:text-xs">
              <T>{metric.label}</T>
            </div>
            <p className="text-sm leading-6 text-on-surface-variant">
              <T>{metric.hint}</T>
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
//-aqui termina funcion RestaurantMetrics-//
