/**
 * Archivo: MobileReservationButton.tsx
 * Responsabilidad: Mostrar un botón flotante de reserva para dispositivos móviles.
 * Tipo: UI
 */

import { T } from "@/components/T";
import { PublicIcon } from "@/components/public/PublicIcon";

//-aqui empieza funcion MobileReservationButton y es para el botón flotante de móvil-//
/**
 * @pure
 */
export function MobileReservationButton() {
  return (
    <div className="fixed bottom-6 left-4 right-4 z-60 md:hidden sm:left-6 sm:right-6">
      <button 
        className="glass-nav flex w-full items-center justify-center gap-3 rounded-full border border-white/20 bg-white/70 py-4 text-lg font-bold text-primary shadow-2xl" 
        type="button"
      >
        <PublicIcon name="restaurant" className="h-5 w-5" />
        <T>Reservar Mesa</T>
      </button>
    </div>
  );
}
//-aqui termina funcion MobileReservationButton-//
