/**
 * Archivo: ConfirmationHero.tsx
 * Responsabilidad: Mostrar el mensaje principal de éxito tras realizar una reserva.
 * Tipo: UI
 */

import { T } from "@/components/T";
import { PublicIcon } from "@/components/public/PublicIcon";

interface ConfirmationHeroProps {
  restaurantName: string;
}

//-aqui empieza funcion ConfirmationHero y es para mostrar el éxito de la reserva-//
/**
 * @pure
 */
export function ConfirmationHero({ restaurantName }: ConfirmationHeroProps) {
  return (
    <section className="mx-auto max-w-4xl px-6 pt-16 text-center">
      <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container">
        <PublicIcon name="checkCircleFilled" className="h-12 w-12" />
      </div>
      <h1 className="mb-4 text-5xl font-extrabold tracking-tight text-primary md:text-7xl">
        <T>¡Tu mesa está reservada!</T>
      </h1>
      <p className="mx-auto max-w-2xl text-xl font-medium text-on-surface-variant">
        <T>{`Hemos confirmado tu reserva en ${restaurantName}. Estamos preparando todo para recibirte.`}</T>
      </p>
    </section>
  );
}
//-aqui termina funcion ConfirmationHero-//
