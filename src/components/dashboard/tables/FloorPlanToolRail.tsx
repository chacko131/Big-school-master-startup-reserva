"use client";

/**
 * Archivo: FloorPlanToolRail.tsx
 * Responsabilidad: Renderizar la paleta lateral de herramientas del editor de mesas.
 * Tipo: UI
 */

import { useState, useRef } from "react";
import { T } from "@/components/T";
import { type FloorPlanTable } from "./floorPlanMocks";
import { getFloorPlanToolKindClassName } from "./floorPlanStyles";

interface FloorPlanToolRailProps {
  unplacedTables: FloorPlanTable[];
  onAddTable: () => void;
}

//-aqui empieza componente FloorPlanToolRail y es para mostrar la paleta de herramientas-//
/**
 * Renderiza el rail lateral con herramientas del editor.
 *
 * @pure
 */
export function FloorPlanToolRail({
  unplacedTables,
  onAddTable,
}: FloorPlanToolRailProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activePage, setActivePage] = useState(0);
  const itemsPerPage = 5;
  const totalTables = unplacedTables?.length || 0;
  const totalPages = Math.max(1, Math.ceil(totalTables / itemsPerPage));

  //-aqui empieza funcion handleScroll y es para detectar en qué "página" estamos según el scroll-//
  /**
   * Actualiza el estado de la página activa basándose en la posición del scroll.
   *
   * @sideEffect
   */
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, clientHeight } = scrollContainerRef.current;
    const page = Math.round(scrollTop / clientHeight);
    if (page !== activePage) {
      setActivePage(page);
    }
  };
  //-aqui termina funcion handleScroll-//

  //-aqui empieza funcion scrollToPage y es para navegar suavemente entre secciones-//
  /**
   * Desplaza el contenedor a la página especificada.
   *
   * @sideEffect
   */
  const scrollToPage = (pageIndex: number) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    container.scrollTo({
      top: pageIndex * container.clientHeight,
      behavior: "smooth",
    });
    setActivePage(pageIndex);
  };
  //-aqui termina funcion scrollToPage-//

  return (
    <aside
      data-drop-zone="sidebar"
      className="flex w-full flex-col gap-3 rounded-[32px] bg-white p-4 shadow-xl ring-1 ring-black/5 xl:gap-6 xl:p-8 xl:h-[760px] transition-all duration-300"
    >
      {/* Cabecera con Paginación Fluida */}
      <div className="flex w-full items-center justify-between xl:flex-col xl:gap-4 shrink-0">
        <div className="flex flex-col xl:items-center">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary/60">
            <T>Mesas disponibles</T>
          </span>
          <h3 className="text-sm font-black text-slate-900 xl:text-center">
            {totalTables} <T>sin colocar</T>
          </h3>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl ring-1 ring-black/5">
            <button
              type="button"
              onClick={() => scrollToPage(activePage - 1)}
              disabled={activePage === 0}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-white shadow-sm text-slate-900 disabled:opacity-20 hover:bg-secondary hover:text-white transition-all active:scale-90"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M1 9L7 3L13 9"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div className="flex gap-1 px-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-500 ${i === activePage ? "w-4 bg-secondary" : "w-1.5 bg-slate-300"}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => scrollToPage(activePage + 1)}
              disabled={activePage === totalPages - 1}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-white shadow-sm text-slate-900 disabled:opacity-20 hover:bg-secondary hover:text-white transition-all active:scale-90"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M1 5L7 11L13 5"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Contenedor de Scroll Suave */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 w-full overflow-y-auto no-scrollbar scroll-smooth"
        style={{ scrollbarWidth: "none" }}
      >
        {(unplacedTables || []).length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 py-12">
            <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M3 3l18 18M9 9l-6 6 6 6M15 15l6-6-6-6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <T>Todo en su sitio</T>
            </span>
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-3 xl:flex xl:flex-col xl:gap-4 pb-4">
          {(unplacedTables || []).map((table) => (
            <div
              className="group relative flex flex-col items-center gap-3 rounded-2xl bg-white p-4 text-center ring-1 ring-black/5 transition-all hover:shadow-lg hover:ring-secondary/20 xl:w-full cursor-grab active:cursor-grabbing"
              key={table.id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("tableId", table.id);
                e.dataTransfer.effectAllowed = "move";
              }}
            >
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-2xl shadow-inner ring-1 ring-black/5 transition-transform group-hover:scale-105 ${getFloorPlanToolKindClassName(table.shape)}`}
              >
                <span className="text-xl font-black text-white drop-shadow-sm">
                  {table.shape === "bar"
                    ? "—"
                    : table.shape === "round"
                      ? "O"
                      : "□"}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-black text-slate-950 truncate max-w-[200px]">
                  <T>{table.name}</T>
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                  {table.capacity} <T>personas</T>
                </span>
              </div>

              {/* Indicador de "Arrastrar" */}
              <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="rounded-full bg-slate-50 p-1 text-slate-300">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <path
                      d="M8 9h8M8 15h8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Botón de Acción Principal */}
      <div className="pt-4 border-t border-slate-50 shrink-0">
        <button
          type="button"
          onClick={onAddTable}
          className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-secondary p-4 text-white shadow-lg shadow-secondary/20 transition-all hover:bg-secondary/90 hover:-translate-y-0.5 active:scale-95"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20">
            <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
              <path
                d="M7 1V13M1 7H13"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-xs font-black uppercase tracking-widest">
            <T>Nueva Mesa</T>
          </span>
        </button>
      </div>
    </aside>
  );
}
//-aqui termina componente FloorPlanToolRail-//
