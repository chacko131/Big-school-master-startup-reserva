/**
 * Archivo: write-access-guard.test.ts
 * Responsabilidad: Validar el guardián de permisos de escritura (canWrite) en el servidor.
 * Tipo: lógica
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { assertCanWrite } from "./write-access-guard";
import { getRestaurantIdFromSession } from "@/modules/auth/get-restaurant-id";
import { getBillingInfrastructure } from "./billing-infrastructure";
import { Subscription } from "../domain/entities/subscription.entity";

vi.mock("@/modules/auth/get-restaurant-id", () => ({
  getRestaurantIdFromSession: vi.fn(),
}));

vi.mock("./billing-infrastructure", () => ({
  getBillingInfrastructure: vi.fn(),
}));

describe("write-access-guard test suite", () => {
  let mockSubscriptionRepository: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockSubscriptionRepository = {
      findByRestaurantId: vi.fn(),
    };

    (getBillingInfrastructure as any).mockReturnValue({
      subscriptionRepository: mockSubscriptionRepository,
    });

    (getRestaurantIdFromSession as any).mockResolvedValue("test-restaurant-id");
  });

  //-aqui empieza test de acceso permitido y es para validar que se retorne el ID si la suscripción permite escritura-//
  it("debería permitir el acceso de escritura si la suscripción está activa (canWrite === true)", async () => {
    const activeSub = Subscription.create({
      id: "sub-1",
      restaurantId: "test-restaurant-id",
      status: "active",
      planId: "pro",
      trialEndsAt: null,
    });

    mockSubscriptionRepository.findByRestaurantId.mockResolvedValue(activeSub);

    const result = await assertCanWrite();

    expect(result).toBe("test-restaurant-id");
    expect(mockSubscriptionRepository.findByRestaurantId).toHaveBeenCalledWith("test-restaurant-id");
  });
  //-aqui termina test de acceso permitido-//

  //-aqui empieza test de acceso denegado y es para validar que se lance un error si la suscripción venció hace más de 7 días-//
  it("debería denegar el acceso de escritura si la suscripción venció hace más de 7 días (canWrite === false)", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-28T12:00:00.000Z"));

    const expiredSub = Subscription.create({
      id: "sub-2",
      restaurantId: "test-restaurant-id",
      status: "canceled",
      planId: "pro",
      currentPeriodStart: new Date("2026-04-18T12:00:00.000Z"),
      currentPeriodEnd: new Date("2026-05-18T12:00:00.000Z"),
      trialEndsAt: new Date("2026-05-18T12:00:00.000Z"),
    });

    mockSubscriptionRepository.findByRestaurantId.mockResolvedValue(expiredSub);

    await expect(assertCanWrite("test-restaurant-id")).rejects.toThrow(
      "Permiso de escritura denegado"
    );

    vi.useRealTimers();
  });
  //-aqui termina test de acceso denegado-//
});
