"use client";

/**
 * Archivo: ReservationSummary.tsx
 * Responsabilidad: Mostrar el resumen de la selección de reserva en la barra lateral.
 * Tipo: UI
 */

import { T } from "@/components/T";
import { PublicIcon } from "@/components/public/PublicIcon";

interface ReservationSummaryProps {
  restaurantName: string;
}

//-aqui empieza funcion getSummaryItemClassName y es para estructurar la tarjeta resumen lateral-//
/**
 * @pure
 */
function getSummaryItemClassName(): string {
  return "flex items-start gap-4";
}
//-aqui termina funcion getSummaryItemClassName-//

//-aqui empieza funcion ReservationSummary y es para mostrar la barra lateral de resumen-//
/**
 * @pure
 */
export function ReservationSummary({ restaurantName }: ReservationSummaryProps) {
  const reservationCardImageUrl =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuD2B4aW7oKiJk6gyllIR0OxTEpzcnEFt39_FZy85ulg2cbUA3cKUfu1dQj0tZzEeAArJ5OJVakO-nKezlhbqMsY5VcLNLuBsA9yu2tTZ01FY6GI9NUwcr5yuA0Ivo_tBlps_Q-9HQx_P9ADfSax9MLSOzeZOXfSCKr9E451Dfd8Y0Rcw1JqjoUCLPW9UnmeIo9yHOW0pBSXOAeaC5Ilhu7SEK0ti6HYI3N0oJsmpRmUTQGsPwtAsmmOC7nJxqJogKe14GkFcxZr0xs";

  return (
    <aside className="sticky top-24 space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-white p-8 shadow-sm border border-slate-100">
        <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-tertiary-container/5 blur-3xl" />
        <h3 className="mb-6 font-headline text-2xl font-bold">
          <T>Tu Mesa</T>
        </h3>
        <div className="space-y-6">
          <div className={getSummaryItemClassName()}>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface-container">
              <PublicIcon name="restaurant" className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-tighter text-on-surface/60">
                <T>Lugar</T>
              </p>
              <p className="font-headline text-lg font-extrabold">{restaurantName}</p>
              <p className="text-sm text-on-surface/60">Av. de los Próceres 124, CDMX</p>
            </div>
          </div>
          <div className={getSummaryItemClassName()}>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface-container">
              <PublicIcon name="calendarMonth" className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-tighter text-on-surface/60">
                <T>Día y Hora</T>
              </p>
              <p className="font-headline text-lg font-extrabold">Miércoles, 9 de Oct</p>
              <p className="text-sm font-bold text-on-tertiary-container">19:30 h</p>
            </div>
          </div>
          <div className={getSummaryItemClassName()}>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface-container">
              <PublicIcon name="group" className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-tighter text-on-surface/60">
                <T>Invitados</T>
              </p>
              <p className="font-headline text-lg font-extrabold">2 personas</p>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-zinc-100 pt-8">
          <img
            alt="minimal monochromatic map of Mexico City downtown showing major streets and restaurant location point"
            className="h-32 w-full rounded-2xl object-cover grayscale contrast-125 brightness-90"
            src={reservationCardImageUrl}
          />
        </div>
      </div>

      <div className="flex items-center gap-4 rounded-3xl border border-secondary-container bg-secondary-container/30 p-6">
        <PublicIcon name="checkCircle" className="text-secondary h-8 w-8" />
        <div>
          <p className="text-sm font-bold text-on-secondary-container">
            <T>Reserva Segura</T>
          </p>
          <p className="text-xs leading-relaxed text-on-secondary-container/80">
            <T>Tu mesa está garantizada al instante sin cargos de gestión.</T>
          </p>
        </div>
      </div>
    </aside>
  );
}
//-aqui termina funcion ReservationSummary-//
