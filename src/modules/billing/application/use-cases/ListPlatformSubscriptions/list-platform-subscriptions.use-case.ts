/**
 * Archivo: list-platform-subscriptions.use-case.ts
 * Responsabilidad: Listar todas las suscripciones de la plataforma para el panel admin.
 * Tipo: lógica
 */

import { type SubscriptionRepository } from "../../../domain/ports/subscription.repository.port";
import { type SubscriptionStatus, type SubscriptionPlanId } from "../../../domain/entities/subscription.entity";

//-aqui empieza tipo PlatformSubscriptionRow-//
/** Fila de suscripción para el listado global del panel admin. */
export interface PlatformSubscriptionRow {
  id: string;
  restaurantId: string;
  status: SubscriptionStatus;
  planId: SubscriptionPlanId;
  isTrial: boolean;
  remainingTrialDays: number;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
}
//-aqui termina tipo PlatformSubscriptionRow-//

//-aqui empieza clase ListPlatformSubscriptions y es para listar suscripciones para admin-//
/**
 * Caso de uso para obtener la lista global de suscripciones.
 *
 * No resuelve nombres de restaurante — eso es responsabilidad de la capa de
 * orquestación (server action) que combina este resultado con datos de catalog.
 *
 * @sideEffect — lectura de base de datos.
 */
export class ListPlatformSubscriptions {
  constructor(private readonly subscriptionRepository: SubscriptionRepository) {}

  async execute(): Promise<PlatformSubscriptionRow[]> {
    const subscriptions = await this.subscriptionRepository.findAll();

    return subscriptions.map((sub) => ({
      id: sub.id,
      restaurantId: sub.restaurantId,
      status: sub.status,
      planId: sub.planId,
      isTrial: sub.isTrialActive(),
      remainingTrialDays: sub.getRemainingTrialDays(),
      currentPeriodEnd: sub.currentPeriodEnd.toISOString(),
      cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
      createdAt: sub.createdAt.toISOString(),
    }));
  }
}
//-aqui termina clase ListPlatformSubscriptions-//
