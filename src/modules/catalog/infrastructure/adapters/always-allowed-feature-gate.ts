/**
 * Archivo: always-allowed-feature-gate.ts
 * Responsabilidad: Adaptador temporal que siempre permite el acceso a cualquier feature.
 * Tipo: servicio
 *
 * Este adaptador se usa durante desarrollo mientras no exista un sistema de billing/planes.
 * Cuando se implemente billing, se reemplaza por un adaptador que consulte
 * el plan activo del restaurante (ej: PlanBasedFeatureGate).
 */

import {
  type FeatureGatePort,
  type FeatureName,
} from "../../application/ports/feature-gate.port";

export class AlwaysAllowedFeatureGate implements FeatureGatePort {
  //-aqui empieza funcion isFeatureAllowed y es para siempre permitir acceso en entorno de desarrollo-//
  /**
   * Siempre devuelve true — todo desbloqueado mientras no exista billing.
   * @pure
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async isFeatureAllowed(_restaurantId: string, _feature: FeatureName): Promise<boolean> {
    return true;
  }
  //-aqui termina funcion isFeatureAllowed y se va autilizar en todos los use cases con gate-//
}
