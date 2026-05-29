/**
 * Archivo: DashboardMetricCard.tsx
 * Responsabilidad: Presentar un indicador o métrica clave de rendimiento diario del restaurante.
 * Tipo: UI
 */

import { T } from "@/components/T";

export interface DashboardMetricCardProps {
  label: string;
  value: string;
  caption: string;
  tone: "primary" | "secondary" | "surface" | "warning";
  progress?: number;
}

//-aqui empieza componente DashboardMetricCard y es para presentar los indicadores diarios del panel-//
/**
 * Renderiza una tarjeta de métrica del reporte diario con barra de progreso opcional.
 *
 * @pure
 */
export function DashboardMetricCard({
  label,
  value,
  caption,
  tone,
  progress,
}: DashboardMetricCardProps) {
  const containerClassName =
    tone === "primary"
      ? "bg-primary text-on-primary"
      : tone === "secondary"
        ? "bg-secondary-container text-on-secondary-container"
        : tone === "warning"
          ? "bg-tertiary-fixed text-on-tertiary-fixed"
          : "bg-surface-container-lowest text-on-surface";
  const labelClassName =
    tone === "primary"
      ? "text-white/70"
      : tone === "secondary"
        ? "text-on-secondary-container/75"
        : tone === "warning"
          ? "text-on-tertiary-fixed/75"
          : "text-on-surface-variant";
  const progressTrackClassName =
    tone === "primary"
      ? "bg-white/20"
      : tone === "secondary"
        ? "bg-on-secondary-container/10"
        : tone === "warning"
          ? "bg-on-tertiary-fixed/10"
          : "bg-outline-variant/30";
  const progressFillClassName =
    tone === "primary"
      ? "bg-white"
      : tone === "secondary"
        ? "bg-on-secondary-container"
        : tone === "warning"
          ? "bg-on-tertiary-fixed"
          : "bg-primary";
  const clampedProgress =
    typeof progress === "number" ? Math.min(100, Math.max(0, Number(progress))) : null;

  return (
    <article className={`rounded-[24px] p-6 shadow-sm ${containerClassName}`}>
      <p className={`text-xs font-bold uppercase tracking-[0.22em] ${labelClassName}`}>
        <T>{label}</T>
      </p>
      <p className="mt-4 text-4xl font-black tracking-tight">
        <T>{value}</T>
      </p>
      <p className={`mt-2 text-sm leading-6 ${labelClassName}`}>
        <T>{caption}</T>
      </p>
      {clampedProgress !== null ? (
        <div
          className={`mt-5 h-1.5 w-full overflow-hidden rounded-full ${progressTrackClassName}`}
          role="progressbar"
          aria-valuenow={clampedProgress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${clampedProgress}%`}
        >
          <div
            className={`h-full rounded-full ${progressFillClassName}`}
            style={{ width: `${clampedProgress}%` }}
          />
        </div>
      ) : null}
    </article>
  );
}
//-aqui termina componente DashboardMetricCard-//
