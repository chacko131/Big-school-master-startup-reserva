/**
 * Archivo: change-subscription-plan.use-case.ts
 * Responsabilidad: Cambiar el plan de suscripción de un restaurante aplicando el prorrateo de Stripe de forma directa.
 * Tipo: lógica
 */

import { type SubscriptionPlanId } from "../../../domain/entities/subscription.entity";
import { type SubscriptionRepository } from "../../../domain/ports/subscription.repository.port";
import { type BillingService } from "../../../domain/ports/billing.service.port";

export interface ChangeSubscriptionPlanInput {
  restaurantId: string;
  newPlanId: SubscriptionPlanId;
}

export interface ChangeSubscriptionPlanOutput {
  success: boolean;
  planId: SubscriptionPlanId;
}

//-aqui empieza clase ChangeSubscriptionPlan y es para gestionar el cambio directo de suscripcion-//
/**
 * Cambia el plan de facturación de un restaurante a través de Stripe y actualiza el estado local.
 * @sideEffect — realiza escrituras en base de datos local y llamadas de red a la API de Stripe.
 */
export class ChangeSubscriptionPlan {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly billingService: BillingService
  ) {}

  async execute(input: ChangeSubscriptionPlanInput): Promise<ChangeSubscriptionPlanOutput> {
    const subscription = await this.subscriptionRepository.findByRestaurantId(input.restaurantId);

    if (subscription === null) {
      throw new Error("No existe una suscripción activa para este restaurante.");
    }

    const stripeSubscriptionId = subscription.stripeSubscriptionId;
    if (!stripeSubscriptionId) {
      throw new Error(
        "El restaurante no tiene una suscripción activa registrada en Stripe. Debe iniciar una primero."
      );
    }

    // Resolvemos el priceId a partir de las variables de entorno
    const priceId =
      input.newPlanId === "pro"
        ? process.env.STRIPE_PRO_PRICE_ID
        : process.env.STRIPE_BASIC_PRICE_ID;

    if (!priceId) {
      throw new Error(
        `El ID de precio para el plan "${input.newPlanId}" no está configurado en las variables de entorno.`
      );
    }

    // Si ya tiene ese plan asignado en local, no es necesario hacer nada en Stripe
    if (subscription.planId === input.newPlanId && subscription.priceId === priceId) {
      return {
        success: true,
        planId: subscription.planId,
      };
    }

    // 1. Modificamos la suscripción en Stripe (aplica prorrateo inmediato)
    await this.billingService.updateSubscriptionPlan({
      stripeSubscriptionId,
      newPriceId: priceId,
    });

    // 2. Modificamos el estado en nuestra base de datos local de forma inmediata para reflejar el cambio
    const updated = subscription.updateDetails({
      planId: input.newPlanId,
      priceId: priceId,
    });

    await this.subscriptionRepository.save(updated);

    return {
      success: true,
      planId: input.newPlanId,
    };
  }
}
//-aqui termina clase ChangeSubscriptionPlan-//
