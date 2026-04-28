/**
 * Archivo: SettingsOverviewCards.tsx
 * Responsabilidad: Mostrar las tarjetas resumen de la configuración operativa con datos mock.
 * Tipo: UI
 */

import { T } from "@/components/T";

interface SettingsOverviewCardDefinition {
  title: string;
  value: string;
  description: string;
  tone: "primary" | "secondary" | "surface" | "warning";
}

const settingsOverviewCardDefinitions: ReadonlyArray<SettingsOverviewCardDefinition> = [
  {
    title: "Reglas activas",
    value: "3",
    description: "Buffer, waitlist y aprobación manual",
    tone: "primary",
  },
  {
    title: "Integraciones",
    value: "2",
    description: "Stripe y calendario sincronizados",
    tone: "secondary",
  },
  {
    title: "Usuarios activos",
    value: "8",
    description: "Equipo operativo y administración",
    tone: "surface",
  },
  {
    title: "Acciones pendientes",
    value: "1",
    description: "Revisar plantillas de email",
    tone: "warning",
  },
] as const;

//-aqui empieza funcion getSettingsOverviewCardClassName y es para pintar la tarjeta segun el tono-//
/**
 * Devuelve las clases visuales de una tarjeta resumen.
 *
 * @pure
 */
function getSettingsOverviewCardClassName(tone: SettingsOverviewCardDefinition["tone"]): string {
  if (tone === "primary") {
    return "bg-primary text-on-primary";
  }

  if (tone === "secondary") {
    return "bg-secondary-container text-on-secondary-container";
  }

  if (tone === "warning") {
    return "bg-tertiary-fixed text-on-tertiary-fixed";
  }

  return "bg-surface-container-lowest text-on-surface shadow-sm";
}
//-aqui termina funcion getSettingsOverviewCardClassName-//

//-aqui empieza componente SettingsOverviewCards y es para mostrar el bloque de resumen operativo-//
/**
 * Renderiza las tarjetas resumen de la configuración.
 *
 * @pure
 */
export function SettingsOverviewCards() {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {settingsOverviewCardDefinitions.map((cardDefinition) => (
        <article className={`rounded-[24px] p-6 shadow-sm ${getSettingsOverviewCardClassName(cardDefinition.tone)}`} key={cardDefinition.title}>
          <p className={`text-xs font-bold uppercase tracking-[0.22em] ${cardDefinition.tone === "primary" ? "text-white/60" : cardDefinition.tone === "secondary" ? "text-on-secondary-container/75" : cardDefinition.tone === "warning" ? "text-on-tertiary-fixed/75" : "text-on-surface-variant"}`}>
            <T>{cardDefinition.title}</T>
          </p>
          <p className="mt-4 text-4xl font-black tracking-tight">
            <T>{cardDefinition.value}</T>
          </p>
          <p className={`mt-2 text-sm leading-6 ${cardDefinition.tone === "primary" ? "text-white/75" : cardDefinition.tone === "secondary" ? "text-on-secondary-container/75" : cardDefinition.tone === "warning" ? "text-on-tertiary-fixed/75" : "text-on-surface-variant"}`}>
            <T>{cardDefinition.description}</T>
          </p>
        </article>
      ))}
    </section>
  );
}
//-aqui termina componente SettingsOverviewCards-//
