/**
 * Archivo: change-subscription-plan.use-case.test.ts
 * Responsabilidad: Validar la actualización directa de planes de suscripción (Upgrade/Downgrade) con Stripe.
 * Tipo: lógica
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { ChangeSubscriptionPlan } from "./change-subscription-plan.use-case";
import { Subscription } from "../../../domain/entities/subscription.entity";
import { type SubscriptionRepository } from "../../../domain/ports/subscription.repository.port";
import { type BillingService } from "../../../domain/ports/billing.service.port";

describe("ChangeSubscriptionPlan Use Case", () => {
  let repositoryMock: SubscriptionRepository;
  let billingServiceMock: BillingService;
  let savedSubscriptions: Subscription[] = [];

  beforeEach(() => {
    savedSubscriptions = [];
    
    // Configuramos variables de entorno para los tests
    process.env.STRIPE_BASIC_PRICE_ID = "price_basic_123";
    process.env.STRIPE_PRO_PRICE_ID = "price_pro_456";

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
      findByStripeSubscriptionId: async () => null,
      findByStripeCustomerId: async () => null,
    };

    billingServiceMock = {
      createCheckoutSession: vi.fn(),
      createCustomerPortalSession: vi.fn(),
      constructEvent: vi.fn(),
      listInvoices: vi.fn(),
      updateSubscriptionPlan: vi.fn().mockResolvedValue({ success: true }),
    };
  });

  //-aqui empieza test de upgrade exitoso y es para verificar que se actualice el plan en Stripe y localmente-//
  it("debería actualizar la suscripción de básico a pro con prorrateo de Stripe", async () => {
    const existing = Subscription.create({
      id: "sub-1",
      restaurantId: "rest-123",
      stripeCustomerId: "cus_stripe_1",
      stripeSubscriptionId: "sub_stripe_123",
      status: "active",
      planId: "basic",
      priceId: "price_basic_123",
    });
    savedSubscriptions.push(existing);

    const useCase = new ChangeSubscriptionPlan(repositoryMock, billingServiceMock);
    const result = await useCase.execute({
      restaurantId: "rest-123",
      newPlanId: "pro",
    });

    expect(result.success).toBe(true);
    expect(result.planId).toBe("pro");

    // Validar que se llamó al servicio de cobros con el priceId de Pro
    expect(billingServiceMock.updateSubscriptionPlan).toHaveBeenCalledWith({
      stripeSubscriptionId: "sub_stripe_123",
      newPriceId: "price_pro_456",
    });

    // Validar que se guardó en local
    const saved = savedSubscriptions[0];
    expect(saved.planId).toBe("pro");
    expect(saved.priceId).toBe("price_pro_456");
  });
  //-aqui termina test de upgrade exitoso-//

  //-aqui empieza test de error si no existe suscripcion y es para asegurar que falle si no hay registro-//
  it("debería lanzar un error si el restaurante no tiene ninguna suscripción registrada", async () => {
    const useCase = new ChangeSubscriptionPlan(repositoryMock, billingServiceMock);

    await expect(
      useCase.execute({
        restaurantId: "rest-999",
        newPlanId: "pro",
      })
    ).rejects.toThrow("No existe una suscripción activa para este restaurante.");
  });
  //-aqui termina test de error si no existe suscripcion-//

  //-aqui empieza test de error si no hay Stripe ID y es para asegurar que requiera una suscripcion activa en Stripe-//
  it("debería lanzar un error si la suscripción no tiene un ID de suscripción de Stripe activo", async () => {
    const trialOnly = Subscription.create({
      id: "sub-trial",
      restaurantId: "rest-123",
      stripeCustomerId: null,
      stripeSubscriptionId: null, // sigue en trial local, sin pasarela activa
      status: "trialing",
      planId: "pro",
    });
    savedSubscriptions.push(trialOnly);

    const useCase = new ChangeSubscriptionPlan(repositoryMock, billingServiceMock);

    await expect(
      useCase.execute({
        restaurantId: "rest-123",
        newPlanId: "basic",
      })
    ).rejects.toThrow(
      "El restaurante no tiene una suscripción activa registrada en Stripe. Debe iniciar una primero."
    );
  });
  //-aqui termina test de error si no hay Stripe ID-//

  //-aqui empieza test de plan identico y es para comprobar que no realice llamadas a Stripe si ya tiene ese plan-//
  it("debería devolver éxito y no llamar a Stripe si el plan solicitado es igual al plan activo", async () => {
    const existing = Subscription.create({
      id: "sub-1",
      restaurantId: "rest-123",
      stripeCustomerId: "cus_stripe_1",
      stripeSubscriptionId: "sub_stripe_123",
      status: "active",
      planId: "pro",
      priceId: "price_pro_456",
    });
    savedSubscriptions.push(existing);

    const useCase = new ChangeSubscriptionPlan(repositoryMock, billingServiceMock);
    const result = await useCase.execute({
      restaurantId: "rest-123",
      newPlanId: "pro",
    });

    expect(result.success).toBe(true);
    expect(result.planId).toBe("pro");
    expect(billingServiceMock.updateSubscriptionPlan).not.toHaveBeenCalled();
  });
  //-aqui termina test de plan identico-//
});
