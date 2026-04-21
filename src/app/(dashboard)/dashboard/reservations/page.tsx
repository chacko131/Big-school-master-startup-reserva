/**
 * Archivo: page.tsx
 * Responsabilidad: Renderizar el listado operativo de reservas del restaurante dentro del dashboard.
 * Tipo: UI
 */

import Link from "next/link";
import { T } from "@/components/T";
import { OnboardingIcon } from "@/components/onboarding/OnboardingIcon";

type ReservationStatusTone = "confirmed" | "arriving" | "checkedIn" | "cancelled" | "noShow";

interface ReservationMetricDefinition {
  label: string;
  value: string;
  caption: string;
  tone: "primary" | "secondary" | "surface" | "warning";
}

interface ReservationDefinition {
  guest: string;
  guestType: string;
  partySize: string;
  time: string;
  table: string;
  status: string;
  statusTone: ReservationStatusTone;
}

interface OccupancyZoneDefinition {
  label: string;
  occupancy: string;
}

interface OperationalAlertDefinition {
  title: string;
  description: string;
  tone: "warning" | "success";
}

const reservationMetricDefinitions: ReadonlyArray<ReservationMetricDefinition> = [
  {
    label: "Reservas de hoy",
    value: "48",
    caption: "+12% vs viernes pasado",
    tone: "primary",
  },
  {
    label: "Mesas activas",
    value: "14 / 24",
    caption: "58% de ocupación",
    tone: "surface",
  },
  {
    label: "Clientes previstos",
    value: "164",
    caption: "pico estimado 20:00",
    tone: "secondary",
  },
  {
    label: "No-shows",
    value: "3",
    caption: "marcados para revisión",
    tone: "warning",
  },
] as const;

const reservationDefinitions: ReadonlyArray<ReservationDefinition> = [
  {
    guest: "Elena Rodriguez",
    guestType: "Cliente habitual",
    partySize: "4 personas",
    time: "19:30",
    table: "Mesa 12",
    status: "Confirmada",
    statusTone: "confirmed",
  },
  {
    guest: "Marcus Chen",
    guestType: "Nuevo cliente",
    partySize: "2 personas",
    time: "19:45",
    table: "Barra 04",
    status: "Llegando pronto",
    statusTone: "arriving",
  },
  {
    guest: "Sarah Jenkins",
    guestType: "VIP · Aniversario",
    partySize: "6 personas",
    time: "20:15",
    table: "Mesa 22",
    status: "No-show",
    statusTone: "noShow",
  },
  {
    guest: "Jonathan White",
    guestType: "Cliente habitual",
    partySize: "3 personas",
    time: "20:30",
    table: "Mesa 08",
    status: "Confirmada",
    statusTone: "confirmed",
  },
  {
    guest: "David Miller",
    guestType: "Nuevo cliente",
    partySize: "2 personas",
    time: "21:00",
    table: "Ventana 02",
    status: "Cancelada",
    statusTone: "cancelled",
  },
] as const;

const occupancyZoneDefinitions: ReadonlyArray<OccupancyZoneDefinition> = [
  {
    label: "Salón principal",
    occupancy: "10 / 12",
  },
  {
    label: "Terraza",
    occupancy: "4 / 8",
  },
  {
    label: "Lounge privado",
    occupancy: "0 / 4",
  },
] as const;

const operationalAlertDefinitions: ReadonlyArray<OperationalAlertDefinition> = [
  {
    title: "Grupos grandes esta noche",
    description: "2 grupos de 10+ personas están programados para las 20:30. Conviene reforzar el servicio.",
    tone: "warning",
  },
  {
    title: "Cumpleaños VIP",
    description: "La mesa 12 celebra aniversario y ya quedó preparada la atención especial.",
    tone: "success",
  },
] as const;

const pacingBars = [20, 45, 85, 100, 90, 60, 30] as const;
const pacingLabels = ["17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"] as const;

//-aqui empieza componente ReservationMetricCard y es para presentar las cifras principales de reservas-//
/**
 * Renderiza una tarjeta de métrica del listado de reservas.
 *
 * @pure
 */
function ReservationMetricCard({ label, value, caption, tone }: ReservationMetricDefinition) {
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
//-aqui termina componente ReservationMetricCard-//

//-aqui empieza componente ReservationsToolbar y es para ofrecer filtros rapidos de agenda-//
/**
 * Renderiza la barra de acciones y filtros del listado.
 *
 * @pure
 */
function ReservationsToolbar() {
  return (
    <section className="flex flex-wrap items-center gap-4 rounded-2xl bg-surface-container-low p-4 shadow-sm">
      <div className="flex min-w-[240px] flex-1 items-center gap-3 rounded-lg bg-surface-container-lowest px-4 py-2.5">
        <OnboardingIcon name="schedule" className="h-5 w-5 text-on-surface-variant" />
        <span className="text-sm font-semibold text-on-surface">
          <T>Hoy, 24 oct</T>
        </span>
        <span className="material-symbols-outlined ml-auto text-sm text-on-surface-variant" aria-hidden="true">
          expand_more
        </span>
      </div>

      <div className="flex min-w-[160px] items-center gap-3 rounded-lg bg-surface-container-lowest px-4 py-2.5">
        <span className="text-sm font-medium text-on-surface-variant">
          <T>Estado:</T>
        </span>
        <span className="text-sm font-semibold text-on-surface">
          <T>Todos</T>
        </span>
        <span className="material-symbols-outlined ml-auto text-sm text-on-surface-variant" aria-hidden="true">
          expand_more
        </span>
      </div>

      <div className="flex min-w-[140px] items-center gap-3 rounded-lg bg-surface-container-lowest px-4 py-2.5">
        <span className="text-sm font-medium text-on-surface-variant">
          <T>Mesa:</T>
        </span>
        <span className="text-sm font-semibold text-on-surface">
          <T>Cualquiera</T>
        </span>
        <span className="material-symbols-outlined ml-auto text-sm text-on-surface-variant" aria-hidden="true">
          expand_more
        </span>
      </div>

      <div className="ml-auto flex gap-2">
        <button className="rounded-lg bg-surface-container-lowest p-2.5 transition-colors hover:bg-surface-container-high" type="button" aria-label="Filtrar">
          <OnboardingIcon name="settings" className="h-5 w-5 text-on-surface-variant" />
        </button>
        <button className="rounded-lg bg-surface-container-lowest p-2.5 transition-colors hover:bg-surface-container-high" type="button" aria-label="Exportar">
          <OnboardingIcon name="contentCopy" className="h-5 w-5 text-on-surface-variant" />
        </button>
      </div>
    </section>
  );
}
//-aqui termina componente ReservationsToolbar-//

//-aqui empieza componente ReservationsLedger y es para mostrar la tabla principal de reservas-//
/**
 * Renderiza el listado operativo de reservas.
 *
 * @pure
 */
function ReservationsLedger() {
  return (
    <section className="overflow-hidden rounded-2xl border border-outline-variant/10 bg-surface-container-lowest shadow-sm">
      <div className="flex items-center justify-between gap-4 border-b border-outline-variant/10 px-6 py-5">
        <div>
          <h3 className="text-lg font-bold tracking-tight text-primary md:text-xl">
            <T>Reservas próximas</T>
          </h3>
          <p className="mt-1 text-sm text-on-surface-variant">
            <T>Gestiona la afluencia del servicio y revisa el estado de cada reserva.</T>
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-on-primary transition-opacity hover:opacity-90" type="button">
          <OnboardingIcon name="checkCircle" className="h-4 w-4" />
          <T>Nueva reserva</T>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead className="bg-surface-container-low">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                <T>Invitado</T>
              </th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                <T>Party</T>
              </th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                <T>Hora</T>
              </th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                <T>Mesa</T>
              </th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                <T>Estado</T>
              </th>
              <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                <T>Acciones</T>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {reservationDefinitions.map((reservationDefinition) => {
              const statusClassName =
                reservationDefinition.statusTone === "confirmed"
                  ? "bg-secondary-container text-on-secondary-container"
                  : reservationDefinition.statusTone === "arriving"
                    ? "bg-tertiary-fixed text-on-tertiary-fixed"
                    : reservationDefinition.statusTone === "checkedIn"
                      ? "bg-zinc-100 text-zinc-700"
                      : reservationDefinition.statusTone === "cancelled"
                        ? "bg-error-container text-on-error-container"
                        : "bg-surface-container-highest text-on-surface-variant";

              return (
                <tr className="transition-colors hover:bg-surface-container-high" key={`${reservationDefinition.guest}-${reservationDefinition.time}`}>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-high text-[10px] font-black text-on-surface-variant">
                        {reservationDefinition.guest
                          .split(" ")
                          .slice(0, 2)
                          .map((word) => word.charAt(0))
                          .join("")}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-on-surface">
                          <T>{reservationDefinition.guest}</T>
                        </p>
                        <p className="text-xs text-on-surface-variant">
                          <T>{reservationDefinition.guestType}</T>
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm font-medium text-on-surface">
                    <T>{reservationDefinition.partySize}</T>
                  </td>
                  <td className="px-6 py-5 text-sm font-medium text-on-surface">
                    <span className="inline-flex rounded-md bg-surface-container-high px-2.5 py-1 text-sm font-bold text-on-surface">
                      <T>{reservationDefinition.time}</T>
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm font-medium text-on-surface">
                    <T>{reservationDefinition.table}</T>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${statusClassName}`}>
                      <T>{reservationDefinition.status}</T>
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="text-xl leading-none text-on-surface-variant transition-colors hover:text-primary" type="button" aria-label="Más acciones">
                      ⋯
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-outline-variant/10 bg-surface-container-low px-6 py-4">
        <p className="text-xs font-medium text-on-surface-variant">
          <T>Mostrando 5 de 48 reservas</T>
        </p>
        <div className="flex gap-2">
          <button className="rounded-lg p-2 transition-colors hover:bg-surface-container-high disabled:cursor-not-allowed disabled:opacity-30" type="button" disabled>
            <span className="material-symbols-outlined text-sm" aria-hidden="true">
              chevron_left
            </span>
          </button>
          <button className="rounded-lg p-2 transition-colors hover:bg-surface-container-high" type="button">
            <span className="material-symbols-outlined text-sm" aria-hidden="true">
              chevron_right
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
//-aqui termina componente ReservationsLedger-//

//-aqui empieza componente ReservationsPacingPanel y es para mostrar el ritmo del servicio-//
/**
 * Renderiza el panel de ritmo de servicio.
 *
 * @pure
 */
function ReservationsPacingPanel() {
  return (
    <section className="rounded-2xl bg-surface-container-lowest p-8 shadow-sm">
      <div className="flex items-center gap-2">
        <OnboardingIcon name="schedule" className="h-5 w-5 text-secondary" />
        <h3 className="text-lg font-bold text-on-surface">
          <T>Ritmo de hoy</T>
        </h3>
      </div>
      <div className="mt-6 flex h-40 items-end gap-2">
        {pacingBars.map((barHeight, index) => (
          <div className="flex-1" key={pacingLabels[index]}>
            <div className="rounded-t-lg bg-surface-container-high" style={{ height: `${barHeight}%` }} />
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-between text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
        {pacingLabels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <p className="mt-5 text-sm leading-7 text-on-surface-variant">
        <T>El pico de ocupación se concentra entre las 19:00 y las 21:00. Reforzar la sala puede mejorar la rotación.</T>
      </p>
    </section>
  );
}
//-aqui termina componente ReservationsPacingPanel-//

//-aqui empieza componente ReservationsOccupancyPanel y es para resumir la capacidad de la sala-//
/**
 * Renderiza el resumen de ocupación del restaurante.
 *
 * @pure
 */
function ReservationsOccupancyPanel() {
  return (
    <section className="rounded-2xl bg-primary p-8 text-on-primary shadow-sm">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/60">
        <T>Ocupación activa</T>
      </p>
      <div className="mt-8 flex items-baseline">
        <span className="text-6xl font-black tracking-tight">92%</span>
        <span className="ml-3 text-sm font-bold uppercase tracking-[0.2em] text-white/60">
          <T>Próximas 2 horas</T>
        </span>
      </div>
      <div className="mt-8 space-y-4">
        {occupancyZoneDefinitions.map((zoneDefinition) => (
          <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3 last:border-b-0 last:pb-0" key={zoneDefinition.label}>
            <span className="text-sm text-white/85">
              <T>{zoneDefinition.label}</T>
            </span>
            <span className="text-sm font-bold text-white">
              <T>{zoneDefinition.occupancy}</T>
            </span>
          </div>
        ))}
      </div>
      <p className="mt-8 text-xs font-medium leading-relaxed text-white/70">
        <T>Alerta de demanda alta: 4 grupos están esperando disponibilidad sin asignación.</T>
      </p>
    </section>
  );
}
//-aqui termina componente ReservationsOccupancyPanel-//

//-aqui empieza componente ReservationsAlertStack y es para mostrar las alertas operativas-//
/**
 * Renderiza el panel de alertas operativas.
 *
 * @pure
 */
function ReservationsAlertStack() {
  return (
    <section className="space-y-4">
      <h3 className="px-2 text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
        <T>Alertas operativas</T>
      </h3>

      {operationalAlertDefinitions.map((alertDefinition) => {
        const alertClassName = alertDefinition.tone === "warning" ? "bg-tertiary-fixed text-on-tertiary-fixed" : "bg-secondary-fixed text-on-secondary-fixed";
        const titleClassName = alertDefinition.tone === "warning" ? "text-on-tertiary-fixed" : "text-on-secondary-fixed";
        const descriptionClassName = alertDefinition.tone === "warning" ? "text-on-tertiary-fixed-variant" : "text-on-secondary-fixed-variant";

        return (
          <article className={`rounded-xl border-l-4 p-5 shadow-sm ${alertClassName}`} key={alertDefinition.title}>
            <div className="flex gap-4">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/40 text-sm font-black">
                {alertDefinition.tone === "warning" ? "!" : "✓"}
              </div>
              <div>
                <p className={`text-sm font-bold ${titleClassName}`}>
                  <T>{alertDefinition.title}</T>
                </p>
                <p className={`mt-1 text-xs leading-relaxed ${descriptionClassName}`}>
                  <T>{alertDefinition.description}</T>
                </p>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
//-aqui termina componente ReservationsAlertStack-//

//-aqui empieza pagina ReservationsPage y es para mostrar la vista operativa de reservas-//
/**
 * Presenta el listado operativo de reservas del día.
 */
export default function ReservationsPage() {
  return (
    <>
      <section className="flex flex-col gap-6 rounded-[28px] bg-surface-container-lowest p-8 shadow-sm md:flex-row md:items-end md:justify-between md:p-10">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
            <T>Reservas del restaurante</T>
          </p>
          <h2 className="mt-4 text-5xl font-black tracking-tighter text-primary md:text-6xl">
            <T>Gestiona el flujo de invitados de hoy.</T>
          </h2>
          <p className="mt-4 max-w-xl text-on-surface-variant md:text-lg md:leading-8">
            <T>
              Revisa las reservas activas, anticipa la ocupación y resuelve incidencias antes de que lleguen al salón.
            </T>
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-surface-container-highest px-6 py-2.5 text-sm font-bold text-on-surface transition-colors hover:bg-surface-container-high" type="button">
            <OnboardingIcon name="contentCopy" className="h-4 w-4" />
            <T>Exportar lista</T>
          </button>
          <Link className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-on-primary transition-colors hover:opacity-90" href="/dashboard/reservations/new">
            <OnboardingIcon name="checkCircle" className="h-4 w-4" />
            <T>Nueva reserva</T>
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {reservationMetricDefinitions.map((metricDefinition) => (
          <ReservationMetricCard
            caption={metricDefinition.caption}
            key={metricDefinition.label}
            label={metricDefinition.label}
            tone={metricDefinition.tone}
            value={metricDefinition.value}
          />
        ))}
      </section>

      <ReservationsToolbar />

      <section className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <ReservationsLedger />
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <ReservationsPacingPanel />
          <ReservationsOccupancyPanel />
          <ReservationsAlertStack />
        </div>
      </section>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <section className="rounded-2xl bg-surface-container-lowest p-8 shadow-sm md:col-span-2">
          <h3 className="text-lg font-bold text-on-surface">
            <T>Actividad reciente</T>
          </h3>
          <div className="mt-6 space-y-4">
            {reservationDefinitions.slice(0, 3).map((reservationDefinition) => (
              <div className="flex items-start gap-4" key={`${reservationDefinition.guest}-${reservationDefinition.status}`}>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-high text-xs font-black text-on-surface-variant">
                  {reservationDefinition.guest
                    .split(" ")
                    .slice(0, 2)
                    .map((word) => word.charAt(0))
                    .join("")}
                </div>
                <div>
                  <p className="text-sm font-bold text-primary">
                    <T>{reservationDefinition.guest}</T>
                  </p>
                  <p className="mt-1 text-sm leading-6 text-on-surface-variant">
                    <T>{`${reservationDefinition.status} · ${reservationDefinition.time} · ${reservationDefinition.table}`}</T>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="relative flex h-48 items-end overflow-hidden rounded-2xl shadow-lg">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.25),transparent_45%),linear-gradient(135deg,#121212_0%,#000000_60%,#1f1f1f_100%)]" />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent" />
          <div className="relative z-10 w-full border-t border-white/20 bg-white/10 p-6 backdrop-blur-sm">
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.22em] text-white/70">
              <T>Especial de cocina</T>
            </p>
            <h4 className="text-lg font-bold text-white">
              <T>Tomahawk madurado</T>
            </h4>
            <p className="mt-1 text-xs text-white/70">
              <T>8 porciones restantes para el servicio</T>
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
//-aqui termina pagina ReservationsPage-
