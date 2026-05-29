/**
 * Archivo: get-restaurant-access-level.use-case.ts
 * Responsabilidad: Consultar la suscripción de un restaurante y devolver su nivel de acceso actual.
 * Tipo: servicio
 *
 * Este use case es el punto centralizado de consulta de acceso.
 * Lo usa el layout del dashboard, los server actions, y cualquier
 * componente que necesite saber si el restaurante puede operar.
 */

import { type SubscriptionRepository } from "../../../domain/ports/subscription.repository.port";
import {
  calculateAccessLevel,
  type AccessLevelResult,
} from "../../../domain/value-objects/access-level";

export interface GetRestaurantAccessLevelInput {
  restaurantId: string;
}

export class GetRestaurantAccessLevel {
  constructor(private readonly subscriptionRepository: SubscriptionRepository) {}

  //-aqui empieza funcion execute y es para obtener el nivel de acceso de un restaurante-//
  /**
   * Consulta la suscripción en BD y delega el cálculo del nivel de acceso
   * a la función pura de dominio `calculateAccessLevel`.
   *
   * @sideEffect — lectura de base de datos.
   */
  async execute(input: GetRestaurantAccessLevelInput): Promise<AccessLevelResult> {
    const subscription = await this.subscriptionRepository.findByRestaurantId(
      input.restaurantId
    );

    return calculateAccessLevel(subscription);
  }
  //-aqui termina funcion execute-//
}
