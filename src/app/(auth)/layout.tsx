/**
 * Archivo: layout.tsx
 * Responsabilidad: Delimitar la superficie pública de autenticación sin reutilizar el shell comercial.
 * Tipo: UI
 */

import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

//-aqui empieza layout de autenticacion publica y es para aislar los flujos de acceso-//
/**
 * Layout base para las rutas públicas de autenticación.
 */
export default function AuthLayout({ children }: AuthLayoutProps) {
  return <>{children}</>;
}
//-aqui termina layout de autenticacion publica-//
