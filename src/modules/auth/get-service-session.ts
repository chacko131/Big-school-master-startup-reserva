/**
 * Archivo: get-service-session.ts
 * Responsabilidad: Obtener en una sola llamada el restaurantId y el rol del usuario
 *   autenticado para el módulo de servicio independiente (/service).
 *   Si no hay sesión o no tiene membership activa, redirige.
 * Tipo: servicio
 */

import { redirect } from "next/navigation";
import { getCurrentUser } from "./get-current-user";
import { getUsersInfrastructure } from "@/modules/users/infrastructure/users-infrastructure";
import type { MembershipRole } from "@/modules/users/domain/entities/user-restaurant-membership.entity";

export interface ServiceSession {
  restaurantId: string;
  userId: string;
  role: MembershipRole;
}

//-aqui empieza funcion getServiceSession y es para resolver restaurantId y rol del usuario en el módulo de servicio-//
/**
 * Devuelve el restaurantId, userId y rol del usuario autenticado.
 * - Sin sesión → redirige a /sign-in
 * - Sin membership activa → redirige a /onboarding/restaurant
 * @sideEffect
 */
export async function getServiceSession(): Promise<ServiceSession> {
  const user = await getCurrentUser();

  if (user === null) {
    redirect("/sign-in?redirect_url=/service");
  }

  const { membershipRepository } = getUsersInfrastructure();
  const memberships = await membershipRepository.findActiveByUserId(user.id);

  if (memberships.length === 0) {
    redirect("/onboarding/restaurant");
  }

  const membership = memberships[0]!.toPrimitives();

  return {
    restaurantId: membership.restaurantId,
    userId: user.id,
    role: membership.role as MembershipRole,
  };
}
//-aqui termina funcion getServiceSession-//
