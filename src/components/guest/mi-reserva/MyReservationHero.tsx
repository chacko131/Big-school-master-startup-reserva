/**
 * Archivo: MyReservationHero.tsx
 * Responsabilidad: Mostrar la sección principal con el estado y estadísticas de la reserva.
 * Tipo: UI
 */

import { T } from "@/components/T";
import { PublicIcon } from "@/components/public/PublicIcon";

interface Stat {
  label: string;
  value: string;
  description: string;
  tone: "ghost" | "mint" | "light";
}

interface MyReservationHeroProps {
  status: string;
  restaurantSubtitle: string;
  stats: ReadonlyArray<Stat>;
}

//-aqui empieza funcion MyReservationHero y es para mostrar el hero de mi reserva-//
/**
 * @pure
 */
export function MyReservationHero({ status, restaurantSubtitle, stats }: MyReservationHeroProps) {
  return (
    <section className="relative mb-8 overflow-hidden rounded-[28px] bg-primary p-5 text-on-primary shadow-[0px_20px_40px_rgba(26,28,28,0.16)] sm:mb-10 sm:p-8 lg:p-10">
      <div className="absolute right-0 top-0 hidden h-full w-1/3 bg-linear-to-l from-white/10 to-transparent md:block" />

      <div className="relative z-10 flex flex-col gap-5 sm:gap-6">
        <div className="max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-2 text-on-secondary shadow-sm sm:px-4">
            <PublicIcon name="checkCircle" className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-[0.22em]">
              <T>{status}</T>
            </span>
          </div>
          <h2 className="max-w-xl font-headline text-3xl font-extrabold leading-tight text-white! sm:text-4xl lg:text-5xl">
            <T>Gestiona tu reserva</T>
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-white/80 sm:text-lg">
            <T>{restaurantSubtitle}</T>
          </p>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:flex-wrap">
          {stats.map((stat) => {
            const cardClassName =
              stat.tone === "ghost"
                ? "bg-transparent text-on-primary md:pt-2"
                : stat.tone === "mint"
                  ? "bg-secondary-container text-on-secondary-container"
                  : "bg-surface-container-lowest text-on-surface";

            const valueClassName =
              stat.tone === "ghost"
                ? "text-3xl font-black tracking-tight text-white sm:text-4xl"
                : stat.tone === "mint"
                  ? "text-3xl font-black tracking-tight text-on-secondary-container sm:text-4xl"
                  : "text-3xl font-black tracking-tight text-on-surface sm:text-4xl";

            const descriptionClassName =
              stat.tone === "ghost"
                ? "text-sm leading-6 text-white/75"
                : stat.tone === "mint"
                  ? "text-sm leading-6 text-on-secondary-container/65"
                  : "text-sm leading-6 text-on-surface/70";

            const cardWidthClassName =
              stat.tone === "ghost"
                ? "w-full md:min-w-[min(14rem,100%)] md:flex-1"
                : stat.tone === "mint"
                  ? "w-full md:min-w-[min(12rem,100%)] md:flex-[1_1_12rem]"
                  : "w-full md:min-w-[min(12rem,100%)] md:flex-[1_1_12rem]";

            return (
              <article className={`rounded-[24px] ${cardWidthClassName} ${cardClassName}`} key={stat.label}>
                <div className={stat.tone === "ghost" ? "px-1 py-2" : "rounded-[24px] px-4 py-4"}>
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-current/70">
                    <T>{stat.label}</T>
                  </p>
                  <p className={`mt-2 ${valueClassName}`}>
                    <T>{stat.value}</T>
                  </p>
                  <p className={`mt-3 max-w-56 ${descriptionClassName}`}>
                    <T>{stat.description}</T>
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
//-aqui termina funcion MyReservationHero-//
