/**
 * Archivo: ServiceAnalyticsInsightPanel.tsx
 * Responsabilidad: Renderizar el panel lateral de insights del servicio:
 *   plato estrella, hora pico y heatmap de ventas por hora.
 * Tipo: UI
 */

import { T } from "@/components/T";
import type {
  MenuItemSalesStat,
  HourlySalesStat,
} from "@/modules/service/domain/types/service.types";

interface ServiceAnalyticsInsightPanelProps {
  topMenuItems: MenuItemSalesStat[];
  hourlyStats: HourlySalesStat[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

//-aqui empieza funcion getPeakHour y es para determinar la hora con más revenue-//
/** @pure */
function getPeakHour(stats: HourlySalesStat[]): HourlySalesStat | null {
  if (stats.length === 0) return null;
  return stats.reduce((best, current) =>
    current.revenue > best.revenue ? current : best
  );
}
//-aqui termina funcion getPeakHour-//

//-aqui empieza funcion getStarItem y es para obtener el plato con mayor margen-//
/** @pure */
function getStarItem(items: MenuItemSalesStat[]): MenuItemSalesStat | null {
  if (items.length === 0) return null;
  return items.reduce((best, current) =>
    current.margin > best.margin ? current : best
  );
}
//-aqui termina funcion getStarItem-//

//-aqui empieza funcion getHeatmapIntensity y es para calcular la opacidad de cada celda del heatmap-//
/**
 * Devuelve una clase Tailwind de opacidad según la intensidad relativa del revenue.
 * @pure
 */
function getHeatmapIntensity(revenue: number, maxRevenue: number): string {
  if (maxRevenue === 0) return "bg-surface-container";
  const ratio = revenue / maxRevenue;
  if (ratio >= 0.85) return "bg-secondary text-on-primary font-bold shadow-sm";
  if (ratio >= 0.65) return "bg-secondary/80 text-on-primary";
  if (ratio >= 0.45) return "bg-secondary/60 text-on-surface";
  if (ratio >= 0.25) return "bg-secondary/35 text-on-surface";
  if (ratio >= 0.05) return "bg-secondary/15 text-on-surface";
  return "bg-surface-container text-outline";
}
//-aqui termina funcion getHeatmapIntensity-//

// ---------------------------------------------------------------------------
// Sub-componentes
// ---------------------------------------------------------------------------

//-aqui empieza componente StarItemInsight y es para mostrar el plato más rentable del período-//
/** @pure */
function StarItemInsight({ item }: { item: MenuItemSalesStat | null }) {
  if (!item) {
    return (
      <div>
        <span className="text-xs font-semibold text-on-surface-variant block mb-1 uppercase tracking-wider">
          <T>Plato Estrella</T>
        </span>
        <p className="text-sm text-on-surface-variant italic">
          <T>Sin datos</T>
        </p>
      </div>
    );
  }

  const marginPct = item.revenue > 0
    ? Math.round(((item.revenue - item.cost) / item.revenue) * 100)
    : 0;

  return (
    <div>
      <span className="text-xs font-semibold text-on-surface-variant block mb-1 uppercase tracking-wider">
        <T>Plato Estrella (Rentabilidad)</T>
      </span>
      <div className="flex justify-between items-end">
        <span className="text-sm font-medium text-primary">{item.menuItemName}</span>
        <span className="text-sm font-bold text-secondary">{marginPct}% <T>Margen</T></span>
      </div>
      <div className="w-full bg-surface-container h-1 mt-2 rounded-full overflow-hidden">
        <div
          className="bg-secondary h-full rounded-full transition-all"
          style={{ width: `${marginPct}%` }}
        />
      </div>
    </div>
  );
}
//-aqui termina componente StarItemInsight-//

//-aqui empieza componente PeakHourInsight y es para mostrar la hora de mayor actividad-//
/** @pure */
function PeakHourInsight({ stat }: { stat: HourlySalesStat | null }) {
  return (
    <div>
      <span className="text-xs font-semibold text-on-surface-variant block mb-1 uppercase tracking-wider">
        <T>Hora Pico</T>
      </span>
      {stat ? (
        <div className="flex justify-between items-center bg-surface-container p-3 rounded-lg mt-1">
          <span className="text-sm font-medium text-primary">
            {String(stat.hour).padStart(2, "0")}:00 – {String(stat.hour + 1).padStart(2, "0")}:00
          </span>
          <span className="text-xs text-on-surface-variant">{stat.orderCount} <T>órdenes</T></span>
        </div>
      ) : (
        <p className="text-sm text-on-surface-variant italic mt-1">
          <T>Sin datos</T>
        </p>
      )}
    </div>
  );
}
//-aqui termina componente PeakHourInsight-//

//-aqui empieza componente HourlySalesHeatmap y es para renderizar el heatmap de ventas por hora-//
/**
 * Muestra una cuadrícula de celdas coloreadas según la intensidad de ventas por hora.
 * @pure
 */
function HourlySalesHeatmap({ stats }: { stats: HourlySalesStat[] }) {
  // Construir mapa hora → revenue para acceso rápido
  const revenueByHour = new Map(stats.map((s) => [s.hour, s.revenue]));
  const maxRevenue = Math.max(...stats.map((s) => s.revenue), 1);

  // Mostrar horas operativas típicas: 12 a 23
  const hours = Array.from({ length: 12 }, (_, i) => i + 12);

  return (
    <div>
      <h3 className="font-black tracking-tight text-primary mb-4">
        <T>Ventas por Hora</T>
      </h3>
      <div className="grid grid-cols-6 gap-1">
        {hours.map((hour) => {
          const revenue = revenueByHour.get(hour) ?? 0;
          const intensityClass = getHeatmapIntensity(revenue, maxRevenue);
          return (
            <div
              key={hour}
              title={`${hour}:00`}
              className={`aspect-square rounded-sm flex items-center justify-center text-[8px] transition-all ${intensityClass}`}
            >
              {hour}
            </div>
          );
        })}
      </div>
      <div className="flex justify-between items-center mt-3">
        <span className="text-[10px] text-on-surface-variant">
          <T>Baja</T>
        </span>
        <div className="flex-1 mx-2 h-1 bg-gradient-to-r from-surface-container via-secondary/50 to-secondary rounded-full" />
        <span className="text-[10px] text-on-surface-variant">
          <T>Alta</T>
        </span>
      </div>
    </div>
  );
}
//-aqui termina componente HourlySalesHeatmap-//

// ---------------------------------------------------------------------------
// Panel principal
// ---------------------------------------------------------------------------

//-aqui empieza componente ServiceAnalyticsInsightPanel y es para mostrar la columna derecha de insights-//
/**
 * Renderiza la columna derecha: plato estrella, hora pico y heatmap.
 * @pure
 */
export function ServiceAnalyticsInsightPanel({
  topMenuItems,
  hourlyStats,
}: ServiceAnalyticsInsightPanelProps) {
  const starItem = getStarItem(topMenuItems);
  const peakHour = getPeakHour(hourlyStats);

  return (
    <div className="flex flex-col gap-8">
      {/* Insights */}
      <div className="bg-surface-container-lowest rounded-xl p-6 border border-surface-container-high/50">
        <div className="flex items-center gap-2 mb-6">
          <svg className="h-5 w-5 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2a7 7 0 0 1 7 7c0 3.5-2.5 6.5-6 7.4V18h-2v-1.6C7.5 15.5 5 12.5 5 9a7 7 0 0 1 7-7z" />
            <path d="M9 21h6" />
            <path d="M10 21v1h4v-1" />
          </svg>
          <h3 className="font-black tracking-tight text-primary">
            <T>Insights del Servicio</T>
          </h3>
        </div>
        <div className="space-y-6">
          <StarItemInsight item={starItem} />
          <PeakHourInsight stat={peakHour} />
        </div>
      </div>

      {/* Heatmap */}
      <div className="bg-surface-container-lowest rounded-xl p-6">
        <HourlySalesHeatmap stats={hourlyStats} />
      </div>
    </div>
  );
}
//-aqui termina componente ServiceAnalyticsInsightPanel-//
