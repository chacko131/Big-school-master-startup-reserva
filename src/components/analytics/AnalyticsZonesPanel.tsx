/**
 * Archivo: AnalyticsZonesPanel.tsx
 * Responsabilidad: Visualizar la afluencia de reservas y comensales por zona real del salón utilizando barras de progreso.
 * Tipo: UI
 */

import { T } from "@/components/T";
import { OnboardingIcon } from "@/components/onboarding/OnboardingIcon";
import { type ZoneUsageMetric } from "@/modules/reservations/application/dtos/get-restaurant-analytics.dto";

export interface AnalyticsZonesPanelProps {
  byZone: ZoneUsageMetric[];
}

//-aqui empieza funcion getAnalyticsPanelBarWidth y es para representar el nivel de uso de la zona-//
/**
 * Devuelve el porcentaje de ancho para la barra de progreso.
 *
 * @pure
 */
function getAnalyticsPanelBarWidth(count: number, total: number): string {
  if (total === 0) return "0%";
  const percent = Math.min(100, Math.max(0, Math.round((count / total) * 100)));
  return `${percent}%`;
}
//-aqui termina funcion getAnalyticsPanelBarWidth-//

//-aqui empieza componente AnalyticsZonesPanel y es para visualizar el flujo por zona-//
/**
 * Renderiza el panel de flujos de reservas y comensales por zonas operativas.
 *
 * @pure
 */
export function AnalyticsZonesPanel({ byZone }: AnalyticsZonesPanelProps) {
  const totalReservations = byZone.reduce((acc, z) => acc + z.reservationsCount, 0);

  // Determinar la zona más popular de forma dinámica para la lectura rápida
  const sortedZones = [...byZone].sort((a, b) => b.reservationsCount - a.reservationsCount);
  const mostPopularZone = sortedZones[0];

  const quickReadText = mostPopularZone && mostPopularZone.reservationsCount > 0
    ? `La zona "${mostPopularZone.zoneName}" concentra la mayor afluencia con un total de ${mostPopularZone.reservationsCount} reservas y ${mostPopularZone.coversCount} comensales. Considera optimizar el personal en esta sección.`
    : "Registra más reservas en tus zonas para obtener análisis de distribución de sala.";

  if (byZone.length === 0) {
    return (
      <section className="rounded-[28px] bg-surface-container-lowest p-8 shadow-sm">
        <div className="flex items-center gap-2">
          <OnboardingIcon name="gridView" className="h-5 w-5 text-secondary" />
          <h3 className="text-lg font-bold text-on-surface">
            <T>Zonas de salón</T>
          </h3>
        </div>
        <div className="mt-8 flex flex-col items-center justify-center py-8 text-center">
          <p className="text-sm font-semibold text-on-surface">
            <T>No hay información de zonas disponible</T>
          </p>
          <p className="mt-1 text-xs text-on-surface-variant">
            <T>Configura zonas y asigna mesas para ver el desglose operativo.</T>
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-[28px] bg-surface-container-lowest p-8 shadow-sm">
      <div className="flex items-center gap-2">
        <OnboardingIcon name="gridView" className="h-5 w-5 text-secondary" />
        <h3 className="text-lg font-bold text-on-surface">
          <T>Afluencia por zonas</T>
        </h3>
      </div>

      <div className="mt-6 space-y-4">
        {byZone.map((zone) => {
          const sharePercent = totalReservations > 0 
            ? Math.round((zone.reservationsCount / totalReservations) * 100) 
            : 0;

          return (
            <div key={zone.zoneId}>
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-semibold text-on-surface">
                  <T>{zone.zoneName}</T>
                </span>
                <span className="text-sm font-bold text-primary">
                  <T>{`${zone.reservationsCount} res (${sharePercent}%) · ${zone.coversCount} comensales`}</T>
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-container-high">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: getAnalyticsPanelBarWidth(zone.reservationsCount, totalReservations) }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-2xl bg-surface-container-low p-5">
        <h4 className="text-sm font-bold text-on-surface">
          <T>Lectura rápida</T>
        </h4>
        <p className="mt-2 text-sm leading-6 text-on-surface-variant">
          <T>{quickReadText}</T>
        </p>
      </div>
    </section>
  );
}
//-aqui termina componente AnalyticsZonesPanel-//
