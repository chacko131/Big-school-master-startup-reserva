/**
 * Archivo: RestaurantMetricCard.tsx
 * Responsabilidad: Renderiza una tarjeta de métrica del listado de restaurantes.
 * Tipo: UI
 */
import { T } from "@/components/T";

export interface RestaurantMetricDefinition {
  label: string;
  value: string;
  caption: string;
  tone: "primary" | "secondary" | "surface" | "warning";
}

export interface RestaurantMetricCardProps {
  label: string;
  value: string;
  caption: string;
  tone: RestaurantMetricDefinition["tone"];
}

/**
 * Renderiza una tarjeta de métrica del listado de restaurantes.
 *
 * @pure
 */
export function RestaurantMetricCard({ label, value, caption, tone }: RestaurantMetricCardProps) {
  const toneClassName =
    tone === "primary"
      ? "bg-primary text-on-primary"
      : tone === "secondary"
        ? "bg-secondary-container text-secondary"
        : tone === "surface"
          ? "bg-surface-container-low text-on-surface"
          : "bg-warning-container text-warning";

  return (
    <article className={`rounded-[24px] px-5 py-6 shadow-sm ${toneClassName}`}>
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
