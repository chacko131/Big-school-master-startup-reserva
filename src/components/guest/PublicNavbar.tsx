"use client";

/**
 * Archivo: PublicNavbar.tsx
 * Responsabilidad: Renderizar la barra de navegación pública superior del perfil del restaurante.
 * Tipo: UI
 */

import Link from "next/link";
import { T } from "@/components/T";
import { LanguageToggle } from "@/components/shared/LanguageToggle";

interface PublicNavbarProps {
  restaurantSlug: string;
  restaurantName?: string;
  buttonText?: string;
  buttonHref?: string;
}

//-aqui empieza funcion PublicNavbar y es para mostrar la navegación superior pública-//
/**
 * @pure
 */
export function PublicNavbar({ 
  restaurantSlug, 
  restaurantName,
  buttonText = "Get Started", 
  buttonHref 
}: PublicNavbarProps) {
  const finalButtonHref = buttonHref || `/${restaurantSlug}/reservar`;
  const displayTitle = restaurantName || "Reserva Latina";

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-black border-b border-slate-100 dark:border-zinc-800">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8">
        <Link 
          className="text-2xl font-bold tracking-tighter text-black dark:text-white font-headline" 
          href={`/${restaurantSlug}`}
        >
          {displayTitle}
        </Link>

        <nav className="hidden items-center space-x-6 md:flex">
          <Link className="text-zinc-500 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-white" href="/sign-in">
            <T>Login</T>
          </Link>
          <LanguageToggle />
        </nav>

        <div className="flex items-center gap-3 md:hidden">
          <Link className="text-zinc-500 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-white" href="/sign-in">
            <T>Login</T>
          </Link>
          <LanguageToggle />
        </div>

        <Link 
          className="hidden rounded-lg bg-primary px-6 py-2.5 font-semibold text-on-primary transition-transform duration-150 hover:scale-95 shadow-lg shadow-primary/20 sm:inline-flex" 
          href={finalButtonHref}
        >
          <T>{buttonText}</T>
        </Link>
      </div>
    </header>
  );
}
//-aqui termina funcion PublicNavbar-//
