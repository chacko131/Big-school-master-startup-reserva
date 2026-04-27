/**
 * Archivo: page.tsx
 * Responsabilidad: Renderizar el perfil público del restaurante dentro de la experiencia guest.
 * Tipo: UI
 */

import Link from "next/link";
import { T } from "@/components/T";
import { PublicIcon } from "@/components/public/PublicIcon";
import { getRestaurantProfile } from "@/lib/public/siteContent";

interface RestaurantProfilePageProps {
  params:
    | {
        restaurantSlug: string;
      }
    | Promise<{
        restaurantSlug: string;
      }>;
}

interface RestaurantMetricDefinition {
  label: string;
  value: string;
  hint: string;
  icon: "star" | "payments" | "distance" | "restaurant";
}

interface GalleryImageDefinition {
  src: string;
  alt: string;
  className: string;
}

interface LocationDetailDefinition {
  icon: "locationOn" | "schedule" | "contactMail";
  title: string;
  lines: string[];
}

const heroImageUrl =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB0CJ71HNFb73k8Pz8kZkTS1qpFZYBC-dIjXhLbcW6cTJ7mF0Wy3AhKO4FvhhOK5Gu78s33Jg6XPgLj3EVNQP2mWLRNKFkUBneRlwlN6_GTuXemman3qzP7qguBs-8Bu0C8MIoeeZEhTQ1F8c0EKhN3OVHL8YJG1EpwnHgk3xxQedNcEpjjq-Y7eZRbdVKKglhVT2Z3FhS6ZlEv5AqSJNXHAz71FjuPyWkrjycU_AXXKerMegHx54w07NqWIw-gRkEWkct0z9jnFYs";

const galleryImageDefinitions: ReadonlyArray<GalleryImageDefinition> = [
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBKIay_FKECfTftkODgADEkF7Tx6TDdKbucO2Q4kVp7VYhFbyztz4273CiyDfnDtRFBNOiKvRvs9jI86D03Xn3kwEl5xsTtr42fjcMujJuqQTCeKWVwePfCEFZeXY4FZ1gjP-UDWhrlwqejnLEcxUPrIwHdiApOw5m4H4k6jyrntZMYDGRNIHuweQq3-UAo9bWoiwOfvrKAE5i6B67pSE-JkJI_iTu2UGvsNYVQU1DScaH0v3q-tkUjFy8d0U9lEQiaehJ7Uc9seGU",
    alt: "Close up of a gourmet taco with vibrant salsa and microgreens on a handmade ceramic plate",
    className: "col-span-2 row-span-2 overflow-hidden rounded-2xl aspect-square lg:aspect-auto",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuC2n7svfl-FqzxQcayPUbTnf3QBNrhkX37iNMUtJQH4K0CYnTWK4OrKb62CWc9ZQYNNcOgn0xqCs14aD9E4Q1ZsD4iu_EEsSCwFy5v7U0XUfvwrFUI1lwXvP7ayh__qA1DMefkIKSR7DkBZOveDJVcaHViYlnc2VYPhzw7B8UouEHQXHlx4vZ7-Uf35P30r7BGpEqCthvy0cLM0ATRU8YsQhVYRIailtsFkaCwC7XuCKFAgOJn3BYsA7NZkRmTmCAXbvPwtpQXHF8Q",
    alt: "Elegant bar area with backlit shelves of mezcal and tequila bottles in a modern rustic style",
    className: "overflow-hidden rounded-2xl aspect-square",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuD64OpvoNsW2CgWiPqBcqZArE0uTaHclKwf9kFWmR--7wiGyO4Xgbq-qdjSwEl_xkehxqBommvJcw-fZ7-iGK8zxM8jK4-xKTZQ4Ukk0anVlSDYLxcxcqMAc6MkaS6IcXuWpQaW4KAG1zeinBGGtrNmYDBiV0eDOmisRkMfbGxIJsW6D66Y7wyjFilrtygNp5inbNJQkgTm6rz-2CDdmr8W89aEH4-qZQAltUhAN4hz_mPF-nCVgXLFW-l3lALKHl4UZo2cw-UlVNs",
    alt: "Traditional Mexican mole dish served with rice and colorful garnishes in a sunlit patio setting",
    className: "overflow-hidden rounded-2xl aspect-square",
  },
] as const;

const locationDetailDefinitions: ReadonlyArray<LocationDetailDefinition> = [
  {
    icon: "locationOn",
    title: "Calle Aristóteles 124",
    lines: ["Polanco IV Secc, 11550 Ciudad de México, CDMX"],
  },
  {
    icon: "schedule",
    title: "Horarios de Servicio",
    lines: ["Lun - Jue: 13:00 - 23:00", "Vie - Sáb: 13:00 - 01:00", "Dom: 12:00 - 18:00"],
  },
  {
    icon: "contactMail",
    title: "Contacto",
    lines: ["+52 55 1234 5678", "hola@lahacienda.mx"],
  },
] as const;

//-aqui empieza funcion getRestaurantMetricDefinitions y es para convertir datos del perfil en cards visuales-//
/**
 * @pure
 */
function getRestaurantMetricDefinitions(): ReadonlyArray<RestaurantMetricDefinition> {
  return [
    {
      label: "Reseñas",
      value: "4.9",
      hint: "Valoración alta para reforzar confianza.",
      icon: "star",
    },
    {
      label: "Precio",
      value: "$$$",
      hint: "Posicionamiento premium para el cliente final.",
      icon: "payments",
    },
    {
      label: "Especialidad",
      value: "Cava",
      hint: "El restaurante se presenta con identidad clara.",
      icon: "restaurant",
    },
    {
      label: "Ubicación",
      value: "Polanco",
      hint: "Referencia geográfica inmediata para el usuario.",
      icon: "distance",
    },
  ];
}
//-aqui termina funcion getRestaurantMetricDefinitions-//

//-aqui empieza funcion getReservationButtonHref y es para definir el CTA principal del perfil-//
/**
 * @pure
 */
function getReservationButtonHref(slug: string): string {
  return `/${slug}/reservar`;
}
//-aqui termina funcion getReservationButtonHref-//

//-aqui empieza funcion RestaurantProfilePage y es para renderizar el perfil publico del restaurante-//
/**
 * Renderiza el perfil público de un restaurante concreto.
 * @pure
 */
export default async function RestaurantProfilePage({ params }: RestaurantProfilePageProps) {
  const { restaurantSlug } = await params;
  const restaurantProfile = getRestaurantProfile(restaurantSlug);
  const restaurantMetricDefinitions = getRestaurantMetricDefinitions();
  const reservationHref = getReservationButtonHref(restaurantSlug);

  return (
    <main className="bg-surface text-on-surface selection:bg-secondary-container">
      <nav className="sticky top-0 z-50 w-full bg-white transition-colors duration-150 dark:bg-black">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="text-xl font-bold tracking-tighter text-black dark:text-white sm:text-2xl">
            <T>Reserva Latina</T>
          </div>

          <div className="hidden items-center space-x-10 md:flex">
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

          <Link className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary transition-transform duration-150 hover:scale-95 sm:px-6" href={reservationHref}>
            <T>Reservar Mesa</T>
          </Link>
        </div>
        <div className="h-px w-full bg-slate-50 dark:bg-zinc-900" />
      </nav>

      <div className="relative">
        <section className="relative h-[819px] w-full overflow-hidden">
          <img className="h-full w-full object-cover" data-alt="Luxurious Latin restaurant interior with high ceilings, arched doorways, warm ambient lighting, and elegant dark wood tables in CDMX" src={heroImageUrl} alt="La Hacienda" />
          <div className="absolute inset-0 flex items-end bg-black/30 px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
            <div className="mx-auto flex w-full max-w-7xl flex-col justify-between gap-8 md:flex-row md:items-end">
              <div className="space-y-4 text-white">
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-white p-2 shadow-xl">
                    <PublicIcon name="restaurant" className="h-10 w-10 text-primary" />
                  </div>
                  <span className="rounded-full bg-secondary-container px-4 py-1 text-sm font-bold tracking-wider text-on-secondary-container">
                    <T>PREMIUM</T>
                  </span>
                </div>
                <h1 className="text-5xl font-extrabold leading-none tracking-tighter sm:text-6xl md:text-8xl">
                  <T>{restaurantProfile.displayName}</T>
                </h1>
                <p className="max-w-xl text-lg font-light opacity-90 sm:text-xl md:text-2xl">
                  <T>{restaurantProfile.subtitle}</T>
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="space-y-16 lg:col-span-8">
              <div className="space-y-8">
                <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                  <T>Un Legado Gastronómico</T>
                </h2>
                <p className="max-w-2xl font-body text-base leading-relaxed text-on-surface-variant sm:text-lg">
                  <T>{restaurantProfile.description}</T>
                </p>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {restaurantMetricDefinitions.map((metricDefinition) => (
                    <article className="space-y-2 rounded-xl bg-surface-container-low p-4 sm:p-6" key={metricDefinition.label}>
                      <PublicIcon name={metricDefinition.icon} className="h-5 w-5 text-secondary sm:h-6 sm:w-6" />
                      <div className="text-2xl font-bold sm:text-3xl">{metricDefinition.value}</div>
                      <div className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant sm:text-xs">
                        <T>{metricDefinition.label}</T>
                      </div>
                      <p className="text-sm leading-6 text-on-surface-variant">
                        <T>{metricDefinition.hint}</T>
                      </p>
                    </article>
                  ))}
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-end justify-between gap-4">
                  <h3 className="text-2xl font-bold sm:text-3xl">
                    <T>Galería</T>
                  </h3>
                  <button className="flex items-center gap-2 font-semibold text-secondary transition-opacity hover:opacity-70" type="button">
                    <T>Ver todas</T>
                    <PublicIcon name="arrowForward" className="h-5 w-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {galleryImageDefinitions.map((galleryImageDefinition) => (
                    <div className={galleryImageDefinition.className} key={galleryImageDefinition.alt}>
                      <img className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" alt={galleryImageDefinition.alt} src={galleryImageDefinition.src} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8 pt-8 md:grid-cols-2">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold">
                    <T>Ubicación y Horarios</T>
                  </h3>

                  <div className="space-y-4">
                    {locationDetailDefinitions.map((locationDetailDefinition) => (
                      <div className="flex items-start gap-4" key={locationDetailDefinition.title}>
                        <PublicIcon name={locationDetailDefinition.icon} className="mt-1 h-5 w-5 text-on-tertiary-container" />
                        <div>
                          <p className="font-semibold">
                            <T>{locationDetailDefinition.title}</T>
                          </p>
                          <div className="mt-1 space-y-1 text-on-surface-variant">
                            {locationDetailDefinition.lines.map((line) => (
                              <p key={line}>
                                <T>{line}</T>
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative min-h-[300px] overflow-hidden rounded-3xl bg-surface-container-high shadow-inner h-64 md:h-full">
                  <img className="h-full w-full object-cover opacity-80 grayscale" data-alt="Clean minimalist map showing Polanco district in Mexico City with a single elegant marker" data-location="Mexico City" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTvUakdE2nc_b_--lnN3eQGM1OpsSJaKtH8bT-UpKoXtB84Vt3hVS-xEjECFOkwqSpf0XmQCFv6xzaEuQl4-zcbN0-NrRC2hfkk9OJOTABpOJsmlntFYwJT4LIHYKxkjcJs2JnkqRjQzneb4OwoCmP15TDFm8lCHC3qXXGnq9DB5g7uLJrkgBSQma-P-L5QdsJkaAYSq29jUj1_MEQwDCVwWjo1pI3jmcfGD6_j8ZfqDdmX4B6WFF18yNhEcfgVcDiGSQ6xNjGUnM" alt="Mapa de ubicación" />
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-2xl ring-8 ring-white/20">
                      <PublicIcon name="pinDrop" className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <aside className="lg:col-span-4">
              <div className="space-y-8 lg:sticky lg:top-32">
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
                        <input className="w-full rounded-xl border-none bg-surface-container-low px-5 py-4 outline-none transition-all focus:ring-2 focus:ring-primary" placeholder="Selecciona una fecha" type="text" />
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

                    <button className="w-full rounded-2xl bg-primary py-5 text-lg font-bold text-on-primary shadow-lg shadow-black/10 transition-all hover:opacity-90 active:scale-[0.98]" type="submit">
                      <T>Confirmar Reserva</T>
                    </button>

                    <p className="px-4 text-center text-xs text-on-surface-variant/70">
                      <T>Al reservar, aceptas nuestras políticas de cancelación y términos de servicio.</T>
                    </p>
                  </form>
                </div>

                <div className="rounded-3xl bg-secondary-container/30 p-6 space-y-4 sm:p-8">
                  <h4 className="font-bold text-on-secondary-container">
                    <T>Eventos Privados</T>
                  </h4>
                  <p className="text-sm leading-relaxed text-on-secondary-container/80">
                    <T>Contamos con salones exclusivos para celebraciones y cenas corporativas de hasta 40 personas.</T>
                  </p>
                  <a className="inline-flex items-center gap-1 text-sm font-bold text-secondary transition-opacity hover:underline" href="#">
                    <T>Solicitar información</T>
                    <PublicIcon name="openInNew" className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </div>

      <div className="fixed bottom-6 left-4 right-4 z-60 md:hidden sm:left-6 sm:right-6">
        <button className="glass-nav flex w-full items-center justify-center gap-3 rounded-full border border-white/20 bg-white/70 py-4 text-lg font-bold text-primary shadow-2xl" type="button">
          <PublicIcon name="restaurant" className="h-5 w-5" />
          <T>Reservar Mesa</T>
        </button>
      </div>

      <footer className="mt-20 w-full border-t border-zinc-100 bg-white py-12 dark:border-zinc-900 dark:bg-black">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:px-6 md:flex-row lg:px-8">
          <div className="text-sm font-body text-zinc-500">
            <T>© 2024 Reserva Latina. Built for Hospitality.</T>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
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
//-aqui termina pagina RestaurantProfilePage-//
