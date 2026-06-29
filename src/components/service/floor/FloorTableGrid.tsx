/**
 * Archivo: FloorTableGrid.tsx
 * Responsabilidad: Grid interactivo de mesas para la vista de sala del mesero.
 *   Gestiona el filtro activo, la mesa seleccionada y el panel lateral de orden.
 * Tipo: UI (client)
 */

"use client";

import { useState, useMemo } from "react";
import { FloorFilterBar } from "./FloorFilterBar";
import { FloorTableCard } from "./FloorTableCard";
import { FloorOrderPanel } from "./FloorOrderPanel";
import { T } from "@/components/T";
import type { FloorFilter } from "./FloorFilterBar";
import type { TableWithOrder } from "@/app/(service)/service/floor/actions";
import type { MenuItemCostingWithMenuItemName } from "@/modules/service/domain/ports/menu-item-costing.repository.port";

interface FloorTableGridProps {
  tables: TableWithOrder[];
  menuItems: MenuItemCostingWithMenuItemName[];
}

//-aqui empieza componente FloorTableGrid y es para mostrar el grid de mesas con filtros y panel lateral-//
/**
 * Gestiona el estado local del filtro activo y la mesa seleccionada.
 * Pasa los datos al FloorOrderPanel cuando se selecciona una mesa.
 * @sideEffect abre panel lateral y revalida al confirmar acciones
 */
export function FloorTableGrid({ tables, menuItems }: FloorTableGridProps) {
  const [activeFilter, setActiveFilter] = useState<FloorFilter>("all");
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);

  //-aqui empieza funcion filterCounts y es para calcular el total de mesas por cada filtro-//
  const filterCounts = useMemo(() => ({
    all: tables.length,
    free: tables.filter((t) => t.order === null).length,
    open: tables.filter((t) => t.order !== null).length,
    ready: tables.filter((t) => t.readyCount > 0).length,
  }), [tables]);
  //-aqui termina funcion filterCounts-//

  //-aqui empieza funcion filteredTables y es para filtrar las mesas según el filtro activo-//
  const filteredTables = useMemo(() => {
    switch (activeFilter) {
      case "free":  return tables.filter((t) => t.order === null);
      case "open":  return tables.filter((t) => t.order !== null);
      case "ready": return tables.filter((t) => t.readyCount > 0);
      default:      return tables;
    }
  }, [tables, activeFilter]);
  //-aqui termina funcion filteredTables-//

  const selectedTable = tables.find((t) => t.tableId === selectedTableId) ?? null;

  if (tables.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-3 text-on-surface-variant">
        <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="8" width="18" height="12" rx="2" />
          <path d="M8 8V6a2 2 0 014 0v2" />
        </svg>
        <p className="text-sm font-semibold">
          <T>No hay mesas configuradas. Ve a Configuración para añadirlas.</T>
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Barra de filtros */}
      <FloorFilterBar
        active={activeFilter}
        onChange={setActiveFilter}
        counts={filterCounts}
      />

      {/* Grid de tarjetas */}
      {filteredTables.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center gap-2 text-on-surface-variant">
          <p className="text-sm font-semibold">
            <T>No hay mesas en este estado.</T>
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredTables.map((table) => (
            <FloorTableCard
              key={table.tableId}
              table={table}
              onClick={() => setSelectedTableId(table.tableId)}
            />
          ))}
        </div>
      )}

      {/* Panel lateral de gestión de orden */}
      <FloorOrderPanel
        table={selectedTable}
        menuItems={menuItems}
        onClose={() => setSelectedTableId(null)}
      />
    </>
  );
}
//-aqui termina componente FloorTableGrid-//
