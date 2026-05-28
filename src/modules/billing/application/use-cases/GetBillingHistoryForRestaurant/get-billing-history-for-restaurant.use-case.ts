/**
 * Archivo: get-billing-history-for-restaurant.use-case.ts
 * Responsabilidad: Obtener la suscripción y el historial de facturas (invoices) de Stripe de un restaurante.
 * Tipo: lógica
 */

import { type SubscriptionRepository } from "../../../domain/ports/subscription.repository.port";
import { type BillingService, type InvoiceInfo } from "../../../domain/ports/billing.service.port";

export interface GetBillingHistoryForRestaurantInput {
  restaurantId: string;
}

export interface GetBillingHistoryForRestaurantOutput {
  restaurantId: string;
  hasActivePlan: boolean;
  planId: "basic" | "pro" | "none";
  status: string;
  isTrial: boolean;
  trialEndsAt: Date | null;
  remainingTrialDays: number;
  currentPeriodEnd: Date | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  invoices: InvoiceInfo[];
}

//-aqui empieza clase GetBillingHistoryForRestaurant y es para recuperar el historico de facturas y el plan del restaurante-//
/**
 * Recupera el estado de suscripción de la base de datos y su historial de cobros desde Stripe en vivo.
 * @readonly — realiza accesos de lectura de base de datos y llamadas externas de consulta.
 */
export class GetBillingHistoryForRestaurant {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly billingService: BillingService
  ) {}

  async execute(
    input: GetBillingHistoryForRestaurantInput
  ): Promise<GetBillingHistoryForRestaurantOutput> {
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
        stripeCustomerId: null,
        stripeSubscriptionId: null,
        invoices: [],
      };
    }

    let invoices: InvoiceInfo[] = [];

    // Si tiene cliente en Stripe registrado, consultamos el listado de facturas en vivo
    if (subscription.stripeCustomerId !== null) {
      try {
        invoices = await this.billingService.listInvoices(subscription.stripeCustomerId);
      } catch (error) {
        console.error(
          `Error al listar facturas de Stripe para el cliente ${subscription.stripeCustomerId}:`,
          error
        );
      }
    }

    let remainingTrialDays = 0;
    if (subscription.isTrialActive() && subscription.trialEndsAt !== null) {
      const end = new Date(subscription.trialEndsAt);
      const now = new Date();
      const utcEnd = Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate());
      const utcNow = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
      const diffTime = utcEnd - utcNow;
      remainingTrialDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    }

    return {
      restaurantId: subscription.restaurantId,
      hasActivePlan: subscription.isActive(),
      planId: subscription.planId,
      status: subscription.status,
      isTrial: subscription.isTrialActive(),
      trialEndsAt: subscription.trialEndsAt,
      remainingTrialDays,
      currentPeriodEnd: subscription.currentPeriodEnd,
      stripeCustomerId: subscription.stripeCustomerId,
      stripeSubscriptionId: subscription.stripeSubscriptionId,
      invoices,
    };
  }
}
//-aqui termina clase GetBillingHistoryForRestaurant-//
