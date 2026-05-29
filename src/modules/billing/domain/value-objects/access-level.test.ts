/**
 * Archivo: access-level.test.ts
 * Responsabilidad: Testear la lógica pura de cálculo de nivel de acceso.
 * Tipo: lógica
 */

import { describe, it, expect } from "vitest";
import { calculateAccessLevel } from "./access-level";
import { Subscription } from "../entities/subscription.entity";

//-aqui empieza helpers de test y son para crear suscripciones rápidamente-//

/** Crea una suscripción activa pagada. */
function createActiveSubscription(planId: "basic" | "pro" = "basic"): Subscription {
  return Subscription.create({
    id: "sub-1",
    restaurantId: "rest-1",
    stripeCustomerId: "cus_123",
    stripeSubscriptionId: "sub_stripe_1",
    status: "active",
    planId,
    priceId: "price_123",
  });
}

/** Crea una suscripción en trial con N días restantes. */
function createTrialSubscription(daysRemaining: number): Subscription {
  const now = new Date();
  const trialEnd = new Date(now.getTime() + daysRemaining * 24 * 60 * 60 * 1000);
  return Subscription.create({
    id: "sub-2",
    restaurantId: "rest-1",
    status: "trialing",
    planId: "basic",
    trialEndsAt: trialEnd,
  });
}

/** Crea una suscripción cuyo trial expiró hace N días. */
function createExpiredTrialSubscription(daysAgo: number): Subscription {
  const now = new Date();
  const trialEnd = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  return Subscription.create({
    id: "sub-3",
    restaurantId: "rest-1",
    status: "trialing",
    planId: "basic",
    trialEndsAt: trialEnd,
  });
}

//-aqui terminan helpers de test-//

describe("calculateAccessLevel", () => {
  it("devuelve 'suspended' cuando no hay suscripción", () => {
    const result = calculateAccessLevel(null);

    expect(result.level).toBe("suspended");
    expect(result.planId).toBeNull();
    expect(result.canWrite).toBe(false);
    // Solo home, billing y settings son accesibles
    expect(result.allowedFeatures.has("home")).toBe(true);
    expect(result.allowedFeatures.has("billing")).toBe(true);
    expect(result.allowedFeatures.has("settings")).toBe(true);
    expect(result.allowedFeatures.has("reservations")).toBe(false);
  });

  it("devuelve 'full' con plan básico cuando la suscripción está activa", () => {
    const sub = createActiveSubscription("basic");
    const result = calculateAccessLevel(sub);

    expect(result.level).toBe("full");
    expect(result.planId).toBe("basic");
    expect(result.canWrite).toBe(true);
    expect(result.isTrialActive).toBe(false);
    // Basic tiene reservations, tables, schedule, team
    expect(result.allowedFeatures.has("reservations")).toBe(true);
    expect(result.allowedFeatures.has("tables")).toBe(true);
    expect(result.allowedFeatures.has("schedule")).toBe(true);
    expect(result.allowedFeatures.has("team")).toBe(true);
    // Basic NO tiene guests ni analytics
    expect(result.allowedFeatures.has("guests")).toBe(false);
    expect(result.allowedFeatures.has("analytics")).toBe(false);
  });

  it("devuelve 'full' con plan pro que incluye guests y analytics", () => {
    const sub = createActiveSubscription("pro");
    const result = calculateAccessLevel(sub);

    expect(result.level).toBe("full");
    expect(result.planId).toBe("pro");
    expect(result.allowedFeatures.has("guests")).toBe(true);
    expect(result.allowedFeatures.has("analytics")).toBe(true);
  });

  it("devuelve 'full' con acceso pro durante trial activo", () => {
    const sub = createTrialSubscription(30);
    const result = calculateAccessLevel(sub);

    expect(result.level).toBe("full");
    expect(result.isTrialActive).toBe(true);
    expect(result.canWrite).toBe(true);
    // Durante trial ve todo como si fuera pro
    expect(result.allowedFeatures.has("guests")).toBe(true);
    expect(result.allowedFeatures.has("analytics")).toBe(true);
  });

  it("devuelve 'full' con mensaje de urgencia cuando quedan 7 días o menos de trial", () => {
    const sub = createTrialSubscription(5);
    const result = calculateAccessLevel(sub);

    expect(result.level).toBe("full");
    expect(result.isTrialActive).toBe(true);
    expect(result.remainingTrialDays).toBeLessThanOrEqual(7);
    expect(result.message).toContain("termina");
  });

  it("devuelve 'grace' cuando el trial expiró hace 3 días", () => {
    const sub = createExpiredTrialSubscription(3);
    const result = calculateAccessLevel(sub);

    expect(result.level).toBe("grace");
    expect(result.canWrite).toBe(true);
    expect(result.daysUntilNextPhase).toBe(4); // 7 - 3 = 4 días para read_only
  });

  it("devuelve 'grace' cuando el trial expiró hace exactamente 7 días", () => {
    const sub = createExpiredTrialSubscription(7);
    const result = calculateAccessLevel(sub);

    expect(result.level).toBe("grace");
    expect(result.canWrite).toBe(true);
    expect(result.daysUntilNextPhase).toBe(0);
  });

  it("devuelve 'read_only' cuando el trial expiró hace 10 días", () => {
    const sub = createExpiredTrialSubscription(10);
    const result = calculateAccessLevel(sub);

    expect(result.level).toBe("read_only");
    expect(result.canWrite).toBe(false);
    expect(result.daysUntilNextPhase).toBe(4); // 14 - 10 = 4 días para suspensión
  });

  it("devuelve 'suspended' cuando el trial expiró hace 15 días", () => {
    const sub = createExpiredTrialSubscription(15);
    const result = calculateAccessLevel(sub);

    expect(result.level).toBe("suspended");
    expect(result.canWrite).toBe(false);
    expect(result.daysUntilNextPhase).toBeNull();
    // Solo home, billing y settings
    expect(result.allowedFeatures.has("reservations")).toBe(false);
  });

  it("devuelve 'grace' cuando el pago falló (past_due)", () => {
    const sub = Subscription.create({
      id: "sub-pd",
      restaurantId: "rest-1",
      stripeCustomerId: "cus_123",
      stripeSubscriptionId: "sub_stripe_1",
      status: "past_due",
      planId: "pro",
      priceId: "price_123",
    });

    const result = calculateAccessLevel(sub);

    expect(result.level).toBe("grace");
    expect(result.canWrite).toBe(true);
    expect(result.message).toContain("método de pago");
  });

  it("devuelve 'full' cuando canceló pero el periodo pagado no ha terminado", () => {
    const futureEnd = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);
    const sub = Subscription.create({
      id: "sub-cancel",
      restaurantId: "rest-1",
      stripeCustomerId: "cus_123",
      stripeSubscriptionId: "sub_stripe_1",
      status: "canceled",
      planId: "basic",
      priceId: "price_123",
      currentPeriodEnd: futureEnd,
    });

    const result = calculateAccessLevel(sub);

    expect(result.level).toBe("full");
    expect(result.canWrite).toBe(true);
    expect(result.message).toContain("cancelada");
  });
});
