/**
 * Archivo: start-trial-subscription.use-case.ts
 * Responsabilidad: Inicializar una suscripción en estado de prueba local (trial de 60 días) sin tarjeta.
 * Tipo: lógica
 */

import { Subscription } from "../../../domain/entities/subscription.entity";
import { type SubscriptionRepository } from "../../../domain/ports/subscription.repository.port";
import { ActiveSubscriptionTrialForbiddenError } from "../../../domain/errors/billing.errors";

export interface StartTrialSubscriptionInput {
  restaurantId: string;
}

export interface StartTrialSubscriptionOutput {
  subscriptionId: string;
  trialEndsAt: Date;
}

//-aqui empieza clase StartTrialSubscription y es para inicializar la suscripcion de prueba local-//
/**
 * Inicializa una suscripción de prueba gratuita de 60 días (Pro) para un restaurante.
 * No requiere tarjeta de crédito ni interactúa con Stripe.
 * @sideEffect — guarda la nueva suscripción en la base de datos.
 */
export class StartTrialSubscription {
  constructor(private readonly subscriptionRepository: SubscriptionRepository) {}

  async execute(input: StartTrialSubscriptionInput): Promise<StartTrialSubscriptionOutput> {
    const existingSubscription = await this.subscriptionRepository.findByRestaurantId(
      input.restaurantId
    );

    const now = new Date();
    // 60 días en milisegundos
    const trialDurationMs = 60 * 24 * 60 * 60 * 1000;
    const trialEndsAt = new Date(now.getTime() + trialDurationMs);

    let subscriptionId: string;

    if (existingSubscription !== null) {
      const statusStr = existingSubscription.status as string;
      const allowedForTrial = ["canceled", "expired", "inactive", "incomplete"];
      if (!allowedForTrial.includes(statusStr)) {
        throw new ActiveSubscriptionTrialForbiddenError();
      }

      // Si ya tiene una suscripción pero está vencida o es de prueba, podemos renovar o mantener la existente.
      // Para el MVP, simplemente extendemos el trial si es una suscripción inactiva/nueva.
      const updated = existingSubscription.updateDetails({
        status: "trialing",
        trialEndsAt,
        currentPeriodStart: now,
        currentPeriodEnd: trialEndsAt,
      });
      await this.subscriptionRepository.save(updated);
      subscriptionId = updated.id;
    } else {
      const newSubscription = Subscription.create({
        id: crypto.randomUUID(),
        restaurantId: input.restaurantId,
        stripeCustomerId: null,
        stripeSubscriptionId: null,
        status: "trialing",
        planId: "pro", // Acceso total durante el trial local
        priceId: null,
        currentPeriodStart: now,
        currentPeriodEnd: trialEndsAt,
        trialEndsAt,
        cancelAtPeriodEnd: false,
      });
      await this.subscriptionRepository.save(newSubscription);
      subscriptionId = newSubscription.id;
    }

    return {
      subscriptionId,
      trialEndsAt,
    };
  }
}
//-aqui termina clase StartTrialSubscription-//
