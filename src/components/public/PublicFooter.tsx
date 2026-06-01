/**
 * Archivo: PublicFooter.tsx
 * Responsabilidad: Renderizar el footer público reutilizable de Reserva Latina.
 * Tipo: UI
 */

import { T } from "@/components/T";
import Link from "next/link";

//-aqui empieza componente PublicFooter y es para reutilizar el footer público-//
/**
 * Footer editorial para cerrar la experiencia pública con marca y enlaces básicos.
 */
export function PublicFooter() {
  return (
    <footer className="w-full border-t border-white/10 bg-black py-12 text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-8 md:flex-row">
        <div>
          <span className="text-xl font-bold tracking-tighter text-white">Full Haus</span>
          <p className="mt-2 text-sm text-white/60">© 2026 Full Haus. Built for Hospitality.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 md:justify-end">
          <a href="mailto:info@fullhaus.es" className="text-sm text-white/60 transition-opacity hover:text-white">
            info@fullhaus.es
          </a>
          <Link href="/contact" className="text-sm text-white/60 transition-opacity hover:text-white">
            <T>Contacto</T>
          </Link>
          <Link href="/privacy" className="text-sm text-white/60 transition-opacity hover:text-white">
            <T>Privacidad</T>
          </Link>
          <Link href="/terms" className="text-sm text-white/60 transition-opacity hover:text-white">
            <T>Términos</T>
          </Link>
          <Link href="/cookies" className="text-sm text-white/60 transition-opacity hover:text-white">
            <T>Cookies</T>
          </Link>
        </div>
      </div>
    </footer>
  );
}
//-aqui termina componente PublicFooter-//
