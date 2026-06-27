/**
 * Archivo: ServiceAnalyticsKpiGrid.tsx
 * Responsabilidad: Renderizar la fila de 5 KPIs del panel de analíticas de servicio.
 * Tipo: UI
 */

import { T } from "@/components/T";
import type { DailySalesSummary } from "@/modules/service/domain/types/service.types";

interface ServiceAnalyticsKpiGridProps {
  summary: DailySalesSummary;
}

//-aqui empieza funcion formatCurrency y es para formatear valores monetarios con símbolo-//
/** @pure */
function formatCurrency(value: number): string {
  return `$${value.toLocaleString("es-MX", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
//-aqui termina funcion formatCurrency-//

//-aqui empieza funcion formatMarginPct y es para calcular el porcentaje de margen bruto-//
/** @pure */
function formatMarginPct(revenue: number, cost: number): string {
  if (revenue === 0) return "0.0%";
  return `${(((revenue - cost) / revenue) * 100).toFixed(1)}%`;
}
//-aqui termina funcion formatMarginPct-//

interface KpiCardProps {
  label: string;
  value: string;
  tone?: "positive" | "negative" | "neutral";
}

//-aqui empieza componente KpiCard y es para renderizar una tarjeta de métrica individual-//
/** @pure */
function KpiCard({ label, value, tone = "neutral" }: KpiCardProps) {
  const toneClass =
    tone === "positive"
      ? "text-secondary"
      : tone === "negative"
        ? "text-on-tertiary-container"
        : "text-on-surface-variant";

  return (
    <div className="bg-surface-container-lowest rounded-xl p-5">
      <span className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
        <T>{label}</T>
      </span>
      <span className={`text-2xl font-black tracking-tight ${toneClass === "text-on-surface-variant" ? "text-primary" : toneClass}`}>
        {value}
      </span>
    </div>
  );
}
//-aqui termina componente KpiCard-//

//-aqui empieza componente ServiceAnalyticsKpiGrid y es para mostrar los 5 KPIs del servicio-//
/**
 * Renderiza los 5 KPIs del período: Revenue, Costo, Margen Bruto, Órdenes, Ticket Promedio.
 * @pure
 */
export function ServiceAnalyticsKpiGrid({ summary }: ServiceAnalyticsKpiGridProps) {
  const marginPct = formatMarginPct(summary.totalRevenue, summary.totalCost);

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <KpiCard label="Revenue" value={formatCurrency(summary.totalRevenue)} tone="positive" />
      <KpiCard label="Costo" value={formatCurrency(summary.totalCost)} tone="negative" />
      <KpiCard label="Margen Bruto" value={marginPct} tone="positive" />
      <KpiCard label="Órdenes" value={String(summary.orderCount)} />
      <KpiCard label="Ticket Promedio" value={formatCurrency(summary.avgTicket)} tone="positive" />
    </div>
  );
}
//-aqui termina componente ServiceAnalyticsKpiGrid-//
