/**
 * Archivo: page.tsx
 * Responsabilidad: Renderizar la vista pública firmada para consultar o gestionar una reserva concreta.
 * Tipo: UI
 */

import { T } from "@/components/T";
import { PublicIcon } from "@/components/public/PublicIcon";
import { getReservationContext } from "@/lib/public/siteContent";

interface ReservationDetailPageProps {
  params:
    | {
        reservationId: string;
      }
    | Promise<{
        reservationId: string;
      }>;
}

interface ReservationFieldDefinition {
  label: string;
  value: string;
}

interface ReservationHeroStatDefinition {
  label: string;
  value: string;
  description: string;
  tone: "ghost" | "mint" | "light";
}

interface ReservationActionDefinition {
  title: string;
  description: string;
  icon: "map" | "chatBubble" | "cancel";
  tone: "primary" | "secondary" | "surface";
}

interface ReservationFooterLinkDefinition {
  label: string;
  href: string;
}

const reservationFieldDefinitions: ReadonlyArray<ReservationFieldDefinition> = [
  {
    label: "Invitado",
    value: "Alejandro Silva",
  },
  {
    label: "Teléfono",
    value: "+34 612 345 678",
  },
  {
    label: "Fecha",
    value: "Sábado, 14 Oct",
  },
  {
    label: "Hora",
    value: "21:30",
  },
] as const;

const reservationHeroStatDefinitions: ReadonlyArray<ReservationHeroStatDefinition> = [
  {
    label: "Estado",
    value: "Confirmada",
    description: "La reserva está activa y lista para el servicio.",
    tone: "ghost",
  },
  {
    label: "Mesa",
    value: "12",
    description: "Asignación visible cuando exista disponibilidad fija.",
    tone: "mint",
  },
  {
    label: "Canal",
    value: "Web",
    description: "Procede de la experiencia pública del restaurante.",
    tone: "light",
  },
  {
    label: "Acceso",
    value: "Firmado",
    description: "La consulta debe protegerse más adelante con backend real.",
    tone: "ghost",
  },
] as const;

const reservationActionDefinitions: ReadonlyArray<ReservationActionDefinition> = [
  {
    title: "Ver mapa de localización",
    description: "Abre la ubicación del restaurante y la ruta para llegar sin fricción.",
    icon: "map",
    tone: "primary",
  },
  {
    title: "Contactar restaurante",
    description: "Inicia una conversación rápida si necesitas aclarar algo de la reserva.",
    icon: "chatBubble",
    tone: "secondary",
  },
  {
    title: "Cancelar reserva",
    description: "Libera la mesa si la ventana de cancelación sigue permitiéndolo.",
    icon: "cancel",
    tone: "surface",
  },
] as const;

const reservationFooterLinks: ReadonlyArray<ReservationFooterLinkDefinition> = [
  {
    label: "Política de Privacidad",
    href: "#",
  },
  {
    label: "Términos de Servicio",
    href: "#",
  },
  {
    label: "Configuración de Cookies",
    href: "#",
  },
] as const;

//-aqui empieza pagina ReservationDetailPage y es para mostrar la gestion publica de una reserva-
/**
 * Renderiza la vista pública de gestión de una reserva concreta.
 */
export default async function ReservationDetailPage({ params }: ReservationDetailPageProps) {
  const { reservationId } = await params;
  const reservationContext = getReservationContext(reservationId);
  const reservationHeroStatus = "Confirmada";
  const reservationReference = `#${reservationContext.codeValue}`;
  const reservationSpecialRequest = "Mesa cerca de la ventana si es posible, es para un aniversario.";
  const assignedTable = "T-14";
  const assignedZone = "Zona Terraza Central";

  return (
    <main className="min-h-screen bg-background text-on-surface">
      <div className="mx-auto min-h-screen max-w-4xl px-4 py-6 pb-28 sm:px-6 sm:py-10 md:px-8 md:pb-12">
        <header className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-start sm:justify-between">
          <button className="flex items-center gap-2 text-sm font-medium text-on-surface-variant transition-colors hover:text-primary" type="button">
            <PublicIcon name="arrowBack" className="h-5 w-5" />
            <T>Volver</T>
          </button>

          <div className="text-left sm:text-right">
            <h1 className="font-headline text-2xl font-extrabold tracking-tighter uppercase text-on-surface sm:text-3xl">
              <T>{reservationContext.restaurantName}</T>
            </h1>
            <p className="text-sm font-medium text-on-surface-variant">
              <T>Ref: </T>
              <span>{reservationReference}</span>
            </p>
          </div>
        </header>

        <section className="relative mb-8 overflow-hidden rounded-[28px] bg-primary p-5 text-on-primary shadow-[0px_20px_40px_rgba(26,28,28,0.16)] sm:mb-10 sm:p-8 lg:p-10">
          <div className="absolute right-0 top-0 hidden h-full w-1/3 bg-linear-to-l from-white/10 to-transparent md:block" />

          <div className="relative z-10 flex flex-col gap-5 sm:gap-6">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-2 text-on-secondary shadow-sm sm:px-4">
                <PublicIcon name="checkCircle" className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-[0.22em]">
                  <T>{reservationHeroStatus}</T>
                </span>
              </div>
              <h2 className="max-w-xl font-headline text-3xl font-extrabold leading-tight text-white! sm:text-4xl lg:text-5xl">
                <T>Gestiona tu reserva</T>
              </h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-white/80 sm:text-lg">
                <T>{reservationContext.restaurantSubtitle}</T>
              </p>
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:flex-wrap">
              {reservationHeroStatDefinitions.map((statDefinition) => {
                const cardClassName =
                  statDefinition.tone === "ghost"
                    ? "bg-transparent text-on-primary md:pt-2"
                    : statDefinition.tone === "mint"
                      ? "bg-secondary-container text-on-secondary-container"
                      : "bg-surface-container-lowest text-on-surface";

                const valueClassName =
                  statDefinition.tone === "ghost"
                    ? "text-3xl font-black tracking-tight text-white sm:text-4xl"
                    : statDefinition.tone === "mint"
                      ? "text-3xl font-black tracking-tight text-on-secondary-container sm:text-4xl"
                      : "text-3xl font-black tracking-tight text-on-surface sm:text-4xl";

                const descriptionClassName =
                  statDefinition.tone === "ghost"
                    ? "text-sm leading-6 text-white/75"
                    : statDefinition.tone === "mint"
                      ? "text-sm leading-6 text-on-secondary-container/65"
                      : "text-sm leading-6 text-on-surface/70";

                const cardWidthClassName =
                  statDefinition.tone === "ghost"
                    ? "w-full md:min-w-[min(14rem,100%)] md:flex-1"
                    : statDefinition.tone === "mint"
                      ? "w-full md:min-w-[min(12rem,100%)] md:flex-[1_1_12rem]"
                      : "w-full md:min-w-[min(12rem,100%)] md:flex-[1_1_12rem]";

                return (
                  <article className={`rounded-[24px] ${cardWidthClassName} ${cardClassName}`} key={statDefinition.label}>
                    <div className={statDefinition.tone === "ghost" ? "px-1 py-2" : "rounded-[24px] px-4 py-4"}>
                      <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-current/70">
                        <T>{statDefinition.label}</T>
                      </p>
                      <p className={`mt-2 ${valueClassName}`}>
                        <T>{statDefinition.value}</T>
                      </p>
                      <p className={`mt-3 max-w-56 ${descriptionClassName}`}>
                        <T>{statDefinition.description}</T>
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <section className="md:col-span-2 rounded-[28px] bg-surface-container-lowest p-8 shadow-[0px_20px_40px_rgba(26,28,28,0.06)]">
            <div className="mb-8 flex items-start justify-between gap-4">
              <h3 className="font-headline text-xl font-bold text-on-surface">
                <T>Detalles de la Reserva</T>
              </h3>
              <PublicIcon name="eventAvailable" className="h-5 w-5 text-on-surface-variant" />
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              {reservationFieldDefinitions.map((fieldDefinition) => (
                <div key={fieldDefinition.label}>
                  <p className="mb-1 text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                    <T>{fieldDefinition.label}</T>
                  </p>
                  <p className="text-lg font-medium text-on-surface">
                    <T>{fieldDefinition.value}</T>
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 border-t border-surface-container pt-8">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                <T>Peticiones Especiales</T>
              </p>
              <p className="italic text-on-surface-variant">
                <T>{reservationSpecialRequest}</T>
              </p>
            </div>
          </section>

          <div className="flex flex-col gap-6">
            <section className="flex min-h-[180px] flex-col items-center justify-center rounded-[28px] bg-primary p-6 text-center text-on-primary shadow-[0px_20px_40px_rgba(26,28,28,0.16)]">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-on-primary/70">
                <T>Mesa Asignada</T>
              </p>
              <span className="font-headline text-5xl font-black leading-none">
                <T>{assignedTable}</T>
              </span>
              <p className="mt-2 text-xs text-on-primary/70">
                <T>{assignedZone}</T>
              </p>
            </section>

            <section className="overflow-hidden rounded-[28px] bg-surface-container-lowest p-2 shadow-[0px_20px_40px_rgba(26,28,28,0.06)]">
              <div className="group relative h-32 overflow-hidden rounded-[20px] bg-surface-container">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.06),transparent_70%)]" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/15">
                  <button className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-black shadow-lg" type="button">
                    <PublicIcon name="map" className="h-4 w-4" />
                    <T>Ver Mapa</T>
                  </button>
                </div>
              </div>
              <div className="p-3">
                <p className="truncate text-xs font-bold text-on-surface">
                  <T>Calle de Serrano, 45, Madrid</T>
                </p>
              </div>
            </section>
          </div>
        </div>

        <section className="mb-16 mt-16">
          <h3 className="mb-6 text-center text-sm font-bold uppercase tracking-[0.22em] text-on-surface-variant">
            <T>Gestión de Reserva</T>
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {reservationActionDefinitions.map((actionDefinition) => (
              <button
                className={`group flex items-center justify-between rounded-[20px] border border-transparent p-5 text-left shadow-sm transition-all duration-300 ${
                  actionDefinition.tone === "primary"
                    ? "bg-surface-container-lowest hover:border-primary hover:bg-primary hover:text-on-primary"
                    : actionDefinition.tone === "secondary"
                      ? "bg-surface-container-lowest hover:border-primary hover:bg-primary hover:text-on-primary"
                      : "bg-surface-container-lowest hover:border-tertiary-container hover:bg-tertiary-container hover:text-on-tertiary"
                }`}
                type="button"
                key={actionDefinition.title}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container group-hover:bg-white/20">
                    <PublicIcon name={actionDefinition.icon} className="h-5 w-5" />
                  </div>
                  <span className="font-semibold leading-5">
                    <T>{actionDefinition.title}</T>
                  </span>
                </div>
                <PublicIcon name="chevronRight" className="h-5 w-5 opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
            ))}
          </div>
        </section>

        <footer className="mt-20 border-t border-surface-container pt-12 text-center">
          <p className="mb-4 font-headline text-lg font-bold tracking-tight uppercase text-on-surface">
            <T>{reservationContext.restaurantName}</T>
          </p>

          <div className="mb-8 flex flex-wrap justify-center gap-8 text-sm text-on-surface-variant">
            {reservationFooterLinks.map((footerLinkDefinition) => (
              <a className="transition-colors hover:text-primary" href={footerLinkDefinition.href} key={footerLinkDefinition.label}>
                <T>{footerLinkDefinition.label}</T>
              </a>
            ))}
          </div>

          <p className="text-xs font-medium text-on-surface-variant">
            <T>© 2024 Reserva Latina. Built for Hospitality.</T>
          </p>
        </footer>
      </div>

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
    </main>
  );
}
//-aqui termina pagina ReservationDetailPage-
//
