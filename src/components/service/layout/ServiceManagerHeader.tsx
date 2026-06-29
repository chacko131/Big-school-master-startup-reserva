/**
 * Archivo: ServiceManagerHeader.tsx
 * Responsabilidad: Header del módulo de servicio para dueño y manager.
 *   Incluye el switcher de vistas (Sala / Cocina / Barra), reloj en vivo
 *   y acceso rápido de vuelta al dashboard.
 * Tipo: UI
 */

import Link from "next/link";
import { T } from "@/components/T";
import { ServiceClock } from "./ServiceClock";
import { ServiceViewSwitcher } from "./ServiceViewSwitcher";
import type { MembershipRole } from "@/modules/users/domain/entities/user-restaurant-membership.entity";

interface ServiceManagerHeaderProps {
  role: MembershipRole;
}

const ROLE_LABEL: Partial<Record<MembershipRole, string>> = {
  RESTAURANT_OWNER: "Propietario",
  MANAGER: "Manager",
};

//-aqui empieza componente ServiceManagerHeader y es para el header del módulo de servicio del dueño y manager-//
/**
 * Header completo para RESTAURANT_OWNER y MANAGER.
 * Muestra logo, switcher de vistas, reloj y enlace al dashboard.
 * @pure
 */
export function ServiceManagerHeader({ role }: ServiceManagerHeaderProps) {
  const roleLabel = ROLE_LABEL[role] ?? "Manager";

  return (
    <header className="sticky top-0 z-50 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between px-6 h-16 gap-6">
      {/* Marca */}
      <Link href="/dashboard" className="shrink-0 flex items-center gap-2" aria-label="Volver al dashboard">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logoHeader.png" alt="Reserva Latina" className="h-7 object-contain brightness-0 invert" />
      </Link>

      {/* Switcher central */}
      <div className="flex-1 flex justify-center">
        <ServiceViewSwitcher />
      </div>

      {/* Controles derecha */}
      <div className="shrink-0 flex items-center gap-4">
        <div className="hidden md:flex flex-col items-end">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            <T>{roleLabel}</T>
          </span>
        </div>
        <ServiceClock />
        <Link
          href="/dashboard"
          className="hidden md:flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <T>Dashboard</T>
        </Link>
      </div>
    </header>
  );
}
//-aqui termina componente ServiceManagerHeader-//
