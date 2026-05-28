/**
 * Archivo: stripe.service.ts
 * Responsabilidad: Encapsular el cliente oficial de Stripe y exponer funciones para la gestión de suscripciones.
 * Tipo: servicio
 */

import Stripe from "stripe";
import {
  type CreateCheckoutSessionInput,
  type CreateCustomerPortalSessionInput,
  type StripeWebhookEvent,
  type InvoiceInfo,
} from "../modules/billing/domain/ports/billing.service.port";

//-aqui empieza funcion getStripeClient y es para obtener el cliente oficial de Stripe con la clave secreta-//
/**
 * Devuelve una instancia del cliente de Stripe.
 * Lanza un error si STRIPE_SECRET_KEY no está configurada.
 * @sideEffect
 */
export function getStripeClient(): Stripe {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) {
    throw new Error("STRIPE_SECRET_KEY no está definida en las variables de entorno");
  }
  return new Stripe(apiKey, {
    apiVersion: "2026-05-27.dahlia",
  });
}
//-aqui termina funcion getStripeClient-//

//-aqui empieza funcion createStripeCheckoutSession y es para generar una sesion de checkout en Stripe-//
/**
 * Genera una sesión de Stripe Checkout y devuelve la URL para redirigir al usuario.
 * @sideEffect — llamadas de red externas a Stripe.
 */
export async function createStripeCheckoutSession(
  input: CreateCheckoutSessionInput
): Promise<{ url: string }> {
  const stripe = getStripeClient();
  const hostUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: input.email,
    line_items: [
      {
        price: input.priceId,
        quantity: 1,
      },
    ],
    metadata: {
      restaurantId: input.restaurantId,
      planId: input.planId,
    },
    subscription_data: {
      metadata: {
        restaurantId: input.restaurantId,
        planId: input.planId,
      },
    },
    success_url: `${hostUrl}/dashboard/billing?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${hostUrl}/onboarding/plan?restaurantId=${input.restaurantId}`,
  });

  if (session.url === null) {
    throw new Error("No se pudo generar la URL de Stripe Checkout.");
  }

  return {
    url: session.url,
  };
}
//-aqui termina funcion createStripeCheckoutSession-//

//-aqui empieza funcion createStripeCustomerPortalSession y es para abrir el portal de facturas y tarjetas-//
/**
 * Genera la sesión del Customer Portal de Stripe para autogestión de pagos.
 * @sideEffect — llamadas de red externas.
 */
export async function createStripeCustomerPortalSession(
  input: CreateCustomerPortalSessionInput
): Promise<{ url: string }> {
  const stripe = getStripeClient();
  const session = await stripe.billingPortal.sessions.create({
    customer: input.stripeCustomerId,
    return_url: input.returnUrl,
  });

  return {
    url: session.url,
  };
}
//-aqui termina funcion createStripeCustomerPortalSession-//

//-aqui empieza funcion constructStripeEvent y es para verificar la firma del webhook de Stripe-//
/**
 * Valida la firma del evento recibido de Stripe Webhook.
 * @pure — validación de payload y firmas sin efectos colaterales de negocio.
 */
export async function constructStripeEvent(
  body: string,
  signature: string,
  webhookSecret: string
): Promise<StripeWebhookEvent> {
  const stripe = getStripeClient();
  const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  return event as unknown as StripeWebhookEvent;
}
//-aqui termina funcion constructStripeEvent-//

//-aqui empieza funcion convertStripeAmount y es para convertir montos de Stripe respetando monedas con cero decimales-//
/**
 * Convierte montos de Stripe a la unidad básica de la moneda correspondiente,
 * manejando correctamente las monedas con cero decimales.
 * @pure
 */
export function convertStripeAmount(amount: number, currency: string): number {
  const zeroDecimalCurrencies = [
    "bif", "clp", "djf", "gnf", "jpy", "kmf", "krw", "mga",
    "pyg", "rwf", "ugx", "vnd", "vuv", "xaf", "xof", "xpf"
  ];
  const lowerCurrency = currency.toLowerCase();
  if (zeroDecimalCurrencies.includes(lowerCurrency)) {
    return amount;
  }
  return amount / 100;
}
//-aqui termina funcion convertStripeAmount-//

//-aqui empieza funcion listStripeInvoices y es para obtener el historial de cobros de un cliente-//
/**
 * Obtiene el listado de facturas históricas para un cliente de Stripe.
 * @sideEffect — llamadas de red externas a Stripe.
 */
export async function listStripeInvoices(stripeCustomerId: string): Promise<InvoiceInfo[]> {
  const stripe = getStripeClient();
  const invoices = await stripe.invoices.list({
    customer: stripeCustomerId,
    limit: 50,
  });

  return invoices.data.map(invoice => ({
    id: invoice.id,
    amount: convertStripeAmount(invoice.amount_paid ?? 0, invoice.currency),
    currency: invoice.currency,
    status: invoice.status ?? "unknown",
    created: new Date(invoice.created * 1000),
    pdfUrl: invoice.invoice_pdf ?? null,
  }));
}
//-aqui termina funcion listStripeInvoices-//
