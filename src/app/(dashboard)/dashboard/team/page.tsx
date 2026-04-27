/**
 * Archivo: page.tsx
 * Responsabilidad: Renderizar la vista MVP de equipo del dashboard.
 * Tipo: UI
 */

import Link from "next/link";
import { T } from "@/components/T";
import { OnboardingIcon } from "@/components/onboarding/OnboardingIcon";

interface TeamMetricDefinition {
  label: string;
  value: string;
  caption: string;
  tone: "primary" | "secondary" | "surface" | "warning";
}

interface TeamMemberDefinition {
  name: string;
  role: string;
  status: string;
  permissions: string;
}

interface TeamInvitationDefinition {
  email: string;
  role: string;
  status: string;
}

interface TeamActivityDefinition {
  time: string;
  title: string;
  description: string;
}

const teamMetricDefinitions: ReadonlyArray<TeamMetricDefinition> = [
  {
    label: "Miembros activos",
    value: "8",
    caption: "usuarios con acceso al panel",
    tone: "primary",
  },
  {
    label: "Roles definidos",
    value: "4",
    caption: "propietario, sala, cocina y apoyo",
    tone: "secondary",
  },
  {
    label: "Invitaciones pendientes",
    value: "2",
    caption: "esperando aceptación",
    tone: "surface",
  },
  {
    label: "Permisos críticos",
    value: "1",
    caption: "requiere revisión manual",
    tone: "warning",
  },
] as const;

const teamMemberDefinitions: ReadonlyArray<TeamMemberDefinition> = [
  {
    name: "Julian Rossi",
    role: "Propietario",
    status: "Acceso total",
    permissions: "Facturación, reservas, configuración",
  },
  {
    name: "Carla Méndez",
    role: "Encargada de sala",
    status: "Activo",
    permissions: "Reservas, clientes y mesa",
  },
  {
    name: "Leo Vargas",
    role: "Host",
    status: "Activo",
    permissions: "Confirmaciones y asignación básica",
  },
  {
    name: "Ana Gómez",
    role: "Apoyo",
    status: "Limitado",
    permissions: "Solo lectura de agenda",
  },
] as const;

const teamInvitationDefinitions: ReadonlyArray<TeamInvitationDefinition> = [
  {
    email: "nuevo@reservalatina.com",
    role: "Host",
    status: "Pendiente",
  },
  {
    email: "equipo@reservalatina.com",
    role: "Sala",
    status: "Pendiente",
  },
] as const;

const teamActivityDefinitions: ReadonlyArray<TeamActivityDefinition> = [
  {
    time: "08:30",
    title: "Rol actualizado",
    description: "La cuenta de sala quedó limitada a reservas y seguimiento de invitados.",
  },
  {
    time: "11:20",
    title: "Invitación enviada",
    description: "Se remitió un acceso nuevo para un apoyo de fin de semana.",
  },
  {
    time: "14:15",
    title: "Permiso revisado",
    description: "Se confirmó que facturación seguirá reservada para el propietario.",
  },
] as const;

//-aqui empieza funcion getTeamMetricClassName y es para colorear las tarjetas principales-//
/**
 * Devuelve las clases visuales de una métrica del equipo.
 *
 * @pure
 */
function getTeamMetricClassName(tone: TeamMetricDefinition["tone"]): string {
  if (tone === "primary") {
    return "bg-primary text-on-primary";
  }

  if (tone === "secondary") {
    return "bg-secondary-container text-on-secondary-container";
  }

  if (tone === "warning") {
    return "bg-tertiary-fixed text-on-tertiary-fixed";
  }

  return "bg-surface-container-lowest text-on-surface";
}
//-aqui termina funcion getTeamMetricClassName-//

//-aqui empieza funcion getTeamMetricLabelClassName y es para ajustar el texto secundario-//
/**
 * Devuelve las clases del texto auxiliar de una métrica.
 *
 * @pure
 */
function getTeamMetricLabelClassName(tone: TeamMetricDefinition["tone"]): string {
  if (tone === "primary") {
    return "text-white/70";
  }

  if (tone === "secondary") {
    return "text-on-secondary-container/75";
  }

  if (tone === "warning") {
    return "text-on-tertiary-fixed/75";
  }

  return "text-on-surface-variant";
}
//-aqui termina funcion getTeamMetricLabelClassName-//

//-aqui empieza componente TeamToolbar y es para resumir la vista de equipo-//
/**
 * Renderiza la cabecera operativa del equipo.
 *
 * @pure
 */
function TeamToolbar() {
  return (
    <section className="flex flex-col gap-6 rounded-[28px] bg-surface-container-lowest p-8 shadow-sm md:flex-row md:items-end md:justify-between md:p-10">
      <div className="max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
          <T>Equipo</T>
        </p>
        <h2 className="mt-4 text-5xl font-black tracking-tighter text-primary md:text-6xl">
          <T>Gestiona accesos y responsabilidades.</T>
        </h2>
        <p className="mt-4 max-w-xl text-on-surface-variant md:text-lg md:leading-8">
          <T>
            Esta pantalla MVP centraliza miembros, invitaciones y niveles de permiso para validar el flujo administrativo.
          </T>
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link className="inline-flex items-center justify-center gap-2 rounded-lg bg-surface-container-highest px-6 py-2.5 text-sm font-bold text-on-surface transition-colors hover:bg-surface-container-high" href="/dashboard/settings">
          <OnboardingIcon name="settings" className="h-4 w-4" />
          <T>Roles</T>
        </Link>
        <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-on-primary transition-colors hover:opacity-90" type="button">
          <OnboardingIcon name="contentCopy" className="h-4 w-4" />
          <T>Invitar miembro</T>
        </button>
      </div>
    </section>
  );
}
//-aqui termina componente TeamToolbar-//

//-aqui empieza componente TeamMetricsGrid y es para mostrar el estado resumido-//
/**
 * Renderiza las métricas principales del equipo.
 *
 * @pure
 */
function TeamMetricsGrid() {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {teamMetricDefinitions.map((metricDefinition) => (
        <article className={`rounded-[24px] p-6 shadow-sm ${getTeamMetricClassName(metricDefinition.tone)}`} key={metricDefinition.label}>
          <p className={`text-xs font-bold uppercase tracking-[0.22em] ${getTeamMetricLabelClassName(metricDefinition.tone)}`}>
            <T>{metricDefinition.label}</T>
          </p>
          <p className="mt-4 text-4xl font-black tracking-tight">
            <T>{metricDefinition.value}</T>
          </p>
          <p className={`mt-2 text-sm leading-6 ${getTeamMetricLabelClassName(metricDefinition.tone)}`}>
            <T>{metricDefinition.caption}</T>
          </p>
        </article>
      ))}
    </section>
  );
}
//-aqui termina componente TeamMetricsGrid-//

//-aqui empieza componente TeamMembersPanel y es para listar el equipo activo-//
/**
 * Renderiza el panel de miembros del equipo.
 *
 * @pure
 */
function TeamMembersPanel() {
  return (
    <section className="rounded-[28px] bg-surface-container-lowest p-8 shadow-sm">
      <div className="flex items-center gap-2">
        <OnboardingIcon name="person" className="h-5 w-5 text-secondary" />
        <h3 className="text-lg font-bold text-on-surface">
          <T>Miembros activos</T>
        </h3>
      </div>

      <div className="mt-6 space-y-4">
        {teamMemberDefinitions.map((memberDefinition) => (
          <article className="rounded-2xl bg-surface-container-low p-5" key={memberDefinition.name}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-high text-sm font-black text-on-surface-variant">
                  {memberDefinition.name
                    .split(" ")
                    .slice(0, 2)
                    .map((word) => word.charAt(0))
                    .join("")}
                </div>
                <div>
                  <p className="text-sm font-bold text-primary">
                    <T>{memberDefinition.name}</T>
                  </p>
                  <p className="mt-1 text-xs text-on-surface-variant">
                    <T>{memberDefinition.role}</T>
                  </p>
                </div>
              </div>
              <span className="inline-flex rounded-full bg-secondary-container px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-on-secondary-container">
                <T>{memberDefinition.status}</T>
              </span>
            </div>
            <div className="mt-4 rounded-2xl bg-surface-container-lowest px-4 py-3 text-sm text-on-surface-variant">
              <T>{memberDefinition.permissions}</T>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
//-aqui termina componente TeamMembersPanel-//

//-aqui empieza componente TeamInvitationPanel y es para listar accesos pendientes-//
/**
 * Renderiza las invitaciones pendientes del equipo.
 *
 * @pure
 */
function TeamInvitationPanel() {
  return (
    <section className="rounded-[28px] bg-surface-container-lowest p-8 shadow-sm">
      <h3 className="text-xl font-black tracking-tight text-primary md:text-2xl">
        <T>Invitaciones pendientes</T>
      </h3>
      <p className="mt-1 text-sm text-on-surface-variant">
        <T>Flujo mínimo para comprobar el alta de usuarios antes de construir el sistema real.</T>
      </p>

      <div className="mt-6 space-y-4">
        {teamInvitationDefinitions.map((invitationDefinition) => (
          <article className="flex items-center justify-between gap-4 rounded-2xl bg-surface-container-low px-5 py-4" key={invitationDefinition.email}>
            <div>
              <p className="text-sm font-bold text-on-surface">
                <T>{invitationDefinition.email}</T>
              </p>
              <p className="mt-1 text-xs text-on-surface-variant">
                <T>{invitationDefinition.role}</T>
              </p>
            </div>
            <span className="inline-flex rounded-full bg-tertiary-fixed px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-on-tertiary-fixed">
              <T>{invitationDefinition.status}</T>
            </span>
          </article>
        ))}
      </div>

      <button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-bold text-on-primary transition-opacity hover:opacity-90" type="button">
        <OnboardingIcon name="arrowForward" className="h-4 w-4" />
        <T>Enviar invitación</T>
      </button>
    </section>
  );
}
//-aqui termina componente TeamInvitationPanel-//

//-aqui empieza componente TeamActivityRail y es para mostrar cambios recientes-//
/**
 * Renderiza el registro de actividad reciente del equipo.
 *
 * @pure
 */
function TeamActivityRail() {
  return (
    <section className="rounded-[28px] bg-primary p-8 text-on-primary shadow-sm">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/60">
          <T>Actividad</T>
        </p>
        <h3 className="mt-3 text-3xl font-black tracking-tight">
          <T>Cambios recientes</T>
        </h3>
        <p className="mt-3 text-sm leading-7 text-white/75">
          <T>El MVP deja trazabilidad básica para validar quién puede tocar cada área del producto.</T>
        </p>
      </div>

      <div className="mt-6 space-y-4 rounded-[24px] bg-white/10 p-5 backdrop-blur-sm">
        {teamActivityDefinitions.map((activityDefinition) => (
          <div className="flex gap-4" key={`${activityDefinition.time}-${activityDefinition.title}`}>
            <div className="w-16 shrink-0 rounded-full bg-white/10 px-3 py-2 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
              {activityDefinition.time}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-white">
                <T>{activityDefinition.title}</T>
              </p>
              <p className="mt-1 text-sm leading-6 text-white/70">
                <T>{activityDefinition.description}</T>
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
//-aqui termina componente TeamActivityRail-//

//-aqui empieza pagina TeamPage y es para mostrar los accesos del equipo-//
/**
 * Presenta la vista MVP de gestión de equipo del dashboard.
 */
export default function TeamPage() {
  return (
    <>
      <TeamToolbar />
      <TeamMetricsGrid />

      <section className="grid grid-cols-1 gap-8 xl:grid-cols-12">
        <div className="xl:col-span-8 space-y-8">
          <TeamMembersPanel />
          <TeamInvitationPanel />
        </div>

        <div className="xl:col-span-4">
          <TeamActivityRail />
        </div>
      </section>
    </>
  );
}
//-aqui termina pagina TeamPage-//
