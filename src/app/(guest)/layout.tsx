/**
 * Archivo: layout.tsx
 * Responsabilidad: Delimitar la experiencia pública del cliente final sin mezclarla con marketing.
 * Tipo: UI
 */

import type { ReactNode } from "react";

interface GuestLayoutProps {
  children: ReactNode;
}

//-aqui empieza layout de experiencia guest y es para aislar la navegacion del cliente final-//
/**
 * Layout base para las rutas públicas B2C del restaurante.
 */
export default function GuestLayout({ children }: GuestLayoutProps) {
  return <>{children}</>;
}
//-aqui termina layout de experiencia guest-//
