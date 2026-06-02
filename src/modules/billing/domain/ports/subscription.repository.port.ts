/**
 * Archivo: subscription.repository.port.ts
 * Responsabilidad: Definir la interfaz del puerto para la persistencia de suscripciones en base de datos.
 * Tipo: lógica
 */

import { Subscription } from "../entities/subscription.entity";

export interface SubscriptionRepository {
  /**
   * Guarda o actualiza la suscripción especificada en la base de datos.
   * @sideEffect — altera el estado de la base de datos.
   */
  save(subscription: Subscription): Promise<void>;

  /**
   * Busca la suscripción asociada a un restaurante por su restaurantId.
   * @pure — lectura de base de datos sin efectos secundarios en memoria.
   */
  findByRestaurantId(restaurantId: string): Promise<Subscription | null>;

  /**
   * Busca la suscripción por el identificador de suscripción de Stripe.
   * @pure
   */
  findByStripeSubscriptionId(stripeSubscriptionId: string): Promise<Subscription | null>;

  /**
   * Busca la suscripción por el identificador de cliente de Stripe.
   * @pure
   */
  findByStripeCustomerId(stripeCustomerId: string): Promise<Subscription | null>;

  /**
   * Devuelve todas las suscripciones de la plataforma.
   * Útil para vistas administrativas globales.
   * @pure
   */
  findAll(): Promise<Subscription[]>;
}
