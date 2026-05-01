/**
 * Archivo: RestaurantActivityRail.tsx
 * Responsabilidad: Mostrar el equipo (usuarios) del tenant (TODO).
 * Tipo: UI
 */
import { T } from "@/components/T";
import { OnboardingIcon } from "@/components/onboarding/OnboardingIcon";

/**
 * Renderiza el panel de equipo del tenant.
 * Actualmente es un TODO hasta que se implemente Auth y roles.
 *
 * @pure
 */
export function RestaurantActivityRail() {
  return (
    <section className="flex flex-col justify-center items-center rounded-[28px] border border-dashed border-outline-variant/40 bg-surface-container-lowest p-8 text-center shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10">
        <OnboardingIcon name="arrowForward" className="h-6 w-6 text-secondary" />
      </div>
      <h2 className="mt-4 text-xl font-black tracking-tight text-primary">
        <T>Equipo del Restaurante</T>
      </h2>
      <p className="mt-2 text-sm leading-6 text-on-surface-variant">
        <T>TODO: Aquí listaremos las personas con acceso a este restaurante y sus permisos. Pendiente de integración con lógica de Auth y Roles.</T>
      </p>
    </section>
  );
}
