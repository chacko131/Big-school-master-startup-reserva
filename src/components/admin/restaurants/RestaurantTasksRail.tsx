/**
 * Archivo: RestaurantTasksRail.tsx
 * Responsabilidad: Mostrar un panel de recordatorio (TODO) para futuras implementaciones de métricas accionables.
 * Tipo: UI
 */
import { T } from "@/components/T";
import { OnboardingIcon } from "@/components/onboarding/OnboardingIcon";

export interface RestaurantTaskDefinition {
  title: string;
  description: string;
}

// TODO: Fase 4 - Reemplazar estos mocks con consultas reales a BD cuando se implementen las métricas de negocio.
export const restaurantTaskDefinitions: ReadonlyArray<RestaurantTaskDefinition> = [
  {
    title: "Fricción de Onboarding",
    description: "Mostrar tenants que crearon el slug pero llevan >24h sin configurar mesas. (Requiere JOIN con DiningTable).",
  },
  {
    title: "Alerta de Riesgo (Churn)",
    description: "Detectar restaurantes que solían tener reservas diarias y llevan 2+ días a cero. (Requiere consulta a Reservations).",
  },
  {
    title: "Solicitudes Pendientes",
    description: "Centralizar tickets de soporte o peticiones de cambio de plan cuando se implemente el módulo de Billing.",
  },
] as const;

/**
 * Renderiza la lista de tareas futuras (TODO) del panel.
 *
 * @pure
 */
export function RestaurantTasksRail() {
  return (
    <section className="rounded-[28px] border-2 border-dashed border-outline-variant/50 bg-surface-container-lowest/50 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
          <T>Roadmap / To-Do</T>
        </p>
        <span className="inline-flex items-center gap-1 rounded-full bg-warning/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-warning">
          <OnboardingIcon name="schedule" className="h-3 w-3" />
          <T>Próximamente</T>
        </span>
      </div>
      
      <h2 className="mt-2 text-2xl font-black tracking-tight text-primary/60">
        <T>Alertas Inteligentes</T>
      </h2>
      <p className="mt-2 text-sm text-on-surface-variant/80">
        <T>Este panel se conectará al backend en la Fase 4 para mostrar datos accionables automáticamente.</T>
      </p>

      <div className="mt-6 space-y-4 opacity-80 mix-blend-luminosity grayscale transition-all hover:grayscale-0">
        {restaurantTaskDefinitions.map((taskDefinition) => (
          <article className="rounded-2xl border border-outline-variant/30 bg-surface-container-low p-4" key={taskDefinition.title}>
            <div className="flex items-start gap-3">
              <div className="mt-0.5 text-outline">
                <OnboardingIcon name="help" className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-on-surface">
                  <T>{taskDefinition.title}</T>
                </h3>
                <p className="mt-1 text-xs leading-5 text-on-surface-variant">
                  <T>{taskDefinition.description}</T>
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
