/**
 * Archivo: AdminMetricCard.tsx
 * Responsabilidad: Card individual de métrica para el resumen de admin
 * Tipo: UI
 */

import { T } from "@/components/T";

interface AdminMetricCardProps {
  label: string;
  value: string;
  caption: string;
  tone: "primary" | "secondary" | "surface" | "warning";
}

//-aqui empieza funcion getToneClassName-//
function getToneClassName(tone: AdminMetricCardProps["tone"]): string {
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
//-aqui termina funcion-//

//-aqui empieza componente AdminMetricCard-//
export function AdminMetricCard({ label, value, caption, tone }: AdminMetricCardProps) {
  return (
    <article className={`rounded-[24px] px-5 py-6 shadow-sm ${getToneClassName(tone)}`}>
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
//-aqui termina componente-//
