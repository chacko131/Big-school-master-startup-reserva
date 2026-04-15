/**
 * Archivo: PublicPageShell.tsx
 * Responsabilidad: Proporcionar un contenedor consistente para las superficies públicas.
 * Tipo: UI
 */

import type { ReactNode } from "react";

interface PublicPageShellProps {
  children: ReactNode;
  className?: string;
}

//-aqui empieza componente PublicPageShell y es para envolver las páginas públicas-//
/**
 * Enmarca la experiencia pública con fondo, espaciado y capas visuales coherentes.
 */
export function PublicPageShell({ children, className = "" }: PublicPageShellProps) {
  return (
    <div className={`relative flex min-h-full flex-1 flex-col overflow-hidden bg-surface ${className}`}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top_left,_rgba(67,102,83,0.12),_transparent_55%),radial-gradient(circle_at_top_right,_rgba(180,90,67,0.10),_transparent_42%)]" />
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col gap-16 px-6 py-10 sm:px-8 lg:px-12">
        {children}
      </div>
    </div>
  );
}
//-aqui termina componente PublicPageShell-//
