"use client";

/**
 * Archivo: PartySizePicker.tsx
 * Responsabilidad: Permitir al usuario seleccionar el número de personas para la reserva.
 * Tipo: UI
 */

import { T } from "@/components/T";

export type PartyOption = {
  label: string;
  selected?: boolean;
};

const PARTY_OPTIONS: PartyOption[] = [
  { label: "1" },
  { label: "2", selected: true },
  { label: "3" },
  { label: "4" },
  { label: "5" },
  { label: "6+" },
];

//-aqui empieza funcion getPartyOptionClassName y es para dibujar el estado visual de las opciones de personas-//
/**
 * @pure
 */
function getPartyOptionClassName(selected?: boolean): string {
  return selected
    ? "border-2 border-primary bg-white text-on-surface font-bold shadow-md"
    : "border border-transparent bg-white text-on-surface font-semibold shadow-sm hover:bg-surface-container-high";
}
//-aqui termina funcion getPartyOptionClassName-//

//-aqui empieza funcion PartySizePicker y es para mostrar el selector de número de invitados-//
/**
 * @pure
 */
export function PartySizePicker() {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-on-primary">1</span>
        <h2 className="font-headline text-2xl font-bold">
          <T>¿Cuántas personas?</T>
        </h2>
      </div>
      <div className="flex flex-wrap gap-3">
        {PARTY_OPTIONS.map((option) => (
          <button
            key={option.label}
            className={`rounded-xl px-8 py-4 text-lg transition-all ${getPartyOptionClassName(option.selected)}`}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
    </section>
  );
}
//-aqui termina funcion PartySizePicker-//
