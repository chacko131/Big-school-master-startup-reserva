/**
 * Archivo: ServiceTableGrid.tsx
 * Responsabilidad: Grid de tarjetas de mesas con apertura de modal por mesa.
 *   Delega la lógica del modal a TableModal y la carta a MenuBook.
 * Tipo: UI
 */

"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { T } from "@/components/T";
import { StatusBadge } from "./StatusBadge";
import { TableModal } from "./TableModal";
import type { TableWithOrder, MenuItemCostingWithMenuItemName } from "./service-table.types";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ServiceTableGridProps {
  tables: TableWithOrder[];
  menuItems: MenuItemCostingWithMenuItemName[];
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

//-aqui empieza componente ServiceTableGrid y es para mostrar el grid de mesas con modal de gestión-//
export function ServiceTableGrid({ tables, menuItems }: ServiceTableGridProps) {
  const [activeTableId, setActiveTableId] = useState<string | null>(null);
  // Inicializa vacío en SSR para evitar hydration mismatch; se hidrata desde localStorage en el cliente
  const [seenReadyCount, setSeenReadyCount] = useState<Record<string, number>>({});

  useEffect(() => {
    try {
      const stored = localStorage.getItem("kds_seen_ready");
      if (stored) setSeenReadyCount(JSON.parse(stored));
    } catch { /* ignorar errores de parse */ }
  }, []);

  useEffect(() => {
    localStorage.setItem("kds_seen_ready", JSON.stringify(seenReadyCount));
  }, [seenReadyCount]);

  function openTable(tableId: string) {
    const t = tables.find((t) => t.tableId === tableId);
    setActiveTableId(tableId);
    setSeenReadyCount((prev) => ({ ...prev, [tableId]: t?.readyCount ?? 0 }));
  }

  if (tables.length === 0) {
    return (
      <p className="text-sm italic text-muted-foreground">
        <T>No hay mesas configuradas. Ve a Configuración para añadirlas.</T>
      </p>
    );
  }

  const activeTable = tables.find((t) => t.tableId === activeTableId) ?? null;

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tables.map((table) => {
          const status = table.order?.status ?? null;
          // Dot visible si hay más ítems READY que los que vio el camarero al abrir
          const showDot = table.readyCount > 0 && table.readyCount > (seenReadyCount[table.tableId] ?? 0);

          return (
            <motion.div
              key={table.tableId}
              layout
              className="relative flex cursor-pointer flex-col gap-3 rounded-2xl border border-border bg-background p-4 shadow-sm transition-shadow hover:shadow-md"
              onClick={() => openTable(table.tableId)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Dot de alerta: platos listos para recoger */}
              {showDot && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 text-[8px] font-black text-white">
                    {table.readyCount}
                  </span>
                </span>
              )}

              <div className="flex items-start justify-between">
                <div>
                  <p className="font-bold">{table.tableName}</p>
                  <p className="text-xs text-muted-foreground">{table.capacity} <T>personas</T></p>
                </div>
                <StatusBadge status={status} />
              </div>

              {/* Barra de estado */}
              <div
                className={`h-1.5 w-full rounded-full ${
                  showDot ? "bg-emerald-400" :
                  status === null ? "bg-emerald-200" :
                  status === "OPEN" ? "bg-amber-300" :
                  "bg-primary/40"
                }`}
              />

              <button className={`w-full rounded-xl border py-2 text-xs font-semibold transition-colors ${
                showDot
                  ? "border-emerald-400 bg-emerald-50 font-bold text-emerald-700 hover:bg-emerald-100"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
              }`}>
                {showDot ? <><T>Recoger</T> ({table.readyCount})</> : <T>Gestionar</T>}
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Modal con AnimatePresence para animar entrada/salida */}
      <AnimatePresence>
        {activeTable && (
          <TableModal
            table={activeTable}
            menuItems={menuItems}
            onClose={() => setActiveTableId(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
//-aqui termina componente ServiceTableGrid-//
