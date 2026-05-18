/**
 * Archivo: get-restaurant-id.ts
 * Responsabilidad: Obtener el restaurantId activo del usuario autenticado desde sus memberships.
 * Reemplaza la lectura de la cookie onboarding_restaurant_id en todas las server actions.
 * Tipo: servicio
 */

import { redirect } from "next/navigation";
import { requireCurrentUser } from "./get-current-user";
import { getUsersInfrastructure } from "@/modules/users/infrastructure/users-infrastructure";

//-aqui empieza funcion getRestaurantIdFromSession y es para obtener el restaurantId del usuario autenticado-//
/**
 * Devuelve el restaurantId de la primera membership ACTIVE del usuario autenticado.
 * Si no hay sesión → redirige a /sign-in.
 * Si no tiene memberships activas → redirige a /onboarding/restaurant.
 * @sideEffect
 */
export async function getRestaurantIdFromSession(): Promise<string> {
  const user = await requireCurrentUser();

  const { membershipRepository } = getUsersInfrastructure();
  const memberships = await membershipRepository.findActiveByUserId(user.id);

  if (memberships.length === 0) {
    redirect("/onboarding/restaurant");
  }

  return memberships[0]!.toPrimitives().restaurantId;
}
//-aqui termina funcion getRestaurantIdFromSession-//
