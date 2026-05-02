/**
 * Archivo: AssignedTableCard.tsx
 * Responsabilidad: Mostrar la mesa y zona asignada a la reserva.
 * Tipo: UI
 */

import { T } from "@/components/T";

interface AssignedTableCardProps {
  tableNumber: string;
  zoneName: string;
}

//-aqui empieza funcion AssignedTableCard y es para mostrar la mesa asignada-//
/**
 * @pure
 */
export function AssignedTableCard({ tableNumber, zoneName }: AssignedTableCardProps) {
  return (
    <section className="flex min-h-[180px] flex-col items-center justify-center rounded-[28px] bg-primary p-6 text-center text-on-primary shadow-[0px_20px_40px_rgba(26,28,28,0.16)]">
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-on-primary/70">
        <T>Mesa Asignada</T>
      </p>
      <span className="font-headline text-5xl font-black leading-none">
        <T>{tableNumber}</T>
      </span>
      <p className="mt-2 text-xs text-on-primary/70">
        <T>{zoneName}</T>
      </p>
    </section>
  );
}
//-aqui termina funcion AssignedTableCard-//
