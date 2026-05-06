/**
 * Archivo: ReservationsToolbar.tsx
 * Responsabilidad: Renderizar la barra de filtros y acciones rápidas para la vista de reservas.
 * Tipo: UI
 */

import { T } from "@/components/T";
import { OnboardingIcon } from "@/components/onboarding/OnboardingIcon";

//-aqui empieza componente ReservationsToolbar y es para ofrecer filtros rapidos de agenda-//
/**
 * Renderiza la barra de acciones y filtros del listado.
 *
 * @pure
 */
export function ReservationsToolbar() {
  return (
    <section className="flex flex-wrap items-center gap-4 rounded-2xl bg-surface-container-low p-4 shadow-sm">
      <div className="flex min-w-[240px] flex-1 items-center gap-3 rounded-lg bg-surface-container-lowest px-4 py-2.5">
        <OnboardingIcon name="schedule" className="h-5 w-5 text-on-surface-variant" />
        <span className="text-sm font-semibold text-on-surface">
          <T>Hoy, 24 oct</T>
        </span>
        <OnboardingIcon name="expandMore" className="ml-auto h-4 w-4 text-on-surface-variant" />
      </div>

      <div className="flex min-w-[160px] items-center gap-3 rounded-lg bg-surface-container-lowest px-4 py-2.5">
        <span className="text-sm font-medium text-on-surface-variant">
          <T>Estado:</T>
        </span>
        <span className="text-sm font-semibold text-on-surface">
          <T>Todos</T>
        </span>
        <OnboardingIcon name="expandMore" className="ml-auto h-4 w-4 text-on-surface-variant" />
      </div>

      <div className="flex min-w-[140px] items-center gap-3 rounded-lg bg-surface-container-lowest px-4 py-2.5">
        <span className="text-sm font-medium text-on-surface-variant">
          <T>Mesa:</T>
        </span>
        <span className="text-sm font-semibold text-on-surface">
          <T>Cualquiera</T>
        </span>
        <OnboardingIcon name="expandMore" className="ml-auto h-4 w-4 text-on-surface-variant" />
      </div>

      <div className="ml-auto flex gap-2">
        <button className="rounded-lg bg-surface-container-lowest p-2.5 transition-colors hover:bg-surface-container-high" type="button" aria-label="Filtrar">
          <OnboardingIcon name="settings" className="h-5 w-5 text-on-surface-variant" />
        </button>
        <button className="rounded-lg bg-surface-container-lowest p-2.5 transition-colors hover:bg-surface-container-high" type="button" aria-label="Exportar">
          <OnboardingIcon name="contentCopy" className="h-5 w-5 text-on-surface-variant" />
        </button>
      </div>
    </section>
  );
}
//-aqui termina componente ReservationsToolbar-//
