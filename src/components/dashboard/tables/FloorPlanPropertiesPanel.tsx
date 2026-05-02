"use client";

/**
 * Archivo: FloorPlanPropertiesPanel.tsx
 * Responsabilidad: Mostrar y editar propiedades locales de la mesa seleccionada en el sandbox.
 * Tipo: UI
 */

import { T } from "@/components/T";
import { OnboardingIcon } from "@/components/onboarding/OnboardingIcon";
import { type FloorPlanTable } from "./floorPlanMocks";
import {
  getPropertyIndicatorClassName,
  getTableSizeLabel,
} from "./floorPlanStyles";
import Link from "next/link";
import type { RestaurantZonePrimitives } from "@/modules/catalog/domain/entities/restaurant-zone.entity";
import type { FloorPlanElementPrimitives } from "@/modules/catalog/domain/entities/floor-plan-element.entity";

interface FloorPlanPropertiesPanelProps {
  selectedTable: FloorPlanTable | undefined;
  selectedElement?: FloorPlanElementPrimitives | undefined;
  activeZone: RestaurantZonePrimitives | undefined;
  onNameChange: (nextName: string) => void;
  onCapacityDecrease: () => void;
  onCapacityIncrease: () => void;
  onToggleCombinable: () => void;
  onSetActive: () => void;
  onSetInactive: () => void;
  onDeleteTable?: () => void;
  onRemoveFromCanvas: () => void;
  onWidthChange: (width: number) => void;
  onHeightChange: (height: number) => void;
  onShapeChange: (shape: FloorPlanTable["shape"]) => void;
  onDeleteElement?: () => void;
  onElementWidthChange?: (width: number) => void;
  onElementHeightChange?: (height: number) => void;
  onSave: () => void;
  isSaving: boolean;
}

//-aqui empieza componente FloorPlanPropertiesPanel y es para mostrar la mesa seleccionada-//
/**
 * Renderiza el panel de propiedades del editor de mesas.
 *
 * @sideEffect
 */
export function FloorPlanPropertiesPanel({
  selectedTable,
  selectedElement,
  activeZone,
  onNameChange,
  onCapacityDecrease,
  onCapacityIncrease,
  onToggleCombinable,
  onSetActive,
  onSetInactive,
  onDeleteTable,
  onRemoveFromCanvas,
  onWidthChange,
  onHeightChange,
  onShapeChange,
  onDeleteElement,
  onElementWidthChange,
  onElementHeightChange,
  onSave,
  isSaving,
}: FloorPlanPropertiesPanelProps) {
  if (selectedElement !== undefined) {
    return (
      <aside className="flex w-full flex-col rounded-[32px] bg-white p-4 shadow-xl ring-1 ring-black/5 xl:h-[760px] xl:w-80 overflow-hidden">
        {/* Header Fijo */}
        <div className="mb-4 shrink-0 px-2 pt-2">
          <h2 className="text-2xl font-black tracking-tight text-slate-950">
            <T>Elemento Decorativo</T>
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {selectedElement.type === "WALL" ? "Muro / Pared" : "Planta"}
          </p>
        </div>

        {/* Contenido con Scroll */}
        <div
          className="flex-1 overflow-y-auto no-scrollbar space-y-8 pr-1 scroll-smooth"
          style={{ scrollbarWidth: "none" }}
        >
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex justify-between items-center">
                  <label
                    className="block text-xs font-bold uppercase tracking-[0.22em] text-slate-500"
                    htmlFor="element-width"
                  >
                    <T>Ancho</T>
                  </label>
                  <span className="text-xs font-semibold text-slate-900">
                    {selectedElement.width ?? 0}
                  </span>
                </div>
                <input
                  id="element-width"
                  type="range"
                  min="20"
                  max="400"
                  step="1"
                  className="w-full accent-slate-900"
                  value={selectedElement.width ?? 0}
                  onChange={(event) =>
                    onElementWidthChange?.(Number(event.target.value))
                  }
                />
              </div>
              <div className="space-y-2 flex-1">
                <div className="flex justify-between items-center">
                  <label
                    className="block text-xs font-bold uppercase tracking-[0.22em] text-slate-500"
                    htmlFor="element-height"
                  >
                    <T>Largo</T>
                  </label>
                  <span className="text-xs font-semibold text-slate-900">
                    {selectedElement.height ?? 0}
                  </span>
                </div>
                <input
                  id="element-height"
                  type="range"
                  min="20"
                  max="400"
                  step="1"
                  className="w-full accent-slate-900"
                  value={selectedElement.height ?? 0}
                  onChange={(event) =>
                    onElementHeightChange?.(Number(event.target.value))
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Fijo */}
        <div className="mt-4 border-t border-slate-100 pt-4 shrink-0">
          <button
            className="w-full rounded-lg bg-rose-50 px-4 py-3 text-xs font-bold text-rose-600 transition-colors hover:bg-rose-100 hover:text-rose-700"
            type="button"
            onClick={onDeleteElement}
          >
            <T>Eliminar elemento</T>
          </button>
        </div>
      </aside>
    );
  }

  // Early return si no hay mesa seleccionada
  if (selectedTable === undefined) {
    return (
      <aside className="flex w-full flex-col rounded-[32px] bg-white p-4 shadow-xl ring-1 ring-black/5 xl:h-[760px] xl:w-80">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-950">
            <T>Propiedades</T>
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            <T>Selecciona una mesa para editar sus propiedades</T>
          </p>
        </div>
      </aside>
    );
  }

  const sizeLabel = getTableSizeLabel(selectedTable.shape);

  return (
    <aside className="flex w-full flex-col rounded-[32px] bg-white p-4 shadow-xl ring-1 ring-black/5 xl:h-[760px] xl:w-80 overflow-hidden">
      {/* Header Fijo */}
      <div className="mb-4 shrink-0 px-2 pt-2">
        <h2 className="text-2xl font-black tracking-tight text-slate-950">
          <T>Propiedades</T>
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          {selectedTable.name} • {sizeLabel}
        </p>
      </div>

      {/* Contenido con Scroll */}
      <div
        className="flex-1 overflow-y-auto no-scrollbar space-y-8 pr-1 scroll-smooth"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <label
              className="block text-xs font-bold uppercase tracking-[0.22em] text-slate-500"
              htmlFor="table-name"
            >
              <T>Nombre de la mesa</T>
            </label>
            <input
              id="table-name"
              className="w-full rounded-lg border-0 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-900 outline-none ring-1 ring-transparent transition-all focus:ring-slate-900"
              value={selectedTable.name}
              onChange={(event) => onNameChange(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <span className="block text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
              <T>Capacidad</T>
            </span>
            <div className="flex items-center gap-4 rounded-lg bg-slate-100 px-4 py-3">
              <button
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-lg font-black text-slate-900 shadow-sm transition-colors hover:bg-slate-200"
                type="button"
                onClick={onCapacityDecrease}
              >
                −
              </button>
              <span className="flex-1 text-center text-lg font-black tracking-tight text-slate-950">
                {selectedTable.capacity}
              </span>
              <button
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-lg font-black text-slate-900 shadow-sm transition-colors hover:bg-slate-200"
                type="button"
                onClick={onCapacityIncrease}
              >
                +
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <span className="block text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
                <T>Combinable</T>
              </span>
              <span className="text-[10px] text-slate-500">
                <T>Puede unirse con mesas adyacentes</T>
              </span>
            </div>
            <button
              className={`relative h-5 w-10 rounded-full transition-colors ${getPropertyIndicatorClassName(selectedTable.isCombinable)}`}
              type="button"
              onClick={onToggleCombinable}
            >
              <div
                className={`absolute top-1 h-3 w-3 rounded-full bg-white transition-all ${selectedTable.isCombinable ? "right-1" : "left-1"}`}
              />
            </button>
          </div>

          <div className="space-y-3">
            <span className="block text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
              <T>Estado</T>
            </span>
            <div className="flex gap-2">
              <button
                className={`flex-1 rounded-lg px-4 py-2 text-xs font-bold shadow-sm transition-colors ${selectedTable.isActive ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-500"}`}
                type="button"
                onClick={onSetActive}
              >
                <T>Activa</T>
              </button>
              <button
                className={`flex-1 rounded-lg px-4 py-2 text-xs font-bold transition-colors ${!selectedTable.isActive ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-500"}`}
                type="button"
                onClick={onSetInactive}
              >
                <T>Inactiva</T>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex justify-between items-center">
                <label
                  className="block text-xs font-bold uppercase tracking-[0.22em] text-slate-500"
                  htmlFor="table-width"
                >
                  <T>Ancho</T>
                </label>
                <span className="text-xs font-semibold text-slate-900">
                  {selectedTable.width ?? 0}
                </span>
              </div>
              <input
                id="table-width"
                type="range"
                min="20"
                max="100"
                step="1"
                className="w-full accent-slate-900"
                value={selectedTable.width ?? 0}
                onChange={(event) => onWidthChange(Number(event.target.value))}
              />
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex justify-between items-center">
                <label
                  className="block text-xs font-bold uppercase tracking-[0.22em] text-slate-500"
                  htmlFor="table-height"
                >
                  <T>Largo</T>
                </label>
                <span className="text-xs font-semibold text-slate-900">
                  {selectedTable.height ?? 0}
                </span>
              </div>
              <input
                id="table-height"
                type="range"
                min="20"
                max="100"
                step="1"
                className="w-full accent-slate-900"
                value={selectedTable.height ?? 0}
                onChange={(event) => onHeightChange(Number(event.target.value))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
              <T>Forma</T>
            </label>
            <div className="flex gap-2">
              <button
                className={`flex-1 rounded-lg px-4 py-2 text-xs font-bold shadow-sm transition-colors ${selectedTable.shape === "square" ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
                type="button"
                onClick={() => onShapeChange("square")}
              >
                <T>Cuadrada</T>
              </button>
              <button
                className={`flex-1 rounded-lg px-4 py-2 text-xs font-bold transition-colors ${selectedTable.shape === "round" ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
                type="button"
                onClick={() => onShapeChange("round")}
              >
                <T>Redonda</T>
              </button>
              <button
                className={`flex-1 rounded-lg px-4 py-2 text-xs font-bold transition-colors ${selectedTable.shape === "bar" ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
                type="button"
                onClick={() => onShapeChange("bar")}
              >
                <T>Barra</T>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <span className="block text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
              <T>Zona</T>
            </span>
            {activeZone !== undefined ? (
              <p
                className="rounded-lg px-4 py-3 text-sm font-semibold text-white"
                style={{ backgroundColor: activeZone.color }}
              >
                {activeZone.name}
              </p>
            ) : (
              <p className="rounded-lg bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-500">
                <T>Sin zona asignada</T>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Footer Fijo */}
      <div className="mt-4 space-y-4 border-t border-slate-100 pt-4 shrink-0">
        <div className="flex flex-col gap-3">
          <button
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition-all hover:bg-slate-800 active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-black/10"
            type="button"
            disabled={isSaving}
            onClick={onSave}
          >
            <OnboardingIcon name="save" className="h-4 w-4" />
            <T>{isSaving ? "Guardando..." : "Guardar cambios"}</T>
          </button>
          <Link
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-5 py-3 text-sm font-bold text-slate-800 transition-all hover:bg-slate-200 active:scale-[0.98]"
            href="/dashboard/reservations"
          >
            <OnboardingIcon name="schedule" className="h-4 w-4" />
            <T>Ver reservas</T>
          </Link>
        </div>

        <div className="flex flex-col gap-2">
          <button
            className="w-full rounded-lg bg-slate-100 px-4 py-2 text-[10px] font-bold text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700 uppercase tracking-wider"
            type="button"
            onClick={onRemoveFromCanvas}
          >
            <T>Mover a la barra (Quitar del lienzo)</T>
          </button>
          <button
            className="w-full rounded-lg bg-rose-50 px-4 py-2 text-[10px] font-bold text-rose-600 transition-colors hover:bg-rose-100 hover:text-rose-700 uppercase tracking-wider"
            type="button"
            onClick={onDeleteTable}
          >
            <T>Eliminar mesa</T>
          </button>
        </div>
      </div>
    </aside>
  );
}
//-aqui termina componente FloorPlanPropertiesPanel-//
//-aqui termina componente FloorPlanPropertiesPanel-//
