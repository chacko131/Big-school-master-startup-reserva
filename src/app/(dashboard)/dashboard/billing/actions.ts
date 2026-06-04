"use server";

/**
 * Archivo: actions.ts
 * Responsabilidad: Exponer las Server Actions del módulo de facturación para el dashboard.
 * Tipo: servicio
 */

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getRestaurantIdFromSession } from "@/modules/auth/get-restaurant-id";
import { getBillingInfrastructure } from "@/modules/billing/infrastructure/billing-infrastructure";
import { CreateCheckoutSession } from "@/modules/billing/application/use-cases/CreateCheckoutSession/create-checkout-session.use-case";
import { CreateCustomerPortalSession } from "@/modules/billing/application/use-cases/CreateCustomerPortalSession/create-customer-portal-session.use-case";
import { ChangeSubscriptionPlan } from "@/modules/billing/application/use-cases/ChangeSubscriptionPlan/change-subscription-plan.use-case";
import { captureUnexpectedError } from "@/lib/sentry";

export interface SubscribeToPlanResult {
  success: boolean;
  url?: string;
  error?: string;
}

//-aqui empieza funcion subscribeToPlanAction y es una Server Action para gestionar el cobro del plan-//
/**
 * Crea una sesión de Stripe Checkout o redirige al Customer Portal para gestionar la suscripción del restaurante.
 * @sideEffect — realiza llamadas a la base de datos y peticiones de red a Stripe API.
 */
export async function subscribeToPlanAction(planId: "basic" | "pro"): Promise<SubscribeToPlanResult> {
  console.log(`[subscribeToPlanAction] Iniciando proceso de suscripción para el plan: "${planId}"`);
  try {
    const restaurantId = await getRestaurantIdFromSession();
    console.log(`[subscribeToPlanAction] Restaurant ID recuperado de la sesión: "${restaurantId}"`);
    if (!restaurantId) {
      console.warn("[subscribeToPlanAction] Advertencia: No se encontró restaurantId activo en la sesión.");
      return { success: false, error: "No se encontró un restaurante activo en la sesión." };
    }

    const user = await currentUser();
    const email = user?.emailAddresses[0]?.emailAddress;
    console.log(`[subscribeToPlanAction] Email del usuario recuperado de Clerk: "${email}"`);
    if (!email) {
      console.warn("[subscribeToPlanAction] Advertencia: No se encontró el email del usuario en Clerk.");
      return { success: false, error: "No se encontró el email del usuario en la sesión." };
    }

    const billingInfrastructure = getBillingInfrastructure();

    // Verificamos si el restaurante ya tiene una suscripción guardada
    console.log("[subscribeToPlanAction] Consultando suscripción existente en la base de datos...");
    const existingSub = await billingInfrastructure.subscriptionRepository.findByRestaurantId(restaurantId);

    // Flujo para restaurante ya registrado en Stripe:
    // Si ya cuenta con una suscripción activa de Stripe, realizamos el cambio directo de plan
    if (existingSub !== null && existingSub.stripeCustomerId !== null && existingSub.stripeSubscriptionId !== null) {
      console.log(`[subscribeToPlanAction] Suscripción activa encontrada. Ejecutando cambio directo de plan a "${planId}"...`);
      const useCase = new ChangeSubscriptionPlan(
        billingInfrastructure.subscriptionRepository,
        billingInfrastructure.billingService
      );
      await useCase.execute({
        restaurantId,
        newPlanId: planId,
      });
      console.log("[subscribeToPlanAction] Cambio de plan directo completado con éxito.");
      return {
        success: true,
        url: "/dashboard/billing?success=upgrade",
      };
    }

    // Si tiene cliente pero no suscripción de Stripe activa (ej. canceló antes de pagar su primer checkout)
    // Redirigimos al Customer Portal para autogestión o Checkout
    if (existingSub !== null && existingSub.stripeCustomerId !== null) {
      console.log(`[subscribeToPlanAction] Cliente Stripe sin suscripción activa encontrado. Redirigiendo a Customer Portal...`);
      const useCase = new CreateCustomerPortalSession(
        billingInfrastructure.subscriptionRepository,
        billingInfrastructure.billingService
      );
      const result = await useCase.execute({ restaurantId });
      return {
        success: true,
        url: result.portalUrl,
      };
    }

    // Flujo para restaurante nuevo en Stripe: Generamos Stripe Checkout
    console.log("[subscribeToPlanAction] El cliente no tiene registro previo en Stripe. Generando Stripe Checkout...");
    const priceId =
      planId === "pro" ? process.env.STRIPE_PRO_PRICE_ID : process.env.STRIPE_BASIC_PRICE_ID;

    console.log(`[subscribeToPlanAction] Usando Stripe Price ID: "${priceId}"`);
    if (!priceId) {
      console.error(`[subscribeToPlanAction] Error: STRIPE_${planId.toUpperCase()}_PRICE_ID no está configurado en el .env.`);
      return {
        success: false,
        error: `El ID de precio para el plan ${planId} no está configurado en las variables de entorno.`,
      };
    }

    const useCase = new CreateCheckoutSession(billingInfrastructure.billingService);
    const result = await useCase.execute({
      restaurantId,
      planId,
      priceId,
      email,
    });

    console.log(`[subscribeToPlanAction] Stripe Checkout generado con éxito. URL: "${result.checkoutUrl}"`);
    return {
      success: true,
      url: result.checkoutUrl,
    };
  } catch (error) {
    console.error("[subscribeToPlanAction] Error crítico durante el flujo de suscripción:", error);
    captureUnexpectedError(error, { action: "subscribeToPlanAction", planId });
    const message = error instanceof Error ? error.message : "Error desconocido al procesar el pago.";
    return {
      success: false,
      error: message,
    };
  }
}
//-aqui termina funcion subscribeToPlanAction-//

//-aqui empieza funcion redirectToCustomerPortalAction y es una Server Action para redirigir al portal de Stripe-//
/**
 * Crea una sesión de Stripe Customer Portal y devuelve la URL para redirigir al usuario a su panel de facturación y facturas.
 * @sideEffect — realiza llamadas a la base de datos y peticiones de red a Stripe API.
 */
export async function redirectToCustomerPortalAction(): Promise<void> {
  console.log("[redirectToCustomerPortalAction] Iniciando proceso de redirección al Customer Portal");
  let portalUrl: string;
  try {
    const restaurantId = await getRestaurantIdFromSession();
    if (!restaurantId) {
      throw new Error("No se encontró un restaurante activo en la sesión.");
    }

    const billingInfrastructure = getBillingInfrastructure();
    const useCase = new CreateCustomerPortalSession(
      billingInfrastructure.subscriptionRepository,
      billingInfrastructure.billingService
    );
    const result = await useCase.execute({ restaurantId });
    portalUrl = result.portalUrl;
  } catch (error) {
    console.error("[redirectToCustomerPortalAction] Error al generar sesión del portal de Stripe:", error);
    captureUnexpectedError(error, { action: "redirectToCustomerPortalAction" });
    throw error;
  }

  // Redirigimos fuera del bloque try/catch para que Next.js procese correctamente la redirección
  redirect(portalUrl);
}
//-aqui termina funcion redirectToCustomerPortalAction-//
