"use client";

/**
 * Archivo: FloorPlanTabs.tsx
 * Responsabilidad: Renderizar las pestañas de zonas y permitir crear/eliminar zonas del restaurante.
 * Tipo: UI
 */

import { useRef, useState } from "react";
import { T } from "@/components/T";
import { OnboardingIcon } from "@/components/onboarding/OnboardingIcon";
import type { RestaurantZonePrimitives } from "@/modules/catalog/domain/entities/restaurant-zone.entity";

interface FloorPlanTabsProps {
  zones: RestaurantZonePrimitives[];
  activeZoneId: string | null;
  onZoneChange: (zoneId: string | null) => void;
  onCreateZone: (name: string) => void;
  onDeleteZone: (zoneId: string) => void;
  isPending?: boolean;
  lastSavedLabel?: string;
}

//-aqui empieza componente FloorPlanTabs y es para navegar entre zonas y gestionar su creación-//
/**
 * Renderiza las pestañas de zonas del editor. Cada pestaña corresponde a una zona real en BD.
 * Permite crear y eliminar zonas directamente desde aquí.
 * @sideEffect
 */
export function FloorPlanTabs({
  zones,
  activeZoneId,
  onZoneChange,
  onCreateZone,
  onDeleteZone,
  isPending = false,
  lastSavedLabel = "Último guardado hace 3 min",
}: FloorPlanTabsProps) {
  const [showCreateInput, setShowCreateInput] = useState(false);
  const [newZoneName, setNewZoneName] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  //-aqui empieza funcion handleCreateSubmit y es para confirmar la creación de la zona-//
  const handleCreateSubmit = () => {
    const name = newZoneName.trim();

    if (name.length === 0) {
      setShowCreateInput(false);
      setNewZoneName("");
      return;
    }

    onCreateZone(name);
    setNewZoneName("");
    setShowCreateInput(false);
  };
  //-aqui termina funcion handleCreateSubmit-//

  return (
    <nav className="flex flex-wrap items-center gap-2 rounded-2xl bg-surface-container-low p-3 shadow-sm">
      {/* Pestañas de zonas reales */}
      {zones.map((zone) => {
        const isActive = zone.id === activeZoneId;

        return (
          <div key={zone.id} className="group relative flex items-center">
            <button
              type="button"
              style={isActive ? { borderBottom: `2px solid ${zone.color}` } : undefined}
              className={`rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
                isActive
                  ? "bg-surface-container-lowest text-on-surface shadow-sm"
                  : "text-on-surface-variant hover:bg-surface-container-lowest hover:text-on-surface"
              }`}
              onClick={() => onZoneChange(zone.id)}
              disabled={isPending}
            >
              <T>{zone.name}</T>
            </button>

            {/* Botón de eliminar zona — solo visible en hover */}
            {isActive && (
              <button
                type="button"
                title="Eliminar zona"
                className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-50 text-rose-500 opacity-0 transition-opacity hover:bg-rose-100 group-hover:opacity-100 disabled:cursor-not-allowed"
                onClick={() => onDeleteZone(zone.id)}
                disabled={isPending}
              >
                <span className="text-xs font-black leading-none">×</span>
              </button>
            )}
          </div>
        );
      })}

      {/* Input de creación de zona */}
      {showCreateInput ? (
        <div className="flex items-center gap-1">
          <input
            ref={inputRef}
            type="text"
            autoFocus
            value={newZoneName}
            onChange={(e) => setNewZoneName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleCreateSubmit();
              }
              if (e.key === "Escape") {
                setShowCreateInput(false);
                setNewZoneName("");
              }
            }}
            placeholder="Nombre de zona..."
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800"
          />
          <button
            type="button"
            onClick={handleCreateSubmit}
            disabled={isPending}
            className="rounded-lg bg-slate-950 px-3 py-1.5 text-xs font-bold text-white disabled:opacity-50"
          >
            <T>Crear</T>
          </button>
          <button
            type="button"
            onClick={() => {
              setShowCreateInput(false);
              setNewZoneName("");
            }}
            className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600"
          >
            <T>Cancelar</T>
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-on-surface-variant transition-colors hover:bg-surface-container-lowest hover:text-on-surface disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => setShowCreateInput(true)}
          disabled={isPending}
        >
          <span className="text-base font-black leading-none">+</span>
          <T>Nueva zona</T>
        </button>
      )}

      {/* Indicador de guardado */}
      <div className="ml-auto hidden items-center gap-2 rounded-full bg-surface-container-lowest px-4 py-2 text-xs font-semibold text-on-surface-variant md:flex">
        <OnboardingIcon name="checkCircle" className="h-4 w-4 text-secondary" />
        <T>{lastSavedLabel}</T>
      </div>
    </nav>
  );
}
//-aqui termina componente FloorPlanTabs-//
