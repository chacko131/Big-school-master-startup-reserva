"use client";

/**
 * Archivo: PartySizePicker.tsx
 * Responsabilidad: Permitir al usuario seleccionar el número de personas para la reserva.
 *   Acepta defaultValue para prellenar desde query params del sidebar.
 * Tipo: UI
 */

import { useState } from "react";
import { T } from "@/components/T";

const PARTY_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

//-aqui empieza funcion getPartyOptionClassName y es para dibujar el estado visual de las opciones de personas-//
/** @pure */
function getPartyOptionClassName(selected: boolean): string {
  return selected
    ? "border-2 border-primary bg-white text-on-surface font-bold shadow-md"
    : "border border-transparent bg-white text-on-surface font-semibold shadow-sm hover:bg-surface-container-high";
}
//-aqui termina funcion getPartyOptionClassName-//

interface PartySizePickerProps {
  defaultValue?: number;
  onSelect?: (value: number) => void;
}

//-aqui empieza componente PartySizePicker y es para mostrar el selector de número de invitados con estado real-//
/**
 * @sideEffect — gestiona estado local de selección
 */
export function PartySizePicker({ defaultValue = 2, onSelect }: PartySizePickerProps) {
  const [selected, setSelected] = useState<number>(defaultValue);

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-on-primary">1</span>
        <h2 className="font-headline text-2xl font-bold">
          <T>¿Cuántas personas?</T>
        </h2>
      </div>
      <div className="flex flex-wrap gap-3">
        {PARTY_OPTIONS.map((n) => (
          <button
            key={n}
            onClick={() => { setSelected(n); onSelect?.(n); }}
            className={`rounded-xl px-8 py-4 text-lg transition-all ${getPartyOptionClassName(selected === n)}`}
            type="button"
            aria-pressed={selected === n}
          >
            {n}
          </button>
        ))}
      </div>
      <input type="hidden" name="partySize" value={selected} />
    </section>
  );
}
//-aqui termina componente PartySizePicker-//
