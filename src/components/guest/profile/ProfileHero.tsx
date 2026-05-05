/**
 * Archivo: ProfileHero.tsx
 * Responsabilidad: Renderizar la sección hero del perfil del restaurante.
 * Tipo: UI
 */

import { T } from "@/components/T";
import { PublicIcon } from "@/components/public/PublicIcon";
import Image from "next/image";

const FALLBACK_HERO =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80&auto=format&fit=crop";

interface ProfileHeroProps {
  displayName: string;
  subtitle: string;
  heroImageUrl: string | null;
}

//-aqui empieza funcion ProfileHero y es para mostrar el hero del perfil-//
/**
 * @pure
 */
export function ProfileHero({ displayName, subtitle, heroImageUrl }: ProfileHeroProps) {
  const imageSrc = heroImageUrl || FALLBACK_HERO;

  return (
    <section className="relative h-[600px] w-full overflow-hidden sm:h-[700px] md:h-[819px]">
      {/* ─── Imagen de fondo ─────────────────────────────────────── */}
      <Image
        className="h-full w-full object-cover"
        src={imageSrc}
        alt={displayName}
        width={1920}
        height={1080}
        priority
      />

      {/* ─── Overlay con gradiente para proteger texto ───────────── */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/10" />

      {/* ─── Contenido con panel semitransparente + blur ──────────── */}
      <div className="absolute inset-0 flex items-end px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <div className="inline-block max-w-2xl rounded-3xl bg-black/50 p-6 backdrop-blur-md sm:p-8 md:p-10">
            <div className="space-y-4 text-white">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white/90 p-2 shadow-xl sm:h-20 sm:w-20">
                  <PublicIcon name="restaurant" className="h-8 w-8 text-primary sm:h-10 sm:w-10" />
                </div>
                <span className="rounded-full bg-secondary-container/90 px-4 py-1 text-sm font-bold tracking-wider text-on-secondary-container backdrop-blur-sm">
                  <T>PREMIUM</T>
                </span>
              </div>
              <h1 className="text-4xl font-extrabold leading-none tracking-tighter text-white! sm:text-5xl md:text-7xl">
                {displayName}
              </h1>
              <p className="text-base font-light text-white/90 sm:text-lg md:text-xl">
                <T>{subtitle}</T>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
//-aqui termina funcion ProfileHero-//
