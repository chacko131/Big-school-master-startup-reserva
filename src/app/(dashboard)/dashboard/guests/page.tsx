/**
 * Archivo: page.tsx
 * Responsabilidad: Renderizar la vista CRM de clientes del dashboard.
 * Tipo: UI
 */

import Link from "next/link";
import { T } from "@/components/T";
import { OnboardingIcon } from "@/components/onboarding/OnboardingIcon";
import type { OnboardingIconName } from "@/types/onboarding";

interface GuestMetricDefinition {
  label: string;
  value: string;
  caption: string;
  tone: "primary" | "secondary" | "surface" | "warning";
}

interface GuestDefinition {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastVisit: string;
  totalReservations: string;
  noShows: string;
  loyalty: string;
  status: string;
  statusTone: "primary" | "secondary" | "warning" | "surface";
  notes: string;
  tags: ReadonlyArray<string>;
}

interface GuestSegmentDefinition {
  label: string;
  description: string;
  value: string;
  tone: "primary" | "secondary" | "warning";
}

interface GuestActivityDefinition {
  time: string;
  title: string;
  description: string;
  icon: OnboardingIconName;
}

interface GuestInsightDefinition {
  title: string;
  value: string;
  description: string;
}

const guestMetricDefinitions: ReadonlyArray<GuestMetricDefinition> = [
  {
    label: "Clientes activos",
    value: "284",
    caption: "Con historial reciente de reserva",
    tone: "primary",
  },
  {
    label: "VIP identificados",
    value: "38",
    caption: "Con notas y preferencias guardadas",
    tone: "secondary",
  },
  {
    label: "No-shows",
    value: "7",
    caption: "Marcados para seguimiento manual",
    tone: "warning",
  },
  {
    label: "Valor medio",
    value: "$146",
    caption: "Ticket promedio por huésped",
    tone: "surface",
  },
] as const;

const guestSegmentDefinitions: ReadonlyArray<GuestSegmentDefinition> = [
  {
    label: "VIP recurrentes",
    description: "Clientes con atención preferente y preferencias guardadas.",
    value: "38",
    tone: "primary",
  },
  {
    label: "Habituales",
    description: "Huéspedes con al menos tres reservas en los últimos 90 días.",
    value: "112",
    tone: "secondary",
  },
  {
    label: "Seguimiento crítico",
    description: "Clientes con cancelaciones o ausencias recientes.",
    value: "9",
    tone: "warning",
  },
] as const;

const guestDefinitions: ReadonlyArray<GuestDefinition> = [
  {
    id: "guest-01",
    name: "Camila Soto",
    email: "camila.soto@email.com",
    phone: "+34 600 123 111",
    lastVisit: "Ayer · 20:00",
    totalReservations: "12",
    noShows: "0",
    loyalty: "VIP",
    status: "Activa",
    statusTone: "secondary",
    notes: "Prefiere mesa junto a ventana y vino blanco frío.",
    tags: ["VIP", "Vino", "Ventana"],
  },
  {
    id: "guest-02",
    name: "Ricardo Montaner",
    email: "ricardo.montaner@email.com",
    phone: "+34 600 123 222",
    lastVisit: "Hace 2 días · 19:30",
    totalReservations: "8",
    noShows: "1",
    loyalty: "Frecuente",
    status: "Seguimiento",
    statusTone: "warning",
    notes: "Suele reservar para grupos y prefiere confirmación anticipada.",
    tags: ["Grupo", "Confirmación", "Cena"],
  },
  {
    id: "guest-03",
    name: "Elena López",
    email: "elena.lopez@email.com",
    phone: "+34 600 123 333",
    lastVisit: "Esta semana · 21:00",
    totalReservations: "5",
    noShows: "0",
    loyalty: "Nueva VIP",
    status: "Activa",
    statusTone: "primary",
    notes: "Quiere celebrar aniversarios y cumpleaños en lounge privado.",
    tags: ["Celebración", "Lounge", "Aniversario"],
  },
  {
    id: "guest-04",
    name: "Fernando Herrera",
    email: "fernando.herrera@email.com",
    phone: "+34 600 123 444",
    lastVisit: "Hace 12 días · 20:45",
    totalReservations: "3",
    noShows: "2",
    loyalty: "En riesgo",
    status: "Atención",
    statusTone: "warning",
    notes: "Necesita contacto manual antes de las próximas confirmaciones.",
    tags: ["No-show", "Llamada", "Manual"],
  },
  {
    id: "guest-05",
    name: "Juan Pablo",
    email: "juan.pablo@email.com",
    phone: "+34 600 123 555",
    lastVisit: "Hace 20 días · 20:15",
    totalReservations: "2",
    noShows: "0",
    loyalty: "Ocasional",
    status: "Activa",
    statusTone: "surface",
    notes: "Le interesa la terraza y el servicio temprano.",
    tags: ["Terraza", "Temprano", "Brunch"],
  },
] as const;

const guestActivityDefinitions: ReadonlyArray<GuestActivityDefinition> = [
  {
    time: "10:40",
    title: "Nota VIP añadida",
    description: "Camila Soto pidió mantener mesa de ventana para su próxima visita.",
    icon: "person",
  },
  {
    time: "11:15",
    title: "Seguimiento de no-show",
    description: "Fernando Herrera quedó en revisión manual antes del servicio de noche.",
    icon: "schedule",
  },
  {
    time: "12:05",
    title: "Campaña preparada",
    description: "Se dejó listo un recordatorio para clientes que celebran aniversarios.",
    icon: "contentCopy",
  },
] as const;

const guestInsightDefinitions: ReadonlyArray<GuestInsightDefinition> = [
  {
    title: "Retención estimada",
    value: "82%",
    description: "Clientes con probabilidad alta de repetir en 30 días.",
  },
  {
    title: "Tickets VIP",
    value: "24",
    description: "Reservas de alto valor con notas operativas activas.",
  },
  {
    title: "Alertas de seguimiento",
    value: "9",
    description: "Casos con cancelaciones, retrasos o ausencias recientes.",
  },
] as const;

const guestActionDefinitions: ReadonlyArray<{ title: string; description: string; buttonLabel: string; icon: OnboardingIconName }> = [
  {
    title: "Registrar nota",
    description: "Documenta preferencias, alergias o comentarios relevantes para el próximo servicio.",
    buttonLabel: "Añadir nota",
    icon: "contentCopy",
  },
  {
    title: "Crear campaña",
    description: "Prepara una acción de fidelización para cumpleaños, aniversarios o clientes dormidos.",
    buttonLabel: "Lanzar campaña",
    icon: "rocketLaunch",
  },
] as const;

//-aqui empieza funcion getGuestStatusToneClassName y es para pintar las etiquetas del CRM-//
/**
 * Devuelve las clases visuales del estado de cada cliente.
 *
 * @pure
 */
function getGuestStatusToneClassName(statusTone: GuestDefinition["statusTone"]): string {
  if (statusTone === "primary") {
    return "bg-primary text-on-primary";
  }

  if (statusTone === "warning") {
    return "bg-tertiary-fixed text-on-tertiary-fixed";
  }

  if (statusTone === "secondary") {
    return "bg-secondary-container text-on-secondary-container";
  }

  return "bg-surface-container-highest text-on-surface-variant";
}
//-aqui termina funcion getGuestStatusToneClassName-//

//-aqui empieza componente GuestMetricCard y es para presentar las métricas principales del CRM-//
/**
 * Renderiza una tarjeta de métrica del CRM de clientes.
 *
 * @pure
 */
function GuestMetricCard({ label, value, caption, tone }: GuestMetricDefinition) {
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
//-aqui termina componente GuestMetricCard-//

//-aqui empieza componente GuestsToolbar y es para buscar y filtrar clientes-//
/**
 * Renderiza la barra superior de filtros del CRM.
 *
 * @pure
 */
function GuestsToolbar() {
  return (
    <section className="flex flex-col gap-6 rounded-[28px] bg-surface-container-lowest p-8 shadow-sm lg:flex-row lg:items-end lg:justify-between lg:p-10">
      <div className="max-w-2xl space-y-4">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
          <T>CRM de clientes</T>
        </p>
        <h2 className="text-5xl font-black tracking-tighter text-primary lg:text-6xl">
          <T>Conoce a tus clientes y cuida la relación antes del próximo servicio.</T>
        </h2>
        <p className="max-w-xl text-on-surface-variant lg:text-lg lg:leading-8">
          <T>
            Esta vista agrupa historial, preferencias y alertas para que recepción y gerencia puedan actuar rápido sin perder contexto.
          </T>
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-surface-container-highest px-6 py-2.5 text-sm font-bold text-on-surface transition-colors hover:bg-surface-container-high" type="button">
          <OnboardingIcon name="contentCopy" className="h-4 w-4" />
          <T>Exportar CRM</T>
        </button>
        <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-on-primary transition-colors hover:opacity-90" type="button">
          <OnboardingIcon name="person" className="h-4 w-4" />
          <T>Nuevo cliente</T>
        </button>
      </div>
    </section>
  );
}
//-aqui termina componente GuestsToolbar-//

//-aqui empieza componente GuestsMetricsGrid y es para resumir la lectura del CRM-//
/**
 * Renderiza las métricas clave de la base de clientes.
 *
 * @pure
 */
function GuestsMetricsGrid() {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {guestMetricDefinitions.map((metricDefinition) => (
        <GuestMetricCard
          caption={metricDefinition.caption}
          key={metricDefinition.label}
          label={metricDefinition.label}
          tone={metricDefinition.tone}
          value={metricDefinition.value}
        />
      ))}
    </section>
  );
}
//-aqui termina componente GuestsMetricsGrid-//

//-aqui empieza componente GuestsFilterBar y es para ordenar el listado de clientes-//
/**
 * Renderiza la barra de filtros rápidos del CRM.
 *
 * @pure
 */
function GuestsFilterBar() {
  return (
    <section className="flex flex-col gap-4 rounded-2xl bg-surface-container-low p-4 shadow-sm lg:flex-row lg:items-center">
      <div className="flex min-w-[260px] flex-1 items-center gap-3 rounded-lg bg-surface-container-lowest px-4 py-3">
        <OnboardingIcon name="person" className="h-5 w-5 text-on-surface-variant" />
        <span className="text-sm font-semibold text-on-surface">
          <T>Buscar cliente, email o teléfono</T>
        </span>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="rounded-lg bg-surface-container-lowest px-4 py-3 text-sm font-semibold text-on-surface-variant">
          <T>Segmento: VIP</T>
        </div>
        <div className="rounded-lg bg-surface-container-lowest px-4 py-3 text-sm font-semibold text-on-surface-variant">
          <T>Estado: Activos</T>
        </div>
        <div className="rounded-lg bg-surface-container-lowest px-4 py-3 text-sm font-semibold text-on-surface-variant">
          <T>Rango: 90 días</T>
        </div>
      </div>

      <div className="ml-auto flex gap-2">
        <button className="rounded-lg bg-surface-container-lowest p-2.5 transition-colors hover:bg-surface-container-high" type="button" aria-label="Filtros avanzados">
          <OnboardingIcon name="settings" className="h-5 w-5 text-on-surface-variant" />
        </button>
        <button className="rounded-lg bg-surface-container-lowest p-2.5 transition-colors hover:bg-surface-container-high" type="button" aria-label="Actualizar CRM">
          <OnboardingIcon name="schedule" className="h-5 w-5 text-on-surface-variant" />
        </button>
      </div>
    </section>
  );
}
//-aqui termina componente GuestsFilterBar-//

//-aqui empieza componente GuestTableRow y es para representar cada cliente del CRM-//
interface GuestTableRowProps {
  guestDefinition: GuestDefinition;
}

/**
 * Renderiza una fila del CRM con historial, estado y etiquetas.
 *
 * @pure
 */
function GuestTableRow({ guestDefinition }: GuestTableRowProps) {
  const initials = guestDefinition.name
    .split(" ")
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("");

  return (
    <tr className="transition-colors hover:bg-surface-container-high/60">
      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-high text-xs font-black text-on-surface-variant">
            <T>{initials}</T>
          </div>
          <div>
            <p className="text-sm font-bold text-on-surface">
              <T>{guestDefinition.name}</T>
            </p>
            <p className="mt-1 text-xs text-on-surface-variant">
              <T>{guestDefinition.email}</T>
            </p>
          </div>
        </div>
      </td>
      <td className="px-6 py-5 text-sm text-on-surface-variant">
        <T>{guestDefinition.phone}</T>
      </td>
      <td className="px-6 py-5 text-sm font-medium text-on-surface">
        <T>{guestDefinition.lastVisit}</T>
      </td>
      <td className="px-6 py-5 text-sm font-medium text-on-surface">
        <T>{guestDefinition.totalReservations}</T>
      </td>
      <td className="px-6 py-5 text-sm font-medium text-on-surface">
        <T>{guestDefinition.noShows}</T>
      </td>
      <td className="px-6 py-5">
        <div className="flex flex-wrap gap-2">
          {guestDefinition.tags.map((tag) => (
            <span className="rounded-full bg-surface-container-low px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-on-surface-variant" key={`${guestDefinition.id}-${tag}`}>
              <T>{tag}</T>
            </span>
          ))}
        </div>
      </td>
      <td className="px-6 py-5">
        <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${getGuestStatusToneClassName(guestDefinition.statusTone)}`}>
          <T>{guestDefinition.status}</T>
        </span>
      </td>
      <td className="px-6 py-5 text-right">
        <button className="text-xl leading-none text-on-surface-variant transition-colors hover:text-primary" type="button" aria-label="Más acciones">
          ⋯
        </button>
      </td>
    </tr>
  );
}
//-aqui termina componente GuestTableRow-//

//-aqui empieza componente GuestsTable y es para agrupar el listado CRM principal-//
/**
 * Renderiza la tabla principal del CRM de clientes.
 *
 * @pure
 */
function GuestsTable() {
  return (
    <section className="overflow-hidden rounded-[28px] bg-surface-container-lowest shadow-sm">
      <div className="flex items-center justify-between gap-4 border-b border-outline-variant/10 bg-surface-container-low px-6 py-5">
        <div>
          <h3 className="text-lg font-black tracking-tight text-primary lg:text-xl">
            <T>Base de clientes</T>
          </h3>
          <p className="mt-1 text-sm text-on-surface-variant">
            <T>Consulta historial, preferencias y señales de riesgo en una sola vista.</T>
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-on-primary transition-opacity hover:opacity-90" type="button">
          <OnboardingIcon name="person" className="h-4 w-4" />
          <T>Asignar segmento</T>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1180px] border-collapse text-left">
          <thead className="bg-surface-container-low">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                <T>Cliente</T>
              </th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                <T>Contacto</T>
              </th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                <T>Última visita</T>
              </th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                <T>Reservas</T>
              </th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                <T>No-shows</T>
              </th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                <T>Notas / etiquetas</T>
              </th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                <T>Estado</T>
              </th>
              <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                <T>Acción</T>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {guestDefinitions.map((guestDefinition) => (
              <GuestTableRow guestDefinition={guestDefinition} key={guestDefinition.id} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
//-aqui termina componente GuestsTable-//

//-aqui empieza componente GuestsInsightsRail y es para resumir la lectura CRM-//
/**
 * Renderiza los paneles laterales con insights y actividad reciente.
 *
 * @pure
 */
function GuestsInsightsRail() {
  return (
    <aside className="space-y-6 xl:w-[360px] xl:shrink-0">
      <section className="rounded-[28px] bg-primary p-8 text-on-primary shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/60">
          <T>Retención estimada</T>
        </p>
        <div className="mt-4 flex items-baseline gap-3">
          <span className="text-6xl font-black tracking-tight">82%</span>
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-white/60">
            <T>30 días</T>
          </span>
        </div>
        <p className="mt-4 text-sm leading-7 text-white/75">
          <T>
            La base de clientes prioriza visitantes con historial reciente y permite reaccionar antes de que un huésped se enfríe.
          </T>
        </p>
      </section>

      <section className="rounded-[24px] bg-surface-container-lowest p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <OnboardingIcon name="checkCircle" className="h-5 w-5 text-secondary" />
          <h3 className="text-lg font-black text-on-surface">
            <T>Segmentos clave</T>
          </h3>
        </div>
        <div className="mt-6 space-y-4">
          {guestSegmentDefinitions.map((segmentDefinition) => {
            const cardClassName =
              segmentDefinition.tone === "primary"
                ? "bg-primary text-on-primary"
                : segmentDefinition.tone === "secondary"
                  ? "bg-secondary-container text-on-secondary-container"
                  : "bg-tertiary-fixed text-on-tertiary-fixed";

            return (
              <div className={`rounded-2xl p-5 ${cardClassName}`} key={segmentDefinition.label}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-black">
                      <T>{segmentDefinition.label}</T>
                    </p>
                    <p className="mt-1 text-xs leading-6 opacity-85">
                      <T>{segmentDefinition.description}</T>
                    </p>
                  </div>
                  <p className="text-3xl font-black tracking-tight">{segmentDefinition.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-[24px] bg-surface-container-lowest p-6 shadow-sm">
        <h3 className="text-lg font-black text-on-surface">
          <T>Actividad reciente</T>
        </h3>
        <div className="mt-6 space-y-4">
          {guestActivityDefinitions.map((activityDefinition) => (
            <div className="flex gap-4 border-b border-outline-variant/10 pb-4 last:border-b-0 last:pb-0" key={`${activityDefinition.time}-${activityDefinition.title}`}>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant">
                <OnboardingIcon name={activityDefinition.icon} className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">{activityDefinition.time}</p>
                <p className="mt-1 text-sm font-bold text-primary">
                  <T>{activityDefinition.title}</T>
                </p>
                <p className="mt-1 text-sm leading-6 text-on-surface-variant">
                  <T>{activityDefinition.description}</T>
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[24px] border border-outline-variant/10 bg-surface-container-lowest p-6 shadow-sm">
        <h3 className="text-lg font-black text-on-surface">
          <T>Acciones rápidas</T>
        </h3>
        <div className="mt-6 space-y-4">
          {guestActionDefinitions.map((actionDefinition) => (
            <div className="rounded-2xl bg-surface-container-low p-5" key={actionDefinition.title}>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary-container text-on-secondary-container">
                  <OnboardingIcon name={actionDefinition.icon} className="h-5 w-5" />
                </div>
                <p className="text-sm font-black text-primary">
                  <T>{actionDefinition.title}</T>
                </p>
              </div>
              <p className="mt-4 text-sm leading-7 text-on-surface-variant">
                <T>{actionDefinition.description}</T>
              </p>
              <button className="mt-5 w-full rounded-lg bg-primary px-4 py-3 text-sm font-bold text-on-primary transition-opacity hover:opacity-90" type="button">
                <T>{actionDefinition.buttonLabel}</T>
              </button>
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
}
//-aqui termina componente GuestsInsightsRail-//

//-aqui empieza componente GuestsSummaryRail y es para acompañar la lectura operacional-//
/**
 * Renderiza el bloque de insights semanales y notas de retención.
 *
 * @pure
 */
function GuestsSummaryRail() {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {guestInsightDefinitions.map((insightDefinition) => (
        <article className="rounded-[24px] bg-surface-container-lowest p-6 shadow-sm" key={insightDefinition.title}>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
            <T>{insightDefinition.title}</T>
          </p>
          <p className="mt-4 text-3xl font-black tracking-tight text-primary">
            <T>{insightDefinition.value}</T>
          </p>
          <p className="mt-2 text-sm leading-6 text-on-surface-variant">
            <T>{insightDefinition.description}</T>
          </p>
        </article>
      ))}
    </section>
  );
}
//-aqui termina componente GuestsSummaryRail-//

//-aqui empieza pagina GuestsPage y es para montar el CRM operativo de clientes-//
/**
 * Presenta la vista CRM de clientes dentro del dashboard.
 */
export default function GuestsPage() {
  return (
    <>
      <GuestsToolbar />
      <GuestsMetricsGrid />
      <GuestsFilterBar />
      <GuestsSummaryRail />

      <section className="flex flex-col gap-8 xl:flex-row xl:items-start">
        <div className="min-w-0 flex-1 space-y-6">
          <GuestsTable />
        </div>
        <GuestsInsightsRail />
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <article className="rounded-[24px] bg-surface-container-lowest p-8 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
            <T>Preferencias guardadas</T>
          </p>
          <h3 className="mt-3 text-2xl font-black tracking-tight text-primary">
            <T>El CRM debe ayudar a servir mejor, no a llenar pantallas.</T>
          </h3>
          <p className="mt-4 text-sm leading-7 text-on-surface-variant">
            <T>
              Por eso la información se concentra en historial, señales de riesgo y notas que el equipo de sala pueda usar en segundos.
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
            <Link className="inline-flex items-center gap-2 rounded-lg bg-surface-container-highest px-4 py-3 text-sm font-bold text-on-surface transition-colors hover:bg-surface-container-high" href="/dashboard/schedule">
              <OnboardingIcon name="rocketLaunch" className="h-4 w-4 text-secondary" />
              <T>Calendario</T>
            </Link>
            <button className="inline-flex items-center gap-2 rounded-lg bg-surface-container-highest px-4 py-3 text-sm font-bold text-on-surface transition-colors hover:bg-surface-container-high" type="button">
              <OnboardingIcon name="contentCopy" className="h-4 w-4 text-secondary" />
              <T>Exportar segmento</T>
            </button>
          </div>
        </article>
      </section>
    </>
  );
}
//-aqui termina pagina GuestsPage-//
