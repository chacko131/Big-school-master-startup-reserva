"use client";

/**
 * Archivo: FloorPlanToolRail.tsx
 * Responsabilidad: Orquestar la paleta lateral del editor (Mesas y Decoración) con efecto de pestañas deslizantes.
 * Tipo: UI
 */

import { useState } from "react";
import { T } from "@/components/T";
import { type FloorPlanTable } from "./floorPlanMocks";
import { FloorPlanTablesRail } from "./FloorPlanTablesRail";
import { FloorPlanDecorationsRail } from "./FloorPlanDecorationsRail";

interface FloorPlanToolRailProps {
  unplacedTables: FloorPlanTable[];
  onAddTable: () => void;
  onAddElement: (type: "WALL" | "WALL_V" | "PLANT") => void;
}

type TabKey = "tables" | "decorations";

//-aqui empieza componente FloorPlanToolRail y es para orquestar los paneles laterales-//
/**
 * Renderiza el rail lateral con pestañas para alternar entre mesas y decoración.
 * Implementa un efecto de deslizamiento suave entre paneles.
 *
 * @pure
 */
export function FloorPlanToolRail({
  unplacedTables,
  onAddTable,
  onAddElement,
}: FloorPlanToolRailProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("tables");

  return (
    <aside
      data-drop-zone="sidebar"
      className="flex w-full flex-col rounded-[32px] bg-white p-4 shadow-xl ring-1 ring-black/5 xl:h-[760px] transition-all duration-300 overflow-hidden"
    >
      {/* Pestañas (Tabs) Superiores */}
      <div className="flex w-full items-center p-1 bg-slate-100 rounded-2xl mb-4 shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab("tables")}
          className={`flex-1 relative z-10 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300 ${
            activeTab === "tables"
              ? "bg-white text-slate-900 shadow-sm ring-1 ring-black/5"
              : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
          }`}
        >
          <T>Mesas</T>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("decorations")}
          className={`flex-1 relative z-10 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300 ${
            activeTab === "decorations"
              ? "bg-white text-slate-900 shadow-sm ring-1 ring-black/5"
              : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
          }`}
        >
          <T>Decoración</T>
        </button>
      </div>

      {/* Contenedor Deslizante (Slide Effect) */}
      <div className="relative flex-1 w-full overflow-hidden rounded-b-[16px]">
        <div
          className="absolute inset-y-0 left-0 flex w-[200%] transition-transform duration-500 ease-in-out"
          style={{
            transform: activeTab === "tables" ? "translateX(0)" : "translateX(-50%)",
          }}
        >
          {/* Panel Izquierdo: Mesas (50% del ancho del contenedor doble) */}
          <div className="w-1/2 h-full flex flex-col">
            <FloorPlanTablesRail
              unplacedTables={unplacedTables}
              onAddTable={onAddTable}
            />
          </div>

          {/* Panel Derecho: Decoración (50% del ancho del contenedor doble) */}
          <div className="w-1/2 h-full flex flex-col">
            <FloorPlanDecorationsRail onAddElement={onAddElement} />
          </div>
        </div>
      </div>
    </aside>
  );
}
//-aqui termina componente FloorPlanToolRail-//
