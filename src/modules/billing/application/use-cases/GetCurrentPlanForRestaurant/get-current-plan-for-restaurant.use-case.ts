/**
 * Archivo: get-current-plan-for-restaurant.use-case.ts
 * Responsabilidad: Obtener los detalles de facturación y plan activo de un restaurante determinado.
 * Tipo: lógica
 */

import { type SubscriptionRepository } from "../../../domain/ports/subscription.repository.port";

export interface GetCurrentPlanForRestaurantInput {
  restaurantId: string;
}

export interface GetCurrentPlanForRestaurantOutput {
  restaurantId: string;
  hasActivePlan: boolean;
  planId: "basic" | "pro" | "none";
  status: string;
  isTrial: boolean;
  trialEndsAt: Date | null;
  remainingTrialDays: number;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
}

//-aqui empieza clase GetCurrentPlanForRestaurant y es para obtener el plan de facturacion del restaurante-//
/**
 * Recupera el estado de suscripción de un restaurante y calcula si tiene acceso activo y cuántos días de trial le quedan.
 * @readonly — realiza operaciones de solo lectura de base de datos sin efectos colaterales de escritura.
 */
export class GetCurrentPlanForRestaurant {
  constructor(private readonly subscriptionRepository: SubscriptionRepository) {}

  async execute(
    input: GetCurrentPlanForRestaurantInput
  ): Promise<GetCurrentPlanForRestaurantOutput> {
    const subscription = await this.subscriptionRepository.findByRestaurantId(input.restaurantId);

    if (subscription === null) {
      return {
        restaurantId: input.restaurantId,
        hasActivePlan: false,
        planId: "none",
        status: "none",
        isTrial: false,
        trialEndsAt: null,
        remainingTrialDays: 0,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
        stripeCustomerId: null,
        stripeSubscriptionId: null,
      };
    }

    return {
      restaurantId: subscription.restaurantId,
      hasActivePlan: subscription.isActive(),
      planId: subscription.planId,
      status: subscription.status,
      isTrial: subscription.isTrialActive(),
      trialEndsAt: subscription.trialEndsAt,
      remainingTrialDays: subscription.getRemainingTrialDays(),
      currentPeriodEnd: subscription.currentPeriodEnd,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      stripeCustomerId: subscription.stripeCustomerId,
      stripeSubscriptionId: subscription.stripeSubscriptionId,
    };
  }
}
//-aqui termina clase GetCurrentPlanForRestaurant-//
