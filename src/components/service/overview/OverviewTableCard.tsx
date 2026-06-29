/**
 * Archivo: OverviewTableCard.tsx
 * Responsabilidad: Tarjeta de mesa en la vista de supervisión del manager.
 *   Read-only: solo muestra estado, sin panel de gestión.
 * Tipo: UI
 */

import { T } from "@/components/T";
import { FloorStatusBadge } from "@/components/service/floor/FloorStatusBadge";
import type { TableWithOrder } from "@/app/(service)/service/floor/actions";

interface OverviewTableCardProps {
  table: TableWithOrder;
}

//-aqui empieza componente OverviewTableCard y es para mostrar una mesa en modo supervisión-//
/**
 * Versión simplificada de FloorTableCard sin botones de acción.
 * Muestra nombre, capacidad, estado y badge de platos listos.
 * @pure
 */
export function OverviewTableCard({ table }: OverviewTableCardProps) {
  const status = table.order?.status ?? null;
  const hasReady = table.readyCount > 0;
  const isOccupied = status !== null;

  return (
    <div
      className={`relative rounded-xl border p-4 flex flex-col gap-2 ${
        hasReady
          ? "border-tertiary-container bg-tertiary-container/10"
          : isOccupied
          ? "border-primary/20 bg-surface-container-lowest"
          : "border-outline-variant/10 bg-surface-container-lowest/60"
      }`}
    >
      {hasReady && (
        <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-tertiary-container text-on-tertiary-container text-[10px] font-black">
          {table.readyCount}
        </span>
      )}

      <div className="flex items-start justify-between gap-2">
        <h3 className="font-heading text-base font-black text-on-surface">{table.tableName}</h3>
        <FloorStatusBadge status={status} />
      </div>

      <p className="text-xs text-on-surface-variant">
        {table.capacity} <T>pax</T>
      </p>

      {/* Indicador visual */}
      <div
        className={`mt-1 h-1 w-full rounded-full ${
          hasReady
            ? "bg-tertiary-container"
            : isOccupied
            ? "bg-primary/30"
            : "bg-secondary/30"
        }`}
      />
    </div>
  );
}
//-aqui termina componente OverviewTableCard-//
