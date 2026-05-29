/**
 * Archivo: GuestMetricCard.tsx
 * Responsabilidad: Renderizar una tarjeta de métrica agregada en el CRM de clientes.
 * Tipo: UI
 */

import { T } from "@/components/T";

export interface GuestMetricCardProps {
  label: string;
  value: string;
  caption: string;
  tone: "primary" | "secondary" | "warning" | "surface";
}

//-aqui empieza componente GuestMetricCard y es para presentar las métricas principales del CRM-//
/**
 * Renderiza una tarjeta de métrica del CRM de clientes.
 *
 * @pure
 */
export function GuestMetricCard({ label, value, caption, tone }: GuestMetricCardProps) {
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
    </article>
  );
}
//-aqui termina componente GuestMetricCard-//
