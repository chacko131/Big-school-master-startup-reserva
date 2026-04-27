/**
 * Archivo: layout.tsx
 * Responsabilidad: Envolver las páginas del panel SaaS de administración con el shell compartido.
 * Tipo: UI
 */

import type { ReactNode } from "react";
import { AdminShell } from "@/components/admin/AdminShell";

interface AdminLayoutProps {
  children: ReactNode;
}

//-aqui empieza pagina AdminLayout y es para aplicar el shell compartido al segmento admin-//
/**
 * Renderiza el layout compartido del panel admin.
 */
export default function AdminLayout({ children }: AdminLayoutProps) {
  return <AdminShell>{children}</AdminShell>;
}
//-aqui termina pagina AdminLayout-//
