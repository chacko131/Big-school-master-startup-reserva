/**
 * Archivo: ServiceStaffHeader.tsx
 * Responsabilidad: Header minimalista para el personal de sala, cocina y barra.
 *   Solo muestra el área asignada y el reloj. Sin switcher de vistas.
 * Tipo: UI
 */

import { T } from "@/components/T";
import { ServiceClock } from "./ServiceClock";
import type { MembershipRole } from "@/modules/users/domain/entities/user-restaurant-membership.entity";

interface ServiceStaffHeaderProps {
  role: MembershipRole;
}

const AREA_LABEL: Partial<Record<MembershipRole, string>> = {
  STAFF_WAITER: "Sala",
  STAFF_KITCHEN: "Cocina",
  STAFF_BAR: "Barra",
};

//-aqui empieza componente ServiceStaffHeader y es para el header minimalista del personal operativo-//
/**
 * Header sin switcher para STAFF_WAITER, STAFF_KITCHEN y STAFF_BAR.
 * Solo muestra el área y el reloj.
 * @pure
 */
export function ServiceStaffHeader({ role }: ServiceStaffHeaderProps) {
  const areaLabel = AREA_LABEL[role] ?? "Servicio";

  return (
    <header className="sticky top-0 z-50 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between px-6 h-14">
      <div className="flex items-center gap-3">
        <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
        <h1 className="text-white font-black text-lg tracking-tight">
          <T>{areaLabel}</T>
        </h1>
      </div>
      <ServiceClock />
    </header>
  );
}
//-aqui termina componente ServiceStaffHeader-//
