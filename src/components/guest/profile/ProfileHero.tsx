/**
 * Archivo: ProfileHero.tsx
 * Responsabilidad: Renderizar la sección hero del perfil del restaurante.
 * Tipo: UI
 */

import { T } from "@/components/T";
import { PublicIcon } from "@/components/public/PublicIcon";

interface ProfileHeroProps {
  displayName: string;
  subtitle: string;
  heroImageUrl: string;
}

//-aqui empieza funcion ProfileHero y es para mostrar el hero del perfil-//
/**
 * @pure
 */
export function ProfileHero({ displayName, subtitle, heroImageUrl }: ProfileHeroProps) {
  return (
    <section className="relative h-[819px] w-full overflow-hidden">
      <img 
        className="h-full w-full object-cover" 
        src={heroImageUrl} 
        alt={displayName} 
      />
      <div className="absolute inset-0 flex items-end bg-black/30 px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="space-y-4 text-white">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-white p-2 shadow-xl">
                <PublicIcon name="restaurant" className="h-10 w-10 text-primary" />
              </div>
              <span className="rounded-full bg-secondary-container px-4 py-1 text-sm font-bold tracking-wider text-on-secondary-container">
                <T>PREMIUM</T>
              </span>
            </div>
            <h1 className="text-5xl font-extrabold leading-none tracking-tighter sm:text-6xl md:text-8xl">
              <T>{displayName}</T>
            </h1>
            <p className="max-w-xl text-lg font-light opacity-90 sm:text-xl md:text-2xl">
              <T>{subtitle}</T>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
//-aqui termina funcion ProfileHero-//
