"use client";

/**
 * Archivo: ReservationsFilterSection.tsx
 * Responsabilidad: Barra de filtros funcional (fecha y estado) + tabla de reservas filtradas.
 *   - La fecha llama al servidor para traer solo las reservas del día seleccionado.
 *   - El filtro de estado se aplica localmente sobre los datos ya cargados.
 * Tipo: UI
 */

import { useState, useRef, useEffect, useCallback, useTransition } from "react";
import { DayPicker } from "react-day-picker";
import { es } from "date-fns/locale";
import "react-day-picker/style.css";
import { OnboardingIcon } from "@/components/onboarding/OnboardingIcon";
import { ReservationsLedger, type ReservationRowData } from "@/components/reservation/ReservationsLedger";
import { EditReservationModal } from "@/components/reservation/EditReservationModal";
import { type ReservationStatus } from "@/modules/reservations/domain/entities/reservation.entity";
import { fetchReservationsByDate } from "@/app/(dashboard)/dashboard/reservations/actions";

const STATUS_OPTIONS: { value: ReservationStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "Todos" },
  { value: "PENDING", label: "Pendiente" },
  { value: "CONFIRMED", label: "Confirmada" },
  { value: "CHECKED_IN", label: "En sala" },
  { value: "COMPLETED", label: "Completada" },
  { value: "CANCELLED", label: "Cancelada" },
  { value: "NO_SHOW", label: "No-show" },
];

//-aqui empieza funcion toLocalDateString y es para formatear una fecha en YYYY-MM-DD local-//
/**
 * Devuelve la fecha en formato YYYY-MM-DD usando la zona horaria local del navegador.
 * @pure
 */
function toLocalDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
//-aqui termina funcion toLocalDateString-//

//-aqui empieza funcion formatDateLabel y es para mostrar la fecha en formato legible en español-//
/**
 * Convierte YYYY-MM-DD a una etiqueta legible como "Lun, 12 may".
 * @pure
 */
function formatDateLabel(dateStr: string): string {
  const date = new Date(`${dateStr}T12:00:00`);
  return date.toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" });
}
//-aqui termina funcion formatDateLabel-//

interface ReservationsFilterSectionProps {
  allReservations: ReadonlyArray<ReservationRowData>;
}

//-aqui empieza componente ReservationsFilterSection y es para filtrar y listar reservas-//
/**
 * Renderiza la barra de filtros (fecha + estado) y el listado filtrado.
 * @sideEffect (estado local de UI)
 */
export function ReservationsFilterSection({ allReservations }: ReservationsFilterSectionProps) {
  const today = toLocalDateString(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [selectedStatus, setSelectedStatus] = useState<ReservationStatus | "ALL">("ALL");
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [loadedReservations, setLoadedReservations] = useState<ReadonlyArray<ReservationRowData>>(allReservations);
  const [isPending, startTransition] = useTransition();
  const [editingReservation, setEditingReservation] = useState<ReservationRowData | null>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);

  //-aqui empieza useEffect y es para cerrar el popover al hacer clic fuera-//
  useEffect(() => {
    if (!datePickerOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (datePickerRef.current && !datePickerRef.current.contains(e.target as Node)) {
        setDatePickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [datePickerOpen]);
  //-aqui termina useEffect-//

  //-aqui empieza handleDaySelect y es para pedir al servidor las reservas del dia seleccionado-//
  const handleDaySelect = useCallback((day: Date | undefined) => {
    if (!day) return;
    const dateStr = toLocalDateString(day);
    setSelectedDate(dateStr);
    setDatePickerOpen(false);
    setSelectedStatus("ALL");

    void fetchReservationsByDate(dateStr).then((result) => {
      startTransition(() => {
        setLoadedReservations(result.reservations);
      });
    });
  }, []);
  //-aqui termina handleDaySelect-//

  //-aqui empieza handleStatusChange y es para actualizar el estado de una reserva en la lista local sin recargar la pagina-//
  const handleStatusChange = useCallback((reservationId: string, newStatus: ReservationStatus) => {
    setLoadedReservations((prev) =>
      prev.map((r) => r.id === reservationId ? { ...r, status: newStatus } : r)
    );
  }, []);
  //-aqui termina handleStatusChange-//

  //-aqui empieza filteredReservations y es para filtrar por estado sobre los datos ya cargados del dia-//
  const filteredReservations = selectedStatus === "ALL"
    ? loadedReservations
    : loadedReservations.filter((r) => r.status === selectedStatus);
  //-aqui termina filteredReservations-//

  const isToday = selectedDate === today;
  const dateLabel = isToday ? `Hoy, ${formatDateLabel(today)}` : formatDateLabel(selectedDate);
  const selectedDateObj = new Date(`${selectedDate}T12:00:00`);

  return (
    <>
      {/* Barra de filtros */}
      <section className="flex flex-wrap items-center gap-4 rounded-2xl bg-surface-container-low p-4 shadow-sm">

        {/* Selector de fecha */}
        <div ref={datePickerRef} className="relative min-w-[220px] flex-1">
          <button
            type="button"
            onClick={() => setDatePickerOpen((prev) => !prev)}
            className="flex w-full cursor-pointer items-center gap-3 rounded-lg bg-surface-container-lowest px-4 py-2.5"
            aria-expanded={datePickerOpen}
            aria-label="Seleccionar fecha"
          >
            <OnboardingIcon name="schedule" className="h-5 w-5 shrink-0 text-on-surface-variant" />
            <span className={`text-sm font-semibold ${isPending ? "opacity-50" : "text-on-surface"}`}>{dateLabel}</span>
            {isPending
              ? <span className="ml-auto h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              : <OnboardingIcon name="expandMore" className="ml-auto h-4 w-4 shrink-0 text-on-surface-variant" />
            }
          </button>

          {datePickerOpen && (
            <div className="absolute left-0 top-full z-50 mt-1 rounded-xl bg-surface-container-lowest shadow-lg">
              <DayPicker
                mode="single"
                selected={selectedDateObj}
                onSelect={handleDaySelect}
                locale={es}
                defaultMonth={selectedDateObj}
              />
            </div>
          )}
        </div>

        {/* Selector de estado */}
        <div className="flex min-w-[160px] items-center gap-2 rounded-lg bg-surface-container-lowest px-4 py-2.5">
          <span className="text-sm font-medium text-on-surface-variant">Estado:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as ReservationStatus | "ALL")}
            className="flex-1 bg-transparent text-sm font-semibold text-on-surface outline-none cursor-pointer"
            aria-label="Filtrar por estado"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

      </section>

      {/* Tabla filtrada */}
      <ReservationsLedger
        reservations={filteredReservations}
        onEdit={setEditingReservation}
        onStatusChange={handleStatusChange}
      />

      {/* Modal de edición */}
      <EditReservationModal
        reservation={editingReservation}
        onClose={() => setEditingReservation(null)}
      />
    </>
  );
}
//-aqui termina componente ReservationsFilterSection-//
