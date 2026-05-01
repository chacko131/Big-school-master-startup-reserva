"use client";

/**
 * Archivo: FloorPlanDecorationsRail.tsx
 * Responsabilidad: Mostrar el listado de elementos decorativos disponibles y la acción de añadirlos.
 * Tipo: UI
 */

import { T } from "@/components/T";

interface FloorPlanDecorationsRailProps {
  onAddElement: (type: "WALL" | "WALL_V" | "PLANT") => void;
}

//-aqui empieza componente FloorPlanDecorationsRail y es para el panel de decoración-//
/**
 * Renderiza la sección de elementos decorativos del rail lateral.
 *
 * @pure
 */
export function FloorPlanDecorationsRail({
  onAddElement,
}: FloorPlanDecorationsRailProps) {
  return (
    <div className="flex h-full w-full shrink-0 flex-col gap-3 xl:gap-6 px-2 pt-2">
      {/* Cabecera */}
      <div className="flex w-full items-center justify-center xl:flex-col xl:gap-4 shrink-0 pb-4 border-b border-black/5">
        <div className="flex flex-col xl:items-center text-center">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary/60">
            <T>Elementos</T>
          </span>
          <h3 className="text-sm font-black text-slate-900 xl:text-center">
            <T>Decoración del plano</T>
          </h3>
        </div>
      </div>

      {/* Contenedor de elementos */}
      <div className="flex-1 w-full overflow-y-auto no-scrollbar pb-4" style={{ scrollbarWidth: "none" }}>
        <div className="grid grid-cols-2 gap-3 xl:flex xl:flex-col xl:gap-4">

          {/* Muro Horizontal */}
          <div
            className="group relative flex flex-col items-center gap-3 rounded-2xl bg-white p-4 text-center ring-1 ring-black/5 transition-all hover:shadow-lg hover:ring-secondary/20 xl:w-full cursor-grab active:cursor-grabbing"
            onClick={() => onAddElement("WALL")}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("elementType", "WALL");
              e.dataTransfer.effectAllowed = "move";
            }}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl shadow-inner ring-1 ring-black/5 bg-slate-100 transition-transform group-hover:scale-105">
              <div className="h-2 w-10 rounded-sm bg-slate-700"></div>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-black text-slate-950">
                <T>Muro H</T>
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                <T>Horizontal</T>
              </span>
            </div>
          </div>

          {/* Muro Vertical */}
          <div
            className="group relative flex flex-col items-center gap-3 rounded-2xl bg-white p-4 text-center ring-1 ring-black/5 transition-all hover:shadow-lg hover:ring-secondary/20 xl:w-full cursor-grab active:cursor-grabbing"
            onClick={() => onAddElement("WALL_V")}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("elementType", "WALL_V");
              e.dataTransfer.effectAllowed = "move";
            }}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl shadow-inner ring-1 ring-black/5 bg-slate-100 transition-transform group-hover:scale-105">
              <div className="h-10 w-2 rounded-sm bg-slate-700"></div>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-black text-slate-950">
                <T>Muro V</T>
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                <T>Vertical</T>
              </span>
            </div>
          </div>

          {/* Planta */}
          <div
            className="group relative flex flex-col items-center gap-3 rounded-2xl bg-white p-4 text-center ring-1 ring-black/5 transition-all hover:shadow-lg hover:ring-secondary/20 xl:w-full cursor-grab active:cursor-grabbing"
            onClick={() => onAddElement("PLANT")}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("elementType", "PLANT");
              e.dataTransfer.effectAllowed = "move";
            }}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl shadow-inner ring-1 ring-black/5 bg-emerald-50 transition-transform group-hover:scale-105">
              <div className="h-8 w-8 rounded-full bg-emerald-500 shadow-sm border-2 border-emerald-600"></div>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-black text-slate-950">
                <T>Planta</T>
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                <T>Decoración</T>
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
//-aqui termina componente FloorPlanDecorationsRail-//
