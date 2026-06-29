/**
 * Archivo: FloorStatusBadge.tsx
 * Responsabilidad: Badge de color que refleja el estado de una mesa en la vista de sala.
 * Tipo: UI
 */

import { T } from "@/components/T";

interface FloorStatusBadgeProps {
  status: string | null;
  readyCount?: number;
}

//-aqui empieza componente FloorStatusBadge y es para mostrar el estado de la mesa con color-//
/**
 * Muestra el estado de la mesa: Libre, Orden abierta, En cocina o Platos listos.
 * Si la mesa tiene platos listos (readyCount > 0) pero la orden está SUBMITTED,
 * prioriza el badge de "Platos listos" para que el mesero lo vea inmediatamente.
 * @pure
 */
export function FloorStatusBadge({ status, readyCount = 0 }: FloorStatusBadgeProps) {
  if (!status)
    return (
      <span className="inline-flex items-center rounded-full bg-secondary-container text-on-secondary-container px-2 py-1 text-xs font-bold uppercase tracking-wider">
        <T>Libre</T>
      </span>
    );

  if (status === "OPEN")
    return (
      <span className="inline-flex items-center rounded-full bg-tertiary-container text-on-tertiary-container px-2 py-1 text-xs font-bold uppercase tracking-wider">
        <T>Open</T>
      </span>
    );

  if (status === "SUBMITTED" && readyCount > 0)
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-secondary-container text-on-secondary-container px-2 py-1 text-xs font-bold uppercase tracking-wider">
        <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
        <T>Listos</T>
      </span>
    );

  if (status === "SUBMITTED")
    return (
      <span className="inline-flex items-center rounded-full bg-surface-container-highest text-on-surface px-2 py-1 text-xs font-bold uppercase tracking-wider">
        <T>En cocina</T>
      </span>
    );

  return null;
}
//-aqui termina componente FloorStatusBadge-//
