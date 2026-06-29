/**
 * Archivo: OverviewFloorPlan.tsx
 * Responsabilidad: Plano de sala en modo supervisión para el manager/dueño.
 *   Read-only — muestra el estado de todas las mesas sin acciones.
 * Tipo: UI
 */

import { T } from "@/components/T";
import { OverviewTableCard } from "./OverviewTableCard";
import type { TableWithOrder } from "@/app/(service)/service/floor/actions";

interface OverviewFloorPlanProps {
  tables: TableWithOrder[];
}

//-aqui empieza componente OverviewFloorPlan y es para mostrar el plano de sala al manager-//
/**
 * Grid de tarjetas de mesa en modo read-only.
 * El manager ve el estado global sin poder interactuar con las órdenes.
 * @pure
 */
export function OverviewFloorPlan({ tables }: OverviewFloorPlanProps) {
  if (tables.length === 0) {
    return (
      <p className="text-sm text-on-surface-variant py-8 text-center">
        <T>No hay mesas configuradas.</T>
      </p>
    );
  }

  return (
    <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {tables.map((table) => (
        <OverviewTableCard key={table.tableId} table={table} />
      ))}
    </div>
  );
}
//-aqui termina componente OverviewFloorPlan-//
