/**
 * Archivo: billing-infrastructure.ts
 * Responsabilidad: Componer las implementaciones concretas de infraestructura del módulo billing.
 * Tipo: servicio
 */

import { PrismaClient } from "@/generated/prisma/client";
import { getPrismaClient } from "@/services/prisma.service";
import { type SubscriptionRepository } from "../domain/ports/subscription.repository.port";
import { type BillingService } from "../domain/ports/billing.service.port";
import { PrismaSubscriptionRepository } from "./repositories/prisma-subscription.repository";
import {
  createStripeCheckoutSession,
  createStripeCustomerPortalSession,
  constructStripeEvent,
  listStripeInvoices,
  updateStripeSubscriptionPlan,
} from "@/services/stripe.service";

export interface BillingInfrastructure {
  subscriptionRepository: SubscriptionRepository;
  billingService: BillingService;
}

//-aqui empieza funcion createBillingInfrastructure y es para ensamblar la infraestructura del modulo billing-//
/**
 * Construye las implementaciones concretas de infraestructura del módulo billing.
 * Recibe el cliente Prisma como parámetro para facilitar testing.
 * @pure
 */
export function createBillingInfrastructure(prismaClient: PrismaClient): BillingInfrastructure {
  return {
    subscriptionRepository: new PrismaSubscriptionRepository(prismaClient),
    billingService: {
      createCheckoutSession: createStripeCheckoutSession,
      createCustomerPortalSession: createStripeCustomerPortalSession,
      constructEvent: constructStripeEvent,
      listInvoices: listStripeInvoices,
      updateSubscriptionPlan: updateStripeSubscriptionPlan,
    },
  };
}
//-aqui termina funcion createBillingInfrastructure-//

//-aqui empieza funcion getBillingInfrastructure y es para obtener la infraestructura con el cliente Prisma compartido-//
/**
 * Construye la infraestructura del módulo billing usando el cliente Prisma compartido del proyecto.
 * Es la función que usan los server actions y server components en runtime.
 * @sideEffect
 */
export function getBillingInfrastructure(): BillingInfrastructure {
  return createBillingInfrastructure(getPrismaClient());
}
//-aqui termina funcion getBillingInfrastructure-//
