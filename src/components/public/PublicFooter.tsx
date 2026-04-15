/**
 * Archivo: PublicFooter.tsx
 * Responsabilidad: Renderizar el footer público reutilizable de Reserva Latina.
 * Tipo: UI
 */

import { PublicIcon } from "@/components/public/PublicIcon";
import { T } from "@/components/T";

//-aqui empieza componente PublicFooter y es para reutilizar el footer público-//
/**
 * Footer editorial para cerrar la experiencia pública con marca y enlaces básicos.
 */
export function PublicFooter() {
  return (
    <footer className="w-full border-t border-white/10 bg-black py-12 text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between px-8 md:flex-row">
        <div className="mb-6 md:mb-0">
          <span className="text-xl font-bold tracking-tighter text-white">Reserva Latina</span>
          <p className="mt-2 text-sm text-white/90"><T>© 2024 Reserva Latina. Built for Hospitality.</T></p>
        </div>

        <div className="flex gap-8">
          <a href="#" className="text-sm text-white transition-opacity hover:text-white/80">
            <T>Política de privacidad</T>
          </a>
          <a href="#" className="text-sm text-white transition-opacity hover:text-white/80">
            <T>Términos del servicio</T>
          </a>
          <a href="#" className="text-sm text-white transition-opacity hover:text-white/80">
            <T>Configuración de cookies</T>
          </a>
        </div>

        <div className="mt-8 flex items-center gap-4 md:mt-0">
        
          <PublicIcon name="share" className="cursor-pointer text-white transition-opacity hover:opacity-80" />
        </div>
      </div>
    </footer>
  );
}
//-aqui termina componente PublicFooter-//
