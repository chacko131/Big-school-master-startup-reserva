"use server";

/**
 * Archivo: actions.ts
 * Responsabilidad: Exponer las Server Actions del módulo de facturación para el dashboard.
 * Tipo: servicio
 */

import { currentUser } from "@clerk/nextjs/server";
import { getRestaurantIdFromSession } from "@/modules/auth/get-restaurant-id";
import { getBillingInfrastructure } from "@/modules/billing/infrastructure/billing-infrastructure";
import { CreateCheckoutSession } from "@/modules/billing/application/use-cases/CreateCheckoutSession/create-checkout-session.use-case";
import { CreateCustomerPortalSession } from "@/modules/billing/application/use-cases/CreateCustomerPortalSession/create-customer-portal-session.use-case";

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

    // Flujo para restaurante ya registrado en Stripe: Redirigimos al Customer Portal para gestionar cambio/tarjeta
    if (existingSub !== null && existingSub.stripeCustomerId !== null) {
      console.log(`[subscribeToPlanAction] Cliente Stripe existente encontrado (stripeCustomerId: "${existingSub.stripeCustomerId}"). Redirigiendo a Customer Portal...`);
      const useCase = new CreateCustomerPortalSession(
        billingInfrastructure.subscriptionRepository,
        billingInfrastructure.billingService
      );
      const result = await useCase.execute({ restaurantId });
      console.log(`[subscribeToPlanAction] Redirección generada con éxito al Customer Portal. URL: "${result.portalUrl}"`);
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
    const message = error instanceof Error ? error.message : "Error desconocido al procesar el pago.";
    return {
      success: false,
      error: message,
    };
  }
}
//-aqui termina funcion subscribeToPlanAction-//
