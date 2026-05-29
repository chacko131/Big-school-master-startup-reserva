/**
 * Archivo: write-access-guard.ts
 * Responsabilidad: Centralizar la protección de acceso de escritura (canWrite) en el servidor.
 * Tipo: servicio
 */

import { getRestaurantIdFromSession } from "@/modules/auth/get-restaurant-id";
import { getBillingInfrastructure } from "./billing-infrastructure";
import { GetRestaurantAccessLevel } from "../application/use-cases/GetRestaurantAccessLevel/get-restaurant-access-level.use-case";

//-aqui empieza funcion assertCanWrite y es para validar permisos de escritura del restaurante-//
/**
 * Verifica si el restaurante actual tiene permiso de escritura (canWrite === true).
 * Si no tiene permiso de escritura (debido a suscripción vencida o suspensión), lanza un error.
 * De lo contrario, devuelve el restaurantId activo de la sesión.
 *
 * @sideEffect — Lee la sesión y la base de datos de suscripciones.
 */
export async function assertCanWrite(providedRestaurantId?: string): Promise<string> {
  const restaurantId = providedRestaurantId ?? await getRestaurantIdFromSession();

  const { subscriptionRepository } = getBillingInfrastructure();
  const getAccessLevelUseCase = new GetRestaurantAccessLevel(subscriptionRepository);

  const accessLevel = await getAccessLevelUseCase.execute({ restaurantId });

  if (!accessLevel.canWrite) {
    throw new Error(
      "Permiso de escritura denegado. Tu restaurante se encuentra en modo de solo lectura o suspendido por facturación pendiente."
    );
  }

  return restaurantId;
}
//-aqui termina funcion assertCanWrite-//
