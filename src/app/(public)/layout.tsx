/**
 * Archivo: layout.tsx
 * Responsabilidad: Aplicar el shell compartido a las rutas públicas agrupadas.
 * Tipo: UI
 */

import type { ReactNode } from "react";
import { PublicSiteShell } from "@/components/public/PublicSiteShell";

interface PublicLayoutProps {
  children: ReactNode;
}

//-aqui empieza layout de las rutas públicas-//
/**
 * Layout compartido para las superficies públicas agrupadas.
 */
export default function PublicLayout({ children }: PublicLayoutProps) {
  return <PublicSiteShell>{children}</PublicSiteShell>;
}
//-aqui termina layout de las rutas públicas-//
