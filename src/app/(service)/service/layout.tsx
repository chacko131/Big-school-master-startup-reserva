/**
 * Archivo: layout.tsx
 * Responsabilidad: Layout raíz del módulo de servicio independiente.
 *   Lee el rol del usuario y renderiza el header adecuado:
 *   - Manager/Propietario → header con switcher de vistas
 *   - Staff → header minimalista sin navegación entre vistas
 * Tipo: UI (server)
 */

import type { Metadata } from "next";
import { getServiceSession } from "@/modules/auth/get-service-session";
import { ServiceManagerHeader } from "@/components/service/layout/ServiceManagerHeader";
import { ServiceStaffHeader } from "@/components/service/layout/ServiceStaffHeader";

export const metadata: Metadata = {
  title: "Servicio del día — Reserva Latina",
};

//-aqui empieza componente ServiceLayout y es para envolver las vistas del módulo de servicio con el header correcto-//
/**
 * Lee el rol de la sesión activa y decide qué header mostrar.
 * Manager/Owner → ServiceManagerHeader (con switcher Sala/Cocina/Barra)
 * Staff → ServiceStaffHeader (solo su área, sin navegación)
 * @sideEffect lee sesión
 */
export default async function ServiceLayout({ children }: { children: React.ReactNode }) {
  const { role } = await getServiceSession();
  const isManager = role === "RESTAURANT_OWNER" || role === "MANAGER";

  return (
    <div className="min-h-screen antialiased flex flex-col">
      {isManager ? (
        <ServiceManagerHeader role={role} />
      ) : (
        <ServiceStaffHeader role={role} />
      )}
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}
//-aqui termina componente ServiceLayout-//
