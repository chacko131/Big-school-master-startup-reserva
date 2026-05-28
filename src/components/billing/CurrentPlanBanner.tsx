/**
 * Archivo: CurrentPlanBanner.tsx
 * Responsabilidad: Mostrar un resumen visual de la suscripción del restaurante (estado de cobro, trial, renovación).
 * Tipo: UI
 */

import { T } from "@/components/T";
import { OnboardingIcon } from "@/components/onboarding/OnboardingIcon";

export interface CurrentPlanBannerProps {
  planId: "basic" | "pro" | "none";
  status: string;
  isTrial: boolean;
  trialEndsAt: Date | null;
  currentPeriodEnd: Date | null;
  remainingTrialDays: number;
}

//-aqui empieza componente CurrentPlanBanner y es para mostrar la información del plan contratado-//
/**
 * Renderiza el banner del estado actual del plan del restaurante.
 * @pure
 */
export function CurrentPlanBanner({
  planId,
  status,
  isTrial,
  trialEndsAt,
  currentPeriodEnd,
  remainingTrialDays,
}: CurrentPlanBannerProps) {
  // Renderizar la fecha formateada
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <article className="overflow-hidden rounded-[28px] border border-outline-variant/20 bg-surface-container-lowest shadow-sm">
      <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-start lg:justify-between md:p-8">
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary-container px-3 py-1 text-xs font-bold uppercase tracking-wider text-on-secondary-container">
            <OnboardingIcon name="payments" className="h-4 w-4" />
            <T>Plan Activo</T>
          </div>

          <h3 className="mt-4 text-3xl font-black tracking-tight text-primary md:text-4xl">
            {planId === "pro" && (isTrial ? <T>Periodo de Prueba Pro (Gratuito)</T> : <T>Plan Operativo Pro</T>)}
            {planId === "basic" && <T>Plan Operativo Básico</T>}
            {planId === "none" && <T>Sin Plan Activo</T>}
          </h3>

          <p className="mt-3 text-sm leading-6 text-on-surface-variant md:text-base md:leading-7">
            {planId === "none" ? (
              <T>Actualmente no cuentas con ninguna suscripción activa. Elige un plan abajo para activar tu sala.</T>
            ) : isTrial ? (
              <T>{`Estás utilizando el acceso completo Pro gracias al trial local gratuito de 60 días sin tarjeta.`}</T>
            ) : (
              <T>Tu plan está al día y sincronizado con tu cuenta de Stripe de forma segura.</T>
            )}
          </p>
        </div>

        {planId !== "none" && (
          <div className="rounded-[24px] bg-primary p-6 text-on-primary shadow-sm lg:min-w-[240px]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/60">
              {isTrial ? <T>Tiempo restante</T> : <T>Siguiente Renovación</T>}
            </p>

            <p className="mt-3 text-3xl font-black tracking-tight">
              {isTrial ? `${remainingTrialDays} días` : currentPeriodEnd ? formatDate(currentPeriodEnd) : "-"}
            </p>

            <p className="mt-2 text-xs text-white/70">
              {isTrial && trialEndsAt ? (
                <T>{`Finaliza el ${formatDate(trialEndsAt)}`}</T>
              ) : status === "canceled" ? (
                <T>Cancelación programada</T>
              ) : (
                <T>Cobro recurrente automático</T>
              )}
            </p>
          </div>
        )}
      </div>
    </article>
  );
}
//-aqui termina componente CurrentPlanBanner-//
