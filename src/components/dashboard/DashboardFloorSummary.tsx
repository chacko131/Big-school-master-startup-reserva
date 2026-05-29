/**
 * Archivo: DashboardFloorSummary.tsx
 * Responsabilidad: Mostrar el porcentaje de ocupación global y el desglose de mesas ocupadas por zonas.
 * Tipo: UI
 */

import { T } from "@/components/T";

export interface DashboardFloorZoneDefinition {
  label: string;
  occupancy: string;
}

export interface DashboardFloorSummaryProps {
  occupancyPercent: number;
  floorZones: ReadonlyArray<DashboardFloorZoneDefinition>;
}

//-aqui empieza componente DashboardFloorSummary y es para mostrar el estado de la sala-//
/**
 * Renderiza el resumen operativo de la sala y desglose de zonas.
 *
 * @pure
 */
export function DashboardFloorSummary({
  occupancyPercent,
  floorZones,
}: DashboardFloorSummaryProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-primary p-8 text-on-primary shadow-sm">
      <div className="relative z-10">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/60">
          <T>Sala activa</T>
        </p>
        <div className="mt-8 flex items-baseline">
          <span className="text-6xl font-black tracking-tight">{occupancyPercent}%</span>
          <span className="ml-3 text-sm font-bold uppercase tracking-[0.2em] text-white/60">
            <T>Capacidad</T>
          </span>
        </div>

        <div className="mt-8 space-y-4">
          {floorZones.length === 0 ? (
            <p className="text-sm text-white/70">
              <T>No hay zonas configuradas</T>
            </p>
          ) : (
            floorZones.map((zoneDefinition) => (
              <div
                className="flex items-center justify-between gap-4 border-b border-white/10 pb-3 last:border-b-0 last:pb-0"
                key={zoneDefinition.label}
              >
                <span className="text-sm text-white/85">
                  <T>{zoneDefinition.label}</T>
                </span>
                <span className="text-sm font-bold text-white">
                  <T>{zoneDefinition.occupancy}</T>
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white/5 blur-3xl" />
    </section>
  );
}
//-aqui termina componente DashboardFloorSummary-//
