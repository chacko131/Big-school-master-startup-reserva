/**
 * Archivo: subscription.entity.test.ts
 * Responsabilidad: Validar las reglas de negocio de la entidad Subscription (estados, trial, expiración).
 * Tipo: lógica
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Subscription } from "./subscription.entity";

describe("Subscription Entity", () => {
  beforeEach(() => {
    // Fijamos la fecha actual para que las pruebas de trial sean deterministas
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-28T12:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  //-aqui empieza test de creacion y es para validar la correcta instanciacion de la suscripcion-//
  it("debería crear una suscripción válida con los valores predeterminados", () => {
    const subscription = Subscription.create({
      id: "sub-123",
      restaurantId: "rest-123",
      status: "trialing",
      planId: "pro",
    });

    expect(subscription.id).toBe("sub-123");
    expect(subscription.restaurantId).toBe("rest-123");
    expect(subscription.status).toBe("trialing");
    expect(subscription.planId).toBe("pro");
    expect(subscription.cancelAtPeriodEnd).toBe(false);
    expect(subscription.version).toBe(1);
    expect(subscription.currentPeriodStart).toBeDefined();
    expect(subscription.currentPeriodEnd).toBeDefined();
  });
  //-aqui termina test de creacion-//

  //-aqui empieza test de validacion y es para comprobar que falla si faltan datos requeridos-//
  it("debería lanzar un error si el id está vacío", () => {
    expect(() => {
      Subscription.create({
        id: "",
        restaurantId: "rest-123",
        status: "active",
        planId: "basic",
      });
    }).toThrow("El ID de la suscripción es obligatorio.");
  });

  it("debería lanzar un error si el restaurantId está vacío", () => {
    expect(() => {
      Subscription.create({
        id: "sub-123",
        restaurantId: " ",
        status: "active",
        planId: "basic",
      });
    }).toThrow("El restaurantId es obligatorio.");
  });
  //-aqui termina test de validacion-//

  //-aqui empieza test de isActive y es para comprobar el estado activo de la suscripcion-//
  it("debería estar activa si el estado es active o trialing", () => {
    const activeSub = Subscription.create({
      id: "sub-123",
      restaurantId: "rest-123",
      status: "active",
      planId: "basic",
    });
    expect(activeSub.isActive()).toBe(true);

    const trialingSub = Subscription.create({
      id: "sub-123",
      restaurantId: "rest-123",
      status: "trialing",
      planId: "pro",
    });
    expect(trialingSub.isActive()).toBe(true);
  });

  it("debería estar activa si el estado no es active pero está dentro del trialEndsAt", () => {
    const futureDate = new Date("2026-06-15T12:00:00.000Z");
    const subInTrial = Subscription.create({
      id: "sub-123",
      restaurantId: "rest-123",
      status: "canceled", // Estado cancelado en Stripe, pero trial local sigue activo
      planId: "pro",
      trialEndsAt: futureDate,
    });

    expect(subInTrial.isActive()).toBe(true);
    expect(subInTrial.isTrialActive()).toBe(true);
  });

  it("no debería estar activa si el estado es canceled y no tiene trial o ya expiró", () => {
    const pastDate = new Date("2026-05-20T12:00:00.000Z");
    const expiredSub = Subscription.create({
      id: "sub-123",
      restaurantId: "rest-123",
      status: "canceled",
      planId: "basic",
      trialEndsAt: pastDate,
    });

    expect(expiredSub.isActive()).toBe(false);
    expect(expiredSub.isTrialActive()).toBe(false);
  });
  //-aqui termina test de isActive-//

  //-aqui empieza test de remainingDays y es para comprobar el conteo de dias restantes del trial-//
  it("debería calcular correctamente los días de trial restantes", () => {
    // Seteamos la fecha a 2 días antes de que termine el trial
    const trialEndsAt = new Date("2026-05-30T12:00:00.000Z");
    const subscription = Subscription.create({
      id: "sub-123",
      restaurantId: "rest-123",
      status: "trialing",
      planId: "pro",
      trialEndsAt,
    });

    expect(subscription.getRemainingTrialDays()).toBe(2);
  });

  it("debería devolver 0 días restantes si el trial ya expiró", () => {
    const trialEndsAt = new Date("2026-05-25T12:00:00.000Z");
    const subscription = Subscription.create({
      id: "sub-123",
      restaurantId: "rest-123",
      status: "trialing",
      planId: "pro",
      trialEndsAt,
    });

    expect(subscription.getRemainingTrialDays()).toBe(0);
  });
  //-aqui termina test de remainingDays-//

  //-aqui empieza test de updateDetails y es para validar la inmutabilidad de la entidad-//
  it("debería actualizar detalles incrementando la versión de forma inmutable", () => {
    const original = Subscription.create({
      id: "sub-123",
      restaurantId: "rest-123",
      status: "trialing",
      planId: "pro",
    });

    const updated = original.updateDetails({
      status: "active",
      stripeSubscriptionId: "stripe-sub-999",
    });

    expect(original.status).toBe("trialing"); // Inmutabilidad
    expect(original.version).toBe(1);

    expect(updated.status).toBe("active");
    expect(updated.stripeSubscriptionId).toBe("stripe-sub-999");
    expect(updated.version).toBe(2);
  });
  //-aqui termina test de updateDetails-//
});
