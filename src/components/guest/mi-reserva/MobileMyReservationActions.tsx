/**
 * Archivo: MobileMyReservationActions.tsx
 * Responsabilidad: Mostrar acciones flotantes para móviles en la página de gestión de reserva.
 * Tipo: UI
 */

import { T } from "@/components/T";
import { PublicIcon } from "@/components/public/PublicIcon";

//-aqui empieza funcion MobileMyReservationActions y es para acciones móviles-//
/**
 * @pure
 */
export function MobileMyReservationActions() {
  return (
    <div className="fixed bottom-6 left-6 right-6 z-50 md:hidden">
      <div className="flex items-center rounded-full border border-outline-variant/20 bg-white/70 p-2 shadow-2xl backdrop-blur-xl">
        <button className="flex-1 rounded-full bg-primary py-3 text-sm font-bold tracking-wide text-on-primary" type="button">
          <T>Modificar Reserva</T>
        </button>
        <button className="px-4 py-3 text-primary" type="button">
          <PublicIcon name="share" className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
//-aqui termina funcion MobileMyReservationActions-//
