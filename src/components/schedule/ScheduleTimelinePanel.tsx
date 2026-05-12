"use client";

/**
 * Archivo: ScheduleTimelinePanel.tsx
 * Responsabilidad: Timeline de sala con vistas Día (timeline hora×mesa) y
 *   Semana (grid dia×mesa con conteo de reservas). Recibe datos del servidor como props.
 * Tipo: UI
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { T } from "@/components/T";
import {
  type GetDailyTimelineOutput,
  type TimelineLane,
} from "@/modules/reservations/application/dtos/get-daily-timeline.dto";
import {
  type GetWeeklySummaryOutput,
  type WeeklyTableRow,
} from "@/modules/reservations/application/dtos/get-weekly-summary.dto";

// ─── Tipos ────────────────────────────────────────────────────────────────────

type ScheduleViewMode = "day" | "week";

// ─── Helpers compartidos ─────────────────────────────────────────────────────

//-aqui empieza funcion parseTimeToMinutes y es para convertir HH:mm en minutos totales con validacion-//
/** @pure */
function parseTimeToMinutes(time: string): number {
  const trimmed = time.trim();
  if (!/^\d{1,2}:\d{2}$/.test(trimmed)) {
    throw new Error(`parseTimeToMinutes: formato inválido "${trimmed}". Se esperaba HH:mm.`);
  }
  const [h, m] = trimmed.split(":").map(Number);
  if (!Number.isFinite(h) || !Number.isFinite(m) || h < 0 || h > 23 || m < 0 || m > 59) {
    throw new Error(`parseTimeToMinutes: valores fuera de rango en "${trimmed}".`);
  }
  return h * 60 + m;
}
//-aqui termina funcion parseTimeToMinutes-//

//-aqui empieza funcion buildHourLabels y es para generar las etiquetas de columna del grid de horas-//
/** @pure */
function buildHourLabels(startTime: string, endTime: string): string[] {
  const startMin = parseTimeToMinutes(startTime);
  let endMin = parseTimeToMinutes(endTime);
  if (endMin <= startMin) endMin += 24 * 60;

  const labels: string[] = [];
  for (let m = startMin; m <= endMin; m += 60) {
    const normalized = m % (24 * 60);
    const hh = String(Math.floor(normalized / 60)).padStart(2, "0");
    labels.push(`${hh}:00`);
  }
  return labels;
}
//-aqui termina funcion buildHourLabels-//

//-aqui empieza funcion toTimelinePosition y es para convertir startAt/endAt a posición porcentual del grid-//
/** @pure */
function toTimelinePosition(
  startAt: Date,
  endAt: Date,
  gridStartMin: number,
  gridTotalMin: number
): { left: number; width: number } {
  const startMin = startAt.getHours() * 60 + startAt.getMinutes();
  let endMin = endAt.getHours() * 60 + endAt.getMinutes();
  if (endMin <= startMin) endMin += 24 * 60;
  const left = Math.min(100, Math.max(0, ((startMin - gridStartMin) / gridTotalMin) * 100));
  const width = Math.min(100 - left, Math.max(2, ((endMin - startMin) / gridTotalMin) * 100));
  return { left, width };
}
//-aqui termina funcion toTimelinePosition-//

//-aqui empieza funcion formatTime y es para mostrar hora HH:MM desde un Date-//
/** @pure */
function formatTime(date: Date): string {
  return date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
}
//-aqui termina funcion formatTime-//

//-aqui empieza funcion formatShortDate y es para mostrar una fecha corta legible-//
/** @pure */
function formatShortDate(date: Date): string {
  return date.toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" });
}
//-aqui termina funcion formatShortDate-//

// ═══════════════════════════════════════════════════════════════════════════════
// VISTA DÍA
// ═══════════════════════════════════════════════════════════════════════════════

interface TimelineLaneRowProps {
  lane: TimelineLane;
  gridStartMin: number;
  gridTotalMin: number;
  hourCount: number;
}

//-aqui empieza componente TimelineLaneRow y es para renderizar una fila de mesa con sus bloques de reserva-//
/** @pure */
function TimelineLaneRow({ lane, gridStartMin, gridTotalMin, hourCount }: TimelineLaneRowProps) {
  return (
    <div className="flex min-h-[112px] hover:bg-surface-container-low/60">
      <div className="w-56 shrink-0 border-r border-outline-variant/10 p-4">
        <div className="flex h-full flex-col justify-center gap-1">
          <p className="text-base font-black tracking-tight text-primary">{lane.tableName}</p>
          <p className="text-xs text-on-surface-variant">{lane.zoneName ?? "Sin zona"}</p>
          <p className="text-xs text-on-surface-variant">
            <T>{`${lane.tableCapacity} asientos`}</T>
          </p>
        </div>
      </div>

      <div className="relative flex flex-1 items-center px-3 py-6">
        <div
          className="absolute inset-0 grid"
          style={{ gridTemplateColumns: `repeat(${hourCount}, 1fr)` }}
        >
          {Array.from({ length: hourCount }).map((_, i) => (
            <div key={`${lane.tableId}-col-${i}`} className="border-r border-dashed border-outline-variant/10" />
          ))}
        </div>

        {lane.bookings.map((booking) => {
          const { left, width } = toTimelinePosition(booking.startAt, booking.endAt, gridStartMin, gridTotalMin);
          const durationMin = Math.round((booking.endAt.getTime() - booking.startAt.getTime()) / 60000);

          return (
            <article
              key={booking.reservationId}
              className="absolute top-1/2 flex -translate-y-1/2 items-center gap-3 rounded-xl bg-primary px-4 py-3 text-on-primary shadow-lg"
              style={{ left: `${left}%`, width: `${width}%` }}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-[10px] font-black uppercase tracking-[0.18em]">
                {booking.partySize}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-black leading-none">{booking.guestFullName}</p>
                <p className="mt-1 truncate text-[10px] leading-none opacity-80">
                  {`${booking.partySize} pers · ${formatTime(booking.startAt)} · ${durationMin} min`}
                </p>
                {booking.specialRequests !== null && booking.specialRequests.length > 0 && (
                  <p className="mt-1 truncate text-[10px] font-semibold uppercase tracking-[0.16em] opacity-70">
                    {booking.specialRequests}
                  </p>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
//-aqui termina componente TimelineLaneRow-//

interface DayViewProps {
  data: GetDailyTimelineOutput;
}

//-aqui empieza componente DayView y es para renderizar el timeline diario de horas x mesas-//
/** @pure */
function DayView({ data }: DayViewProps) {
  const isClosedDay = data.timelineStart === null || data.timelineEnd === null;

  if (isClosedDay) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
        <p className="text-sm font-bold text-on-surface"><T>El restaurante no tiene servicio este día.</T></p>
        <p className="text-xs text-on-surface-variant"><T>Revisa los horarios de apertura en Configuración.</T></p>
      </div>
    );
  }

  const hourLabels = buildHourLabels(data.timelineStart!, data.timelineEnd!);
  const gridStartMin = parseTimeToMinutes(data.timelineStart!);
  const rawEnd = parseTimeToMinutes(data.timelineEnd!);
  const gridEndMin = rawEnd <= gridStartMin ? rawEnd + 24 * 60 : rawEnd;
  const gridTotalMin = gridEndMin - gridStartMin;

  return (
    <div className="overflow-x-auto">
      <div style={{ minWidth: `${hourLabels.length * 120 + 224}px` }}>
        <div className="flex border-b border-outline-variant/10 bg-surface-container-lowest">
          <div className="w-56 shrink-0 border-r border-outline-variant/10 p-4 text-xs font-black uppercase tracking-[0.24em] text-on-surface-variant">
            <T>Mesa / zona</T>
          </div>
          <div className="flex flex-1">
            {hourLabels.map((label) => (
              <div key={label} className="min-w-[120px] flex-1 border-r border-outline-variant/10 px-4 py-4 text-center text-sm font-bold text-on-surface">
                {label}
              </div>
            ))}
          </div>
        </div>

        {data.lanes.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-sm text-on-surface-variant">
            <T>No hay mesas activas configuradas para este restaurante.</T>
          </div>
        ) : (
          <div className="divide-y divide-outline-variant/10">
            {data.lanes.map((lane) => (
              <TimelineLaneRow
                key={lane.tableId}
                lane={lane}
                gridStartMin={gridStartMin}
                gridTotalMin={gridTotalMin}
                hourCount={hourLabels.length}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
//-aqui termina componente DayView-//

// ═══════════════════════════════════════════════════════════════════════════════
// VISTA SEMANA
// ═══════════════════════════════════════════════════════════════════════════════

//-aqui empieza funcion getWeekDayCountClassName y es para colorear la celda según la ocupación del día-//
/**
 * Devuelve las clases de color de una celda según el número de reservas.
 * @pure
 */
function getCellClassName(count: number, isClosed: boolean): string {
  if (isClosed) return "bg-surface-container text-on-surface-variant/40 cursor-default";
  if (count === 0) return "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low cursor-pointer";
  if (count <= 2) return "bg-secondary-container text-on-secondary-container hover:opacity-90 cursor-pointer";
  if (count <= 4) return "bg-tertiary-fixed text-on-tertiary-fixed hover:opacity-90 cursor-pointer";
  return "bg-primary text-on-primary hover:opacity-90 cursor-pointer";
}
//-aqui termina funcion getWeekDayCountClassName-//

interface WeeklyTableRowViewProps {
  row: WeeklyTableRow;
  onDayClick: (date: Date) => void;
}

//-aqui empieza componente WeeklyTableRowView y es para renderizar una fila de mesa en la vista semanal-//
/** @pure */
function WeeklyTableRowView({ row, onDayClick }: WeeklyTableRowViewProps) {
  return (
    <div className="flex min-h-[72px] hover:bg-surface-container-low/40">
      <div className="w-56 shrink-0 border-r border-outline-variant/10 p-4">
        <p className="text-sm font-black tracking-tight text-primary">{row.tableName}</p>
        <p className="text-xs text-on-surface-variant">{row.zoneName ?? "Sin zona"}</p>
        <p className="text-xs text-on-surface-variant"><T>{`${row.tableCapacity} asientos`}</T></p>
      </div>
      <div className="flex flex-1">
        {row.days.map((cell) => (
          <button
            key={cell.date.toISOString()}
            type="button"
            disabled={cell.isClosed}
            onClick={() => !cell.isClosed && onDayClick(cell.date)}
            className={`flex flex-1 flex-col items-center justify-center gap-1 border-r border-outline-variant/10 p-3 text-center transition-opacity ${getCellClassName(cell.reservationCount, cell.isClosed)}`}
          >
            {cell.isClosed ? (
              <span className="text-xs font-semibold uppercase tracking-[0.14em]"><T>Cerrado</T></span>
            ) : (
              <>
                <span className="text-2xl font-black leading-none">{cell.reservationCount}</span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] opacity-75">
                  <T>{cell.reservationCount === 1 ? "reserva" : "reservas"}</T>
                </span>
              </>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
//-aqui termina componente WeeklyTableRowView-//

interface WeekViewProps {
  data: GetWeeklySummaryOutput;
  onDayClick: (date: Date) => void;
}

//-aqui empieza componente WeekView y es para renderizar el grid semanal de dias x mesas-//
/** @pure */
function WeekView({ data, onDayClick }: WeekViewProps) {
  const DAY_LABELS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  // Construir las 7 fechas de la semana desde weekStart, independiente de si hay rows
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(data.weekStart);
    d.setDate(data.weekStart.getDate() + i);
    return d;
  });

  return (
    <div className="overflow-x-auto">
      <div style={{ minWidth: "800px" }}>
        {/* Cabecera de días */}
        <div className="flex border-b border-outline-variant/10 bg-surface-container-lowest">
          <div className="w-56 shrink-0 border-r border-outline-variant/10 p-4 text-xs font-black uppercase tracking-[0.24em] text-on-surface-variant">
            <T>Mesa / zona</T>
          </div>
          <div className="flex flex-1">
            {weekDates.map((date, i) => (
              <div
                key={date.toISOString()}
                className="flex flex-1 flex-col items-center border-r border-outline-variant/10 px-3 py-4"
              >
                <span className="text-xs font-black uppercase tracking-[0.16em] text-on-surface-variant">{DAY_LABELS[i]}</span>
                <span className="mt-0.5 text-sm font-bold text-on-surface">
                  {date.getDate()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Filas de mesas */}
        {data.rows.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-sm text-on-surface-variant">
            <T>No hay mesas activas configuradas para este restaurante.</T>
          </div>
        ) : (
          <div className="divide-y divide-outline-variant/10">
            {data.rows.map((row) => (
              <WeeklyTableRowView key={row.tableId} row={row} onDayClick={onDayClick} />
            ))}
          </div>
        )}

        {/* Leyenda de colores */}
        <div className="flex items-center gap-4 border-t border-outline-variant/10 px-6 py-3">
          <span className="text-xs text-on-surface-variant"><T>Ocupación:</T></span>
          <span className="flex items-center gap-1.5 text-xs text-on-surface-variant">
            <span className="h-3 w-3 rounded-sm bg-surface-container-lowest border border-outline-variant/20" />
            <T>0</T>
          </span>
          <span className="flex items-center gap-1.5 text-xs text-on-surface-variant">
            <span className="h-3 w-3 rounded-sm bg-secondary-container" />
            <T>1–2</T>
          </span>
          <span className="flex items-center gap-1.5 text-xs text-on-surface-variant">
            <span className="h-3 w-3 rounded-sm bg-tertiary-fixed" />
            <T>3–4</T>
          </span>
          <span className="flex items-center gap-1.5 text-xs text-on-surface-variant">
            <span className="h-3 w-3 rounded-sm bg-primary" />
            <T>5+</T>
          </span>
        </div>
      </div>
    </div>
  );
}
//-aqui termina componente WeekView-//

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

interface ScheduleTimelinePanelProps {
  dailyData: GetDailyTimelineOutput;
  weeklyData: GetWeeklySummaryOutput;
  initialView: ScheduleViewMode;
}

//-aqui empieza componente ScheduleTimelinePanel y es para mostrar el timeline con selector de vista Dia/Semana-//
/**
 * Orquesta las vistas Día y Semana. El click en una celda semanal
 * cambia a vista día mostrando ese día (hardcodeado al día actual por ahora,
 * ya que los datos de día solo vienen de today — extensión futura: pasar fecha por URL).
 * @sideEffect (estado local del modo de vista)
 */
export function ScheduleTimelinePanel({ dailyData, weeklyData, initialView }: ScheduleTimelinePanelProps) {
  const [mode, setMode] = useState<ScheduleViewMode>(initialView);
  const router = useRouter();

  const subtitle = mode === "day"
    ? (dailyData.timelineStart !== null
        ? `Servicio de ${dailyData.timelineStart} a ${dailyData.timelineEnd}`
        : "El restaurante no tiene servicio programado para hoy.")
    : `Semana del ${formatShortDate(weeklyData.weekStart)}`;

  //-aqui empieza funcion handleWeekDayClick y es para navegar a la vista dia del dia seleccionado en la semana-//
  function handleWeekDayClick(date: Date): void {
    setMode("day");
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    router.push(`/dashboard/schedule?date=${yyyy}-${mm}-${dd}&view=day`);
  }
  //-aqui termina funcion handleWeekDayClick-//

  //-aqui empieza funcion handleModeChange y es para cambiar de vista sin perder la fecha activa-//
  function handleModeChange(next: ScheduleViewMode): void {
    setMode(next);
    const currentDate = dailyData.date;
    const yyyy = currentDate.getFullYear();
    const mm = String(currentDate.getMonth() + 1).padStart(2, "0");
    const dd = String(currentDate.getDate()).padStart(2, "0");
    router.push(`/dashboard/schedule?date=${yyyy}-${mm}-${dd}&view=${next}`, { scroll: false });
  }
  //-aqui termina funcion handleModeChange-//

  return (
    <section className="overflow-hidden rounded-[28px] bg-surface-container-lowest shadow-sm">

      {/* Cabecera */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-outline-variant/10 bg-surface-container-low px-6 py-5">
        <div>
          <h3 className="text-lg font-black tracking-tight text-primary lg:text-xl">
            <T>Timeline de sala</T>
          </h3>
          <p className="mt-1 text-sm text-on-surface-variant">
            <T>{subtitle}</T>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex rounded-xl bg-surface-container-highest p-1">
            <button
              type="button"
              onClick={() => handleModeChange("day")}
              className={`rounded-lg px-4 py-2 text-xs font-black uppercase tracking-[0.18em] transition-colors ${
                mode === "day"
                  ? "bg-surface-container-lowest text-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <T>Día</T>
            </button>
            <button
              type="button"
              onClick={() => handleModeChange("week")}
              className={`rounded-lg px-4 py-2 text-xs font-black uppercase tracking-[0.18em] transition-colors ${
                mode === "week"
                  ? "bg-surface-container-lowest text-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <T>Semana</T>
            </button>
          </div>

        </div>
      </div>

      {/* Contenido según modo */}
      {mode === "day" ? (
        <DayView data={dailyData} />
      ) : (
        <WeekView data={weeklyData} onDayClick={handleWeekDayClick} />
      )}

    </section>
  );
}
//-aqui termina componente ScheduleTimelinePanel-//
