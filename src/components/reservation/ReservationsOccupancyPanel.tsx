/**
 * Archivo: ReservationsOccupancyPanel.tsx
 * Responsabilidad: Renderizar el resumen de ocupación activa por zonas del restaurante.
 * Tipo: UI
 */

import { T } from "@/components/T";

export interface OccupancyZoneDefinition {
  label: string;
  occupancy: string;
}

interface ReservationsOccupancyPanelProps {
  percentage: string;
  timeframe: string;
  zones: ReadonlyArray<OccupancyZoneDefinition>;
  alert: string;
}

//-aqui empieza componente ReservationsOccupancyPanel y es para resumir la capacidad de la sala-//
/**
 * Renderiza el resumen de ocupación del restaurante.
 *
 * @pure
 */
export function ReservationsOccupancyPanel({ percentage, timeframe, zones, alert }: ReservationsOccupancyPanelProps) {
  return (
    <section className="rounded-2xl bg-primary p-8 text-on-primary shadow-sm">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/60">
        <T>Ocupación activa</T>
      </p>
      <div className="mt-8 flex items-baseline">
        <span className="text-6xl font-black tracking-tight">{percentage}</span>
        <span className="ml-3 text-sm font-bold uppercase tracking-[0.2em] text-white/60">
          <T>{timeframe}</T>
        </span>
      </div>
      <div className="mt-8 space-y-4">
        {zones.map((zone) => (
          <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3 last:border-b-0 last:pb-0" key={zone.label}>
            <span className="text-sm text-white/85">
              <T>{zone.label}</T>
            </span>
            <span className="text-sm font-bold text-white">
              <T>{zone.occupancy}</T>
            </span>
          </div>
        ))}
      </div>
      <p className="mt-8 text-xs font-medium leading-relaxed text-white/70">
        <T>{alert}</T>
      </p>
    </section>
  );
}
//-aqui termina componente ReservationsOccupancyPanel-//
