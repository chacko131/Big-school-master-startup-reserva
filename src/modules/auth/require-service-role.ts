/**
 * Archivo: require-service-role.ts
 * Responsabilidad: Verificar que el usuario autenticado tiene el rol requerido
 *   para acceder a una ruta específica del módulo de servicio independiente.
 *   Si el rol no coincide, redirige a la ruta correcta para ese usuario.
 * Tipo: servicio
 */

import { redirect } from "next/navigation";
import { getServiceSession } from "./get-service-session";
import type { MembershipRole } from "@/modules/users/domain/entities/user-restaurant-membership.entity";
import type { ServiceSession } from "./get-service-session";

//-aqui empieza funcion resolveServiceRoute y es para mapear cada rol a su ruta correcta-//
/**
 * Devuelve la ruta de destino según el rol del usuario.
 * @pure
 */
export function resolveServiceRoute(role: MembershipRole): string {
  switch (role) {
    case "STAFF_KITCHEN":
      return "/service/kds/kitchen";
    case "STAFF_BAR":
      return "/service/kds/bar";
    case "STAFF_WAITER":
      return "/service/floor";
    case "RESTAURANT_OWNER":
    case "MANAGER":
      return "/service/overview";
  }
}
//-aqui termina funcion resolveServiceRoute-//

//-aqui empieza funcion requireServiceRole y es para proteger cada ruta del módulo de servicio-//
/**
 * Valida que el usuario autenticado tenga uno de los roles permitidos para la ruta.
 * Si el rol no está en la lista de permitidos, redirige a la ruta correcta para ese usuario.
 * Uso: llamar al inicio de cada page.tsx del módulo de servicio.
 * @sideEffect redirige si el rol no está autorizado
 */
export async function requireServiceRole(
  allowedRoles: MembershipRole[]
): Promise<ServiceSession> {
  const session = await getServiceSession();

  if (!allowedRoles.includes(session.role)) {
    redirect(resolveServiceRoute(session.role));
  }

  return session;
}
//-aqui termina funcion requireServiceRole-//
