"use client";

/**
 * Archivo: FloorPlanHero.tsx
 * Responsabilidad: Encabezado principal del editor de mesas con CTA y copy.
 * Tipo: UI
 */

import Link from "next/link";
import { T } from "@/components/T";
import { OnboardingIcon } from "@/components/onboarding/OnboardingIcon";

interface FloorPlanHeroProps {
  onSave: () => void;
  isSaving: boolean;
}

//-aqui empieza componente FloorPlanHero y es para mostrar el hero del editor de mesas-//
/**
 * Renderiza el hero con título, descripción y acciones principales.
 * Recibe el handler de guardado desde el editor padre.
 *
 * @sideEffect
 */
export function FloorPlanHero({ onSave, isSaving }: FloorPlanHeroProps) {
  return (
    <section className="flex flex-col gap-6 rounded-[28px] bg-surface-container-lowest p-8 shadow-sm md:flex-row md:items-end md:justify-between md:p-10">
      <div className="max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
          <T>Editor de mesas</T>
        </p>
        <h2 className="mt-4 text-5xl font-black tracking-tighter text-primary md:text-6xl">
          <T>Organiza la sala y ajusta cada mesa.</T>
        </h2>
        <p className="mt-4 max-w-xl text-on-surface-variant md:text-lg md:leading-8">
          <T>Reordena el plano, define la capacidad y controla qué mesas están activas para la operación de hoy.</T>
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
        <button
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-on-primary transition-colors hover:opacity-90 disabled:opacity-60"
          type="button"
          disabled={isSaving}
          onClick={onSave}
        >
          <OnboardingIcon name="save" className="h-4 w-4" />
          <T>{isSaving ? "Guardando..." : "Guardar cambios"}</T>
        </button>
      </div>
    </section>
  );
}
//-aqui termina componente FloorPlanHero-//
