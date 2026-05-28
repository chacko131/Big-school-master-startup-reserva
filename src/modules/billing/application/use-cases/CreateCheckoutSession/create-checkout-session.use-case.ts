/**
 * Archivo: create-checkout-session.use-case.ts
 * Responsabilidad: Generar una sesión de Stripe Checkout para iniciar la suscripción de un restaurante.
 * Tipo: lógica
 */

import { type BillingService } from "../../../domain/ports/billing.service.port";

export interface CreateCheckoutSessionInput {
  restaurantId: string;
  planId: "basic" | "pro";
  priceId: string;
  email: string;
}

export interface CreateCheckoutSessionOutput {
  checkoutUrl: string;
}

//-aqui empieza clase CreateCheckoutSession y es para iniciar el flujo de Stripe Checkout-//
/**
 * Crea una sesión de Stripe Checkout y devuelve la URL para redirigir al usuario.
 * @sideEffect — llama a servicios externos de Stripe.
 */
export class CreateCheckoutSession {
  constructor(private readonly billingService: BillingService) {}

  async execute(input: CreateCheckoutSessionInput): Promise<CreateCheckoutSessionOutput> {
    if (!input.priceId || input.priceId.trim().length === 0) {
      throw new Error("El priceId de Stripe es obligatorio para crear la sesión.");
    }

    const session = await this.billingService.createCheckoutSession({
      restaurantId: input.restaurantId,
      planId: input.planId,
      priceId: input.priceId,
      email: input.email,
    });

    return {
      checkoutUrl: session.url,
    };
  }
}
//-aqui termina clase CreateCheckoutSession-//
