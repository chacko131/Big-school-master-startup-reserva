"use client";

/**
 * Archivo: ReservationHero.tsx
 * Responsabilidad: Mostrar el encabezado de la página de reserva con el nombre y descripción del restaurante.
 * Tipo: UI
 */

import { T } from "@/components/T";

interface ReservationHeroProps {
  restaurantName: string;
}

//-aqui empieza funcion ReservationHero y es para mostrar el encabezado de la reserva-//
/**
 * @pure
 */
export function ReservationHero({ restaurantName }: ReservationHeroProps) {
  return (
    <section>
      <h1 className="mb-4 font-headline text-5xl font-extrabold tracking-tight sm:text-6xl text-slate-900">
        {restaurantName}
      </h1>
      <p className="max-w-md text-lg leading-8 text-on-surface/70">
        <T>Reserve su mesa en el corazón de la tradición. Una experiencia gastronómica auténtica le espera.</T>
      </p>
    </section>
  );
}
//-aqui termina funcion ReservationHero-//
