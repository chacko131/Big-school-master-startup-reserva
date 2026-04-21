/**
 * Archivo: page.tsx
 * Responsabilidad: Renderizar el reporte diario operativo del restaurante dentro del dashboard.
 * Tipo: UI
 */

import Link from "next/link";
import { T } from "@/components/T";

interface DashboardMetricDefinition {
  label: string;
  value: string;
  caption: string;
  tone: "primary" | "secondary" | "surface" | "warning";
  progress?: number;
}

interface DashboardReservationDefinition {
  guest: string;
  time: string;
  covers: string;
  status: string;
  statusTone: "confirmed" | "warning" | "pending";
}

interface DashboardFloorZoneDefinition {
  label: string;
  occupancy: string;
}

interface DashboardAlertDefinition {
  title: string;
  description: string;
  tone: "warning" | "success";
}

const dashboardMetricDefinitions: ReadonlyArray<DashboardMetricDefinition> = [
  {
    label: "Reservas hoy",
    value: "48",
    caption: "+12% vs viernes pasado",
    tone: "primary",
  },
  {
    label: "Mesas activas",
    value: "14 / 24",
    caption: "58% de ocupación",
    tone: "surface",
    progress: 58,
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

const dashboardReservationDefinitions: ReadonlyArray<DashboardReservationDefinition> = [
  {
    guest: "Ricardo Montaner",
    time: "19:30",
    covers: "4",
    status: "Confirmada",
    statusTone: "confirmed",
  },
  {
    guest: "Sofía Castillo",
    time: "19:45",
    covers: "2",
    status: "Llegando pronto",
    statusTone: "warning",
  },
  {
    guest: "Elena López",
    time: "20:00",
    covers: "8",
    status: "Confirmada",
    statusTone: "confirmed",
  },
  {
    guest: "Juan Pablo",
    time: "20:15",
    covers: "4",
    status: "Pendiente",
    statusTone: "pending",
  },
] as const;

const dashboardFloorZoneDefinitions: ReadonlyArray<DashboardFloorZoneDefinition> = [
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

const dashboardAlertDefinitions: ReadonlyArray<DashboardAlertDefinition> = [
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

//-aqui empieza componente DashboardMetricCard y es para presentar los indicadores diarios del panel-//
/**
 * Renderiza una tarjeta de métrica del reporte diario.
 *
 * @pure
 */
function DashboardMetricCard({ label, value, caption, tone, progress }: DashboardMetricDefinition) {
  const containerClassName =
    tone === "primary"
      ? "bg-primary text-on-primary"
      : tone === "secondary"
        ? "bg-secondary-container text-on-secondary-container"
        : tone === "warning"
          ? "bg-tertiary-fixed text-on-tertiary-fixed"
          : "bg-surface-container-lowest text-on-surface";
  const labelClassName = tone === "primary" ? "text-white/70" : tone === "secondary" ? "text-on-secondary-container/75" : tone === "warning" ? "text-on-tertiary-fixed/75" : "text-on-surface-variant";
  const progressTrackClassName = tone === "primary" ? "bg-white/20" : tone === "secondary" ? "bg-on-secondary-container/10" : tone === "warning" ? "bg-on-tertiary-fixed/10" : "bg-outline-variant/30";
  const progressFillClassName = tone === "primary" ? "bg-white" : tone === "secondary" ? "bg-on-secondary-container" : tone === "warning" ? "bg-on-tertiary-fixed" : "bg-primary";
  const clampedProgress = typeof progress === "number" ? Math.min(100, Math.max(0, Number(progress))) : null;

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
      {clampedProgress !== null ? (
        <div className={`mt-5 h-1.5 w-full overflow-hidden rounded-full ${progressTrackClassName}`} role="progressbar" aria-valuenow={clampedProgress} aria-valuemin={0} aria-valuemax={100} aria-label={`${clampedProgress}%`}>
          <div className={`h-full rounded-full ${progressFillClassName}`} style={{ width: `${clampedProgress}%` }} />
        </div>
      ) : null}
    </article>
  );
}
//-aqui termina componente DashboardMetricCard-//

//-aqui empieza componente DashboardReservationsTable y es para mostrar la agenda del servicio-//
/**
 * Renderiza la tabla de reservas próximas.
 *
 * @pure
 */
function DashboardReservationsTable() {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-4 px-2">
        <h3 className="text-xl font-bold tracking-tight text-primary md:text-2xl">
          <T>Próximas reservas</T>
        </h3>
        <Link className="inline-flex items-center gap-1 text-sm font-bold text-on-surface-variant transition-colors hover:text-primary" href="/dashboard/reservations">
          <T>Ver todo</T>
          <span aria-hidden="true">›</span>
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm">
        <table className="w-full border-collapse text-left">
          <thead className="bg-surface-container-low">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                <T>Invitado</T>
              </th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                <T>Hora</T>
              </th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                <T>Comensales</T>
              </th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                <T>Estado</T>
              </th>
              <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                <T>Acción</T>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {dashboardReservationDefinitions.map((reservationDefinition) => {
              const statusClassName =
                reservationDefinition.statusTone === "confirmed"
                  ? "bg-secondary-container text-on-secondary-container"
                  : reservationDefinition.statusTone === "warning"
                    ? "bg-tertiary-fixed text-on-tertiary-fixed"
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
                      <p className="text-sm font-bold text-on-surface">
                        <T>{reservationDefinition.guest}</T>
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm font-medium text-on-surface">
                    <T>{reservationDefinition.time}</T>
                  </td>
                  <td className="px-6 py-5 text-sm font-medium text-on-surface">
                    <T>{reservationDefinition.covers}</T>
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
    </section>
  );
}
//-aqui termina componente DashboardReservationsTable-//

//-aqui empieza componente DashboardFloorSummary y es para mostrar el estado de la sala-//
/**
 * Renderiza el resumen operativo de la sala.
 *
 * @pure
 */
function DashboardFloorSummary() {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-primary p-8 text-on-primary shadow-sm">
      <div className="relative z-10">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/60">
          <T>Sala activa</T>
        </p>
        <div className="mt-8 flex items-baseline">
          <span className="text-6xl font-black tracking-tight">58%</span>
          <span className="ml-3 text-sm font-bold uppercase tracking-[0.2em] text-white/60">
            <T>Capacidad</T>
          </span>
        </div>

        <div className="mt-8 space-y-4">
          {dashboardFloorZoneDefinitions.map((zoneDefinition) => (
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
      </div>

      <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white/5 blur-3xl" />
    </section>
  );
}
//-aqui termina componente DashboardFloorSummary-//

//-aqui empieza componente DashboardAlertStack y es para advertencias operativas del dia-//
/**
 * Renderiza el bloque de alertas operativas.
 *
 * @pure
 */
function DashboardAlertStack() {
  return (
    <section className="space-y-4">
      <h3 className="px-2 text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
        <T>Alertas operativas</T>
      </h3>

      {dashboardAlertDefinitions.map((alertDefinition) => {
        const alertClassName =
          alertDefinition.tone === "warning"
            ? "bg-tertiary-fixed text-on-tertiary-fixed"
            : "bg-secondary-fixed text-on-secondary-fixed";
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
//-aqui termina componente DashboardAlertStack-//

//-aqui empieza componente DashboardPromoCard y es para resaltar el especial de cocina-//
/**
 * Renderiza la tarjeta promocional de cocina del día.
 *
 * @pure
 */
function DashboardPromoCard() {
  return (
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
  );
}
//-aqui termina componente DashboardPromoCard-//

//-aqui empieza pagina DashboardHomePage y es para mostrar el reporte diario del restaurante-//
/**
 * Presenta el reporte diario del restaurante dentro del dashboard.
 */
export default function DashboardHomePage() {
  return (
    <>
      <section className="flex flex-col gap-6 rounded-[28px] bg-surface-container-lowest p-8 shadow-sm md:flex-row md:items-end md:justify-between md:p-10">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
            <T>Buenos días, Mateo.</T>
          </p>
          <h2 className="mt-4 text-5xl font-black tracking-tighter text-primary md:text-6xl">
            <T>El servicio de hoy está en marcha.</T>
          </h2>
          <p className="mt-4 max-w-xl text-on-surface-variant md:text-lg md:leading-8">
            <T>
              La sala tiene 12 reservas por atender durante el almuerzo. La cocina se mantiene estable y el ritmo operativo va por buen camino.
            </T>
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button className="inline-flex items-center justify-center rounded-lg bg-surface-container-highest px-6 py-2.5 text-sm font-bold text-on-surface transition-colors hover:bg-surface-container-high" type="button">
            <T>Exportar reporte</T>
          </button>
          <Link className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-on-primary transition-colors hover:opacity-90" href="/dashboard/tables">
            <T>Vista de sala</T>
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardMetricDefinitions.map((metricDefinition) => (
          <DashboardMetricCard
            caption={metricDefinition.caption}
            key={metricDefinition.label}
            label={metricDefinition.label}
            progress={metricDefinition.progress}
            tone={metricDefinition.tone}
            value={metricDefinition.value}
          />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <DashboardReservationsTable />
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <DashboardFloorSummary />
          <DashboardAlertStack />
          <DashboardPromoCard />
        </div>
      </section>

      <button className="fixed bottom-8 right-8 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-3xl font-black text-on-primary shadow-2xl transition-transform hover:scale-105" type="button" aria-label="Nueva acción">
        +
      </button>
    </>
  );
}
//-aqui termina pagina DashboardHomePage-
//
