/**
 * Archivo: page.tsx
 * Responsabilidad: Renderizar la vista de planes y estado de facturación para el restaurante tenant.
 * Tipo: UI
 */

import { getRestaurantIdFromSession } from "@/modules/auth/get-restaurant-id";
import { getBillingInfrastructure } from "@/modules/billing/infrastructure/billing-infrastructure";
import { GetCurrentPlanForRestaurant } from "@/modules/billing/application/use-cases/GetCurrentPlanForRestaurant/get-current-plan-for-restaurant.use-case";
import { PlanSelector } from "@/components/billing/PlanSelector";
import { T } from "@/components/T";

//-aqui empieza pagina BillingPage y es para mostrar la facturación del restaurante-//
/**
 * Renderiza el dashboard de facturación del restaurante consultando su suscripción en tiempo real.
 */
export default async function BillingPage() {
  let plan;
  try {
    const restaurantId = await getRestaurantIdFromSession();
    const billingInfrastructure = getBillingInfrastructure();
    const getCurrentPlan = new GetCurrentPlanForRestaurant(billingInfrastructure.subscriptionRepository);

    plan = await getCurrentPlan.execute({ restaurantId });
  } catch (error) {
    console.error("Error al cargar la página de facturación para el restaurante:", error);
    throw error;
  }

  return (
    <>
      <section className="rounded-[28px] bg-secondary-container px-6 py-8 shadow-sm md:px-8 md:py-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-on-surface-variant">
          <T>Facturación</T>
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-primary md:text-5xl">
          <T>Planes y Suscripción</T>
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-7 text-on-surface-variant">
          <T>Consulta el estado de tu suscripción actual y explora las opciones de planes del sistema.</T>
        </p>
      </section>

      <PlanSelector subscription={plan} />
    </>
  );
}
//-aqui termina pagina BillingPage-//
