"use client";

/**
 * Archivo: DatePicker.tsx
 * Responsabilidad: Permitir al usuario seleccionar una fecha en un calendario visual.
 * Tipo: UI
 */

import { T } from "@/components/T";
import { PublicIcon } from "@/components/public/PublicIcon";

export type CalendarDay = {
  label: string;
  muted?: boolean;
  selected?: boolean;
  hasDot?: boolean;
};

const CALENDAR_DAYS: CalendarDay[] = [
  { label: "29", muted: true },
  { label: "30", muted: true },
  { label: "1" },
  { label: "2" },
  { label: "3" },
  { label: "4" },
  { label: "5" },
  { label: "6" },
  { label: "7" },
  { label: "8" },
  { label: "9", selected: true },
  { label: "10" },
  { label: "11", hasDot: true },
  { label: "12" },
];

//-aqui empieza funcion getCalendarDayClassName y es para dibujar el estado visual de cada dia del calendario-//
/**
 * @pure
 */
function getCalendarDayClassName(day: CalendarDay): string {
  if (day.muted) {
    return "py-3 text-zinc-300";
  }

  if (day.selected) {
    return "py-3 rounded-lg bg-primary font-bold text-on-primary shadow-lg";
  }

  return "py-3 font-medium transition-colors hover:bg-surface-container rounded-lg cursor-pointer";
}
//-aqui termina funcion getCalendarDayClassName-//

//-aqui empieza funcion DatePicker y es para mostrar el selector de fecha-//
/**
 * @pure
 */
export function DatePicker() {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-on-primary">2</span>
        <h2 className="font-headline text-2xl font-bold">
          <T>Seleccione Fecha</T>
        </h2>
      </div>
      <div className="space-y-6 rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between px-2">
          <span className="font-headline text-lg font-bold">Octubre 2024</span>
          <div className="flex gap-4">
            <button className="rounded-full p-2 transition-colors hover:bg-surface-container" type="button">
              <PublicIcon name="arrowBack" className="h-5 w-5" />
            </button>
            <button className="rounded-full p-2 transition-colors hover:bg-surface-container" type="button">
              <PublicIcon name="arrowForward" className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="mb-4 grid grid-cols-7 text-center text-xs font-bold uppercase tracking-widest text-on-surface/60">
          <div>Dom</div>
          <div>Lun</div>
          <div>Mar</div>
          <div>Mié</div>
          <div>Jue</div>
          <div>Vie</div>
          <div>Sáb</div>
        </div>
        <div className="grid grid-cols-7 gap-y-2 text-center">
          {CALENDAR_DAYS.map((day) => (
            <button key={day.label} className={getCalendarDayClassName(day)} type="button">
              <span className="relative inline-flex justify-center">
                {day.label}
                {day.hasDot ? <span className="absolute -bottom-1.5 h-1 w-1 rounded-full bg-secondary" /> : null}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
//-aqui termina funcion DatePicker-//
