/**
 * Archivo: page.tsx
 * Responsabilidad: Renderizar el flujo público de reserva para un restaurante concreto.
 * Tipo: UI
 */

import Link from "next/link";
import { T } from "@/components/T";
import { PublicIcon } from "@/components/public/PublicIcon";
import { getRestaurantProfile } from "@/lib/public/siteContent";

interface ReservationFlowPageProps {
  params: Promise<{
    restaurantSlug: string;
  }>;
}

type PartyOption = {
  label: string;
  selected?: boolean;
};

type CalendarDay = {
  label: string;
  muted?: boolean;
  selected?: boolean;
  hasDot?: boolean;
};

type TimeSlot = {
  label: string;
  selected?: boolean;
};

const PARTY_OPTIONS: PartyOption[] = [
  { label: "1" },
  { label: "2", selected: true },
  { label: "3" },
  { label: "4" },
  { label: "5" },
  { label: "6+" },
];

const CALENDAR_DAYS: CalendarDay[] = [
  { label: "29", muted: true },
  { label: "30", muted: true },
  { label: "1" },
  { label: "2" },
  { label: "3" },
  { label: "4" },
  { label: "5" },
  { label: "6" },
  { label: "7" },
  { label: "8" },
  { label: "9", selected: true },
  { label: "10" },
  { label: "11", hasDot: true },
  { label: "12" },
];

const LUNCH_TIME_SLOTS: TimeSlot[] = [
  { label: "13:00" },
  { label: "13:30" },
  { label: "14:00" },
  { label: "14:30" },
];

const DINNER_TIME_SLOTS: TimeSlot[] = [
  { label: "19:30", selected: true },
  { label: "20:00" },
  { label: "20:30" },
  { label: "21:00" },
  { label: "21:30" },
];

//-aqui empieza funcion getPartyOptionClassName y es para dibujar el estado visual de las opciones de personas-//
/**
 * @pure
 */
function getPartyOptionClassName(selected?: boolean): string {
  return selected
    ? "border-2 border-primary bg-white text-on-surface font-bold shadow-md"
    : "border border-transparent bg-white text-on-surface font-semibold shadow-sm hover:bg-surface-container-high";
}
//-aqui termina funcion getPartyOptionClassName-//

//-aqui empieza funcion getCalendarDayClassName y es para dibujar el estado visual de cada dia del calendario-//
/**
 * @pure
 */
function getCalendarDayClassName(day: CalendarDay): string {
  if (day.muted) {
    return "py-3 text-zinc-300";
  }

  if (day.selected) {
    return "py-3 rounded-lg bg-primary font-bold text-on-primary shadow-lg";
  }

  return "py-3 font-medium transition-colors hover:bg-surface-container rounded-lg cursor-pointer";
}
//-aqui termina funcion getCalendarDayClassName-//

//-aqui empieza funcion getTimeSlotClassName y es para dibujar el estado visual de cada hora disponible-//
/**
 * @pure
 */
function getTimeSlotClassName(selected?: boolean): string {
  return selected
    ? "rounded-xl bg-primary py-3 text-center font-bold text-on-primary shadow-lg"
    : "rounded-xl border border-transparent bg-white py-3 text-center font-medium transition-all hover:bg-surface-container-high";
}
//-aqui termina funcion getTimeSlotClassName-//

//-aqui empieza funcion getSummaryItemClassName y es para estructurar la tarjeta resumen lateral-//
/**
 * @pure
 */
function getSummaryItemClassName(): string {
  return "flex items-start gap-4";
}
//-aqui termina funcion getSummaryItemClassName-//

//-aqui empieza funcion ReservationFlowPage y es para renderizar el flujo publico de reserva-//
/**
 * Renderiza el flujo público de reserva siguiendo la referencia Stitch.
 * @pure
 */
export default async function ReservationFlowPage({ params }: ReservationFlowPageProps) {
  const { restaurantSlug } = await params;
  const restaurantProfile = getRestaurantProfile(restaurantSlug);
  const restaurantName = restaurantProfile.displayName;
  const reservationCardImageUrl =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuD2B4aW7oKiJk6gyllIR0OxTEpzcnEFt39_FZy85ulg2cbUA3cKUfu1dQj0tZzEeAArJ5OJVakO-nKezlhbqMsY5VcLNLuBsA9yu2tTZ01FY6GI9NUwcr5yuA0Ivo_tBlps_Q-9HQx_P9ADfSax9MLSOzeZOXfSCKr9E451Dfd8Y0Rcw1JqjoUCLPW9UnmeIo9yHOW0pBSXOAeaC5Ilhu7SEK0ti6HYI3N0oJsmpRmUTQGsPwtAsmmOC7nJxqJogKe14GkFcxZr0xs";

  return (
    <main className="bg-surface text-on-surface selection:bg-secondary-container">
      <header className="sticky top-0 z-50 w-full bg-white dark:bg-black">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8">
          <Link className="text-2xl font-bold tracking-tighter text-black dark:text-white font-headline" href={`/${restaurantSlug}`}>
            <T>Reserva Latina</T>
          </Link>
          <nav className="hidden items-center space-x-8 md:flex">
            <a className="text-zinc-500 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-white" href="#">
              <T>Platform</T>
            </a>
            <a className="text-zinc-500 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-white" href="#">
              <T>Pricing</T>
            </a>
            <a className="border-b-2 border-black pb-1 font-semibold text-black dark:border-white dark:text-white" href="#">
              <T>Restaurants</T>
            </a>
            <a className="text-zinc-500 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-white" href="#">
              <T>Login</T>
            </a>
          </nav>
          <Link className="rounded-lg bg-primary px-6 py-2.5 font-semibold text-on-primary transition-transform duration-150 hover:scale-95" href={`/${restaurantSlug}`}>
            <T>Get Started</T>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-20">
        <div className="flex flex-col gap-16 lg:flex-row">
          <div className="grow space-y-16 lg:max-w-2xl">
            <section>
              <h1 className="mb-4 font-headline text-5xl font-extrabold tracking-tight sm:text-6xl">{restaurantName}</h1>
              <p className="max-w-md text-lg leading-8 text-on-surface/70">
                <T>Reserve su mesa en el corazón de la tradición. Una experiencia gastronómica auténtica le espera.</T>
              </p>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-on-primary">1</span>
                <h2 className="font-headline text-2xl font-bold">
                  <T>¿Cuántas personas?</T>
                </h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {PARTY_OPTIONS.map((option) => (
                  <button
                    key={option.label}
                    className={`rounded-xl px-8 py-4 text-lg transition-all ${getPartyOptionClassName(option.selected)}`}
                    type="button"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-on-primary">2</span>
                <h2 className="font-headline text-2xl font-bold">
                  <T>Seleccione Fecha</T>
                </h2>
              </div>
              <div className="space-y-6 rounded-2xl bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between px-2">
                  <span className="font-headline text-lg font-bold">Octubre 2024</span>
                  <div className="flex gap-4">
                    <button className="rounded-full p-2 transition-colors hover:bg-surface-container" type="button">
                      <PublicIcon name="arrowBack" className="h-5 w-5" />
                    </button>
                    <button className="rounded-full p-2 transition-colors hover:bg-surface-container" type="button">
                      <PublicIcon name="arrowForward" className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="mb-4 grid grid-cols-7 text-center text-xs font-bold uppercase tracking-widest text-on-surface/60">
                  <div>Dom</div>
                  <div>Lun</div>
                  <div>Mar</div>
                  <div>Mié</div>
                  <div>Jue</div>
                  <div>Vie</div>
                  <div>Sáb</div>
                </div>
                <div className="grid grid-cols-7 gap-y-2 text-center">
                  {CALENDAR_DAYS.map((day) => (
                    <button key={day.label} className={getCalendarDayClassName(day)} type="button">
                      <span className={day.hasDot ? "relative inline-flex justify-center" : "relative inline-flex justify-center"}>
                        {day.label}
                        {day.hasDot ? <span className="absolute -bottom-1.5 h-1 w-1 rounded-full bg-secondary" /> : null}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-on-primary">3</span>
                <h2 className="font-headline text-2xl font-bold">
                  <T>Hora Disponible</T>
                </h2>
              </div>
              <div className="space-y-8">
                <div>
                  <span className="mb-4 block text-sm font-bold uppercase tracking-widest text-on-surface/60">
                    <T>Comida</T>
                  </span>
                  <div className="grid grid-cols-3 gap-3 md:grid-cols-4">
                    {LUNCH_TIME_SLOTS.map((slot) => (
                      <button key={slot.label} className={getTimeSlotClassName(slot.selected)} type="button">
                        {slot.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="mb-4 block text-sm font-bold uppercase tracking-widest text-on-surface/60">
                    <T>Cena</T>
                  </span>
                  <div className="grid grid-cols-3 gap-3 md:grid-cols-4">
                    {DINNER_TIME_SLOTS.map((slot) => (
                      <button key={slot.label} className={getTimeSlotClassName(slot.selected)} type="button">
                        {slot.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-8 border-t border-zinc-200 pt-8">
              <div className="flex items-center gap-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-on-primary">4</span>
                <h2 className="font-headline text-2xl font-bold">
                  <T>Datos de Contacto</T>
                </h2>
              </div>
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="px-1 text-sm font-semibold text-on-surface">
                    <T>Nombre completo</T>
                  </label>
                  <input className="h-14 w-full rounded-xl border-0 bg-surface-container-highest px-6 transition-all focus:ring-2 focus:ring-primary" placeholder="Ej. Juan Pérez" type="text" />
                </div>
                <div className="space-y-2">
                  <label className="px-1 text-sm font-semibold text-on-surface">
                    <T>Teléfono</T>
                  </label>
                  <input className="h-14 w-full rounded-xl border-0 bg-surface-container-highest px-6 transition-all focus:ring-2 focus:ring-primary" placeholder="+52 55..." type="tel" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="px-1 text-sm font-semibold text-on-surface">
                  <T>Email (opcional)</T>
                </label>
                <input className="h-14 w-full rounded-xl border-0 bg-surface-container-highest px-6 transition-all focus:ring-2 focus:ring-primary" placeholder="email@ejemplo.com" type="email" />
              </div>
              <div className="space-y-2">
                <label className="px-1 text-sm font-semibold text-on-surface">
                  <T>Notas o Peticiones Especiales</T>
                </label>
                <textarea
                  className="min-h-32 w-full resize-none rounded-xl border-0 bg-surface-container-highest p-6 transition-all focus:ring-2 focus:ring-primary"
                  placeholder="Cuéntanos si celebras algo o tienes alguna alergia..."
                  rows={4}
                />
              </div>
            </section>

            <div className="pt-6">
              <Link className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-12 py-5 font-headline text-xl font-extrabold text-on-primary transition-transform active:scale-95 md:w-auto" href="/reserva/confirmacion">
                <T>Confirmar Reserva</T>
              </Link>
              <p className="mt-4 text-center text-xs text-on-surface/60 md:text-left">
                <T>Al reservar, aceptas nuestras políticas de cancelación y términos de servicio.</T>
              </p>
            </div>
          </div>

          <div className="lg:w-96">
            <aside className="sticky top-24 space-y-6">
              <div className="relative overflow-hidden rounded-3xl bg-white p-8 shadow-sm">
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
                    data-alt="minimal monochromatic map of Mexico City downtown showing major streets and restaurant location point"
                    data-location="Mexico City"
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
          </div>
        </div>
      </div>

      <div className="mt-20 border-t border-zinc-100 bg-white py-12 dark:border-zinc-900 dark:bg-black">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 md:flex-row lg:px-8">
          <p className="text-sm text-zinc-500">
            <T>© 2024 Reserva Latina. Built for Hospitality.</T>
          </p>
          <div className="flex gap-6">
            <a className="text-sm text-zinc-500 transition-opacity hover:text-black dark:hover:text-white" href="#">
              <T>Privacy Policy</T>
            </a>
            <a className="text-sm text-zinc-500 transition-opacity hover:text-black dark:hover:text-white" href="#">
              <T>Terms of Service</T>
            </a>
            <a className="text-sm text-zinc-500 transition-opacity hover:text-black dark:hover:text-white" href="#">
              <T>Cookie Settings</T>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
//-aqui termina funcion ReservationFlowPage-//
