/**
 * Archivo: page.tsx
 * Responsabilidad: Renderizar la vista MVP de notificaciones del dashboard.
 * Tipo: UI
 */

import { T } from "@/components/T";
import { OnboardingIcon } from "@/components/onboarding/OnboardingIcon";

interface NotificationMetricDefinition {
  label: string;
  value: string;
  caption: string;
  tone: "primary" | "secondary" | "surface" | "warning";
}

interface NotificationRuleDefinition {
  label: string;
  description: string;
  enabled: boolean;
}

interface NotificationTemplateDefinition {
  name: string;
  channel: string;
  status: string;
  statusTone: "active" | "draft" | "attention";
}

interface NotificationEventDefinition {
  time: string;
  title: string;
  description: string;
}

const notificationMetricDefinitions: ReadonlyArray<NotificationMetricDefinition> = [
  {
    label: "Activas",
    value: "6",
    caption: "reglas y alertas en ejecución",
    tone: "primary",
  },
  {
    label: "Plantillas",
    value: "4",
    caption: "confirmación, recordatorio y cancelación",
    tone: "secondary",
  },
  {
    label: "Entregadas",
    value: "92%",
    caption: "tasa de envío satisfactoria",
    tone: "surface",
  },
  {
    label: "Pendientes",
    value: "1",
    caption: "plantilla requiere revisión",
    tone: "warning",
  },
] as const;

const notificationRuleDefinitions: ReadonlyArray<NotificationRuleDefinition> = [
  {
    label: "Recordatorio 24h",
    description: "Envía un aviso automático un día antes de la reserva.",
    enabled: true,
  },
  {
    label: "Cancelación inmediata",
    description: "Notifica en cuanto una reserva quede cancelada o liberada.",
    enabled: true,
  },
  {
    label: "Aviso de lista de espera",
    description: "Informa cuando aparezca una mesa libre para un cliente en espera.",
    enabled: false,
  },
] as const;

const notificationTemplateDefinitions: ReadonlyArray<NotificationTemplateDefinition> = [
  {
    name: "Confirmación de reserva",
    channel: "Email + SMS",
    status: "Activo",
    statusTone: "active",
  },
  {
    name: "Recordatorio de llegada",
    channel: "WhatsApp",
    status: "Borrador",
    statusTone: "draft",
  },
  {
    name: "Cancelación y reembolso",
    channel: "Email",
    status: "Revisión",
    statusTone: "attention",
  },
] as const;

const notificationEventDefinitions: ReadonlyArray<NotificationEventDefinition> = [
  {
    time: "07:40",
    title: "Recordatorio enviado",
    description: "Se avisó a tres reservas del servicio de mediodía.",
  },
  {
    time: "10:22",
    title: "Plantilla actualizada",
    description: "La confirmación ahora incluye el enlace del mapa de acceso.",
  },
  {
    time: "16:15",
    title: "Aviso pendiente",
    description: "La plantilla de cancelación requiere validación manual antes de activarse.",
  },
] as const;

//-aqui empieza funcion getNotificationRuleIndicatorClassName y es para colorear las reglas activas-//
/**
 * Devuelve el color del interruptor de una regla de notificación.
 *
 * @pure
 */
function getNotificationRuleIndicatorClassName(enabled: boolean): string {
  return enabled ? "bg-secondary" : "bg-zinc-300";
}
//-aqui termina funcion getNotificationRuleIndicatorClassName-//

//-aqui empieza funcion getNotificationMetricClassName y es para colorear las métricas del panel-//
/**
 * Devuelve las clases visuales de una métrica de notificación.
 *
 * @pure
 */
function getNotificationMetricClassName(tone: NotificationMetricDefinition["tone"]): string {
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
//-aqui termina funcion getNotificationMetricClassName-//

//-aqui empieza funcion getNotificationMetricLabelClassName y es para ajustar los textos auxiliares-//
/**
 * Devuelve las clases del texto secundario de una métrica.
 *
 * @pure
 */
function getNotificationMetricLabelClassName(tone: NotificationMetricDefinition["tone"]): string {
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
//-aqui termina funcion getNotificationMetricLabelClassName-//

//-aqui empieza funcion getNotificationTemplateStatusClassName y es para pintar el estado de cada plantilla-//
/**
 * Devuelve las clases visuales del estado de una plantilla.
 *
 * @pure
 */
function getNotificationTemplateStatusClassName(statusTone: NotificationTemplateDefinition["statusTone"]): string {
  if (statusTone === "active") {
    return "bg-secondary-container text-on-secondary-container";
  }

  if (statusTone === "attention") {
    return "bg-tertiary-fixed text-on-tertiary-fixed";
  }

  return "bg-surface-container-highest text-on-surface-variant";
}
//-aqui termina funcion getNotificationTemplateStatusClassName-//

//-aqui empieza componente NotificationsToolbar y es para resumir el panel de alertas-//
/**
 * Renderiza la cabecera operativa de notificaciones.
 *
 * @pure
 */
function NotificationsToolbar() {
  return (
    <section className="flex flex-col gap-6 rounded-[28px] bg-surface-container-lowest p-8 shadow-sm md:flex-row md:items-end md:justify-between md:p-10">
      <div className="max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
          <T>Notificaciones</T>
        </p>
        <h2 className="mt-4 text-5xl font-black tracking-tighter text-primary md:text-6xl">
          <T>Controla alertas y mensajes automáticos.</T>
        </h2>
        <p className="mt-4 max-w-xl text-on-surface-variant md:text-lg md:leading-8">
          <T>
            Este MVP permite ver qué reglas existen, qué plantillas están listas y qué eventos se enviaron recientemente.
          </T>
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-surface-container-highest px-6 py-2.5 text-sm font-bold text-on-surface transition-colors hover:bg-surface-container-high" type="button">
          <OnboardingIcon name="contentCopy" className="h-4 w-4" />
          <T>Duplicar plantilla</T>
        </button>
        <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-on-primary transition-colors hover:opacity-90" type="button">
          <OnboardingIcon name="save" className="h-4 w-4" />
          <T>Guardar reglas</T>
        </button>
      </div>
    </section>
  );
}
//-aqui termina componente NotificationsToolbar-//

//-aqui empieza componente NotificationsMetricsGrid y es para mostrar el estado resumido-//
/**
 * Renderiza las métricas principales del panel de notificaciones.
 *
 * @pure
 */
function NotificationsMetricsGrid() {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {notificationMetricDefinitions.map((metricDefinition) => (
        <article className={`rounded-[24px] p-6 shadow-sm ${getNotificationMetricClassName(metricDefinition.tone)}`} key={metricDefinition.label}>
          <p className={`text-xs font-bold uppercase tracking-[0.22em] ${getNotificationMetricLabelClassName(metricDefinition.tone)}`}>
            <T>{metricDefinition.label}</T>
          </p>
          <p className="mt-4 text-4xl font-black tracking-tight">
            <T>{metricDefinition.value}</T>
          </p>
          <p className={`mt-2 text-sm leading-6 ${getNotificationMetricLabelClassName(metricDefinition.tone)}`}>
            <T>{metricDefinition.caption}</T>
          </p>
        </article>
      ))}
    </section>
  );
}
//-aqui termina componente NotificationsMetricsGrid-//

//-aqui empieza componente NotificationsRulesPanel y es para las reglas automaticas-//
/**
 * Renderiza las reglas operativas de notificación.
 *
 * @pure
 */
function NotificationsRulesPanel() {
  return (
    <section className="rounded-[28px] bg-surface-container-lowest p-8 shadow-sm">
      <div className="flex items-center gap-2">
        <OnboardingIcon name="checkCircle" className="h-5 w-5 text-secondary" />
        <h3 className="text-lg font-bold text-on-surface">
          <T>Reglas automáticas</T>
        </h3>
      </div>

      <div className="mt-6 space-y-4">
        {notificationRuleDefinitions.map((ruleDefinition) => (
          <article className="flex items-start justify-between gap-4 rounded-2xl bg-surface-container-low p-5" key={ruleDefinition.label}>
            <div className="flex gap-4">
              <button className={`relative mt-0.5 h-5 w-10 rounded-full transition-colors ${getNotificationRuleIndicatorClassName(ruleDefinition.enabled)}`} type="button" aria-label={ruleDefinition.label}>
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
//-aqui termina componente NotificationsRulesPanel-//

//-aqui empieza componente NotificationsTemplatesPanel y es para las plantillas-//
/**
 * Renderiza las plantillas de mensajes disponibles.
 *
 * @pure
 */
function NotificationsTemplatesPanel() {
  return (
    <section className="rounded-[28px] bg-surface-container-lowest p-8 shadow-sm">
      <h3 className="text-xl font-black tracking-tight text-primary md:text-2xl">
        <T>Plantillas</T>
      </h3>
      <p className="mt-1 text-sm text-on-surface-variant">
        <T>Versiones mínimas para validar los flujos antes de automatizarlos por completo.</T>
      </p>

      <div className="mt-6 space-y-4">
        {notificationTemplateDefinitions.map((templateDefinition) => (
          <article className="rounded-2xl bg-surface-container-low p-5" key={templateDefinition.name}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-primary">
                  <T>{templateDefinition.name}</T>
                </p>
                <p className="mt-1 text-sm leading-6 text-on-surface-variant">
                  <T>{templateDefinition.channel}</T>
                </p>
              </div>
              <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${getNotificationTemplateStatusClassName(templateDefinition.statusTone)}`}>
                <T>{templateDefinition.status}</T>
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
//-aqui termina componente NotificationsTemplatesPanel-//

//-aqui empieza componente NotificationsEventRail y es para mostrar la actividad reciente-//
/**
 * Renderiza el rail lateral de actividad reciente.
 *
 * @pure
 */
function NotificationsEventRail() {
  return (
    <section className="rounded-[28px] bg-primary p-8 text-on-primary shadow-sm">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/60">
          <T>Actividad</T>
        </p>
        <h3 className="mt-3 text-3xl font-black tracking-tight">
          <T>Mensajes recientes</T>
        </h3>
        <p className="mt-3 text-sm leading-7 text-white/75">
          <T>El historial sirve como referencia rápida antes de migrar estas reglas a un motor real.</T>
        </p>
      </div>

      <div className="mt-6 space-y-4 rounded-[24px] bg-white/10 p-5 backdrop-blur-sm">
        {notificationEventDefinitions.map((eventDefinition) => (
          <div className="flex gap-4" key={`${eventDefinition.time}-${eventDefinition.title}`}>
            <div className="w-16 shrink-0 rounded-full bg-white/10 px-3 py-2 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
              {eventDefinition.time}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-white">
                <T>{eventDefinition.title}</T>
              </p>
              <p className="mt-1 text-sm leading-6 text-white/70">
                <T>{eventDefinition.description}</T>
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
//-aqui termina componente NotificationsEventRail-//

//-aqui empieza pagina NotificationsPage y es para mostrar notificaciones-//
/**
 * Presenta la vista MVP de notificaciones del dashboard.
 */
export default function NotificationsPage() {
  return (
    <>
      <NotificationsToolbar />
      <NotificationsMetricsGrid />

      <section className="grid grid-cols-1 gap-8 xl:grid-cols-12">
        <div className="xl:col-span-8 space-y-8">
          <NotificationsRulesPanel />
          <NotificationsTemplatesPanel />
        </div>

        <div className="xl:col-span-4">
          <NotificationsEventRail />
        </div>
      </section>
    </>
  );
}
//-aqui termina pagina NotificationsPage-//
