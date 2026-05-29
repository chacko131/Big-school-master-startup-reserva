"use client";

/**
 * Archivo: PlanSelector.tsx
 * Responsabilidad: Combinar el banner de suscripción actual con el grid de selección de planes de cobro de forma interactiva.
 * Tipo: UI
 */

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { T } from "@/components/T";
import { PlanCard } from "./PlanCard";
import { CurrentPlanBanner } from "./CurrentPlanBanner";
import { subscribeToPlanAction } from "@/app/(dashboard)/dashboard/billing/actions";

export interface PlanSelectorProps {
  subscription: {
    planId: "basic" | "pro" | "none";
    status: string;
    isTrial: boolean;
    trialEndsAt: Date | null;
    currentPeriodEnd: Date | null;
    remainingTrialDays: number;
  };
}

//-aqui empieza componente PlanSelector y es para orquestar la vista de planes del cliente-//
/**
 * Renderiza el banner del plan activo y el listado de planes disponibles de forma interactiva.
 * @pure
 */
export function PlanSelector({ subscription }: PlanSelectorProps) {
  const [loadingPlan, setLoadingPlan] = useState<"basic" | "pro" | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const isSuccessUpgrade = searchParams.get("success") === "upgrade";

  const handleSelectPlan = async (planId: "basic" | "pro") => {
    setLoadingPlan(planId);
    setErrorMessage(null);

    const result = await subscribeToPlanAction(planId);

    if (!result.success || !result.url) {
      setErrorMessage(result.error ?? "Ocurrió un error al procesar el pago con Stripe.");
      setLoadingPlan(null);
      return;
    }

    // Redirigimos a Stripe Checkout o Customer Portal
    window.location.href = result.url;
  };

  // Lista de beneficios del Plan Básico
  const basicFeatures = [
    "Reservas online ilimitadas",
    "Gestión básica de sala y mesas",
    "Panel operativo en tiempo real",
    "Recordatorios básicos por email",
    "Soporte técnico estándar",
  ];

  // Lista de beneficios del Plan Pro
  const proFeatures = [
    "Todo lo incluido en el Plan Básico",
    "Lista de espera automática para clientes",
    "Métricas y reportes de conversión avanzados",
    "Gestión multiusuario avanzada con roles",
    "Configuraciones de tiempo y ventanas límites",
    "Soporte prioritario 24/7",
  ];

  return (
    <section className="space-y-8">
      {/* Banner con los detalles del plan activo */}
      <CurrentPlanBanner
        planId={subscription.planId}
        status={subscription.status}
        isTrial={subscription.isTrial}
        trialEndsAt={subscription.trialEndsAt}
        currentPeriodEnd={subscription.currentPeriodEnd}
        remainingTrialDays={subscription.remainingTrialDays}
      />

      {errorMessage && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-xs font-bold text-red-600 dark:text-red-400">
          <T>{errorMessage}</T>
        </div>
      )}

      {isSuccessUpgrade && (
        <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-xs font-bold text-green-600 dark:text-green-400">
          <T>¡El plan se ha actualizado correctamente!</T>
        </div>
      )}

      <div>
        <div className="mb-6">
          <h3 className="text-xl font-black tracking-tight text-primary">
            <T>Planes de suscripción disponibles</T>
          </h3>
          <p className="mt-1 text-sm text-on-surface-variant">
            <T>Escoge el plan que mejor se adapte al volumen y necesidades de tu restaurante.</T>
          </p>
        </div>

        {/* Grid de planes */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <PlanCard
            name="Plan Básico"
            description="La base perfecta para digitalizar el libro de reservas y gestionar tus mesas de forma digital."
            price="69,99 €"
            features={basicFeatures}
            isCurrent={subscription.planId === "basic" && !subscription.isTrial}
            isLoading={loadingPlan === "basic"}
            onSelect={() => handleSelectPlan("basic")}
          />

          <PlanCard
            name="Plan Pro"
            description="Potencia al máximo tu sala con automatizaciones, analíticas de reservas e invitados."
            price="149,99 €"
            features={proFeatures}
            isCurrent={subscription.planId === "pro" || (subscription.planId === "none" && subscription.isTrial)}
            accent={true}
            isLoading={loadingPlan === "pro"}
            onSelect={() => handleSelectPlan("pro")}
          />
        </div>
      </div>
    </section>
  );
}
//-aqui termina componente PlanSelector-//
