/**
 * Archivo: billing.errors.ts
 * Responsabilidad: Definir los errores específicos del dominio de facturación.
 * Tipo: lógica
 */

export class BillingDomainError extends Error {
  constructor(message: string, readonly code = "BILLING_DOMAIN_ERROR") {
    super(message);
    this.name = "BillingDomainError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class SubscriptionNotFoundError extends BillingDomainError {
  constructor(restaurantId: string) {
    super(
      `No se encontró ninguna suscripción registrada para el restaurante: ${restaurantId}`,
      "SUBSCRIPTION_NOT_FOUND"
    );
    this.name = "SubscriptionNotFoundError";
  }
}

export class ActiveSubscriptionTrialForbiddenError extends BillingDomainError {
  constructor() {
    super(
      "Cannot start trial for active subscription",
      "ACTIVE_SUBSCRIPTION_TRIAL_FORBIDDEN"
    );
    this.name = "ActiveSubscriptionTrialForbiddenError";
  }
}

