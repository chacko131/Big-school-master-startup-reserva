/**
 * Archivo: ReservationsPacingPanel.tsx
 * Responsabilidad: Renderizar el panel de ritmo de servicio con barras de actividad por hora.
 * Tipo: UI
 */

import { T } from "@/components/T";
import { OnboardingIcon } from "@/components/onboarding/OnboardingIcon";

interface ReservationsPacingPanelProps {
  bars: ReadonlyArray<number>;
  labels: ReadonlyArray<string>;
  description: string;
}

//-aqui empieza componente ReservationsPacingPanel y es para mostrar el ritmo del servicio-//
/**
 * Renderiza el panel de ritmo de servicio.
 *
 * @pure
 */
export function ReservationsPacingPanel({ bars, labels, description }: ReservationsPacingPanelProps) {
  return (
    <section className="rounded-2xl bg-surface-container-lowest p-8 shadow-sm">
      <div className="flex items-center gap-2">
        <OnboardingIcon name="schedule" className="h-5 w-5 text-secondary" />
        <h3 className="text-lg font-bold text-on-surface">
          <T>Ritmo de hoy</T>
        </h3>
      </div>
      <div className="mt-6 flex h-40 items-end gap-2">
        {bars.map((barHeight, index) => (
          <div className="flex-1" key={labels[index]}>
            <div className="rounded-t-lg bg-surface-container-high" style={{ height: `${barHeight}%` }} />
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-between text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
        {labels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <p className="mt-5 text-sm leading-7 text-on-surface-variant">
        <T>{description}</T>
      </p>
    </section>
  );
}
//-aqui termina componente ReservationsPacingPanel-//
