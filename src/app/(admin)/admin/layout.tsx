/**
 * Archivo: layout.tsx
 * Responsabilidad: Envolver las páginas del panel SaaS de administración con el shell compartido.
 * Protege el segmento admin: solo usuarios con globalRole SUPER_ADMIN pueden acceder.
 * Tipo: UI
 */

import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { getCurrentUser } from "@/modules/auth/get-current-user";

interface AdminLayoutProps {
  children: ReactNode;
}

//-aqui empieza pagina AdminLayout y es para aplicar el shell compartido al segmento admin-//
/**
 * Renderiza el layout compartido del panel admin.
 * Redirige a /sign-in si no hay sesión activa.
 * Devuelve 403 si el usuario autenticado no es SUPER_ADMIN.
 */
export default async function AdminLayout({ children }: AdminLayoutProps) {
  const user = await getCurrentUser();

  if (user === null) {
    redirect("/sign-in?redirect_url=/admin");
  }

  if (!user.isSuperAdmin()) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-surface px-6">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
            Acceso denegado
          </p>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-primary">
            No tienes permiso para acceder a esta sección.
          </h1>
        </div>
      </main>
    );
  }

  return <AdminShell>{children}</AdminShell>;
}
//-aqui termina pagina AdminLayout-//
