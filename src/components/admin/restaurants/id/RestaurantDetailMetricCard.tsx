/**
 * Archivo: RestaurantDetailMetricCard.tsx
 * Responsabilidad: Renderiza una tarjeta de métrica del detalle del restaurante.
 * Tipo: UI
 */
import { T } from "@/components/T";

export interface RestaurantDetailMetricDefinition {
  label: string;
  value: string;
  caption: string;
  tone: "primary" | "secondary" | "surface" | "warning";
}

export interface RestaurantDetailMetricCardProps {
  label: string;
  value: string;
  caption: string;
  tone: RestaurantDetailMetricDefinition["tone"];
}

/**
 * Devuelve la clase visual para el tono de una tarjeta.
 *
 * @pure
 */
export function getRestaurantToneClassName(tone: RestaurantDetailMetricDefinition["tone"]): string {
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

/**
 * Renderiza una tarjeta de métrica del detalle del restaurante.
 *
 * @pure
 */
export function RestaurantDetailMetricCard({ label, value, caption, tone }: RestaurantDetailMetricCardProps) {
  return (
    <article className={`rounded-[24px] px-5 py-6 shadow-sm ${getRestaurantToneClassName(tone)}`}>
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
