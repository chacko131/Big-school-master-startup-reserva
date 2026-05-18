/**
 * Archivo: TeamActivityRail.tsx
 * Responsabilidad: Mostrar el registro de actividad reciente relacionada con el equipo.
 * Tipo: UI
 */

import { T } from "@/components/T";

export interface TeamActivity {
  id: string;
  time: string;
  title: string;
  description: string;
}

interface TeamActivityRailProps {
  activities: ReadonlyArray<TeamActivity>;
}

//-aqui empieza componente TeamActivityRail y es para mostrar cambios recientes del equipo-//
/**
 * Renderiza el registro de actividad reciente del equipo.
 *
 * @pure
 */
export function TeamActivityRail({ activities }: TeamActivityRailProps) {
  return (
    <section className="rounded-[28px] bg-primary p-8 text-on-primary shadow-sm">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/60">
          <T>Actividad</T>
        </p>
        <h3 className="mt-3 text-3xl font-black tracking-tight">
          <T>Cambios recientes</T>
        </h3>
        <p className="mt-3 text-sm leading-7 text-white/75">
          <T>El MVP deja trazabilidad básica para validar quién puede tocar cada área del producto.</T>
        </p>
      </div>

      <div className="mt-6 space-y-4 rounded-[24px] bg-white/10 p-5 backdrop-blur-sm">
        {activities.map((activity) => (
          <div className="flex gap-4" key={activity.id}>
            <div className="w-16 shrink-0 rounded-full bg-white/10 px-3 py-2 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
              {activity.time}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-white">
                <T>{activity.title}</T>
              </p>
              <p className="mt-1 text-sm leading-6 text-white/70">
                <T>{activity.description}</T>
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
//-aqui termina componente TeamActivityRail-//
