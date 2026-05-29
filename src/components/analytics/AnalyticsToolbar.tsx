/**
 * Archivo: AnalyticsToolbar.tsx
 * Responsabilidad: Renderizar la cabecera del panel de analítica con accesos rápidos.
 * Tipo: UI
 */

import Link from "next/link";
import { T } from "@/components/T";
import { OnboardingIcon } from "@/components/onboarding/OnboardingIcon";

//-aqui empieza componente AnalyticsToolbar y es para resumir la vista de analitica-//
/**
 * Renderiza la cabecera operativa del panel de analíticas con botones de navegación.
 *
 * @pure
 */
export function AnalyticsToolbar() {
  return (
    <section className="flex flex-col gap-6 rounded-[28px] bg-surface-container-lowest p-8 shadow-sm md:flex-row md:items-end md:justify-between md:p-10">
      <div className="max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
          <T>Analítica operativa</T>
        </p>
        <h2 className="mt-4 text-5xl font-black tracking-tighter text-primary md:text-6xl">
          <T>Observa qué impulsa las reservas.</T>
        </h2>
        <p className="mt-4 max-w-xl text-on-surface-variant md:text-lg md:leading-8">
          <T>
            Analiza el comportamiento histórico, la afluencia en las zonas del salón, las ausencias y la tasa de recurrencia de tus clientes en tiempo real.
          </T>
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-surface-container-highest px-6 py-2.5 text-sm font-bold text-on-surface transition-colors hover:bg-surface-container-high"
          href="/dashboard/reservations"
        >
          <OnboardingIcon name="schedule" className="h-4 w-4" />
          <T>Ver reservas</T>
        </Link>
        <Link
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-on-primary transition-colors hover:opacity-90"
          href="/dashboard/tables"
        >
          <OnboardingIcon name="restaurant" className="h-4 w-4" />
          <T>Vista de sala</T>
        </Link>
      </div>
    </section>
  );
}
//-aqui termina componente AnalyticsToolbar-//
