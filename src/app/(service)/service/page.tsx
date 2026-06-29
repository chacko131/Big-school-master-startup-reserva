/**
 * Archivo: page.tsx
 * Responsabilidad: Punto de entrada del módulo de servicio.
 *   Detecta el rol del usuario autenticado y redirige a su vista correspondiente.
 * Tipo: UI (server)
 */

import { redirect } from "next/navigation";
import { getServiceSession } from "@/modules/auth/get-service-session";
import { resolveServiceRoute } from "@/modules/auth/require-service-role";

//-aqui empieza componente ServiceEntryPage y es para redirigir al usuario a su vista de servicio-//
/**
 * Landing del módulo de servicio — no renderiza nada, solo redirige.
 * @sideEffect redirige según el rol
 */
export default async function ServiceEntryPage() {
  const { role } = await getServiceSession();
  redirect(resolveServiceRoute(role));
}
//-aqui termina componente ServiceEntryPage-//
