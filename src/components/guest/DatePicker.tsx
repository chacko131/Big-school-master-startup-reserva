"use client";

/**
 * Archivo: DatePicker.tsx
 * Responsabilidad: Permitir al usuario seleccionar una fecha en un calendario visual real.
 *   Acepta defaultDate (YYYY-MM-DD) para prellenar desde query params del sidebar.
 * Tipo: UI
 */

import { useState } from "react";
import { T } from "@/components/T";
import { PublicIcon } from "@/components/public/PublicIcon";

// ─── Constantes ───────────────────────────────────────────────────────────────

const WEEKDAY_LABELS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

// Mapeo DayOfWeek (string del dominio) → número de getDay() (0=Dom, 1=Lun, ...)
const DAY_OF_WEEK_TO_JS: Record<string, number> = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

//-aqui empieza funcion toDateKey y es para convertir año/mes/día en clave YYYY-MM-DD-//
/** @pure */
function toDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}
//-aqui termina funcion toDateKey-//

//-aqui empieza funcion buildCalendarGrid y es para construir la cuadrícula de días del mes con offsets-//
/** @pure */
function buildCalendarGrid(year: number, month: number): Array<{ day: number; currentMonth: boolean }> {
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells: Array<{ day: number; currentMonth: boolean }> = [];

  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    cells.push({ day: daysInPrevMonth - i, currentMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, currentMonth: true });
  }
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    cells.push({ day: d, currentMonth: false });
  }
  return cells;
}
//-aqui termina funcion buildCalendarGrid-//

//-aqui empieza funcion getDayClassName y es para resolver el estilo visual de cada celda del calendario-//
/** @pure */
function getDayClassName(isSelected: boolean, isMuted: boolean, isPast: boolean): string {
  if (isMuted || isPast) return "py-3 text-zinc-300 cursor-default";
  if (isSelected) return "py-3 rounded-lg bg-primary font-bold text-on-primary shadow-lg";
  return "py-3 font-medium transition-colors hover:bg-surface-container rounded-lg cursor-pointer";
}
//-aqui termina funcion getDayClassName-//

// ─── Props ────────────────────────────────────────────────────────────────────

interface DatePickerProps {
  defaultDate?: string;
  closedDays?: string[];
  onSelect?: (date: string) => void;
}

//-aqui empieza componente DatePicker y es para mostrar un calendario interactivo con prellenado-//
/**
 * @sideEffect — gestiona estado local de mes y día seleccionado
 */
export function DatePicker({ defaultDate, closedDays = [], onSelect }: DatePickerProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const parsedDefault = defaultDate !== undefined ? new Date(`${defaultDate}T00:00:00`) : null;
  const initial = (parsedDefault !== null && !isNaN(parsedDefault.getTime())) ? parsedDefault : today;
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());
  const [selectedKey, setSelectedKey] = useState<string>(
    toDateKey(initial.getFullYear(), initial.getMonth(), initial.getDate())
  );

  const todayKey = toDateKey(today.getFullYear(), today.getMonth(), today.getDate());
  const grid = buildCalendarGrid(viewYear, viewMonth);

  //-aqui empieza funcion goToPrevMonth y es para navegar al mes anterior sin ir antes del mes actual-//
  function goToPrevMonth(): void {
    const prev = new Date(viewYear, viewMonth - 1, 1);
    const todayFirst = new Date(today.getFullYear(), today.getMonth(), 1);
    if (prev < todayFirst) return;
    setViewYear(prev.getFullYear());
    setViewMonth(prev.getMonth());
  }
  //-aqui termina funcion goToPrevMonth-//

  //-aqui empieza funcion goToNextMonth y es para navegar al mes siguiente-//
  function goToNextMonth(): void {
    const next = new Date(viewYear, viewMonth + 1, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  }
  //-aqui termina funcion goToNextMonth-//

  const closedJsDays = new Set(closedDays.map((d) => DAY_OF_WEEK_TO_JS[d]).filter((n) => n !== undefined));

  //-aqui empieza funcion isClosedDay y es para determinar si un día concreto está cerrado por horario del restaurante-//
  /** @pure */
  function isClosedDay(year: number, month: number, day: number): boolean {
    const jsDay = new Date(year, month, day).getDay();
    return closedJsDays.has(jsDay);
  }
  //-aqui termina funcion isClosedDay-//

  //-aqui empieza funcion handleDayClick y es para seleccionar un día válido del calendario-//
  function handleDayClick(day: number, currentMonth: boolean): void {
    if (!currentMonth) return;
    const key = toDateKey(viewYear, viewMonth, day);
    const clickedDate = new Date(`${key}T00:00:00`);
    if (clickedDate < today) return;
    if (isClosedDay(viewYear, viewMonth, day)) return;
    setSelectedKey(key);
    onSelect?.(key);
  }
  //-aqui termina funcion handleDayClick-//

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-on-primary">2</span>
        <h2 className="font-headline text-2xl font-bold">
          <T>Seleccione Fecha</T>
        </h2>
      </div>

      <div className="space-y-6 rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
        {/* Navegación de mes */}
        <div className="flex items-center justify-between px-2">
          <span className="font-headline text-lg font-bold">
            {MONTH_NAMES[viewMonth]} {viewYear}
          </span>
          <div className="flex gap-4">
            <button
              className="rounded-full p-2 transition-colors hover:bg-surface-container disabled:opacity-30"
              type="button"
              onClick={goToPrevMonth}
              aria-label="Mes anterior"
            >
              <PublicIcon name="arrowBack" className="h-5 w-5" />
            </button>
            <button
              className="rounded-full p-2 transition-colors hover:bg-surface-container"
              type="button"
              onClick={goToNextMonth}
              aria-label="Mes siguiente"
            >
              <PublicIcon name="arrowForward" className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Cabecera días de la semana */}
        <div className="grid grid-cols-7 text-center text-xs font-bold uppercase tracking-widest text-on-surface/60">
          {WEEKDAY_LABELS.map((label) => (
            <div key={label}>{label}</div>
          ))}
        </div>

        {/* Cuadrícula de días */}
        <div className="grid grid-cols-7 gap-y-2 text-center">
          {grid.map((cell, i) => {
            const key = cell.currentMonth ? toDateKey(viewYear, viewMonth, cell.day) : "";
            const isSelected = key === selectedKey;
            const isPast = cell.currentMonth && key < todayKey;
            const isClosed = cell.currentMonth && isClosedDay(viewYear, viewMonth, cell.day);
            const isDisabled = !cell.currentMonth || isPast || isClosed;
            return (
              <button
                key={i}
                type="button"
                onClick={() => handleDayClick(cell.day, cell.currentMonth)}
                disabled={isDisabled}
                aria-pressed={isSelected}
                title={isClosed ? "Cerrado" : undefined}
                className={getDayClassName(isSelected, !cell.currentMonth || isClosed, isPast)}
              >
                {cell.day}
              </button>
            );
          })}
        </div>
      </div>

      <input type="hidden" name="date" value={selectedKey} />
    </section>
  );
}
//-aqui termina componente DatePicker-//
