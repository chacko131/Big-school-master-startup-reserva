/**
 * Archivo: page.tsx
 * Responsabilidad: Renderizar la visión global del panel SaaS de administración.
 * Tipo: UI
 */

import Link from "next/link";
import { T } from "@/components/T";
import { OnboardingIcon } from "@/components/onboarding/OnboardingIcon";

interface AdminMetricDefinition {
  label: string;
  value: string;
  caption: string;
  tone: "primary" | "secondary" | "surface" | "warning";
}

interface AdminShortcutDefinition {
  label: string;
  description: string;
  href: string;
  icon: "settings" | "storefront" | "payments" | "person" | "help" | "rocketLaunch";
  tone: "primary" | "secondary" | "surface" | "warning";
}

interface AdminActivityDefinition {
  time: string;
  title: string;
  description: string;
}

const adminMetricDefinitions: ReadonlyArray<AdminMetricDefinition> = [
  {
    label: "Restaurantes activos",
    value: "128",
    caption: "tenants supervisados hoy",
    tone: "primary",
  },
  {
    label: "MRR estimado",
    value: "€34.8k",
    caption: "ingreso recurrente mensual del SaaS",
    tone: "secondary",
  },
  {
    label: "Incidencias abiertas",
    value: "3",
    caption: "eventos operativos que requieren seguimiento",
    tone: "surface",
  },
  {
    label: "Usuarios activos",
    value: "412",
    caption: "cuentas con actividad reciente",
    tone: "warning",
  },
] as const;

const adminShortcutDefinitions: ReadonlyArray<AdminShortcutDefinition> = [
  {
    label: "Restaurantes",
    description: "Auditar tenants, revisar estado y abrir detalle.",
    href: "/admin/restaurants",
    icon: "storefront",
    tone: "primary",
  },
  {
    label: "Suscripciones",
    description: "Controlar planes, cobros e incidencias de billing.",
    href: "/admin/subscriptions",
    icon: "payments",
    tone: "secondary",
  },
  {
    label: "Usuarios",
    description: "Revisar accesos globales, roles y membresías.",
    href: "/admin/users",
    icon: "person",
    tone: "surface",
  },
  {
    label: "Incidencias",
    description: "Monitorear webhooks, errores y problemas críticos.",
    href: "/admin/incidents",
    icon: "help",
    tone: "warning",
  },
  {
    label: "Feature flags",
    description: "Liberar módulos de forma progresiva.",
    href: "/admin/feature-flags",
    icon: "rocketLaunch",
    tone: "surface",
  },
] as const;

const adminActivityDefinitions: ReadonlyArray<AdminActivityDefinition> = [
  {
    time: "08:45",
    title: "Nuevo tenant creado",
    description: "Casa Luma completó onboarding y activó el plan Growth.",
  },
  {
    time: "09:20",
    title: "Webhook reintentado",
    description: "Se recuperó una notificación fallida de facturación.",
  },
  {
    time: "10:05",
    title: "Revisión manual",
    description: "Se marcó un restaurante en estado de observación por churn.",
  },
] as const;

//-aqui empieza funcion getAdminMetricToneClassName y es para pintar el tono visual de las metricas-//
/**
 * Devuelve la clase de tono para las métricas del panel admin.
 *
 * @pure
 */
function getAdminMetricToneClassName(tone: AdminMetricDefinition["tone"]): string {
  switch (tone) {
    case "primary":
      return "bg-primary text-on-primary";
    case "secondary":
      return "bg-secondary-container text-secondary";
    case "surface":
      return "bg-surface-container-low text-on-surface";
    case "warning":
      return "bg-warning-container text-warning";
    default:
      return "bg-surface-container-low text-on-surface";
  }
}
//-aqui termina funcion getAdminMetricToneClassName-//

//-aqui empieza funcion getAdminShortcutToneClassName y es para pintar el tono de los accesos rapidos-//
/**
 * Devuelve la clase de tono para los accesos rápidos.
 *
 * @pure
 */
function getAdminShortcutToneClassName(tone: AdminShortcutDefinition["tone"]): string {
  switch (tone) {
    case "primary":
      return "border-primary/20 bg-primary/5";
    case "secondary":
      return "border-secondary/20 bg-secondary/5";
    case "surface":
      return "border-outline-variant/20 bg-surface-container-low";
    case "warning":
      return "border-warning/20 bg-warning/5";
    default:
      return "border-outline-variant/20 bg-surface-container-low";
  }
}
//-aqui termina funcion getAdminShortcutToneClassName-//

//-aqui empieza componente AdminMetricCard y es para mostrar una metrica de plataforma-//
interface AdminMetricCardProps {
  label: string;
  value: string;
  caption: string;
  tone: AdminMetricDefinition["tone"];
}

/**
 * Renderiza una tarjeta de métrica del panel admin.
 *
 * @pure
 */
function AdminMetricCard({ label, value, caption, tone }: AdminMetricCardProps) {
  return (
    <article className={`rounded-[24px] px-5 py-6 shadow-sm ${getAdminMetricToneClassName(tone)}`}>
      <p className="text-[10px] font-bold uppercase tracking-[0.22em] opacity-80">
        <T>{label}</T>
      </p>
      <p className="mt-3 text-4xl font-black tracking-tight">
        <T>{value}</T>
      </p>
      <p className="mt-2 text-sm leading-5 opacity-80">
        <T>{caption}</T>
      </p>
    </article>
  );
}
//-aqui termina componente AdminMetricCard-//

//-aqui empieza componente AdminShortcutCard y es para mostrar accesos rapidos del panel-//
interface AdminShortcutCardProps {
  label: string;
  description: string;
  href: string;
  icon: AdminShortcutDefinition["icon"];
  tone: AdminShortcutDefinition["tone"];
}

/**
 * Renderiza una tarjeta de acceso rápido a una superficie del panel.
 *
 * @pure
 */
function AdminShortcutCard({ label, description, href, icon, tone }: AdminShortcutCardProps) {
  return (
    <Link className={`flex h-full flex-col rounded-[24px] border p-5 transition-transform hover:-translate-y-0.5 ${getAdminShortcutToneClassName(tone)}`} href={href}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-surface text-on-surface shadow-sm">
          <OnboardingIcon name={icon} className="h-5 w-5" />
        </div>
        <span className="rounded-full bg-surface px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
          <T>Ir</T>
        </span>
      </div>
      <h2 className="mt-5 text-xl font-black tracking-tight text-primary">
        <T>{label}</T>
      </h2>
      <p className="mt-2 text-sm leading-6 text-on-surface-variant">
        <T>{description}</T>
      </p>
    </Link>
  );
}
//-aqui termina componente AdminShortcutCard-//

//-aqui empieza componente AdminActivityRail y es para mostrar la actividad reciente-//
/**
 * Renderiza la actividad reciente del SaaS.
 *
 * @pure
 */
function AdminActivityRail() {
  return (
    <section className="rounded-[28px] border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
            <T>Actividad reciente</T>
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-primary">
            <T>Señales de plataforma</T>
          </h2>
        </div>
        <OnboardingIcon name="schedule" className="h-5 w-5 text-on-surface-variant" />
      </div>

      <div className="mt-6 space-y-4">
        {adminActivityDefinitions.map((activityDefinition) => (
          <article className="rounded-2xl bg-surface-container-low p-4" key={activityDefinition.title}>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              {activityDefinition.time}
            </p>
            <h3 className="mt-2 text-sm font-bold text-on-surface">
              <T>{activityDefinition.title}</T>
            </h3>
            <p className="mt-1 text-sm leading-6 text-on-surface-variant">
              <T>{activityDefinition.description}</T>
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
//-aqui termina componente AdminActivityRail-//

//-aqui empieza pagina AdminPage y es para mostrar la portada del panel SaaS-//
/**
 * Renderiza la vista principal del panel de administración.
 */
export default function AdminPage() {
  return (
    <>
      <section className="rounded-[28px] bg-primary px-6 py-8 text-on-primary shadow-sm md:px-8 md:py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_0.8fr] lg:items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-on-primary/70">
              <T>Supervisión interna</T>
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">
              <T>Panel de administración del SaaS</T>
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-7 text-on-primary/80">
              <T>Vista global para operar tenants, suscripciones, usuarios y salud de la plataforma antes de conectar la lógica real.</T>
            </p>
          </div>

          <div className="rounded-[24px] bg-white/10 p-5 backdrop-blur-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-primary/70">
              <T>Contexto</T>
            </p>
            <p className="mt-3 text-sm leading-6 text-on-primary/85">
              <T>Esta superficie está pensada para el equipo interno y se protegerá después con middleware y roles de plataforma.</T>
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {adminMetricDefinitions.map((metricDefinition) => (
          <AdminMetricCard
            caption={metricDefinition.caption}
            key={metricDefinition.label}
            label={metricDefinition.label}
            tone={metricDefinition.tone}
            value={metricDefinition.value}
          />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-8 xl:grid-cols-[1.5fr_0.95fr]">
        <div className="space-y-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
              <T>Accesos principales</T>
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-primary">
              <T>Superficies del panel</T>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {adminShortcutDefinitions.map((shortcutDefinition) => (
              <AdminShortcutCard
                description={shortcutDefinition.description}
                href={shortcutDefinition.href}
                icon={shortcutDefinition.icon}
                key={shortcutDefinition.label}
                label={shortcutDefinition.label}
                tone={shortcutDefinition.tone}
              />
            ))}
          </div>
        </div>

        <AdminActivityRail />
      </section>
    </>
  );
}
//-aqui termina pagina AdminPage-//
