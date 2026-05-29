/**
 * Archivo: get-billing-history-for-restaurant.use-case.test.ts
 * Responsabilidad: Validar la obtención del historial de facturación de Stripe para un restaurante.
 * Tipo: lógica
 */

import { describe, it, expect, beforeEach } from "vitest";
import { GetBillingHistoryForRestaurant } from "./get-billing-history-for-restaurant.use-case";
import { Subscription } from "../../../domain/entities/subscription.entity";
import { type SubscriptionRepository } from "../../../domain/ports/subscription.repository.port";
import { type BillingService } from "../../../domain/ports/billing.service.port";

describe("GetBillingHistoryForRestaurant Use Case", () => {
  let repositoryMock: SubscriptionRepository;
  let billingServiceMock: BillingService;
  let savedSubscriptions: Subscription[] = [];

  beforeEach(() => {
    savedSubscriptions = [];
    repositoryMock = {
      save: async (sub: Subscription) => {
        savedSubscriptions.push(sub);
      },
      findByRestaurantId: async (id: string) => {
        return savedSubscriptions.find(s => s.restaurantId === id) ?? null;
      },
      findByStripeSubscriptionId: async () => null,
      findByStripeCustomerId: async () => null,
    };

    billingServiceMock = {
      createCheckoutSession: async () => ({ url: "" }),
      createCustomerPortalSession: async () => ({ url: "" }),
      constructEvent: async () => ({ type: "", data: { object: {} } }),
      listInvoices: async (_customerId: string) => {
        return [
          {
            id: "inv_1",
            amount: 69.99,
            currency: "eur",
            status: "paid",
            created: new Date("2026-05-28T12:00:00.000Z"),
            pdfUrl: "https://stripe.com/invoice.pdf",
          },
        ];
      },
      updateSubscriptionPlan: async () => ({ success: true }),
    };
  });

  //-aqui empieza test de sin sub y es para verificar que devuelva valores vacios si no hay suscripcion-//
  it("debería devolver un plan vacío si el restaurante no tiene suscripción", async () => {
    const useCase = new GetBillingHistoryForRestaurant(repositoryMock, billingServiceMock);
    const result = await useCase.execute({ restaurantId: "rest-none" });

    expect(result.hasActivePlan).toBe(false);
    expect(result.planId).toBe("none");
    expect(result.invoices.length).toBe(0);
  });
  //-aqui termina test de sin sub-//

  //-aqui empieza test de trial sin stripe y es para verificar que devuelva facturas vacias si es trial local-//
  it("debería devolver la información de trial local y facturas vacías si no tiene Stripe Customer ID", async () => {
    const trialSub = Subscription.create({
      id: "sub-trial",
      restaurantId: "rest-trial",
      status: "trialing",
      planId: "pro",
      trialEndsAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    });
    savedSubscriptions.push(trialSub);

    const useCase = new GetBillingHistoryForRestaurant(repositoryMock, billingServiceMock);
    const result = await useCase.execute({ restaurantId: "rest-trial" });

    expect(result.hasActivePlan).toBe(true);
    expect(result.planId).toBe("pro");
    expect(result.stripeCustomerId).toBeNull();
    expect(result.invoices.length).toBe(0);
  });
  //-aqui termina test de trial sin stripe-//

  //-aqui empieza test de con facturas Stripe y es para verificar que traiga el listado de invoices-//
  it("debería devolver el listado de facturas de Stripe si el restaurante tiene Stripe Customer ID", async () => {
    const activeSub = Subscription.create({
      id: "sub-active",
      restaurantId: "rest-paid",
      stripeCustomerId: "cus_stripe_abc",
      status: "active",
      planId: "basic",
    });
    savedSubscriptions.push(activeSub);

    const useCase = new GetBillingHistoryForRestaurant(repositoryMock, billingServiceMock);
    const result = await useCase.execute({ restaurantId: "rest-paid" });

    expect(result.hasActivePlan).toBe(true);
    expect(result.planId).toBe("basic");
    expect(result.stripeCustomerId).toBe("cus_stripe_abc");
    expect(result.invoices.length).toBe(1);
    expect(result.invoices[0].id).toBe("inv_1");
    expect(result.invoices[0].amount).toBe(69.99);
  });
  //-aqui termina test de con facturas Stripe-//
});
