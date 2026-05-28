/**
 * Archivo: start-trial-subscription.use-case.test.ts
 * Responsabilidad: Validar la inicialización y renovación del trial de 60 días de suscripción.
 * Tipo: lógica
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { StartTrialSubscription } from "./start-trial-subscription.use-case";
import { Subscription } from "../../../domain/entities/subscription.entity";
import { type SubscriptionRepository } from "../../../domain/ports/subscription.repository.port";
import { ActiveSubscriptionTrialForbiddenError } from "../../../domain/errors/billing.errors";

describe("StartTrialSubscription Use Case", () => {
  let repositoryMock: SubscriptionRepository;
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
      findByStripeSubscriptionId: async () => null,
      findByStripeCustomerId: async () => null,
    };

    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-28T12:00:00.000Z"));
  });

  //-aqui empieza test de creacion trial y es para verificar que se asigne una suscripcion de 60 dias-//
  it("debería crear una nueva suscripción de trial de 60 días en plan pro", async () => {
    const useCase = new StartTrialSubscription(repositoryMock);

    const result = await useCase.execute({ restaurantId: "rest-1" });

    expect(result.subscriptionId).toBeDefined();
    expect(savedSubscriptions.length).toBe(1);

    const saved = savedSubscriptions[0];
    expect(saved.restaurantId).toBe("rest-1");
    expect(saved.status).toBe("trialing");
    expect(saved.planId).toBe("pro");
    expect(saved.trialEndsAt).toBeDefined();

    // 60 días después de "2026-05-28T12:00:00.000Z"
    const expectedEndDate = new Date(new Date("2026-05-28T12:00:00.000Z").getTime() + 60 * 24 * 60 * 60 * 1000);
    expect(saved.trialEndsAt?.getTime()).toBe(expectedEndDate.getTime());
    expect(result.trialEndsAt.getTime()).toBe(expectedEndDate.getTime());
  });
  //-aqui termina test de creacion trial-//

  //-aqui empieza test de renovacion y es para comprobar que se extienda el trial si ya existe la suscripcion-//
  it("debería extender el trial si el restaurante ya tenía una suscripción existente", async () => {
    // Primero guardamos una suscripción antigua expirada
    const oldSub = Subscription.create({
      id: "sub-old",
      restaurantId: "rest-1",
      status: "canceled",
      planId: "basic",
      trialEndsAt: new Date("2026-05-20T12:00:00.000Z"),
    });
    savedSubscriptions.push(oldSub);

    const useCase = new StartTrialSubscription(repositoryMock);
    const result = await useCase.execute({ restaurantId: "rest-1" });

    expect(savedSubscriptions.length).toBe(1);
    const updated = savedSubscriptions[0];

    expect(updated.id).toBe("sub-old"); // Mismo ID de suscripción
    expect(updated.status).toBe("trialing");
    expect(updated.planId).toBe("basic"); // Mantiene su plan anterior pero cambia a trialing
    expect(result.trialEndsAt).toBeDefined();
  });
  //-aqui termina test de renovacion-//

  it("debería lanzar un error si la suscripción existente está activa", async () => {
    const activeSub = Subscription.create({
      id: "sub-active",
      restaurantId: "rest-1",
      status: "active",
      planId: "pro",
      trialEndsAt: null,
    });
    savedSubscriptions.push(activeSub);

    const useCase = new StartTrialSubscription(repositoryMock);

    await expect(useCase.execute({ restaurantId: "rest-1" })).rejects.toThrow(
      ActiveSubscriptionTrialForbiddenError
    );
  });
});
