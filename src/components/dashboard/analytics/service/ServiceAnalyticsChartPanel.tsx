/**
 * Archivo: ServiceAnalyticsChartPanel.tsx
 * Responsabilidad: Renderizar el gráfico de barras Revenue vs Costo por hora
 *   y la tabla Top 10 platos del período.
 * Tipo: UI
 */

import { T } from "@/components/T";
import type {
  HourlySalesStat,
  MenuItemSalesStat,
} from "@/modules/service/domain/types/service.types";

interface ServiceAnalyticsChartPanelProps {
  hourlyStats: HourlySalesStat[];
  topMenuItems: MenuItemSalesStat[];
}

//-aqui empieza funcion formatCurrency y es para formatear moneda en la tabla-//
/** @pure */
function formatCurrency(value: number): string {
  return `$${value.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
//-aqui termina funcion formatCurrency-//

//-aqui empieza funcion getMarginPct y es para calcular el porcentaje de margen de un plato-//
/** @pure */
function getMarginPct(revenue: number, cost: number): string {
  if (revenue === 0) return "0%";
  return `${Math.round(((revenue - cost) / revenue) * 100)}%`;
}
//-aqui termina funcion getMarginPct-//

// ---------------------------------------------------------------------------
// Gráfico de barras inline (sin librería externa)
// ---------------------------------------------------------------------------

//-aqui empieza componente HourlyBarChart y es para visualizar revenue vs costo por hora-//
/**
 * Renderiza barras proporcionales por hora usando solo Tailwind CSS.
 * La barra más alta siempre ocupa el 100% del contenedor.
 * @pure
 */
function HourlyBarChart({ stats }: { stats: HourlySalesStat[] }) {
  if (stats.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-on-surface-variant">
        <T>Sin datos para el período seleccionado</T>
      </div>
    );
  }

  const maxRevenue = Math.max(...stats.map((s) => s.revenue), 1);

  return (
    <div className="flex flex-col flex-1">
      <div className="flex items-end gap-1.5 flex-1 mt-4">
        {stats.map((stat) => {
          const revenueHeight = Math.round((stat.revenue / maxRevenue) * 100);
          return (
            <div
              key={stat.hour}
              className="flex-1 flex flex-col justify-end gap-0.5 group relative"
              title={`${stat.hour}:00 — ${formatCurrency(stat.revenue)} (${stat.orderCount} órdenes)`}
            >
              <div
                className="w-full bg-primary rounded-t-sm group-hover:opacity-80 transition-opacity"
                style={{ height: `${revenueHeight}%` }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-3 border-t border-surface-container pt-2">
        {stats.map((s) => (
          <span key={s.hour} className="flex-1 text-center text-[10px] text-on-surface-variant">
            {s.hour}h
          </span>
        ))}
      </div>
    </div>
  );
}
//-aqui termina componente HourlyBarChart-//

// ---------------------------------------------------------------------------
// Tabla Top 10
// ---------------------------------------------------------------------------

//-aqui empieza componente TopMenuItemsTable y es para mostrar el ranking de platos del período-//
/**
 * Renderiza la tabla "Hospitality Ledger" con los 10 platos más vendidos.
 * Sin líneas verticales ni horizontales (regla del design system).
 * @pure
 */
function TopMenuItemsTable({ items }: { items: MenuItemSalesStat[] }) {
  const top10 = items.slice(0, 10);

  if (top10.length === 0) {
    return (
      <p className="px-6 py-8 text-sm text-on-surface-variant italic">
        <T>Sin ventas registradas en este período.</T>
      </p>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-surface-container-low text-on-surface-variant text-xs uppercase tracking-wider">
            <th className="px-6 py-4 font-semibold rounded-tl-lg">
              <T>Item</T>
            </th>
            <th className="px-6 py-4 font-semibold">
              <T>Unidades</T>
            </th>
            <th className="px-6 py-4 font-semibold">
              <T>Revenue</T>
            </th>
            <th className="px-6 py-4 font-semibold">
              <T>Costo</T>
            </th>
            <th className="px-6 py-4 font-semibold rounded-tr-lg">
              <T>Margen</T>
            </th>
          </tr>
        </thead>
        <tbody className="text-sm text-on-surface">
          {top10.map((item) => {
            const marginPct = getMarginPct(item.revenue, item.cost);
            const marginNum = item.revenue > 0
              ? ((item.revenue - item.cost) / item.revenue) * 100
              : 0;
            const marginColor = marginNum >= 60 ? "text-secondary" : marginNum >= 40 ? "text-on-surface" : "text-on-tertiary-container";

            return (
              <tr
                key={item.menuItemId}
                className="hover:bg-surface-container-high transition-colors cursor-default"
              >
                <td className="px-6 py-3 border-b border-surface-container/50 font-medium text-primary">
                  {item.menuItemName}
                </td>
                <td className="px-6 py-3 border-b border-surface-container/50">
                  {item.qtySold}
                </td>
                <td className="px-6 py-3 border-b border-surface-container/50">
                  {formatCurrency(item.revenue)}
                </td>
                <td className="px-6 py-3 border-b border-surface-container/50">
                  {formatCurrency(item.cost)}
                </td>
                <td className={`px-6 py-3 border-b border-surface-container/50 font-semibold ${marginColor}`}>
                  {marginPct}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
//-aqui termina componente TopMenuItemsTable-//

// ---------------------------------------------------------------------------
// Panel principal
// ---------------------------------------------------------------------------

//-aqui empieza componente ServiceAnalyticsChartPanel y es para orquestar gráfico y tabla-//
/**
 * Renderiza la columna izquierda (ancha) del panel de analíticas:
 * gráfico de revenue por hora + tabla top 10 platos.
 * @pure
 */
export function ServiceAnalyticsChartPanel({
  hourlyStats,
  topMenuItems,
}: ServiceAnalyticsChartPanelProps) {
  return (
    <div className="xl:col-span-2 flex flex-col gap-8">
      {/* Gráfico Revenue por hora */}
      <div className="bg-surface-container-lowest rounded-xl p-6 min-h-[280px] flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-black tracking-tight text-primary">
            <T>Revenue por Hora</T>
          </h3>
          <div className="flex gap-3 text-xs text-on-surface-variant">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary inline-block" />
              <T>Revenue</T>
            </span>
          </div>
        </div>
        <HourlyBarChart stats={hourlyStats} />
      </div>

      {/* Tabla Top 10 */}
      <div className="bg-surface-container-lowest rounded-xl pb-4">
        <div className="p-6 pb-2">
          <h3 className="font-black tracking-tight text-primary">
            <T>Top 10 Platos & Bebidas</T>
          </h3>
        </div>
        <TopMenuItemsTable items={topMenuItems} />
      </div>
    </div>
  );
}
//-aqui termina componente ServiceAnalyticsChartPanel-//
