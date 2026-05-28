/**
 * Archivo: create-customer-portal-session.use-case.ts
 * Responsabilidad: Generar una sesión de Stripe Customer Portal para que el usuario gestione su suscripción.
 * Tipo: lógica
 */

import { type SubscriptionRepository } from "../../../domain/ports/subscription.repository.port";
import { type BillingService } from "../../../domain/ports/billing.service.port";
import { SubscriptionNotFoundError } from "../../../domain/errors/billing.errors";

export interface CreateCustomerPortalSessionInput {
  restaurantId: string;
}

export interface CreateCustomerPortalSessionOutput {
  portalUrl: string;
}

//-aqui empieza clase CreateCustomerPortalSession y es para abrir el Stripe Customer Portal-//
/**
 * Crea una sesión en el portal de clientes de Stripe para autogestión de facturas y tarjetas.
 * @sideEffect — consulta base de datos y llama a APIs externas de Stripe.
 */
export class CreateCustomerPortalSession {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly billingService: BillingService
  ) {}

  async execute(
    input: CreateCustomerPortalSessionInput
  ): Promise<CreateCustomerPortalSessionOutput> {
    const subscription = await this.subscriptionRepository.findByRestaurantId(input.restaurantId);

    if (subscription === null) {
      throw new SubscriptionNotFoundError(input.restaurantId);
    }

    if (subscription.stripeCustomerId === null) {
      throw new Error(
        "Este restaurante aún no tiene un identificador de cliente en Stripe (probablemente esté en periodo de prueba local sin tarjeta)."
      );
    }

    const hostUrl =
      process.env.SERVER_URL ??
      process.env.APP_URL ??
      process.env.BASE_URL ??
      "http://localhost:3000";
    const returnUrl = `${hostUrl}/dashboard/billing`;

    const portalSession = await this.billingService.createCustomerPortalSession({
      stripeCustomerId: subscription.stripeCustomerId,
      returnUrl,
    });

    return {
      portalUrl: portalSession.url,
    };
  }
}
//-aqui termina clase CreateCustomerPortalSession-//
