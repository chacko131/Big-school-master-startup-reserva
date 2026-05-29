/**
 * Archivo: sync-stripe-webhook.use-case.ts
 * Responsabilidad: Procesar y sincronizar los eventos de webhooks de Stripe con el estado de base de datos local.
 * Tipo: lógica
 */

import { Subscription, SubscriptionStatus, SubscriptionPlanId } from "../../../domain/entities/subscription.entity";
import { type SubscriptionRepository } from "../../../domain/ports/subscription.repository.port";
import { type BillingService } from "../../../domain/ports/billing.service.port";

export interface SyncStripeWebhookInput {
  body: string;
  signature: string;
  webhookSecret: string;
}

export interface SyncStripeWebhookOutput {
  success: boolean;
  eventType: string;
}

interface StripeSessionMock {
  metadata?: {
    restaurantId?: string;
    planId?: string;
  };
  customer?: string | null;
  subscription?: string | null;
  line_items?: {
    data?: Array<{
      price?: {
        id?: string;
      };
    }>;
  };
}

interface StripeSubscriptionMock {
  id: string;
  status: string;
  current_period_start: number;
  current_period_end: number;
  cancel_at_period_end: boolean;
  trial_end: number | null;
  items?: {
    data?: Array<{
      price?: {
        id?: string;
      };
    }>;
  };
}

//-aqui empieza clase SyncStripeWebhook y es para sincronizar base de datos local con Stripe-//
/**
 * Procesa un webhook de Stripe, valida su firma y actualiza el estado de la suscripción del restaurante.
 * @sideEffect — valida firmas criptográficas con red y escribe en base de datos.
 */
export class SyncStripeWebhook {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly billingService: BillingService
  ) {}

  async execute(input: SyncStripeWebhookInput): Promise<SyncStripeWebhookOutput> {
    const event = await this.billingService.constructEvent(
      input.body,
      input.signature,
      input.webhookSecret
    );

    const eventType = event.type;

    if (eventType === "checkout.session.completed") {
      const session = event.data.object as unknown as StripeSessionMock;
      const restaurantId = session.metadata?.restaurantId;
      const planId = (session.metadata?.planId ?? "pro") as SubscriptionPlanId;

      if (!restaurantId) {
        throw new Error("checkout.session.completed no tiene restaurantId en el metadata.");
      }

      const stripeCustomerId = session.customer ?? null;
      const stripeSubscriptionId = session.subscription ?? null;

      // Buscamos si ya existe la suscripción
      const existing = await this.subscriptionRepository.findByRestaurantId(restaurantId);

      const currentPeriodStart = new Date();
      // Fin del periodo predeterminado en 30 días para Checkout
      const currentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      const priceId = session.line_items?.data?.[0]?.price?.id ?? null;

      if (existing !== null) {
        const updated = existing.updateDetails({
          status: "active",
          stripeSubscriptionId,
          priceId,
          currentPeriodStart,
          currentPeriodEnd,
          trialEndsAt: null, // Si pagó, cancelamos el trial local
        });
        await this.subscriptionRepository.save(updated);
      } else {
        const newSubscription = Subscription.create({
          id: crypto.randomUUID(),
          restaurantId,
          stripeCustomerId,
          stripeSubscriptionId,
          status: "active",
          planId,
          priceId,
          currentPeriodStart,
          currentPeriodEnd,
          trialEndsAt: null,
        });
        await this.subscriptionRepository.save(newSubscription);
      }
    }

    if (eventType === "customer.subscription.updated" || eventType === "customer.subscription.deleted") {
      const stripeSubscription = event.data.object as unknown as StripeSubscriptionMock;
      const stripeSubscriptionId = stripeSubscription.id;

      const localSubscription = await this.subscriptionRepository.findByStripeSubscriptionId(
        stripeSubscriptionId
      );

      if (localSubscription !== null) {
        const stripeStatus = stripeSubscription.status as SubscriptionStatus;
        const currentPeriodStart = new Date(stripeSubscription.current_period_start * 1000);
        const currentPeriodEnd = new Date(stripeSubscription.current_period_end * 1000);
        const cancelAtPeriodEnd = stripeSubscription.cancel_at_period_end;

        const priceId = stripeSubscription.items?.data?.[0]?.price?.id ?? null;
        let planId = localSubscription.planId;

        if (priceId !== null) {
          if (priceId === process.env.STRIPE_PRO_PRICE_ID) {
            planId = "pro";
          } else if (priceId === process.env.STRIPE_BASIC_PRICE_ID) {
            planId = "basic";
          } else {
            console.error(
              `[SyncStripeWebhook] Error de configuración: Se recibió el priceId "${priceId}" de Stripe pero no coincide con las variables de entorno STRIPE_PRO_PRICE_ID o STRIPE_BASIC_PRICE_ID. Suscripción Stripe ID: "${stripeSubscriptionId}", Suscripción Local ID: "${localSubscription.id}".`
            );
            throw new Error(
              `El priceId "${priceId}" recibido de Stripe no coincide con STRIPE_PRO_PRICE_ID ni con STRIPE_BASIC_PRICE_ID.`
            );
          }
        }

        const updated = localSubscription.updateDetails({
          status: stripeStatus,
          currentPeriodStart,
          currentPeriodEnd,
          cancelAtPeriodEnd,
          priceId,
          planId,
          trialEndsAt: stripeSubscription.trial_end !== null
            ? new Date(stripeSubscription.trial_end * 1000)
            : localSubscription.trialEndsAt,
        });

        await this.subscriptionRepository.save(updated);
      }
    }

    return {
      success: true,
      eventType,
    };
  }
}
//-aqui termina clase SyncStripeWebhook-//
