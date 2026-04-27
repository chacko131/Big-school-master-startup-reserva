/**
 * Archivo: page.tsx
 * Responsabilidad: Renderizar la vista operativa de calendario y timeline del dashboard.
 * Tipo: UI
 */

import Link from "next/link";
import { T } from "@/components/T";
import { OnboardingIcon } from "@/components/onboarding/OnboardingIcon";
import type { OnboardingIconName } from "@/types/onboarding";

interface ScheduleMetricDefinition {
  label: string;
  value: string;
  caption: string;
  tone: "primary" | "secondary" | "surface" | "warning";
}

interface ScheduleBookingDefinition {
  guest: string;
  partySize: string;
  time: string;
  duration: string;
  note: string;
  tone: "primary" | "secondary" | "warning" | "surface";
  left: number;
  width: number;
}

interface ScheduleLaneDefinition {
  name: string;
  area: string;
  seats: string;
  status: string;
  statusTone: "primary" | "secondary" | "warning";
  bookings: ReadonlyArray<ScheduleBookingDefinition>;
}

interface ScheduleArrivalDefinition {
  guest: string;
  partySize: string;
  eta: string;
  table: string;
}

interface ScheduleActionDefinition {
  title: string;
  description: string;
  buttonLabel: string;
  icon: OnboardingIconName;
}

const scheduleMetricDefinitions: ReadonlyArray<ScheduleMetricDefinition> = [
  {
    label: "Bloques confirmados",
    value: "18",
    caption: "Distribuidos entre sala y terraza",
    tone: "primary",
  },
  {
    label: "Ocupación prevista",
    value: "74%",
    caption: "Pico entre 19:00 y 21:00",
    tone: "secondary",
  },
  {
    label: "Arribos próximos",
    value: "7",
    caption: "En los próximos 90 minutos",
    tone: "surface",
  },
  {
    label: "Alertas activas",
    value: "2",
    caption: "Patio y grupo grande",
    tone: "warning",
  },
] as const;

const scheduleHourLabels = ["17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"] as const;

const scheduleLaneDefinitions: ReadonlyArray<ScheduleLaneDefinition> = [
  {
    name: "Mesa 01",
    area: "Salón principal",
    seats: "4 asientos",
    status: "Seleccionada",
    statusTone: "primary",
    bookings: [
      {
        guest: "Ricardo Montaner",
        partySize: "4 invitados",
        time: "17:15",
        duration: "75 min",
        note: "Check-in temprano",
        tone: "primary",
        left: 5,
        width: 25,
      },
      {
        guest: "Ana Gabriel",
        partySize: "2 invitados",
        time: "21:00",
        duration: "45 min",
        note: "Llegada prevista",
        tone: "warning",
        left: 65,
        width: 15,
      },
    ],
  },
  {
    name: "Mesa 02",
    area: "Salón principal",
    seats: "2 asientos",
    status: "Disponible",
    statusTone: "secondary",
    bookings: [
      {
        guest: "Elena López",
        partySize: "2 invitados",
        time: "19:00",
        duration: "90 min",
        note: "Confirmada por recepción",
        tone: "secondary",
        left: 20,
        width: 30,
      },
    ],
  },
  {
    name: "Bar 04",
    area: "Bar lounge",
    seats: "1 asiento",
    status: "En uso",
    statusTone: "primary",
    bookings: [
      {
        guest: "Juan Luis G.",
        partySize: "1 invitado",
        time: "19:45",
        duration: "60 min",
        note: "Servicio de barra",
        tone: "primary",
        left: 40,
        width: 15,
      },
    ],
  },
  {
    name: "Patio 12",
    area: "Terraza",
    seats: "6 asientos",
    status: "Revisión",
    statusTone: "warning",
    bookings: [
      {
        guest: "Marcela Valencia",
        partySize: "6 invitados",
        time: "20:30",
        duration: "120 min",
        note: "Evento familiar",
        tone: "warning",
        left: 45,
        width: 40,
      },
    ],
  },
] as const;

const scheduleArrivalDefinitions: ReadonlyArray<ScheduleArrivalDefinition> = [
  {
    guest: "Camila Soto",
    partySize: "2 invitados",
    eta: "En 12 min",
    table: "Mesa 08",
  },
  {
    guest: "Fernando Herrera",
    partySize: "4 invitados",
    eta: "En 25 min",
    table: "Mesa 11",
  },
  {
    guest: "Julian Alvarez",
    partySize: "3 invitados",
    eta: "En 40 min",
    table: "Patio 12",
  },
] as const;

const scheduleActionDefinitions: ReadonlyArray<ScheduleActionDefinition> = [
  {
    title: "Reasignación rápida",
    description: "Reubica reservas del patio si el clima cambia o si el salón necesita equilibrio.",
    buttonLabel: "Auto reasignar",
    icon: "rocketLaunch",
  },
  {
    title: "Exportar jornada",
    description: "Genera un resumen visual para el equipo antes del siguiente turno.",
    buttonLabel: "Exportar",
    icon: "contentCopy",
  },
] as const;

//-aqui empieza funcion getScheduleBookingToneClassName y es para pintar cada bloque de reserva en el timeline-//
/**
 * Devuelve las clases visuales de cada bloque del timeline.
 *
 * @pure
 */
function getScheduleBookingToneClassName(tone: ScheduleBookingDefinition["tone"]): string {
  if (tone === "primary") {
    return "bg-primary text-on-primary";
  }

  if (tone === "secondary") {
    return "bg-secondary-container text-on-secondary-container border border-secondary/10";
  }

  if (tone === "warning") {
    return "bg-on-tertiary-container text-on-tertiary border border-tertiary/20";
  }

  return "bg-surface-container-highest text-on-surface-variant";
}
//-aqui termina funcion getScheduleBookingToneClassName-//

//-aqui empieza funcion getScheduleStatusToneClassName y es para pintar el estado de cada fila-//
/**
 * Devuelve las clases visuales del estado de la mesa.
 *
 * @pure
 */
function getScheduleStatusToneClassName(statusTone: ScheduleLaneDefinition["statusTone"]): string {
  if (statusTone === "primary") {
    return "bg-primary text-on-primary";
  }

  if (statusTone === "warning") {
    return "bg-tertiary-fixed text-on-tertiary-fixed";
  }

  return "bg-secondary-container text-on-secondary-container";
}
//-aqui termina funcion getScheduleStatusToneClassName-//

//-aqui empieza componente ScheduleMetricCard y es para presentar las cifras principales del calendario-//
/**
 * Renderiza una tarjeta de métrica de la vista de calendario.
 *
 * @pure
 */
function ScheduleMetricCard({ label, value, caption, tone }: ScheduleMetricDefinition) {
  const containerClassName =
    tone === "primary"
      ? "bg-primary text-on-primary"
      : tone === "secondary"
        ? "bg-secondary-container text-on-secondary-container"
        : tone === "warning"
          ? "bg-tertiary-fixed text-on-tertiary-fixed"
          : "bg-surface-container-lowest text-on-surface";
  const labelClassName = tone === "primary" ? "text-white/70" : tone === "secondary" ? "text-on-secondary-container/75" : tone === "warning" ? "text-on-tertiary-fixed/75" : "text-on-surface-variant";

  return (
    <article className={`rounded-[24px] p-6 shadow-sm ${containerClassName}`}>
      <p className={`text-xs font-bold uppercase tracking-[0.22em] ${labelClassName}`}>
        <T>{label}</T>
      </p>
      <p className="mt-4 text-4xl font-black tracking-tight">
        <T>{value}</T>
      </p>
      <p className={`mt-2 text-sm leading-6 ${labelClassName}`}>
        <T>{caption}</T>
      </p>
    </article>
  );
}
//-aqui termina componente ScheduleMetricCard-//

//-aqui empieza componente ScheduleToolbar y es para controlar la vista temporal-//
/**
 * Renderiza la cabecera con filtros de agenda.
 *
 * @pure
 */
function ScheduleToolbar() {
  return (
    <section className="flex flex-col gap-6 rounded-[28px] bg-surface-container-lowest p-8 shadow-sm lg:flex-row lg:items-end lg:justify-between lg:p-10">
      <div className="max-w-2xl space-y-4">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
          <T>Calendario del restaurante</T>
        </p>
        <h2 className="text-5xl font-black tracking-tighter text-primary lg:text-6xl">
          <T>Controla la agenda de hoy por mesa y franja horaria.</T>
        </h2>
        <p className="max-w-xl text-on-surface-variant lg:text-lg lg:leading-8">
          <T>
            La vista tipo timeline ayuda a detectar picos, evitar solapamientos y preparar al equipo antes de que lleguen las reservas.
          </T>
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link className="inline-flex items-center justify-center gap-2 rounded-lg bg-surface-container-highest px-6 py-2.5 text-sm font-bold text-on-surface transition-colors hover:bg-surface-container-high" href="/dashboard/reservations">
          <OnboardingIcon name="schedule" className="h-4 w-4" />
          <T>Ver reservas</T>
        </Link>
        <Link className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-on-primary transition-colors hover:opacity-90" href="/dashboard/tables">
          <OnboardingIcon name="gridView" className="h-4 w-4" />
          <T>Ir al plano</T>
        </Link>
      </div>
    </section>
  );
}
//-aqui termina componente ScheduleToolbar-//

//-aqui empieza componente ScheduleModeSwitch y es para marcar el modo activo de lectura-//
/**
 * Renderiza el selector de modo de lectura de la agenda.
 *
 * @pure
 */
function ScheduleModeSwitch() {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-surface-container-low p-4 shadow-sm">
      <div>
        <p className="text-sm font-bold text-primary">
          <T>Vista de jornada</T>
        </p>
        <p className="text-xs text-on-surface-variant">
          <T>Recomendado para coordinación de sala y recepción.</T>
        </p>
      </div>
      <div className="inline-flex rounded-xl bg-surface-container-highest p-1">
        <button className="rounded-lg bg-surface-container-lowest px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-primary shadow-sm" type="button">
          <T>Día</T>
        </button>
        <button className="px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-on-surface-variant" type="button">
          <T>Semana</T>
        </button>
        <button className="px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-on-surface-variant" type="button">
          <T>Lista</T>
        </button>
      </div>
    </div>
  );
}
//-aqui termina componente ScheduleModeSwitch-//

//-aqui empieza componente ScheduleTimelineBoard y es para dibujar el calendario por mesa-//
/**
 * Renderiza el timeline central de reservas por mesa.
 *
 * @pure
 */
function ScheduleTimelineBoard() {
  return (
    <section className="overflow-hidden rounded-[28px] bg-surface-container-lowest shadow-sm">
      <div className="flex items-center justify-between gap-4 border-b border-outline-variant/10 bg-surface-container-low px-6 py-5">
        <div>
          <h3 className="text-lg font-black tracking-tight text-primary lg:text-xl">
            <T>Timeline de sala</T>
          </h3>
          <p className="mt-1 text-sm text-on-surface-variant">
            <T>Visualiza bloques por mesa y detecta solapamientos antes del servicio.</T>
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-on-primary transition-opacity hover:opacity-90" type="button">
          <OnboardingIcon name="checkCircle" className="h-4 w-4" />
          <T>Confirmar jornada</T>
        </button>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[1080px]">
          <div className="flex border-b border-outline-variant/10 bg-surface-container-lowest">
            <div className="w-56 border-r border-outline-variant/10 p-4 text-xs font-black uppercase tracking-[0.24em] text-on-surface-variant">
              <T>Mesa / zona</T>
            </div>
            <div className="flex flex-1">
              {scheduleHourLabels.map((hourLabel) => (
                <div className="min-w-[132px] flex-1 border-r border-outline-variant/10 px-4 py-4 text-center text-sm font-bold text-on-surface" key={hourLabel}>
                  {hourLabel}
                </div>
              ))}
            </div>
          </div>

          <div className="divide-y divide-outline-variant/10">
            {scheduleLaneDefinitions.map((laneDefinition) => (
              <div className="flex min-h-[112px] hover:bg-surface-container-low/60" key={laneDefinition.name}>
                <div className="w-56 border-r border-outline-variant/10 p-4">
                  <div className="flex h-full flex-col justify-center gap-1">
                    <p className="text-base font-black tracking-tight text-primary">
                      <T>{laneDefinition.name}</T>
                    </p>
                    <p className="text-sm text-on-surface-variant">
                      <T>{laneDefinition.area}</T>
                    </p>
                    <div className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant">
                      <span>
                        <T>{laneDefinition.seats}</T>
                      </span>
                      <span aria-hidden="true">•</span>
                      <span className={`inline-flex rounded-full px-2.5 py-1 ${getScheduleStatusToneClassName(laneDefinition.statusTone)}`}>
                        <T>{laneDefinition.status}</T>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="relative flex flex-1 items-center px-3 py-6">
                  <div className="absolute inset-0 grid grid-cols-7">
                    {scheduleHourLabels.map((hourLabel) => (
                      <div className="border-r border-dashed border-outline-variant/10" key={`${laneDefinition.name}-${hourLabel}`} />
                    ))}
                  </div>

                  {laneDefinition.bookings.map((bookingDefinition) => (
                    <article
                      className={`absolute top-1/2 flex -translate-y-1/2 items-center gap-3 rounded-xl px-4 py-3 shadow-lg ${getScheduleBookingToneClassName(bookingDefinition.tone)}`}
                      key={`${bookingDefinition.guest}-${bookingDefinition.time}`}
                      style={{ left: `${bookingDefinition.left}%`, width: `${bookingDefinition.width}%` }}
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-[10px] font-black uppercase tracking-[0.18em]">
                        <T>{bookingDefinition.partySize.slice(0, 2)}</T>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-black leading-none">
                          <T>{bookingDefinition.guest}</T>
                        </p>
                        <p className="mt-1 truncate text-[10px] leading-none opacity-80">
                          <T>{`${bookingDefinition.partySize} · ${bookingDefinition.time} · ${bookingDefinition.duration}`}</T>
                        </p>
                        <p className="mt-1 truncate text-[10px] font-semibold uppercase tracking-[0.16em] opacity-70">
                          <T>{bookingDefinition.note}</T>
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
//-aqui termina componente ScheduleTimelineBoard-//

//-aqui empieza componente ScheduleSidebar y es para mostrar la lectura operativa lateral-//
/**
 * Renderiza los paneles auxiliares de la vista de calendario.
 *
 * @pure
 */
function ScheduleSidebar() {
  return (
    <aside className="space-y-6 lg:w-[360px] lg:shrink-0">
      <section className="relative overflow-hidden rounded-[28px] bg-primary p-8 text-on-primary shadow-sm">
        <div className="relative z-10 space-y-4">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/60">
            <T>Ocupación activa</T>
          </p>
          <div className="flex items-baseline gap-3">
            <span className="text-6xl font-black tracking-tight">74%</span>
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-white/60">
              <T>Hoy</T>
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/15">
            <div className="h-full rounded-full bg-secondary" style={{ width: "74%" }} />
          </div>
          <p className="text-sm leading-7 text-white/75">
            <T>
              El pico de actividad se concentra entre las 19:00 y las 21:00. Conviene reservar margen para grupos grandes y llegadas tardías.
            </T>
          </p>
        </div>
        <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white/5 blur-3xl" />
      </section>

      <section className="rounded-[24px] bg-surface-container-lowest p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <OnboardingIcon name="schedule" className="h-5 w-5 text-secondary" />
          <h3 className="text-lg font-black text-on-surface">
            <T>Próximas llegadas</T>
          </h3>
        </div>
        <div className="mt-6 space-y-4">
          {scheduleArrivalDefinitions.map((arrivalDefinition) => (
            <div className="flex items-center gap-4 group" key={arrivalDefinition.guest}>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-high text-xs font-black text-on-surface-variant">
                {arrivalDefinition.guest
                  .split(" ")
                  .slice(0, 2)
                  .map((word) => word.charAt(0))
                  .join("")}
              </div>
              <div className="flex-1 border-b border-outline-variant/10 pb-3 group-last:border-b-0 group-last:pb-0">
                <p className="text-sm font-bold text-on-surface">
                  <T>{arrivalDefinition.guest}</T>
                </p>
                <p className="mt-1 text-xs text-on-surface-variant">
                  <T>{`${arrivalDefinition.partySize} · ${arrivalDefinition.eta} · ${arrivalDefinition.table}`}</T>
                </p>
              </div>
            </div>
          ))}
        </div>
        <Link className="mt-5 inline-flex items-center gap-1 text-xs font-black uppercase tracking-[0.2em] text-primary transition-colors hover:text-secondary" href="/dashboard/reservations">
          <T>Ver lista completa</T>
          <span aria-hidden="true">›</span>
        </Link>
      </section>

      {scheduleActionDefinitions.map((actionDefinition) => (
        <section className="rounded-[24px] border border-outline-variant/10 bg-surface-container-lowest p-6 shadow-sm" key={actionDefinition.title}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary-container text-on-secondary-container">
              <OnboardingIcon name={actionDefinition.icon} className="h-5 w-5" />
            </div>
            <h3 className="text-base font-black text-primary">
              <T>{actionDefinition.title}</T>
            </h3>
          </div>
          <p className="mt-4 text-sm leading-7 text-on-surface-variant">
            <T>{actionDefinition.description}</T>
          </p>
          <button className="mt-5 w-full rounded-lg bg-primary px-4 py-3 text-sm font-bold text-on-primary transition-opacity hover:opacity-90" type="button">
            <T>{actionDefinition.buttonLabel}</T>
          </button>
        </section>
      ))}
    </aside>
  );
}
//-aqui termina componente ScheduleSidebar-//

//-aqui empieza pagina SchedulePage y es para montar la vista de calendario del dashboard-//
/**
 * Presenta la pantalla de agenda y calendario del restaurante.
 */
export default function SchedulePage() {
  return (
    <>
      <ScheduleToolbar />
      <ScheduleModeSwitch />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {scheduleMetricDefinitions.map((metricDefinition) => (
          <ScheduleMetricCard
            caption={metricDefinition.caption}
            key={metricDefinition.label}
            label={metricDefinition.label}
            tone={metricDefinition.tone}
            value={metricDefinition.value}
          />
        ))}
      </section>

      <section className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1 space-y-6">
          <ScheduleTimelineBoard />
        </div>
        <ScheduleSidebar />
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <article className="rounded-[24px] bg-surface-container-lowest p-8 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
            <T>Plan del turno</T>
          </p>
          <h3 className="mt-3 text-2xl font-black tracking-tight text-primary">
            <T>La vista prioriza claridad operativa.</T>
          </h3>
          <p className="mt-4 text-sm leading-7 text-on-surface-variant">
            <T>
              La agenda debe servir a recepción, sala y gerencia al mismo tiempo. Por eso la información está agrupada por mesa, franja y próxima acción.
            </T>
          </p>
        </article>

        <article className="rounded-[24px] bg-surface-container-lowest p-8 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
            <T>Acceso rápido</T>
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link className="inline-flex items-center gap-2 rounded-lg bg-surface-container-highest px-4 py-3 text-sm font-bold text-on-surface transition-colors hover:bg-surface-container-high" href="/dashboard/reservations">
              <OnboardingIcon name="schedule" className="h-4 w-4 text-secondary" />
              <T>Reservas</T>
            </Link>
            <Link className="inline-flex items-center gap-2 rounded-lg bg-surface-container-highest px-4 py-3 text-sm font-bold text-on-surface transition-colors hover:bg-surface-container-high" href="/dashboard/tables">
              <OnboardingIcon name="gridView" className="h-4 w-4 text-secondary" />
              <T>Mesas</T>
            </Link>
            <button className="inline-flex items-center gap-2 rounded-lg bg-surface-container-highest px-4 py-3 text-sm font-bold text-on-surface transition-colors hover:bg-surface-container-high" type="button">
              <OnboardingIcon name="contentCopy" className="h-4 w-4 text-secondary" />
              <T>Exportar agenda</T>
            </button>
          </div>
        </article>
      </section>
    </>
  );
}
//-aqui termina pagina SchedulePage-//
