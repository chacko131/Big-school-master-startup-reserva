"use client";

/**
 * Archivo: PublicNavbar.tsx
 * Responsabilidad: Renderizar la barra de navegación pública superior.
 * Tipo: UI
 */

import Link from "next/link";
import { T } from "@/components/T";

interface PublicNavbarProps {
  restaurantSlug: string;
  buttonText?: string;
  buttonHref?: string;
}

//-aqui empieza funcion PublicNavbar y es para mostrar la navegación superior pública-//
/**
 * @pure
 */
export function PublicNavbar({ 
  restaurantSlug, 
  buttonText = "Get Started", 
  buttonHref 
}: PublicNavbarProps) {
  const finalButtonHref = buttonHref || `/${restaurantSlug}/reservar`;

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-black border-b border-slate-100 dark:border-zinc-800">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8">
        <Link 
          className="text-2xl font-bold tracking-tighter text-black dark:text-white font-headline" 
          href={`/${restaurantSlug}`}
        >
          <T>Reserva Latina</T>
        </Link>
        <nav className="hidden items-center space-x-8 md:flex">
          <a className="text-zinc-500 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-white" href="#">
            <T>Platform</T>
          </a>
          <a className="text-zinc-500 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-white" href="#">
            <T>Pricing</T>
          </a>
          <a className="border-b-2 border-black pb-1 font-semibold text-black dark:border-white dark:text-white" href="#">
            <T>Restaurants</T>
          </a>
          <a className="text-zinc-500 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-white" href="#">
            <T>Login</T>
          </a>
        </nav>
        <Link 
          className="rounded-lg bg-primary px-6 py-2.5 font-semibold text-on-primary transition-transform duration-150 hover:scale-95 shadow-lg shadow-primary/20" 
          href={finalButtonHref}
        >
          <T>{buttonText}</T>
        </Link>
      </div>
    </header>
  );
}
//-aqui termina funcion PublicNavbar-//
