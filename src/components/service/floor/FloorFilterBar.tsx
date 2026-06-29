/**
 * Archivo: FloorFilterBar.tsx
 * Responsabilidad: Tabs de filtro para la vista de sala del mesero.
 * Tipo: UI (client)
 */

"use client";

import { T } from "@/components/T";

export type FloorFilter = "all" | "free" | "open" | "ready";

interface FloorFilterBarProps {
  active: FloorFilter;
  onChange: (filter: FloorFilter) => void;
  counts: Record<FloorFilter, number>;
}

const FILTERS: { key: FloorFilter; label: string }[] = [
  { key: "all", label: "Todas" },
  { key: "free", label: "Libres" },
  { key: "open", label: "Con orden" },
  { key: "ready", label: "Platos listos" },
];

//-aqui empieza componente FloorFilterBar y es para filtrar las mesas en la vista de sala-//
/**
 * Renderiza tabs para filtrar la grilla de mesas.
 * Muestra un contador dinámico en cada tab.
 * @pure
 */
export function FloorFilterBar({ active, onChange, counts }: FloorFilterBarProps) {
  return (
    <div className="flex gap-2 pb-4 overflow-x-auto no-scrollbar shrink-0 border-b border-surface-container" style={{ scrollbarWidth: "none" }}>
      {FILTERS.map(({ key, label }) => {
        const isReady = key === "ready";
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              active === key
                ? "bg-primary text-on-primary"
                : "bg-surface-container-highest text-on-surface hover:bg-surface-variant"
            }`}
          >
            <T>{label}</T>
            <span className="tabular-nums">({counts[key]})</span>
            {isReady && counts[key] > 0 && (
              <span className="w-2 h-2 rounded-full bg-secondary" />
            )}
          </button>
        );
      })}
    </div>
  );
}
//-aqui termina componente FloorFilterBar-//
