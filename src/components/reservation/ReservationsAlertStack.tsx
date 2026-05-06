/**
 * Archivo: ReservationsAlertStack.tsx
 * Responsabilidad: Renderizar el panel de alertas operativas del servicio.
 * Tipo: UI
 */

import { T } from "@/components/T";

export interface OperationalAlertDefinition {
  title: string;
  description: string;
  tone: "warning" | "success";
}

interface ReservationsAlertStackProps {
  alerts: ReadonlyArray<OperationalAlertDefinition>;
}

//-aqui empieza componente ReservationsAlertStack y es para mostrar las alertas operativas-//
/**
 * Renderiza el panel de alertas operativas.
 *
 * @pure
 */
export function ReservationsAlertStack({ alerts }: ReservationsAlertStackProps) {
  return (
    <section className="space-y-4">
      <h3 className="px-2 text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
        <T>Alertas operativas</T>
      </h3>

      {alerts.map((alertDefinition) => {
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
