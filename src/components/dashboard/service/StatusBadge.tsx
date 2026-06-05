/**
 * Archivo: StatusBadge.tsx
 * Responsabilidad: Badge de color que refleja el estado de la orden de una mesa.
 * Tipo: UI
 */

import { T } from "@/components/T";

//-aqui empieza funcion StatusBadge y es para mostrar el estado de la orden con color-//
export function StatusBadge({ status }: { status: string | null }) {
  if (!status)
    return (
      <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
        <T>Libre</T>
      </span>
    );
  if (status === "OPEN")
    return (
      <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
        <T>Orden abierta</T>
      </span>
    );
  if (status === "SUBMITTED")
    return (
      <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
        <T>En cocina</T>
      </span>
    );
  return null;
}
//-aqui termina funcion StatusBadge-//
