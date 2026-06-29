/**
 * Archivo: ServiceViewSwitcher.tsx
 * Responsabilidad: Tabs de navegación entre vistas del módulo de servicio
 *   para el dueño y manager (Sala / Cocina / Barra).
 * Tipo: UI (client)
 */

"use client";

import { usePathname, useRouter } from "next/navigation";
import { T } from "@/components/T";

const VIEWS = [
  { label: "Sala", href: "/service/floor" },
  { label: "Cocina", href: "/service/kds/kitchen" },
  { label: "Barra", href: "/service/kds/bar" },
] as const;

//-aqui empieza componente ServiceViewSwitcher y es para cambiar entre vistas del módulo de servicio-//
/**
 * Renderiza tres botones (Sala / Cocina / Barra).
 * Al pulsar navega a la ruta correspondiente.
 * Marca como activo el tab cuyo href coincide con el pathname actual.
 * @pure (sin efectos secundarios de red)
 */
export function ServiceViewSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  //-aqui empieza funcion isActive y es para determinar si un tab es el activo-//
  function isActive(href: string): boolean {
    return pathname === href || pathname.startsWith(`${href}/`);
  }
  //-aqui termina funcion isActive-//

  return (
    <nav aria-label="Cambiar vista de servicio" className="flex bg-zinc-800 p-1 rounded-xl gap-1">
      {VIEWS.map(({ label, href }) => (
        <button
          key={href}
          type="button"
          onClick={() => router.push(href)}
          className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all ${
            isActive(href)
              ? "bg-white text-black shadow-sm"
              : "text-zinc-400 hover:text-white hover:bg-zinc-700"
          }`}
          aria-current={isActive(href) ? "page" : undefined}
        >
          <T>{label}</T>
        </button>
      ))}
    </nav>
  );
}
//-aqui termina componente ServiceViewSwitcher-//
