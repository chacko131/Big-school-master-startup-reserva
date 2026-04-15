/**
 * Archivo: PublicTimeline.tsx
 * Responsabilidad: Mostrar un recorrido secuencial de estados o pasos públicos.
 * Tipo: UI
 */

import { T } from "@/components/T";
import type { PublicTimelineStep } from "@/lib/public/siteContent";

interface PublicTimelineProps {
  title: string;
  description: string;
  steps: PublicTimelineStep[];
  className?: string;
}

const statusStyles: Record<PublicTimelineStep["status"], string> = {
  complete: "bg-secondary text-white",
  active: "bg-primary text-background",
  pending: "bg-tertiary text-white",
};

//-aqui empieza componente PublicTimeline y es para mostrar pasos de estado-//
/**
 * Lista temporal de pasos con un estado visual por cada hito.
 */
export function PublicTimeline({ title, description, steps, className = "" }: PublicTimelineProps) {
  return (
    <section className={`rounded-[32px] bg-surface-container-low p-6 shadow-[0_20px_40px_rgba(26,28,28,0.06)] sm:p-8 ${className}`}>
      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
          <T>{title}</T>
        </h2>
        <p className="max-w-2xl text-sm leading-7 text-foreground/70">
          <T>{description}</T>
        </p>
      </div>

      <ol className="mt-8 space-y-4">
        {steps.map((step, index) => (
          <li key={step.title} className="flex gap-4 rounded-[24px] bg-surface-container-lowest p-4 shadow-[0_20px_40px_rgba(26,28,28,0.04)]">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${statusStyles[step.status]}`}>
              {index + 1}
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-foreground">
                <T>{step.title}</T>
              </h3>
              <p className="text-sm leading-6 text-foreground/68">
                <T>{step.description}</T>
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
//-aqui termina componente PublicTimeline-//
