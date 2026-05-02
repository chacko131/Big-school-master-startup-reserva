/**
 * Archivo: MyReservationHeader.tsx
 * Responsabilidad: Renderizar el encabezado de la página de gestión de reserva.
 * Tipo: UI
 */

import { T } from "@/components/T";
import { PublicIcon } from "@/components/public/PublicIcon";

interface MyReservationHeaderProps {
  restaurantName: string;
  reservationReference: string;
}

//-aqui empieza funcion MyReservationHeader y es para mostrar el encabezado de mi reserva-//
/**
 * @pure
 */
export function MyReservationHeader({ restaurantName, reservationReference }: MyReservationHeaderProps) {
  return (
    <header className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-start sm:justify-between">
      <button className="flex items-center gap-2 text-sm font-medium text-on-surface-variant transition-colors hover:text-primary" type="button">
        <PublicIcon name="arrowBack" className="h-5 w-5" />
        <T>Volver</T>
      </button>

      <div className="text-left sm:text-right">
        <h1 className="font-headline text-2xl font-extrabold tracking-tighter uppercase text-on-surface sm:text-3xl">
          <T>{restaurantName}</T>
        </h1>
        <p className="text-sm font-medium text-on-surface-variant">
          <T>Ref: </T>
          <span>{reservationReference}</span>
        </p>
      </div>
    </header>
  );
}
//-aqui termina funcion MyReservationHeader-//
