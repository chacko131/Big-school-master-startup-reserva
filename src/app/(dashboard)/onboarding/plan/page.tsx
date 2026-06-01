/**
 * Archivo: page.tsx
 * Responsabilidad: Renderizar el paso de selección de plan dentro del onboarding del restaurante.
 * Tipo: UI
 */

import { redirect } from "next/navigation";
import { ONBOARDING_TOTAL_STEPS, getOnboardingStepNumber, getOnboardingSteps } from "@/constants/onboarding";
import { T } from "@/components/T";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { getCatalogInfrastructure } from "@/modules/catalog/infrastructure/catalog-infrastructure";
import { getBillingInfrastructure } from "@/modules/billing/infrastructure/billing-infrastructure";
import { StartTrialSubscription } from "@/modules/billing/application/use-cases/StartTrialSubscription/start-trial-subscription.use-case";
import { ActiveSubscriptionTrialForbiddenError } from "@/modules/billing/domain/errors/billing.errors";
import { GetCurrentPlanForRestaurant } from "@/modules/billing/application/use-cases/GetCurrentPlanForRestaurant/get-current-plan-for-restaurant.use-case";
import { PlanSelector } from "@/components/billing/PlanSelector";
import { CurrentPlanBanner } from "@/components/billing/CurrentPlanBanner";

const planPageLayoutClassName = "flex w-full max-w-4xl flex-col gap-10";
const planCompletionFormId = "plan-completion-form";

//-aqui empieza funcion ensurePlanPrerequisites y es para bloquear el paso de plan si faltan pasos previos-//
/**
 * Valida que el onboarding mínimo esté completo antes de mostrar el plan.
 * @sideEffect
 */
async function ensurePlanPrerequisites(restaurantId: string): Promise<void> {
  if (restaurantId.trim().length === 0) {
    redirect("/onboarding/restaurant");
  }

  const catalogInfrastructure = getCatalogInfrastructure();
  const restaurant = await catalogInfrastructure.restaurantRepository.findById(restaurantId);

  if (restaurant === null) {
    redirect("/onboarding/restaurant");
  }

  const restaurantSettings = await catalogInfrastructure.restaurantSettingsRepository.findByRestaurantId(restaurantId);

  if (restaurantSettings === null) {
    redirect(`/onboarding/settings?restaurantId=${restaurantId}`);
  }

  const diningTables = await catalogInfrastructure.diningTableRepository.findByRestaurantId(restaurantId);

  if (diningTables.length === 0) {
    redirect(`/onboarding/tables?restaurantId=${restaurantId}`);
  }
}
//-aqui termina funcion ensurePlanPrerequisites y se va autilizar en la pagina-//

//-aqui empieza funcion completeOnboardingAndGoToDashboardAction y es para activar el trial e ir al dashboard-//
/**
 * Activa el trial de 60 días para el restaurante y redirige al dashboard.
 * Si el trial ya existe o la suscripción ya está activa, continúa igualmente.
 * @sideEffect
 */
async function completeOnboardingAndGoToDashboardAction(restaurantId: string) {
  "use server";

  if (restaurantId.trim().length > 0) {
    try {
      const { subscriptionRepository } = getBillingInfrastructure();
      const useCase = new StartTrialSubscription(subscriptionRepository);
      await useCase.execute({ restaurantId });
    } catch (error) {
      // Cualquier otro error (BD inaccesible, restaurantId inválido, etc.) se relanza
      if (!(error instanceof ActiveSubscriptionTrialForbiddenError)) {
        throw error;
      }
      // Si ya tiene suscripción activa, continuamos igualmente al dashboard
    }
  }

  redirect("/dashboard");
}
//-aqui termina funcion completeOnboardingAndGoToDashboardAction y se va autilizar en el footer-//

//-aqui empieza componente TrialHero y es para comunicar el periodo gratuito de 60 días al usuario-//
/**
 * Cabecera informativa del paso de plan que comunica el trial gratuito.
 * @pure
 */
function TrialHero() {
  return (
    <section className="rounded-[28px] bg-secondary-container px-6 py-8 shadow-sm md:px-8 md:py-10">
      <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-on-surface-variant">
        <T>Bienvenido a Reserva Latina</T>
      </p>
      <h1 className="mt-3 text-4xl font-black tracking-tight text-primary md:text-5xl">
        <T>60 días gratis, sin tarjeta.</T>
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-7 text-on-surface-variant">
        <T>
          Tu restaurante tiene acceso completo al Plan Pro durante 60 días sin coste. Cuando quieras, activa el plan que mejor se adapte a tu negocio.
        </T>
      </p>
    </section>
  );
}
//-aqui termina componente TrialHero-//

//-aqui empieza componente TrialFooter y es para cerrar el paso de plan con el CTA de activar el trial-//
interface TrialFooterProps {
  action: () => Promise<void>;
}

/**
 * Footer con el formulario para activar el trial y entrar al dashboard.
 * @pure
 */
function TrialFooter({ action }: TrialFooterProps) {
  return (
    <section className="border-t border-outline-variant/20 py-8">
      <form action={action} id={planCompletionFormId}>
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-6 text-on-surface-variant">
            <T>Sin compromisos. Cancela cuando quieras. Datos seguros con cifrado SSL 256 bits.</T>
          </p>
          <button
            className="rounded-lg bg-primary px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] text-on-primary transition-all hover:opacity-90"
            type="submit"
          >
            <T>Activar prueba gratuita →</T>
          </button>
        </div>
      </form>
    </section>
  );
}
//-aqui termina componente TrialFooter-//

//-aqui empieza pagina PlanOnboardingPage y es para montar el paso final de seleccion de plan del onboarding-//
/**
 * Muestra el periodo de prueba gratuito y los planes disponibles para contratar.
 * Activa el trial al confirmar y redirige al dashboard.
 * @sideEffect
 */
export default async function PlanOnboardingPage({ searchParams }: { searchParams: Promise<{ restaurantId?: string }> }) {
  const { restaurantId = "" } = await searchParams;
  await ensurePlanPrerequisites(restaurantId);

  // Consultamos el plan actual para mostrarlo en el banner (puede ser null si aún no hay suscripción)
  const billingInfrastructure = getBillingInfrastructure();
  const getCurrentPlan = new GetCurrentPlanForRestaurant(billingInfrastructure.subscriptionRepository);
  const plan = await getCurrentPlan.execute({ restaurantId });

  const currentStepKey = "plan" as const;
  const currentStepNumber = getOnboardingStepNumber(currentStepKey);
  const onboardingSteps = getOnboardingSteps(currentStepKey);

  return (
    <OnboardingShell
      currentStepNumber={currentStepNumber}
      mobilePrimaryAction={{ label: "Activar prueba gratuita", formId: planCompletionFormId, icon: "arrowForward" }}
      steps={onboardingSteps}
      title="Plan de pago"
      totalSteps={ONBOARDING_TOTAL_STEPS}
    >
      <div className={planPageLayoutClassName}>
        <TrialHero />
        {plan.hasActivePlan && (
          <CurrentPlanBanner
            planId={plan.planId}
            status={plan.status}
            isTrial={plan.isTrial}
            trialEndsAt={plan.trialEndsAt}
            currentPeriodEnd={plan.currentPeriodEnd}
            remainingTrialDays={plan.remainingTrialDays}
          />
        )}
        <PlanSelector subscription={plan} />
        <TrialFooter action={completeOnboardingAndGoToDashboardAction.bind(null, restaurantId)} />
      </div>
    </OnboardingShell>
  );
}
//-aqui termina pagina PlanOnboardingPage-//
