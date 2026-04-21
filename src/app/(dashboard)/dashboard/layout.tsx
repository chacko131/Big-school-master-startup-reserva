/**
 * Archivo: layout.tsx
 * Responsabilidad: Envolver las páginas del dashboard con el shell compartido de navegación.
 * Tipo: UI
 */

import type { ReactNode } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

interface DashboardLayoutProps {
  children: ReactNode;
}

//-aqui empieza pagina DashboardLayout y es para aplicar el shell compartido al segmento dashboard-//
/**
 * Renderiza el layout compartido del dashboard.
 */
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return <DashboardShell>{children}</DashboardShell>;
}
//-aqui termina pagina DashboardLayout-//
