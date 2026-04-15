/**
 * Archivo: PublicSiteShell.tsx
 * Responsabilidad: Montar la navegación y el pie compartidos para las superficies públicas.
 * Tipo: UI
 */

import type { ReactNode } from "react";
import { PublicFooter } from "@/components/public/PublicFooter";
import { PublicHeader } from "@/components/public/PublicHeader";

interface PublicSiteShellProps {
  children: ReactNode;
}

//-aqui empieza componente PublicSiteShell y es para envolver la experiencia pública completa-//
/**
 * Estructura común del sitio público con header, navegación y footer.
 */
export function PublicSiteShell({ children }: PublicSiteShellProps) {
  return (
    <div className="flex min-h-full flex-col bg-surface text-foreground">
      <PublicHeader />

      <main className="flex-1">{children}</main>

      <PublicFooter />
    </div>
  );
}
//-aqui termina componente PublicSiteShell-//
