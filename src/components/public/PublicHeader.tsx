/**
 * Archivo: PublicHeader.tsx
 * Responsabilidad: Renderizar el header público reutilizable de Reserva Latina.
 * Tipo: UI
 */

import { LanguageToggle } from "@/components/shared/LanguageToggle";
import { PublicIcon } from "@/components/public/PublicIcon";
import { T } from "@/components/T";

interface PublicNavigationItem {
  label: string;
  href: string;
}

interface PublicHeaderProps {
  navigationItems?: PublicNavigationItem[];
  actionLabel?: string;
  actionHref?: string;
}

const defaultNavigationItems: PublicNavigationItem[] = [
  { label: "Plataforma", href: "#" },
  { label: "Precios", href: "#" },
  { label: "Restaurantes", href: "#" },
  { label: "Acceso", href: "#" },
];

//-aqui empieza componente PublicHeader y es para reutilizar el header público-//
/**
 * Header sticky con navegación, brand y CTA principal.
 */
export function PublicHeader({
  navigationItems = defaultNavigationItems,
  actionLabel = "Empezar ahora",
  actionHref = "#",
}: PublicHeaderProps) {
  return (
    <nav className="sticky top-0 z-50 w-full bg-black text-white transition-all duration-150">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-8">
        <div className="text-2xl font-bold tracking-tighter text-white">Reserva Latina</div>

        <div className="hidden items-center space-x-8 md:flex">
          {navigationItems.map((item) => (
            <a key={item.label} href={item.href} className="text-sm text-white transition-colors hover:text-white/80">
              <T>{item.label}</T>
            </a>
          ))}
          <a href={actionHref} className="rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-black transition-transform duration-150 hover:scale-95">
            <T>{actionLabel}</T>
          </a>
          <div className="pl-2">
            <LanguageToggle />
          </div>
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <LanguageToggle />
          <PublicIcon name="menu" className="text-white" />
        </div>
      </div>
    </nav>
  );
}
//-aqui termina componente PublicHeader-//
