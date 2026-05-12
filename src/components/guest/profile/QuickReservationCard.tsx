/**
 * Archivo: QuickReservationCard.tsx
 * Responsabilidad: Card del sidebar que invita al usuario a ir al flujo de reserva.
 * Tipo: UI
 */

import Link from "next/link";
import { T } from "@/components/T";

// ─── Props ────────────────────────────────────────────────────────────────────

interface QuickReservationCardProps {
  restaurantSlug: string;
}

//-aqui empieza componente QuickReservationCard y es para mostrar el CTA de reserva en el sidebar-//
/**
 * @pure
 */
export function QuickReservationCard({ restaurantSlug }: QuickReservationCardProps) {
  return (
    <div className="rounded-3xl border border-outline-variant/10 bg-white p-6 shadow-[0px_20px_40px_rgba(26,28,28,0.06)] sm:p-8">
      <h3 className="mb-6 text-2xl font-bold">
        <T>Reservar Mesa</T>
      </h3>

      <Link
        href={`/${restaurantSlug}/reservar`}
        className="block w-full rounded-2xl bg-primary py-5 text-center text-lg font-bold text-on-primary shadow-lg shadow-black/10 transition-all hover:opacity-90 active:scale-[0.98]"
      >
        <T>Ver disponibilidad</T>
      </Link>
    </div>
  );
}
//-aqui termina componente QuickReservationCard-//
