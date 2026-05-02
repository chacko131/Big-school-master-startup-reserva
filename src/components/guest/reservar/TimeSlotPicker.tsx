"use client";

/**
 * Archivo: TimeSlotPicker.tsx
 * Responsabilidad: Permitir al usuario seleccionar una franja horaria para su reserva.
 * Tipo: UI
 */

import { T } from "@/components/T";

export type TimeSlot = {
  label: string;
  selected?: boolean;
};

const LUNCH_TIME_SLOTS: TimeSlot[] = [
  { label: "13:00" },
  { label: "13:30" },
  { label: "14:00" },
  { label: "14:30" },
];

const DINNER_TIME_SLOTS: TimeSlot[] = [
  { label: "19:30", selected: true },
  { label: "20:00" },
  { label: "20:30" },
  { label: "21:00" },
  { label: "21:30" },
];

//-aqui empieza funcion getTimeSlotClassName y es para dibujar el estado visual de cada hora disponible-//
/**
 * @pure
 */
function getTimeSlotClassName(selected?: boolean): string {
  return selected
    ? "rounded-xl bg-primary py-3 text-center font-bold text-on-primary shadow-lg"
    : "rounded-xl border border-transparent bg-white py-3 text-center font-medium transition-all hover:bg-surface-container-high border border-slate-100 shadow-sm";
}
//-aqui termina funcion getTimeSlotClassName-//

//-aqui empieza funcion TimeSlotPicker y es para mostrar el selector de horarios-//
/**
 * @pure
 */
export function TimeSlotPicker() {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-on-primary">3</span>
        <h2 className="font-headline text-2xl font-bold">
          <T>Hora Disponible</T>
        </h2>
      </div>
      <div className="space-y-8">
        <div>
          <span className="mb-4 block text-sm font-bold uppercase tracking-widest text-on-surface/60">
            <T>Comida</T>
          </span>
          <div className="grid grid-cols-3 gap-3 md:grid-cols-4">
            {LUNCH_TIME_SLOTS.map((slot) => (
              <button key={slot.label} className={getTimeSlotClassName(slot.selected)} type="button">
                {slot.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <span className="mb-4 block text-sm font-bold uppercase tracking-widest text-on-surface/60">
            <T>Cena</T>
          </span>
          <div className="grid grid-cols-3 gap-3 md:grid-cols-4">
            {DINNER_TIME_SLOTS.map((slot) => (
              <button key={slot.label} className={getTimeSlotClassName(slot.selected)} type="button">
                {slot.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
//-aqui termina funcion TimeSlotPicker-//
