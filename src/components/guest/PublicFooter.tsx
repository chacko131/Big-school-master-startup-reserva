"use client";

/**
 * Archivo: PublicFooter.tsx
 * Responsabilidad: Renderizar el pie de página público compartido.
 * Tipo: UI
 */

import { T } from "@/components/T";

//-aqui empieza funcion PublicFooter y es para mostrar el pie de página público-//
/**
 * @pure
 */
export function PublicFooter() {
  return (
    <div className="mt-20 border-t border-zinc-100 bg-white py-12 dark:border-zinc-900 dark:bg-black">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 md:flex-row lg:px-8">
        <p className="text-sm text-zinc-500">
          <T>© 2024 Reserva Latina. Built for Hospitality.</T>
        </p>
        <div className="flex gap-6">
          <a className="text-sm text-zinc-500 transition-opacity hover:text-black dark:hover:text-white" href="#">
            <T>Privacy Policy</T>
          </a>
          <a className="text-sm text-zinc-500 transition-opacity hover:text-black dark:hover:text-white" href="#">
            <T>Terms of Service</T>
          </a>
          <a className="text-sm text-zinc-500 transition-opacity hover:text-black dark:hover:text-white" href="#">
            <T>Cookie Settings</T>
          </a>
        </div>
      </div>
    </div>
  );
}
//-aqui termina funcion PublicFooter-//
