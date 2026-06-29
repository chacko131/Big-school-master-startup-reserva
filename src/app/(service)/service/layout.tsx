/**
 * Archivo: layout.tsx
 * Responsabilidad: Layout raíz del módulo de servicio independiente.
 *   Sin sidebar ni header del dashboard — superficie propia para el equipo de sala.
 * Tipo: UI (server)
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Servicio del día — Reserva Latina",
};

//-aqui empieza componente ServiceLayout y es para envolver las vistas del módulo de servicio-//
/**
 * Layout minimalista para el módulo de servicio.
 * No hereda nada del dashboard — pantalla completa para el equipo operativo.
 */
export default function ServiceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface text-on-surface antialiased">
      {children}
    </div>
  );
}
//-aqui termina componente ServiceLayout-//
