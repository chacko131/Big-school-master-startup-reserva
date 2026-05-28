/**
 * Archivo: route.ts
 * Responsabilidad: Exponer el endpoint HTTP POST para recibir y verificar los webhooks de Stripe.
 * Tipo: servicio
 */

import { NextResponse } from "next/server";
import { getBillingInfrastructure } from "@/modules/billing/infrastructure/billing-infrastructure";
import { SyncStripeWebhook } from "@/modules/billing/application/use-cases/SyncStripeWebhook/sync-stripe-webhook.use-case";

//-aqui empieza funcion POST y es para recibir notificaciones webhook desde Stripe-//
/**
 * Procesa la petición POST de Stripe Webhooks. Verifica la firma y ejecuta el caso de uso de sincronización.
 * @sideEffect — valida firmas y altera el estado de las suscripciones en base de datos.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const signature = request.headers.get("stripe-signature");

  if (signature === null) {
    return NextResponse.json({ error: "Falta la cabecera stripe-signature" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("Falta STRIPE_WEBHOOK_SECRET en las variables de entorno.");
    return NextResponse.json(
      { error: "El webhook secreto no está configurado" },
      { status: 500 }
    );
  }

  try {
    const rawBody = await request.text();
    const billingInfrastructure = getBillingInfrastructure();

    const useCase = new SyncStripeWebhook(
      billingInfrastructure.subscriptionRepository,
      billingInfrastructure.billingService
    );

    const result = await useCase.execute({
      body: rawBody,
      signature,
      webhookSecret,
    });

    return NextResponse.json({ received: true, eventType: result.eventType }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    console.error("Error procesando Stripe Webhook:", error);
    return NextResponse.json(
      { error: `Error en webhook: ${message}` },
      { status: 400 }
    );
  }
}
//-aqui termina funcion POST-//
