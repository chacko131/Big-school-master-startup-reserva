/**
 * Archivo: RestaurantActivityRail.tsx
 * Responsabilidad: Mostrar la actividad reciente del tenant.
 * Tipo: UI
 */
import { T } from "@/components/T";

export interface RestaurantActivityDefinition {
  time: string;
  title: string;
  description: string;
}

export const restaurantActivityDefinitions: ReadonlyArray<RestaurantActivityDefinition> = [
  {
    time: "08:40",
    title: "Plan confirmado",
    description: "Se aplicó Growth y se validó la configuración principal.",
  },
  {
    time: "09:10",
    title: "Reservas sincronizadas",
    description: "Llegó la última tanda de reservas desde la operación diaria.",
  },
  {
    time: "10:02",
    title: "Checklist completado",
    description: "Se revisaron permisos, mesas y reglas base del tenant.",
  },
] as const;

/**
 * Renderiza la actividad reciente del tenant.
 *
 * @pure
 */
export function RestaurantActivityRail() {
  return (
    <section className="rounded-[28px] border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-sm">
      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
        <T>Actividad reciente</T>
      </p>
      <h2 className="mt-2 text-2xl font-black tracking-tight text-primary">
        <T>Movimientos del tenant</T>
      </h2>

      <div className="mt-6 space-y-4">
        {restaurantActivityDefinitions.map((activityDefinition) => (
          <article className="rounded-2xl bg-surface-container-low p-4" key={activityDefinition.title}>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              {activityDefinition.time}
            </p>
            <h3 className="mt-2 text-sm font-bold text-on-surface">
              <T>{activityDefinition.title}</T>
            </h3>
            <p className="mt-1 text-sm leading-6 text-on-surface-variant">
              <T>{activityDefinition.description}</T>
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
