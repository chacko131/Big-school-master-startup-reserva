"use client";

/**
 * Archivo: TimeSlotPicker.tsx
 * Responsabilidad: Permitir al usuario seleccionar una franja horaria para su reserva.
 *   Recibe los slots reales del restaurante desde el servidor.
 *   Acepta defaultTime (HH:mm) para prellenar desde query params del sidebar.
 * Tipo: UI
 */

import { useState } from "react";
import { T } from "@/components/T";

//-aqui empieza funcion getTimeSlotClassName y es para dibujar el estado visual de cada hora disponible-//
/** @pure */
function getTimeSlotClassName(selected: boolean): string {
  return selected
    ? "rounded-xl bg-primary py-3 text-center font-bold text-on-primary shadow-lg"
    : "rounded-xl border border-transparent bg-white py-3 text-center font-medium transition-all hover:bg-surface-container-high border border-slate-100 shadow-sm";
}
//-aqui termina funcion getTimeSlotClassName-//

//-aqui empieza funcion parseSlotHour y es para extraer la hora numérica de un string HH:mm-//
/** @pure */
function parseSlotHour(slot: string): number | null {
  if (!/^\d{1,2}:\d{2}$/.test(slot)) return null;
  const hour = parseInt(slot.split(":")[0], 10);
  if (isNaN(hour) || hour < 0 || hour > 23) return null;
  return hour;
}
//-aqui termina funcion parseSlotHour-//

// ─── Props ────────────────────────────────────────────────────────────────────

interface TimeSlotPickerProps {
  slots: string[];
  defaultTime?: string;
  onSelect?: (time: string) => void;
}

//-aqui empieza componente TimeSlotPicker y es para mostrar el selector de horarios reales del restaurante-//
/**
 * @sideEffect — gestiona estado local de slot seleccionado
 */
export function TimeSlotPicker({ slots, defaultTime, onSelect }: TimeSlotPickerProps) {
  const firstSlot = slots[0] ?? "";
  const [selected, setSelected] = useState<string>(
    defaultTime !== undefined && slots.includes(defaultTime) ? defaultTime : firstSlot
  );

  const lunchSlots = slots.filter((s) => { const h = parseSlotHour(s); return h !== null && h < 16; });
  const dinnerSlots = slots.filter((s) => { const h = parseSlotHour(s); return h !== null && h >= 16; });

  if (slots.length === 0) {
    return (
      <section className="space-y-6">
        <div className="flex items-center gap-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-on-primary">3</span>
          <h2 className="font-headline text-2xl font-bold">
            <T>Hora Disponible</T>
          </h2>
        </div>
        <p className="rounded-2xl bg-surface-container-low px-6 py-8 text-center text-sm text-on-surface-variant">
          <T>No hay disponibilidad para este día. Prueba con otra fecha.</T>
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-on-primary">3</span>
        <h2 className="font-headline text-2xl font-bold">
          <T>Hora Disponible</T>
        </h2>
      </div>

      <div className="space-y-8">
        {lunchSlots.length > 0 && (
          <div>
            <span className="mb-4 block text-sm font-bold uppercase tracking-widest text-on-surface/60">
              <T>Comida</T>
            </span>
            <div className="grid grid-cols-3 gap-3 md:grid-cols-4">
              {lunchSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => { setSelected(slot); onSelect?.(slot); }}
                  aria-pressed={selected === slot}
                  className={getTimeSlotClassName(selected === slot)}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        )}

        {dinnerSlots.length > 0 && (
          <div>
            <span className="mb-4 block text-sm font-bold uppercase tracking-widest text-on-surface/60">
              <T>Cena</T>
            </span>
            <div className="grid grid-cols-3 gap-3 md:grid-cols-4">
              {dinnerSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => { setSelected(slot); onSelect?.(slot); }}
                  aria-pressed={selected === slot}
                  className={getTimeSlotClassName(selected === slot)}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <input type="hidden" name="time" value={selected} />
    </section>
  );
}
//-aqui termina componente TimeSlotPicker-//
