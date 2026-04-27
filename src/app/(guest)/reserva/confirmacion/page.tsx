/**
 * Archivo: page.tsx
 * Responsabilidad: Mostrar la confirmación pública de una reserva recién creada.
 * Tipo: UI
 */

import Link from "next/link";
import { T } from "@/components/T";
import { PublicIcon } from "@/components/public/PublicIcon";

interface ReservationConfirmationSummary {
  restaurantName: string;
  confirmedLabel: string;
  dateLabel: string;
  dateValue: string;
  timeValue: string;
  partyLabel: string;
  partyValue: string;
  reservationIdLabel: string;
  reservationIdValue: string;
  locationLabel: string;
  locationValue: string;
}

interface ReservationConfirmationAction {
  label: string;
  href: string;
  icon: "calendarAddOn" | "editCalendar" | "share";
  primary?: boolean;
}

const RESERVATION_CONFIRMATION_SUMMARY: ReservationConfirmationSummary = {
  restaurantName: "La Hacienda",
  confirmedLabel: "Confirmed",
  dateLabel: "Date & Time",
  dateValue: "24 Oct, 2024",
  timeValue: "20:30 hrs",
  partyLabel: "Party Size",
  partyValue: "4 People",
  reservationIdLabel: "Reservation ID",
  reservationIdValue: "#LH-8829",
  locationLabel: "Ubicación",
  locationValue: "Av. Paseo de la Reforma 250, Juárez, 06600 Ciudad de México, CDMX",
};

const RESERVATION_CONFIRMATION_ACTIONS: ReservationConfirmationAction[] = [
  {
    label: "Añadir al calendario",
    href: "#",
    icon: "calendarAddOn",
  },
  {
    label: "Gestionar reserva",
    href: "/mi-reserva/LH-8829",
    icon: "editCalendar",
  },
  {
    label: "Compartir detalles",
    href: "#",
    icon: "share",
    primary: true,
  },
];

//-aqui empieza funcion getActionClassName y es para marcar el estilo de las acciones de confirmacion-//
/**
 * @pure
 */
function getActionClassName(primary?: boolean): string {
  return primary
    ? "flex items-center justify-center gap-3 rounded-xl bg-primary py-6 text-on-primary transition-all active:scale-95 hover:opacity-90"
    : "flex items-center justify-center gap-3 rounded-xl bg-surface-container-lowest py-6 transition-all hover:bg-surface-container-high active:scale-95";
}
//-aqui termina funcion getActionClassName-//

//-aqui empieza funcion ReservationConfirmationPage y es para renderizar la pantalla de exito de la reserva-//
/**
 * Renderiza la confirmación pública siguiendo la referencia Stitch.
 * @pure
 */
export default function ReservationConfirmationPage() {
  return (
    <main className="bg-surface text-on-surface antialiased">
      <nav className="sticky top-0 z-50 w-full bg-white dark:bg-black">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-8">
          <div className="text-2xl font-bold tracking-tighter text-black dark:text-white">
            <T>Reserva Latina</T>
          </div>
          <div className="hidden items-center gap-x-8 md:flex">
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
          </div>
          <button className="rounded-lg bg-primary px-6 py-2.5 font-semibold text-on-primary transition-all duration-150 active:opacity-80" type="button">
            <T>Get Started</T>
          </button>
        </div>
      </nav>

      <div className="min-h-screen pb-24">
        <section className="mx-auto max-w-4xl px-6 pt-16 text-center">
          <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container">
            <PublicIcon name="checkCircleFilled" className="h-12 w-12" />
          </div>
          <h1 className="mb-4 text-5xl font-extrabold tracking-tight text-primary md:text-7xl">
            <T>¡Tu mesa está reservada!</T>
          </h1>
          <p className="mx-auto max-w-2xl text-xl font-medium text-on-surface-variant">
            <T>Hemos confirmado tu reserva en La Hacienda. Estamos preparando todo para recibirte.</T>
          </p>
        </section>

        <section className="mx-auto mt-16 max-w-5xl px-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-8 md:col-span-8">
              <div className="relative z-10 flex flex-col justify-between gap-8">
                <div>
                  <div className="mb-6 flex items-center gap-2">
                    <span className="rounded-full bg-secondary-container px-3 py-1 text-xs font-bold uppercase tracking-widest text-on-secondary-container">
                      <T>{RESERVATION_CONFIRMATION_SUMMARY.confirmedLabel}</T>
                    </span>
                  </div>
                  <h2 className="mb-8 text-4xl font-bold">
                    {RESERVATION_CONFIRMATION_SUMMARY.restaurantName}
                  </h2>
                  <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                    <div>
                      <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-on-primary-container">
                        <T>{RESERVATION_CONFIRMATION_SUMMARY.dateLabel}</T>
                      </p>
                      <p className="text-xl font-bold">{RESERVATION_CONFIRMATION_SUMMARY.dateValue}</p>
                      <p className="text-lg text-on-surface-variant">{RESERVATION_CONFIRMATION_SUMMARY.timeValue}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-on-primary-container">
                        <T>{RESERVATION_CONFIRMATION_SUMMARY.partyLabel}</T>
                      </p>
                      <p className="text-xl font-bold">{RESERVATION_CONFIRMATION_SUMMARY.partyValue}</p>
                      <p className="text-lg text-on-surface-variant">Indoor Table</p>
                    </div>
                    <div>
                      <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-on-primary-container">
                        <T>{RESERVATION_CONFIRMATION_SUMMARY.reservationIdLabel}</T>
                      </p>
                      <p className="text-xl font-bold">{RESERVATION_CONFIRMATION_SUMMARY.reservationIdValue}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pointer-events-none absolute right-0 top-0 h-full w-1/3 opacity-10">
                <img
                  alt="abstract close up of rustic terracotta tiles with natural sunlight casting geometric shadows and warm earthy textures"
                  className="h-full w-full object-cover"
                  data-alt="abstract close up of rustic terracotta tiles with natural sunlight casting geometric shadows and warm earthy textures"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIsJxqM6aUMRZrmmMXrMozJJKwtqQsF6RmiougkUqBdKqq9d2zpTY6dtDx98aLM3ZC-Nl85Hgm8tkmSu0GJoQWiPzvxqMPaOm_qxR7mISoBNtH_MKr30XFPZnExX_2408Z6WyFP8ppQq7KhHDeJFabZZbTrBdUJ2G-saYt-3qibgbiRgl1UmZOg_dosFw_9awA4Vshaj1GwjLu3be7KTZrACYA5MvGtUqSkrdy8xGTmfTcnvwipKS1VOEcWKn4kIULkW0UrnWdBxU"
                />
              </div>
            </div>

            <div className="flex flex-col overflow-hidden rounded-xl bg-surface-container-low md:col-span-4">
              <div className="relative h-48 w-full bg-surface-container-highest">
                <img
                  alt="stylized map view of a vibrant urban neighborhood in Mexico City with clean lines and soft pastel colors"
                  className="h-full w-full object-cover"
                  data-alt="stylized map view of a vibrant urban neighborhood in Mexico City with clean lines and soft pastel colors"
                  data-location="Mexico City"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuALS42zux4RGC8SlW8qfolTT757DNhA6aT26YEJRSQBjqoRIM-76C2dVS40OCppBn_NBBIri9ClA7kpd0X0qZ8DKYnlVwezPzDBF4rBWr6l_vGEi58Gv25xERzfp6qYLu-VUxxt9jWKj9opH-kHtftOMNjP0ObcTC4MNlfz87Y0g7bwZFZp3OdW-qHnymVGTUgB4Tp552PIRWYKF37aSS__XBzE7Xb0h45S8p8fS65JO1QrxKFaolH5NjO3jJKOuCDkHo4O5mJ974A"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-on-primary shadow-lg">
                    <PublicIcon name="locationOn" className="h-5 w-5" />
                  </div>
                </div>
              </div>
              <div className="grow p-6">
                <h3 className="mb-1 text-lg font-bold">
                  <T>Ubicación</T>
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-on-surface-variant">
                  {RESERVATION_CONFIRMATION_SUMMARY.locationValue}
                </p>
                <a className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline" href="#">
                  <T>Cómo llegar</T>
                  <PublicIcon name="openInNew" className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:col-span-12 sm:grid-cols-3">
              {RESERVATION_CONFIRMATION_ACTIONS.map((action) => (
                <Link key={action.label} className={getActionClassName(action.primary)} href={action.href}>
                  <PublicIcon name={action.icon} className="h-5 w-5" />
                  <span className="font-bold">
                    <T>{action.label}</T>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto mt-12 max-w-5xl px-6">
          <div className="relative flex h-64 items-center overflow-hidden rounded-2xl bg-black p-12">
            <img
              alt="luxury candlelit dinner table setting with fine wine glasses and white linen in a historic courtyard"
              className="absolute inset-0 h-full w-full object-cover opacity-50"
              data-alt="luxury candlelit dinner table setting with fine wine glasses and white linen in a historic courtyard"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5gjfCBt3hs1XQwkvNLJL5AdJHx6vC1UfAi6VFBZh1FPytxBA0HGqFHfEB6oyJ1xnLzBcp09evlju69ctHkik5e3Gy8ENj7LSD3QWVtxn4AdD2oS1l0rTziICnB94hvB5Oc2liqy7Fqkf2TD8LYu5SCjevMl6Ctj_Xj1nqOTtS92JKGiq67NNaDiH6f2f8v33RTobM8aWoWNOtRoJYBtmZUsmOMd0QwoEg2eyuRmudJ2ds57KfTwdrnkP6t1N0pGNOLe4wQUHLZPo"
            />
            <div className="relative z-10 max-w-lg">
              <h2 className="mb-2 text-3xl font-bold italic text-white">
                <T>Hazlo especial</T>
              </h2>
              <p className="mb-6 text-zinc-300">
                <T>¿Celebras algo especial? Permítenos preparar una experiencia personalizada para tu llegada.</T>
              </p>
              <button className="rounded-lg bg-white px-8 py-3 font-bold text-black transition-colors hover:bg-zinc-200" type="button">
                <T>Ver menú de experiencias</T>
              </button>
            </div>
          </div>
        </section>
      </div>

      <footer className="w-full border-t border-zinc-100 bg-white py-12 dark:border-zinc-900 dark:bg-black">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between px-8 md:flex-row">
          <div className="mb-4 text-sm text-zinc-500 md:mb-0">
            <T>© 2024 Reserva Latina. Built for Hospitality.</T>
          </div>
          <div className="flex gap-8">
            <a className="text-sm text-zinc-500 opacity-80 transition-opacity hover:text-black dark:hover:text-white" href="#">
              <T>Privacy Policy</T>
            </a>
            <a className="text-sm text-zinc-500 opacity-80 transition-opacity hover:text-black dark:hover:text-white" href="#">
              <T>Terms of Service</T>
            </a>
            <a className="text-sm text-zinc-500 opacity-80 transition-opacity hover:text-black dark:hover:text-white" href="#">
              <T>Cookie Settings</T>
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
//-aqui termina funcion ReservationConfirmationPage-//
