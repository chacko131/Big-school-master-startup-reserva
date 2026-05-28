/**
 * Archivo: prisma-subscription.repository.ts
 * Responsabilidad: Implementar la interfaz del puerto SubscriptionRepository usando Prisma Client.
 * Tipo: servicio
 */

import { PrismaClient } from "@/generated/prisma/client";
import {
  Subscription,
  SubscriptionStatus,
  SubscriptionPlanId,
} from "../../domain/entities/subscription.entity";
import { type SubscriptionRepository } from "../../domain/ports/subscription.repository.port";

export class PrismaSubscriptionRepository implements SubscriptionRepository {
  constructor(private readonly prismaClient: PrismaClient) {}

  //-aqui empieza funcion save y es para persistir o actualizar una suscripcion en base de datos-//
  /**
   * Guarda o actualiza la suscripción especificada usando upsert de Prisma.
   * @sideEffect — altera el estado de la base de datos.
   */
  async save(subscription: Subscription): Promise<void> {
    const primitives = subscription.toPrimitives();

    await this.prismaClient.subscription.upsert({
      where: {
        restaurantId: primitives.restaurantId,
      },
      update: {
        stripeCustomerId: primitives.stripeCustomerId,
        stripeSubscriptionId: primitives.stripeSubscriptionId,
        status: primitives.status,
        planId: primitives.planId,
        priceId: primitives.priceId,
        currentPeriodStart: primitives.currentPeriodStart,
        currentPeriodEnd: primitives.currentPeriodEnd,
        trialEndsAt: primitives.trialEndsAt,
        cancelAtPeriodEnd: primitives.cancelAtPeriodEnd,
        version: primitives.version,
      },
      create: {
        id: primitives.id,
        restaurantId: primitives.restaurantId,
        stripeCustomerId: primitives.stripeCustomerId,
        stripeSubscriptionId: primitives.stripeSubscriptionId,
        status: primitives.status,
        planId: primitives.planId,
        priceId: primitives.priceId,
        currentPeriodStart: primitives.currentPeriodStart,
        currentPeriodEnd: primitives.currentPeriodEnd,
        trialEndsAt: primitives.trialEndsAt,
        cancelAtPeriodEnd: primitives.cancelAtPeriodEnd,
        version: primitives.version,
      },
    });
  }
  //-aqui termina funcion save-//

  //-aqui empieza funcion findByRestaurantId y es para buscar la suscripcion por id de restaurante-//
  /**
   * Recupera la suscripción del restaurante especificado o devuelve null si no existe.
   * @pure — lectura de base de datos.
   */
  async findByRestaurantId(restaurantId: string): Promise<Subscription | null> {
    const record = await this.prismaClient.subscription.findUnique({
      where: {
        restaurantId,
      },
    });

    if (record === null) {
      return null;
    }

    return Subscription.fromPrimitives({
      id: record.id,
      restaurantId: record.restaurantId,
      stripeCustomerId: record.stripeCustomerId,
      stripeSubscriptionId: record.stripeSubscriptionId,
      status: record.status as SubscriptionStatus,
      planId: record.planId as SubscriptionPlanId,
      priceId: record.priceId,
      currentPeriodStart: record.currentPeriodStart,
      currentPeriodEnd: record.currentPeriodEnd,
      trialEndsAt: record.trialEndsAt,
      cancelAtPeriodEnd: record.cancelAtPeriodEnd,
      version: record.version,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
  //-aqui termina funcion findByRestaurantId-//

  //-aqui empieza funcion findByStripeSubscriptionId y es para buscar la suscripcion por id de Stripe-//
  /**
   * Recupera la suscripción basada en el identificador de suscripción de Stripe.
   * @pure
   */
  async findByStripeSubscriptionId(
    stripeSubscriptionId: string,
  ): Promise<Subscription | null> {
    const record = await this.prismaClient.subscription.findUnique({
      where: {
        stripeSubscriptionId,
      },
    });

    if (record === null) {
      return null;
    }

    return Subscription.fromPrimitives({
      id: record.id,
      restaurantId: record.restaurantId,
      stripeCustomerId: record.stripeCustomerId,
      stripeSubscriptionId: record.stripeSubscriptionId,
      status: record.status as SubscriptionStatus,
      planId: record.planId as SubscriptionPlanId,
      priceId: record.priceId,
      currentPeriodStart: record.currentPeriodStart,
      currentPeriodEnd: record.currentPeriodEnd,
      trialEndsAt: record.trialEndsAt,
      cancelAtPeriodEnd: record.cancelAtPeriodEnd,
      version: record.version,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
  //-aqui termina funcion findByStripeSubscriptionId-//

  //-aqui empieza funcion findByStripeCustomerId y es para buscar la suscripcion por id de cliente Stripe-//
  /**
   * Recupera la suscripción basada en el identificador de cliente de Stripe.
   * @pure
   */
  async findByStripeCustomerId(
    stripeCustomerId: string,
  ): Promise<Subscription | null> {
    const record = await this.prismaClient.subscription.findUnique({
      where: {
        stripeCustomerId,
      },
    });

    if (record === null) {
      return null;
    }

    return Subscription.fromPrimitives({
      id: record.id,
      restaurantId: record.restaurantId,
      stripeCustomerId: record.stripeCustomerId,
      stripeSubscriptionId: record.stripeSubscriptionId,
      status: record.status as SubscriptionStatus,
      planId: record.planId as SubscriptionPlanId,
      priceId: record.priceId,
      currentPeriodStart: record.currentPeriodStart,
      currentPeriodEnd: record.currentPeriodEnd,
      trialEndsAt: record.trialEndsAt,
      cancelAtPeriodEnd: record.cancelAtPeriodEnd,
      version: record.version,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
  //-aqui termina funcion findByStripeCustomerId-//
}
