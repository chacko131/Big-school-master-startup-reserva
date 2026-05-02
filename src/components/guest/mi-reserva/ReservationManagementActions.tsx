/**
 * Archivo: ReservationManagementActions.tsx
 * Responsabilidad: Mostrar los botones de acción para gestionar la reserva.
 * Tipo: UI
 */

import { T } from "@/components/T";
import { PublicIcon } from "@/components/public/PublicIcon";

interface Action {
  title: string;
  description: string;
  icon: "map" | "chatBubble" | "cancel";
  tone: "primary" | "secondary" | "surface";
}

interface ReservationManagementActionsProps {
  actions: ReadonlyArray<Action>;
}

//-aqui empieza funcion ReservationManagementActions y es para mostrar acciones de gestión-//
/**
 * @pure
 */
export function ReservationManagementActions({ actions }: ReservationManagementActionsProps) {
  return (
    <section className="mb-16 mt-16">
      <h3 className="mb-6 text-center text-sm font-bold uppercase tracking-[0.22em] text-on-surface-variant">
        <T>Gestión de Reserva</T>
      </h3>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {actions.map((action) => (
          <button
            className={`group flex items-center justify-between rounded-[20px] border border-transparent p-5 text-left shadow-sm transition-all duration-300 ${
              action.tone === "primary"
                ? "bg-surface-container-lowest hover:border-primary hover:bg-primary hover:text-on-primary"
                : action.tone === "secondary"
                  ? "bg-surface-container-lowest hover:border-primary hover:bg-primary hover:text-on-primary"
                  : "bg-surface-container-lowest hover:border-tertiary-container hover:bg-tertiary-container hover:text-on-tertiary"
            }`}
            type="button"
            key={action.title}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container group-hover:bg-white/20">
                <PublicIcon name={action.icon} className="h-5 w-5" />
              </div>
              <span className="font-semibold leading-5">
                <T>{action.title}</T>
              </span>
            </div>
            <PublicIcon name="chevronRight" className="h-5 w-5 opacity-0 transition-opacity group-hover:opacity-100" />
          </button>
        ))}
      </div>
    </section>
  );
}
//-aqui termina funcion ReservationManagementActions-//
