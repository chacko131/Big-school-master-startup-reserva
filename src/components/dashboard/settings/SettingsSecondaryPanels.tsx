/**
 * Archivo: SettingsSecondaryPanels.tsx
 * Responsabilidad: Agrupar paneles secundarios de configuración del restaurante.
 * Tipo: UI
 */

import { T } from "@/components/T";
import { OnboardingIcon } from "@/components/onboarding/OnboardingIcon";
import { NotificationBanner } from "@/components/ui/NotificationBanner";

interface RestaurantSettingsInitialValues {
  reservationApprovalMode: "AUTO" | "MANUAL";
  waitlistMode: "MANUAL" | "AUTO";
  defaultReservationDurationMinutes: number;
  reservationBufferMinutes: number;
  cancellationWindowHours: number;
  allowTableCombination: boolean;
  enableAutoTableAssignment: boolean;
}

interface SettingsRulesPanelProps {
  initialValues: RestaurantSettingsInitialValues;
  errorMessage?: string;
  successMessage?: string;
  saveAction: (formData: FormData) => Promise<void>;
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

const restaurantDurationOptions = [60, 90, 120, 180] as const;
const restaurantBufferOptions = [0, 15, 30] as const;
const restaurantCancellationWindowOptions = [12, 24, 48, 72] as const;

const settingsRulesInputClassName = "w-full rounded-lg border-0 bg-surface-container-low px-4 py-3 text-sm font-semibold text-on-surface outline-none ring-1 ring-transparent transition-all focus:ring-primary";

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

//-aqui empieza componente SettingsRulesPanel y es para ajustar reglas de la operacion-//
/**
 * Renderiza y guarda la configuración operativa del restaurante.
 *
 * @pure
 */
export function SettingsRulesPanel({ initialValues, errorMessage, successMessage, saveAction }: SettingsRulesPanelProps) {
  return (
    <section className="rounded-[28px] bg-surface-container-lowest p-8 shadow-sm">
      <h3 className="text-xl font-black tracking-tight text-primary md:text-2xl">
        <T>Reglas de reserva</T>
      </h3>
      <p className="mt-1 text-sm text-on-surface-variant">
        <T>Define aquí las opciones operativas del restaurante que afectan a reservas y sala.</T>
      </p>

      <form action={saveAction} className="mt-6 space-y-8">
        {errorMessage ? <NotificationBanner key={`rules-error-${errorMessage}`} description={errorMessage} tone="error" title="No pudimos guardar las reglas" /> : null}

        {successMessage ? <NotificationBanner key={`rules-success-${successMessage}`} description={successMessage} tone="success" title="Reglas actualizadas" /> : null}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <label className="space-y-2" htmlFor="reservation-approval-mode">
            <span className="block text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
              <T>Modo de aprobación</T>
            </span>
            <select className={settingsRulesInputClassName} defaultValue={initialValues.reservationApprovalMode} id="reservation-approval-mode" name="reservationApprovalMode">
              <option value="AUTO">Auto</option>
              <option value="MANUAL">Manual</option>
            </select>
            <p className="text-xs leading-6 text-on-surface-variant">
              <T>Controla si las reservas se confirman solas o pasan por revisión.</T>
            </p>
          </label>

          <label className="space-y-2" htmlFor="waitlist-mode">
            <span className="block text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
              <T>Modo lista de espera</T>
            </span>
            <select className={settingsRulesInputClassName} defaultValue={initialValues.waitlistMode} id="waitlist-mode" name="waitlistMode">
              <option value="MANUAL">Manual</option>
              <option value="AUTO">Auto</option>
            </select>
            <p className="text-xs leading-6 text-on-surface-variant">
              <T>Define cómo se capturan las solicitudes cuando la sala se llena.</T>
            </p>
          </label>

          <label className="space-y-2" htmlFor="default-reservation-duration-minutes">
            <span className="block text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
              <T>Duración por defecto</T>
            </span>
            <select className={settingsRulesInputClassName} defaultValue={String(initialValues.defaultReservationDurationMinutes)} id="default-reservation-duration-minutes" name="defaultReservationDurationMinutes">
              {restaurantDurationOptions.map((durationOption) => (
                <option key={durationOption} value={durationOption}>
                  {durationOption} minutos
                </option>
              ))}
            </select>
            <p className="text-xs leading-6 text-on-surface-variant">
              <T>Tiempo estándar reservado para cada experiencia.</T>
            </p>
          </label>

          <label className="space-y-2" htmlFor="reservation-buffer-minutes">
            <span className="block text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
              <T>Buffer entre turnos</T>
            </span>
            <select className={settingsRulesInputClassName} defaultValue={String(initialValues.reservationBufferMinutes)} id="reservation-buffer-minutes" name="reservationBufferMinutes">
              {restaurantBufferOptions.map((bufferOption) => (
                <option key={bufferOption} value={bufferOption}>
                  {bufferOption === 0 ? "Sin buffer" : `${bufferOption} minutos`}
                </option>
              ))}
            </select>
            <p className="text-xs leading-6 text-on-surface-variant">
              <T>Margen operativo entre reservas consecutivas.</T>
            </p>
          </label>

          <label className="space-y-2 lg:col-span-2" htmlFor="cancellation-window-hours">
            <span className="block text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
              <T>Ventana de cancelación</T>
            </span>
            <select className={settingsRulesInputClassName} defaultValue={String(initialValues.cancellationWindowHours)} id="cancellation-window-hours" name="cancellationWindowHours">
              {restaurantCancellationWindowOptions.map((windowOption) => (
                <option key={windowOption} value={windowOption}>
                  {windowOption} horas
                </option>
              ))}
            </select>
            <p className="text-xs leading-6 text-on-surface-variant">
              <T>Tiempo mínimo antes de aplicar penalizaciones o restricciones.</T>
            </p>
          </label>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <label className="flex items-start justify-between gap-4 rounded-2xl bg-surface-container-low p-5">
            <div className="space-y-1">
              <p className="text-sm font-bold text-primary">
                <T>Combinación de mesas</T>
              </p>
              <p className="text-sm leading-6 text-on-surface-variant">
                <T>Permite que el sistema una mesas cercanas para grupos grandes.</T>
              </p>
            </div>
            <input defaultChecked={initialValues.allowTableCombination} name="allowTableCombination" type="checkbox" className="mt-1 h-5 w-5 rounded border-outline-variant text-secondary focus:ring-secondary" />
          </label>

          <label className="flex items-start justify-between gap-4 rounded-2xl bg-surface-container-low p-5">
            <div className="space-y-1">
              <p className="text-sm font-bold text-primary">
                <T>Asignación inteligente</T>
              </p>
              <p className="text-sm leading-6 text-on-surface-variant">
                <T>Activa sugerencias automáticas de mesas según capacidad y zona.</T>
              </p>
            </div>
            <input defaultChecked={initialValues.enableAutoTableAssignment} name="enableAutoTableAssignment" type="checkbox" className="mt-1 h-5 w-5 rounded border-outline-variant text-secondary focus:ring-secondary" />
          </label>
        </div>

        <div className="flex justify-end">
          <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-on-primary transition-colors hover:opacity-90" type="submit">
            <OnboardingIcon name="save" className="h-4 w-4" />
            <T>Guardar cambios</T>
          </button>
        </div>
      </form>
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
export function SettingsIntegrationsPanel() {
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
export function SettingsTeamPanel() {
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
export function SettingsActivityRail() {
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

      <button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white/10 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-white/15" type="button">
        <OnboardingIcon name="payments" className="h-4 w-4" />
        <T>Ir a facturación</T>
      </button>
    </section>
  );
}
//-aqui termina componente SettingsActivityRail-//
