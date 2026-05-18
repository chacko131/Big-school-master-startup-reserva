/**
 * Archivo: TeamToolbar.tsx
 * Responsabilidad: Cabecera de la vista de equipo con título descriptivo y acción principal.
 * Tipo: UI
 */

import type { ReactNode } from "react";
import Link from "next/link";
import { T } from "@/components/T";
import { OnboardingIcon } from "@/components/onboarding/OnboardingIcon";

interface TeamToolbarProps {
  inviteModal?: ReactNode;
}

//-aqui empieza componente TeamToolbar y es para resumir la vista de equipo-//
/**
 * Renderiza la cabecera operativa del equipo.
 * Acepta inviteModal como slot para que solo el owner vea el botón real de invitación.
 *
 * @pure
 */
export function TeamToolbar({ inviteModal }: TeamToolbarProps) {
  return (
    <section className="flex flex-col gap-6 rounded-[28px] bg-surface-container-lowest p-8 shadow-sm md:flex-row md:items-end md:justify-between md:p-10">
      <div className="max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
          <T>Equipo</T>
        </p>
        <h2 className="mt-4 text-5xl font-black tracking-tighter text-primary md:text-6xl">
          <T>Gestiona accesos y responsabilidades.</T>
        </h2>
        <p className="mt-4 max-w-xl text-on-surface-variant md:text-lg md:leading-8">
          <T>
            Esta pantalla MVP centraliza miembros, invitaciones y niveles de permiso para validar el flujo administrativo.
          </T>
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-surface-container-highest px-6 py-2.5 text-sm font-bold text-on-surface transition-colors hover:bg-surface-container-high"
          href="/dashboard/settings"
        >
          <OnboardingIcon name="settings" className="h-4 w-4" />
          <T>Roles</T>
        </Link>
        {inviteModal}
      </div>
    </section>
  );
}
//-aqui termina componente TeamToolbar-//
