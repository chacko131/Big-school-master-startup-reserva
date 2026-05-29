/**
 * Archivo: DashboardSuccessBanner.tsx
 * Responsabilidad: Confirmar visualmente la aceptación exitosa de una invitación de equipo.
 * Tipo: UI
 */

import Link from "next/link";
import { T } from "@/components/T";

//-aqui empieza componente DashboardSuccessBanner y es para confirmar acciones exitosas-//
/**
 * Muestra un aviso de éxito cuando una invitación acaba de aceptarse.
 *
 * @pure
 */
export function DashboardSuccessBanner() {
  return (
    <section className="rounded-[28px] border border-secondary-container bg-secondary-container px-6 py-5 text-on-secondary-container shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-on-secondary-container/70">
            <T>Acceso activado</T>
          </p>
          <h3 className="mt-2 text-lg font-black tracking-tight">
            <T>La invitación se aceptó correctamente.</T>
          </h3>
          <p className="mt-1 text-sm leading-6 text-on-secondary-container/80">
            <T>Ya formas parte del equipo y puedes seguir trabajando desde el dashboard.</T>
          </p>
        </div>
        <Link
          className="inline-flex items-center justify-center rounded-lg bg-on-secondary-container px-5 py-2.5 text-sm font-bold text-secondary-container transition-colors hover:opacity-90"
          href="/dashboard/team"
        >
          <T>Ir al equipo</T>
        </Link>
      </div>
    </section>
  );
}
//-aqui termina componente DashboardSuccessBanner-//
