/**
 * Archivo: page.tsx
 * Responsabilidad: Renderizar la vista operativa de configuración del restaurante dentro del dashboard.
 * Tipo: UI
 */

import Link from "next/link";
import { T } from "@/components/T";
import { OnboardingIcon } from "@/components/onboarding/OnboardingIcon";

interface RestaurantProfileFieldDefinition {
  label: string;
  value: string;
  hint: string;
  type: "text" | "email" | "tel" | "select";
  options?: ReadonlyArray<string>;
}

interface RestaurantRuleDefinition {
  label: string;
  description: string;
  enabled: boolean;
}

interface RestaurantIntegrationDefinition {
  label: string;
  description: string;
  status: string;
  statusTone: "connected" | "available" | "attention";
}

interface RestaurantTeamMemberDefinition {
  name: string;
  role: string;
  status: string;
}

interface RestaurantActivityDefinition {
  time: string;
  title: string;
  description: string;
}

const restaurantProfileFieldDefinitions: ReadonlyArray<RestaurantProfileFieldDefinition> = [
  {
    label: "Nombre del restaurante",
    value: "Reserva Latina",
    hint: "Visible para el equipo y las reservas públicas.",
    type: "text",
  },
  {
    label: "Slug público",
    value: "reserva-latina",
    hint: "Se usa en enlaces y rutas compartidas.",
    type: "text",
  },
  {
    label: "Zona horaria",
    value: "Europe/Madrid",
    hint: "Sincroniza horarios de reservas y cobros.",
    type: "select",
    options: ["Europe/Madrid", "America/Mexico_City", "America/Bogota"],
  },
  {
    label: "Teléfono",
    value: "+34 600 123 456",
    hint: "Contacto visible para confirmaciones.",
    type: "tel",
  },
  {
    label: "Email administrativo",
    value: "hola@reservalatina.com",
    hint: "Notificaciones de sistema y facturación.",
    type: "email",
  },
  {
    label: "Política de cancelación",
    value: "12 horas",
    hint: "Ventana mínima antes de penalizar cambios.",
    type: "select",
    options: ["12 horas", "24 horas", "48 horas"],
  },
] as const;

const restaurantRuleDefinitions: ReadonlyArray<RestaurantRuleDefinition> = [
  {
    label: "Aprobación manual de reservas",
    description: "Requiere revisión del equipo antes de confirmar solicitudes de alto riesgo.",
    enabled: true,
  },
  {
    label: "Lista de espera activa",
    description: "Permite capturar demanda cuando la sala alcanza su límite operativo.",
    enabled: true,
  },
  {
    label: "Buffer entre turnos",
    description: "Reserva tiempo extra para limpieza, recambio de mesa y reajuste del salón.",
    enabled: true,
  },
  {
    label: "Autoasignación de mesa",
    description: "Sugerencia automática de mesa basada en capacidad, zona y disponibilidad.",
    enabled: false,
  },
] as const;

const restaurantIntegrationDefinitions: ReadonlyArray<RestaurantIntegrationDefinition> = [
  {
    label: "Stripe",
    description: "Cobros y suscripción sincronizados con el ciclo SaaS.",
    status: "Conectado",
    statusTone: "connected",
  },
  {
    label: "Google Calendar",
    description: "Exportación de eventos de servicio para el equipo de sala.",
    status: "Disponible",
    statusTone: "available",
  },
  {
    label: "Email transaccional",
    description: "Plantillas de confirmación, cancelación y recordatorios.",
    status: "Requiere revisión",
    statusTone: "attention",
  },
] as const;

const restaurantTeamMemberDefinitions: ReadonlyArray<RestaurantTeamMemberDefinition> = [
  {
    name: "Julian Rossi",
    role: "Propietario",
    status: "Acceso total",
  },
  {
    name: "Carla Méndez",
    role: "Encargada de sala",
    status: "Permisos de reservas",
  },
  {
    name: "Leo Vargas",
    role: "Host",
    status: "Confirmaciones y mesas",
  },
] as const;

const restaurantActivityDefinitions: ReadonlyArray<RestaurantActivityDefinition> = [
  {
    time: "09:20",
    title: "Timezone actualizado",
    description: "La hora del restaurante quedó ajustada al horario local del servicio.",
  },
  {
    time: "11:05",
    title: "Buffer de turno revisado",
    description: "Se confirmó un margen de 15 minutos entre servicios consecutivos.",
  },
  {
    time: "13:30",
    title: "Permiso de usuario editado",
    description: "El acceso de sala quedó limitado a reservas y seguimiento de invitados.",
  },
] as const;

//-aqui empieza funcion getRestaurantRuleIndicatorClassName y es para colorear el estado de cada regla-//
/**
 * Devuelve el color del indicador para una regla operativa.
 *
 * @pure
 */
function getRestaurantRuleIndicatorClassName(enabled: boolean): string {
  return enabled ? "bg-secondary" : "bg-zinc-300";
}
//-aqui termina funcion getRestaurantRuleIndicatorClassName-//

//-aqui empieza funcion getRestaurantIntegrationStatusClassName y es para pintar el estado de las integraciones-//
/**
 * Devuelve las clases del estado de una integración.
 *
 * @pure
 */
function getRestaurantIntegrationStatusClassName(statusTone: RestaurantIntegrationDefinition["statusTone"]): string {
  if (statusTone === "connected") {
    return "bg-secondary-container text-on-secondary-container";
  }

  if (statusTone === "attention") {
    return "bg-tertiary-fixed text-on-tertiary-fixed";
  }

  return "bg-surface-container-highest text-on-surface-variant";
}
//-aqui termina funcion getRestaurantIntegrationStatusClassName-//

//-aqui empieza componente SettingsToolbar y es para resumir la vista de configuracion-//
/**
 * Renderiza la cabecera operativa de la vista de configuración.
 *
 * @pure
 */
function SettingsToolbar() {
  return (
    <section className="flex flex-col gap-6 rounded-[28px] bg-surface-container-lowest p-8 shadow-sm md:flex-row md:items-end md:justify-between md:p-10">
      <div className="max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
          <T>Configuración del restaurante</T>
        </p>
        <h2 className="mt-4 text-5xl font-black tracking-tighter text-primary md:text-6xl">
          <T>Ajusta reglas, perfil y accesos del equipo.</T>
        </h2>
        <p className="mt-4 max-w-xl text-on-surface-variant md:text-lg md:leading-8">
          <T>
            Centraliza la identidad del restaurante, las reglas de reserva y las integraciones clave desde una única pantalla.
          </T>
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-surface-container-highest px-6 py-2.5 text-sm font-bold text-on-surface transition-colors hover:bg-surface-container-high" type="button">
          <OnboardingIcon name="contentCopy" className="h-4 w-4" />
          <T>Duplicar ajustes</T>
        </button>
        <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-on-primary transition-colors hover:opacity-90" type="button">
          <OnboardingIcon name="save" className="h-4 w-4" />
          <T>Guardar cambios</T>
        </button>
      </div>
    </section>
  );
}
//-aqui termina componente SettingsToolbar-//

//-aqui empieza componente SettingsProfilePanel y es para mostrar los campos principales del restaurante-//
/**
 * Renderiza el formulario de datos base del restaurante.
 *
 * @pure
 */
function SettingsProfilePanel() {
  return (
    <section className="overflow-hidden rounded-[28px] bg-surface-container-lowest shadow-sm">
      <div className="border-b border-outline-variant/10 p-8">
        <h3 className="text-xl font-black tracking-tight text-primary md:text-2xl">
          <T>Perfil del restaurante</T>
        </h3>
        <p className="mt-1 text-sm text-on-surface-variant">
          <T>Mantén sincronizados el nombre, contacto y zona horaria del negocio.</T>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 p-8 lg:grid-cols-2">
        {restaurantProfileFieldDefinitions.map((fieldDefinition) => {
          const inputClassName = "w-full rounded-lg border-0 bg-surface-container-low px-4 py-3 text-sm font-semibold text-on-surface outline-none ring-1 ring-transparent transition-all focus:ring-primary";

          return (
            <label className="space-y-2" key={fieldDefinition.label}>
              <span className="block text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                <T>{fieldDefinition.label}</T>
              </span>
              {fieldDefinition.type === "select" ? (
                <div className="rounded-lg bg-surface-container-low px-4 py-3 ring-1 ring-transparent transition-all focus-within:ring-primary">
                  <div className="flex items-center gap-2">
                    <select className="w-full border-0 bg-transparent text-sm font-semibold text-on-surface outline-none" defaultValue={fieldDefinition.value}>
                      {fieldDefinition.options?.map((optionDefinition) => (
                        <option key={optionDefinition} value={optionDefinition}>
                          {optionDefinition}
                        </option>
                      ))}
                    </select>
                    <OnboardingIcon name="rocketLaunch" className="h-4 w-4 shrink-0 text-on-surface-variant" />
                  </div>
                </div>
              ) : (
                <input className={inputClassName} defaultValue={fieldDefinition.value} type={fieldDefinition.type} />
              )}
              <p className="text-xs leading-6 text-on-surface-variant">
                <T>{fieldDefinition.hint}</T>
              </p>
            </label>
          );
        })}
      </div>
    </section>
  );
}
//-aqui termina componente SettingsProfilePanel-//

//-aqui empieza componente SettingsRulesPanel y es para ajustar reglas de la operacion-//
/**
 * Renderiza la colección de reglas operativas.
 *
 * @pure
 */
function SettingsRulesPanel() {
  return (
    <section className="rounded-[28px] bg-surface-container-lowest p-8 shadow-sm">
      <h3 className="text-xl font-black tracking-tight text-primary md:text-2xl">
        <T>Reglas de reserva</T>
      </h3>
      <p className="mt-1 text-sm text-on-surface-variant">
        <T>Define el comportamiento operativo del sistema sin tocar el código.</T>
      </p>

      <div className="mt-6 space-y-4">
        {restaurantRuleDefinitions.map((ruleDefinition) => (
          <article className="flex items-start justify-between gap-4 rounded-2xl bg-surface-container-low p-5" key={ruleDefinition.label}>
            <div className="flex gap-4">
              <button className={`relative mt-0.5 h-5 w-10 rounded-full transition-colors ${getRestaurantRuleIndicatorClassName(ruleDefinition.enabled)}`} type="button" aria-label={ruleDefinition.label}>
                <div className={`absolute top-1 h-3 w-3 rounded-full bg-white transition-all ${ruleDefinition.enabled ? "right-1" : "left-1"}`} />
              </button>
              <div>
                <p className="text-sm font-bold text-primary">
                  <T>{ruleDefinition.label}</T>
                </p>
                <p className="mt-1 text-sm leading-6 text-on-surface-variant">
                  <T>{ruleDefinition.description}</T>
                </p>
              </div>
            </div>
            <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${ruleDefinition.enabled ? "bg-secondary-container text-on-secondary-container" : "bg-surface-container-highest text-on-surface-variant"}`}>
              <T>{ruleDefinition.enabled ? "Activa" : "Desactivada"}</T>
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}
//-aqui termina componente SettingsRulesPanel-//

//-aqui empieza componente SettingsIntegrationsPanel y es para mostrar integraciones conectadas-//
/**
 * Renderiza el panel de integraciones vinculadas.
 *
 * @pure
 */
function SettingsIntegrationsPanel() {
  return (
    <section className="rounded-[28px] bg-surface-container-lowest p-8 shadow-sm">
      <h3 className="text-xl font-black tracking-tight text-primary md:text-2xl">
        <T>Integraciones</T>
      </h3>
      <p className="mt-1 text-sm text-on-surface-variant">
        <T>Estado de las conexiones críticas que soportan la operación diaria.</T>
      </p>

      <div className="mt-6 space-y-4">
        {restaurantIntegrationDefinitions.map((integrationDefinition) => (
          <article className="rounded-2xl bg-surface-container-low p-5" key={integrationDefinition.label}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-primary">
                  <T>{integrationDefinition.label}</T>
                </p>
                <p className="mt-1 text-sm leading-6 text-on-surface-variant">
                  <T>{integrationDefinition.description}</T>
                </p>
              </div>
              <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${getRestaurantIntegrationStatusClassName(integrationDefinition.statusTone)}`}>
                <T>{integrationDefinition.status}</T>
              </span>
            </div>
          </article>
        ))}
      </div>

      <button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-bold text-on-primary transition-opacity hover:opacity-90" type="button">
        <OnboardingIcon name="arrowForward" className="h-4 w-4" />
        <T>Conectar integración</T>
      </button>
    </section>
  );
}
//-aqui termina componente SettingsIntegrationsPanel-//

//-aqui empieza componente SettingsTeamPanel y es para listar accesos de equipo-//
/**
 * Renderiza el bloque de usuarios del restaurante.
 *
 * @pure
 */
function SettingsTeamPanel() {
  return (
    <section className="rounded-[28px] bg-surface-container-lowest p-8 shadow-sm">
      <h3 className="text-xl font-black tracking-tight text-primary md:text-2xl">
        <T>Equipo con acceso</T>
      </h3>
      <p className="mt-1 text-sm text-on-surface-variant">
        <T>Controla quién puede operar reservas, sala y facturación.</T>
      </p>

      <div className="mt-6 space-y-4">
        {restaurantTeamMemberDefinitions.map((memberDefinition) => (
          <article className="flex items-center justify-between gap-4 rounded-2xl bg-surface-container-low px-5 py-4" key={memberDefinition.name}>
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-high text-sm font-black text-on-surface-variant">
                {memberDefinition.name
                  .split(" ")
                  .slice(0, 2)
                  .map((word) => word.charAt(0))
                  .join("")}
              </div>
              <div>
                <p className="text-sm font-bold text-on-surface">
                  <T>{memberDefinition.name}</T>
                </p>
                <p className="text-xs text-on-surface-variant">
                  <T>{memberDefinition.role}</T>
                </p>
              </div>
            </div>
            <span className="inline-flex rounded-full bg-secondary-container px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-on-secondary-container">
              <T>{memberDefinition.status}</T>
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}
//-aqui termina componente SettingsTeamPanel-//

//-aqui empieza componente SettingsActivityRail y es para mostrar cambios recientes-//
/**
 * Renderiza el registro de actividad reciente de configuración.
 *
 * @pure
 */
function SettingsActivityRail() {
  return (
    <section className="rounded-[28px] bg-primary p-8 text-on-primary shadow-sm">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/60">
          <T>Actividad reciente</T>
        </p>
        <h3 className="mt-3 text-3xl font-black tracking-tight">
          <T>Cambios del día</T>
        </h3>
        <p className="mt-3 text-sm leading-7 text-white/75">
          <T>La configuración se está manteniendo alineada con la operación del restaurante.</T>
        </p>
      </div>

      <div className="mt-6 space-y-4 rounded-[24px] bg-white/10 p-5 backdrop-blur-sm">
        {restaurantActivityDefinitions.map((activityDefinition) => (
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

      <Link className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white/10 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-white/15" href="/dashboard/billing">
        <OnboardingIcon name="payments" className="h-4 w-4" />
        <T>Ir a facturación</T>
      </Link>
    </section>
  );
}
//-aqui termina componente SettingsActivityRail-//

//-aqui empieza pagina SettingsPage y es para mostrar la configuración del restaurante-//
/**
 * Presenta la vista de configuración operativa del restaurante.
 */
export default function SettingsPage() {
  return (
    <>
      <SettingsToolbar />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-[24px] bg-primary p-6 text-on-primary shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/60">
            <T>Reglas activas</T>
          </p>
          <p className="mt-4 text-4xl font-black tracking-tight">3</p>
          <p className="mt-2 text-sm leading-6 text-white/75">
            <T>Buffer, waitlist y aprobación manual</T>
          </p>
        </article>
        <article className="rounded-[24px] bg-secondary-container p-6 text-on-secondary-container shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-on-secondary-container/75">
            <T>Integraciones</T>
          </p>
          <p className="mt-4 text-4xl font-black tracking-tight">2</p>
          <p className="mt-2 text-sm leading-6 text-on-secondary-container/75">
            <T>Stripe y calendario sincronizados</T>
          </p>
        </article>
        <article className="rounded-[24px] bg-surface-container-lowest p-6 text-on-surface shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
            <T>Usuarios activos</T>
          </p>
          <p className="mt-4 text-4xl font-black tracking-tight">8</p>
          <p className="mt-2 text-sm leading-6 text-on-surface-variant">
            <T>Equipo operativo y administración</T>
          </p>
        </article>
        <article className="rounded-[24px] bg-tertiary-fixed p-6 text-on-tertiary-fixed shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-on-tertiary-fixed/75">
            <T>Acciones pendientes</T>
          </p>
          <p className="mt-4 text-4xl font-black tracking-tight">1</p>
          <p className="mt-2 text-sm leading-6 text-on-tertiary-fixed/75">
            <T>Revisar plantillas de email</T>
          </p>
        </article>
      </section>

      <section className="grid grid-cols-1 gap-8 xl:grid-cols-12">
        <div className="xl:col-span-8 space-y-8">
          <SettingsProfilePanel />
          <SettingsRulesPanel />
          <SettingsTeamPanel />
        </div>

        <div className="xl:col-span-4 space-y-8">
          <SettingsIntegrationsPanel />
          <SettingsActivityRail />
        </div>
      </section>
    </>
  );
}
//-aqui termina pagina SettingsPage-//
