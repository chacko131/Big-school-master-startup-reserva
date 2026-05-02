/**
 * Archivo: QuickReservationCard.tsx
 * Responsabilidad: Mostrar un formulario rápido de reserva en el lateral del perfil.
 * Tipo: UI
 */

import { T } from "@/components/T";
import { PublicIcon } from "@/components/public/PublicIcon";

//-aqui empieza funcion QuickReservationCard y es para el formulario rápido de reserva-//
/**
 * @pure
 */
export function QuickReservationCard() {
  return (
    <div className="rounded-3xl border border-outline-variant/10 bg-white p-6 shadow-[0px_20px_40px_rgba(26,28,28,0.06)] sm:p-8">
      <h3 className="mb-6 text-2xl font-bold">
        <T>Reservar Mesa</T>
      </h3>
      <form className="space-y-6">
        <div className="space-y-2">
          <label className="ml-1 text-sm font-semibold tracking-wide">
            <T>Fecha</T>
          </label>
          <div className="relative">
            <input 
              className="w-full rounded-xl border-none bg-surface-container-low px-5 py-4 outline-none transition-all focus:ring-2 focus:ring-primary" 
              placeholder="Selecciona una fecha" 
              type="text" 
            />
            <PublicIcon name="calendarMonth" className="absolute right-4 top-4 h-5 w-5 text-zinc-400" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="ml-1 text-sm font-semibold tracking-wide">
              <T>Invitados</T>
            </label>
            <div className="relative">
              <select className="w-full appearance-none rounded-xl border-none bg-surface-container-low px-5 py-4 outline-none transition-all focus:ring-2 focus:ring-primary">
                <option>2 Personas</option>
                <option>3 Personas</option>
                <option>4 Personas</option>
                <option>6+ Personas</option>
              </select>
              <PublicIcon name="expandMore" className="pointer-events-none absolute right-4 top-4 h-5 w-5 text-zinc-400" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="ml-1 text-sm font-semibold tracking-wide">
              <T>Hora</T>
            </label>
            <div className="relative">
              <select className="w-full appearance-none rounded-xl border-none bg-surface-container-low px-5 py-4 outline-none transition-all focus:ring-2 focus:ring-primary">
                <option>19:00</option>
                <option>19:30</option>
                <option>20:00</option>
                <option>21:00</option>
              </select>
              <PublicIcon name="schedule" className="pointer-events-none absolute right-4 top-4 h-5 w-5 text-zinc-400" />
            </div>
          </div>
        </div>

        <button 
          className="w-full rounded-2xl bg-primary py-5 text-lg font-bold text-on-primary shadow-lg shadow-black/10 transition-all hover:opacity-90 active:scale-[0.98]" 
          type="submit"
        >
          <T>Confirmar Reserva</T>
        </button>

        <p className="px-4 text-center text-xs text-on-surface-variant/70">
          <T>Al reservar, aceptas nuestras políticas de cancelación y términos de servicio.</T>
        </p>
      </form>
    </div>
  );
}
//-aqui termina funcion QuickReservationCard-//
