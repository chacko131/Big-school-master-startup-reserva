/**
 * Archivo: PlanCard.tsx
 * Responsabilidad: Presentar las características, precio mensual y estado de contratación de un plan específico.
 * Tipo: UI
 */

import { T } from "@/components/T";
import { OnboardingIcon } from "@/components/onboarding/OnboardingIcon";

export interface PlanCardProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  isCurrent: boolean;
  accent?: boolean;
  isLoading?: boolean;
  onSelect?: () => void;
}

//-aqui empieza componente PlanCard y es para renderizar la tarjeta del plan de suscripción-//
/**
 * Renderiza la tarjeta de un plan de suscripción con su listado de beneficios y botón de acción.
 * @pure
 */
export function PlanCard({
  name,
  price,
  description,
  features,
  isCurrent,
  accent = false,
  isLoading = false,
  onSelect,
}: PlanCardProps) {
  return (
    <article
      className={`relative flex flex-col rounded-[28px] p-6 shadow-sm border transition-all duration-300 ${
        isCurrent
          ? "border-primary bg-primary/5 ring-1 ring-primary"
          : accent
          ? "border-indigo-500/30 bg-surface-container-low hover:border-indigo-500/50"
          : "border-outline-variant/20 bg-surface-container-low hover:border-outline-variant/40"
      }`}
    >
      {isCurrent && (
        <span className="absolute -top-3 right-6 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-on-primary">
          <T>Tu Plan Actual</T>
        </span>
      )}

      <div className="mb-5">
        <h3 className="text-xl font-black tracking-tight text-primary">
          <T>{name}</T>
        </h3>
        <p className="mt-2 text-xs text-on-surface-variant leading-5">
          <T>{description}</T>
        </p>
      </div>

      <div className="mb-6 flex items-baseline gap-1 text-on-surface">
        <span className="text-3xl font-black tracking-tight">{price}</span>
        <span className="text-sm font-semibold text-on-surface-variant">
          <T>/mes</T>
        </span>
      </div>

      <div className="flex-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
          <T>Beneficios incluidos</T>
        </p>
        <ul className="mt-4 space-y-3">
          {features.map((feature) => (
            <li className="flex items-start gap-2.5 text-xs text-on-surface" key={feature}>
              <span
                className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                  isCurrent || accent
                    ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                    : "bg-surface-container-highest text-on-surface-variant"
                }`}
              >
                <OnboardingIcon name="checkCircle" className="h-3 w-3" />
              </span>
              <span>
                <T>{feature}</T>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8">
        {isCurrent ? (
          <button
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-on-primary cursor-default opacity-90"
            type="button"
            disabled
          >
            <T>Plan Actual</T>
          </button>
        ) : (
          <button
            className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200 ${
              isLoading
                ? "opacity-50 cursor-wait bg-surface-container-high text-on-surface-variant"
                : accent
                ? "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98] cursor-pointer"
                : "border border-outline-variant/30 bg-surface-container-high text-on-surface hover:bg-surface-container-highest active:scale-[0.98] cursor-pointer"
            }`}
            type="button"
            disabled={isLoading}
            onClick={onSelect}
          >
            {isLoading ? <T>Procesando...</T> : <T>Seleccionar Plan</T>}
          </button>
        )}
      </div>
    </article>
  );
}
//-aqui termina componente PlanCard-//
