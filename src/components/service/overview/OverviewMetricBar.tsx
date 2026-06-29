/**
 * Archivo: OverviewMetricBar.tsx
 * Responsabilidad: Fila de KPIs operativos del turno para la vista de control total.
 * Tipo: UI
 */

import { T } from "@/components/T";
import type { TableWithOrder } from "@/app/(service)/service/floor/actions";
import type { KdsItem } from "@/app/(service)/service/kds/actions";

interface OverviewMetricBarProps {
  tables: TableWithOrder[];
  kitchenItems: KdsItem[];
  barItems: KdsItem[];
}

//-aqui empieza componente OverviewMetricBar y es para mostrar los KPIs operativos del turno al manager-//
/**
 * Calcula 5 KPIs a partir de los datos de sala y KDS:
 * - Mesas libres / ocupadas
 * - Órdenes activas
 * - Ítems en cocina
 * - Ítems en barra
 * - Platos listos para recoger
 * @pure
 */
export function OverviewMetricBar({ tables, kitchenItems, barItems }: OverviewMetricBarProps) {
  const freeTables = tables.filter((t) => t.order === null).length;
  const occupiedTables = tables.filter((t) => t.order !== null).length;
  const activeOrders = occupiedTables;
  const kitchenCount = kitchenItems.length;
  const barCount = barItems.length;
  const readyCount = tables.reduce((sum, t) => sum + t.readyCount, 0);

  const metrics = [
    {
      label: "Mesas libres",
      value: freeTables,
      total: tables.length,
      colorBar: "bg-secondary",
      colorText: "text-secondary",
    },
    {
      label: "Órdenes activas",
      value: activeOrders,
      total: tables.length,
      colorBar: "bg-primary",
      colorText: "text-on-surface",
    },
    {
      label: "Cocina",
      value: kitchenCount,
      total: null,
      colorBar: "bg-amber-500",
      colorText: "text-on-surface",
    },
    {
      label: "Barra",
      value: barCount,
      total: null,
      colorBar: "bg-indigo-400",
      colorText: "text-on-surface",
    },
    {
      label: "Platos listos",
      value: readyCount,
      total: null,
      colorBar: "bg-tertiary-container",
      colorText: readyCount > 0 ? "text-secondary" : "text-on-surface",
    },
  ] as const;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {metrics.map((m) => (
        <div
          key={m.label}
          className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-4 flex flex-col gap-3"
        >
          <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
            <T>{m.label}</T>
          </span>
          <div className="flex items-end gap-1">
            <span className={`font-heading text-3xl font-black leading-none ${m.colorText}`}>
              {String(m.value).padStart(2, "0")}
            </span>
            {m.total !== null && (
              <span className="text-sm text-on-surface-variant mb-0.5">/ {m.total}</span>
            )}
          </div>
          {/* Barra de progreso */}
          {m.total !== null ? (
            <div className="h-1 w-full rounded-full bg-surface-container-high overflow-hidden">
              <div
                className={`h-full rounded-full ${m.colorBar}`}
                style={{ width: m.total > 0 ? `${(m.value / m.total) * 100}%` : "0%" }}
              />
            </div>
          ) : (
            <div className={`h-1 w-full rounded-full ${m.value > 0 ? m.colorBar : "bg-surface-container-high"}`} />
          )}
        </div>
      ))}
    </div>
  );
}
//-aqui termina componente OverviewMetricBar-//
