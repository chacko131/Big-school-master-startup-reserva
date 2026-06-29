/**
 * Archivo: FloorTableCard.tsx
 * Responsabilidad: Tarjeta individual de una mesa en la vista de sala del mesero.
 * Tipo: UI
 */

import { T } from "@/components/T";
import { FloorStatusBadge } from "./FloorStatusBadge";
import type { TableWithOrder } from "@/app/(service)/service/floor/actions";

interface FloorTableCardProps {
  table: TableWithOrder;
  onClick: () => void;
}

//-aqui empieza componente FloorTableCard y es para mostrar una mesa en el grid de sala-//
/**
 * Muestra el nombre, capacidad, estado y alerta de platos listos de una mesa.
 * El borde y el botón cambian según el estado y si hay platos listos para recoger.
 * @pure
 */
export function FloorTableCard({ table, onClick }: FloorTableCardProps) {
  const status = table.order?.status ?? null;
  const hasReady = table.readyCount > 0;
  const isOccupied = status !== null;
  const openedAt = table.order?.openedAt;

  const leftBorder = !status
    ? "border-l-4 border-l-secondary"
    : status === "OPEN"
    ? "border-l-4 border-l-on-tertiary-container"
    : "border-l-4 border-l-primary";

  const elapsed = openedAt ? formatElapsed(openedAt) : null;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex flex-col justify-between min-h-[160px] bg-surface-container-lowest rounded-xl p-4 text-left transition-colors hover:bg-surface-container-high ${
        hasReady ? "ring-2 ring-tertiary-container ring-offset-2 ring-offset-surface" : ""
      } ${leftBorder}`}
    >
      {/* Pulse alert de platos listos */}
      {hasReady && (
        <div className="absolute -top-2 -right-2 flex items-center justify-center">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
          <span className="relative inline-flex rounded-full h-4 w-4 bg-secondary" />
        </div>
      )}

      <div className="flex justify-between items-start mb-2">
        <h3 className="font-heading text-2xl font-bold tracking-tight text-on-surface">{table.tableName}</h3>
        <FloorStatusBadge status={status} readyCount={table.readyCount} />
      </div>

      <div className="flex justify-between items-center text-on-surface-variant text-sm mb-4">
        <div className="flex items-center gap-1">
          <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
          <span>
            {table.capacity} <T>pax</T>
          </span>
        </div>
        {elapsed && <span className="font-medium text-primary">{elapsed}</span>}
      </div>

      {/* Banner de platos listos */}
      {hasReady && (
        <div className="mb-3 bg-secondary-container/30 rounded-md p-2 flex items-center justify-between">
          <span className="text-xs font-bold text-on-surface">
            {table.readyCount} <T>PLATOS LISTOS</T>
          </span>
        </div>
      )}

      {/* CTA */}
      <span
        className={`inline-flex w-full items-center justify-center rounded-md py-2 text-sm font-medium transition-colors mt-auto ${
          hasReady
            ? "bg-primary text-on-primary hover:bg-primary/90"
            : "bg-transparent border border-outline-variant/30 text-primary hover:bg-surface-variant"
        }`}
      >
        {hasReady ? (
          <>
            <T>Recoger</T> ({table.readyCount})
          </>
        ) : isOccupied ? (
          <T>Gestionar</T>
        ) : (
          <T>Abrir orden</T>
        )}
      </span>
    </button>
  );
}

//-aqui empieza funcion formatElapsed y es para mostrar minutos u horas transcurridas desde openedAt-//
/** @pure */
function formatElapsed(openedAt: Date): string {
  const minutes = Math.floor((Date.now() - openedAt.getTime()) / 60_000);
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}
//-aqui termina funcion formatElapsed-//
//-aqui termina componente FloorTableCard-//
