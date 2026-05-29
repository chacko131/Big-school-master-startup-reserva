/**
 * Archivo: sync-stripe-webhook.use-case.test.ts
 * Responsabilidad: Validar la recepción de eventos de webhook y la sincronización con el estado local.
 * Tipo: lógica
 */

import { describe, it, expect, beforeEach } from "vitest";
import { SyncStripeWebhook } from "./sync-stripe-webhook.use-case";
import { Subscription } from "../../../domain/entities/subscription.entity";
import { type SubscriptionRepository } from "../../../domain/ports/subscription.repository.port";
import { type BillingService } from "../../../domain/ports/billing.service.port";

describe("SyncStripeWebhook Use Case", () => {
  let repositoryMock: SubscriptionRepository;
  let billingServiceMock: BillingService;
  let savedSubscriptions: Subscription[] = [];

  beforeEach(() => {
    savedSubscriptions = [];

    repositoryMock = {
      save: async (sub: Subscription) => {
        const index = savedSubscriptions.findIndex(s => s.restaurantId === sub.restaurantId);
        if (index >= 0) {
          savedSubscriptions[index] = sub;
        } else {
          savedSubscriptions.push(sub);
        }
      },
      findByRestaurantId: async (id: string) => {
        return savedSubscriptions.find(s => s.restaurantId === id) ?? null;
      },
      findByStripeSubscriptionId: async (id: string) => {
        return savedSubscriptions.find(s => s.stripeSubscriptionId === id) ?? null;
      },
      findByStripeCustomerId: async (id: string) => {
        return savedSubscriptions.find(s => s.stripeCustomerId === id) ?? null;
      },
    };

    billingServiceMock = {
      createCheckoutSession: async () => ({ url: "" }),
      createCustomerPortalSession: async () => ({ url: "" }),
      constructEvent: async (body: string) => {
        return JSON.parse(body);
      },
      listInvoices: async () => [],
      updateSubscriptionPlan: async () => ({ success: true }),
    };
  });

  //-aqui empieza test de webhook checkout.session.completed y es para verificar que se guarde la nueva suscripcion activa-//
  it("debería activar la suscripción en checkout.session.completed", async () => {
    const mockEvent = {
      type: "checkout.session.completed",
      data: {
        object: {
          customer: "cus_123",
          subscription: "sub_strip_999",
          metadata: {
            restaurantId: "rest-1",
            planId: "pro",
          },
          line_items: {
            data: [
              {
                price: {
                  id: "price_abc",
                },
              },
            ],
          },
        },
      },
    };

    const useCase = new SyncStripeWebhook(repositoryMock, billingServiceMock);

    const result = await useCase.execute({
      body: JSON.stringify(mockEvent),
      signature: "mock_sig",
      webhookSecret: "mock_secret",
    });

    expect(result.success).toBe(true);
    expect(result.eventType).toBe("checkout.session.completed");
    expect(savedSubscriptions.length).toBe(1);

    const subscription = savedSubscriptions[0];
    expect(subscription.restaurantId).toBe("rest-1");
    expect(subscription.status).toBe("active");
    expect(subscription.stripeCustomerId).toBe("cus_123");
    expect(subscription.stripeSubscriptionId).toBe("sub_strip_999");
    expect(subscription.trialEndsAt).toBeNull(); // El trial local se cancela tras el pago
  });
  //-aqui termina test de webhook checkout.session.completed-//

  //-aqui empieza test de webhook customer.subscription.updated y es para verificar la actualizacion de estados-//
  it("debería actualizar el estado de la suscripción al recibir customer.subscription.updated", async () => {
    // Primero pre-guardamos una suscripción activa
    const activeSub = Subscription.create({
      id: "sub-123",
      restaurantId: "rest-1",
      stripeCustomerId: "cus_123",
      stripeSubscriptionId: "sub_strip_999",
      status: "active",
      planId: "pro",
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
    savedSubscriptions.push(activeSub);

    // Evento de Stripe indicando que la suscripción pasó a past_due (pago pendiente)
    const mockEvent = {
      type: "customer.subscription.updated",
      data: {
        object: {
          id: "sub_strip_999",
          status: "past_due",
          current_period_start: Math.floor(Date.now() / 1000),
          current_period_end: Math.floor((Date.now() + 15 * 24 * 60 * 60 * 1000) / 1000),
          cancel_at_period_end: true,
        },
      },
    };

    const useCase = new SyncStripeWebhook(repositoryMock, billingServiceMock);

    await useCase.execute({
      body: JSON.stringify(mockEvent),
      signature: "mock_sig",
      webhookSecret: "mock_secret",
    });

    const updated = savedSubscriptions[0];
    expect(updated.status).toBe("past_due");
    expect(updated.cancelAtPeriodEnd).toBe(true);
  });
  //-aqui termina test de webhook customer.subscription.updated-//
});
