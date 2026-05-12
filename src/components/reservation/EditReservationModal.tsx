"use client";

/**
 * Archivo: EditReservationModal.tsx
 * Responsabilidad: Modal para editar una reserva existente desde el dashboard.
 *   Precarga los datos actuales de la reserva y llama a updateReservationAction.
 * Tipo: UI
 */

import { useState, useTransition, useEffect } from "react";
import { T } from "@/components/T";
import { OnboardingIcon } from "@/components/onboarding/OnboardingIcon";
import {
  updateReservationAction,
  type UpdateReservationActionResult,
} from "@/app/(dashboard)/dashboard/reservations/actions";
import { type ReservationRowData } from "@/components/reservation/ReservationsLedger";

// ─── Tipos locales ────────────────────────────────────────────────────────────

interface EditFormData {
  partySize: string;
  date: string;
  time: string;
  specialRequests: string;
  internalNotes: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

//-aqui empieza funcion toDateInputValue y es para convertir un Date en YYYY-MM-DD para el input date-//
/** @pure */
function toDateInputValue(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
//-aqui termina funcion toDateInputValue-//

//-aqui empieza funcion toTimeInputValue y es para convertir un Date en HH:MM para el input time-//
/** @pure */
function toTimeInputValue(date: Date): string {
  const h = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${h}:${min}`;
}
//-aqui termina funcion toTimeInputValue-//

//-aqui empieza funcion buildInitialFormData y es para inicializar el formulario con los datos de la reserva-//
/** @pure */
function buildInitialFormData(reservation: ReservationRowData): EditFormData {
  return {
    partySize: String(reservation.partySize),
    date: toDateInputValue(reservation.startAt),
    time: toTimeInputValue(reservation.startAt),
    specialRequests: reservation.specialRequests ?? "",
    internalNotes: "",
  };
}
//-aqui termina funcion buildInitialFormData-//

// ─── Props ────────────────────────────────────────────────────────────────────

interface EditReservationModalProps {
  reservation: ReservationRowData | null;
  onClose: () => void;
}

// ─── Componente ───────────────────────────────────────────────────────────────

//-aqui empieza componente EditReservationModal y es para editar una reserva existente con sus datos precargados-//
/**
 * Modal con formulario precargado para editar una reserva.
 * Visible cuando reservation !== null.
 * @sideEffect
 */
export function EditReservationModal({ reservation, onClose }: EditReservationModalProps) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<UpdateReservationActionResult | null>(null);
  const [autoClose, setAutoClose] = useState(false);
  const [formData, setFormData] = useState<EditFormData>(() =>
    reservation !== null ? buildInitialFormData(reservation) : { partySize: "2", date: "", time: "", specialRequests: "", internalNotes: "" }
  );

  //-aqui empieza useEffect y es para cerrar automaticamente el modal tras exito con cleanup-//
  useEffect(() => {
    if (!autoClose) return;
    const timerId = setTimeout(() => {
      setResult(null);
      setAutoClose(false);
      onClose();
    }, 1200);
    return () => clearTimeout(timerId);
  }, [autoClose, onClose]);
  //-aqui termina useEffect-//

  if (reservation === null) return null;

  const reservationId = reservation.id;

  //-aqui empieza funcion handleChange y es para actualizar el estado del formulario campo a campo-//
  function handleChange(field: keyof EditFormData, value: string): void {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }
  //-aqui termina funcion handleChange-//

  //-aqui empieza funcion handleSubmit y es para enviar el formulario de edicion a la server action-//
  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();

    const submitData = new FormData();
    submitData.set("partySize", formData.partySize);
    submitData.set("date", formData.date);
    submitData.set("time", formData.time);
    submitData.set("specialRequests", formData.specialRequests);
    submitData.set("internalNotes", formData.internalNotes);

    void updateReservationAction(reservationId, submitData).then((actionResult) => {
      startTransition(() => {
        setResult(actionResult);
        if (actionResult.success) {
          setAutoClose(true);
        }
      });
    });
  }
  //-aqui termina funcion handleSubmit-//

  //-aqui empieza funcion handleClose y es para cerrar el modal y limpiar el estado-//
  function handleClose(): void {
    setResult(null);
    onClose();
  }
  //-aqui termina funcion handleClose-//

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-lg rounded-2xl bg-surface-container-lowest p-8 shadow-xl">
        {/* Cabecera */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-black tracking-tight text-primary">
              <T>Editar reserva</T>
            </h2>
            <p className="mt-1 text-sm text-on-surface-variant">
              {reservation.guestFullName} · {reservation.guestPhone}
            </p>
          </div>
          <button
            className="rounded-lg p-2 transition-colors hover:bg-surface-container-high"
            onClick={handleClose}
            type="button"
            aria-label="Cerrar"
          >
            <OnboardingIcon name="close" className="h-5 w-5 text-on-surface-variant" />
          </button>
        </div>

        {/* Feedback */}
        {result?.success && (
          <div className="mt-4 rounded-xl bg-secondary-container p-4 text-sm font-bold text-on-secondary-container">
            <T>Reserva actualizada correctamente.</T>
          </div>
        )}
        {result?.error !== undefined && result.error.length > 0 && (
          <div className="mt-4 rounded-xl bg-error-container p-4 text-sm font-bold text-on-error-container">
            {result.error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Personas */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div>
              <label htmlFor="edit-partySize" className="text-xs font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                <T>Personas *</T>
              </label>
              <input
                id="edit-partySize"
                name="partySize"
                type="number"
                min="1"
                max="20"
                required
                value={formData.partySize}
                onChange={(e) => handleChange("partySize", e.target.value)}
                className="mt-2 w-full rounded-lg border border-outline-variant/20 bg-surface-container-lowest px-4 py-3 text-sm text-on-surface focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="edit-date" className="text-xs font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                <T>Fecha *</T>
              </label>
              <input
                id="edit-date"
                name="date"
                type="date"
                required
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
                className="mt-2 w-full rounded-lg border border-outline-variant/20 bg-surface-container-lowest px-4 py-3 text-sm text-on-surface focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="edit-time" className="text-xs font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                <T>Hora *</T>
              </label>
              <input
                id="edit-time"
                name="time"
                type="time"
                required
                value={formData.time}
                onChange={(e) => handleChange("time", e.target.value)}
                className="mt-2 w-full rounded-lg border border-outline-variant/20 bg-surface-container-lowest px-4 py-3 text-sm text-on-surface focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Peticiones especiales */}
          <div>
            <label htmlFor="edit-specialRequests" className="text-xs font-bold uppercase tracking-[0.18em] text-on-surface-variant">
              <T>Peticiones especiales</T>
            </label>
            <textarea
              id="edit-specialRequests"
              name="specialRequests"
              rows={2}
              value={formData.specialRequests}
              onChange={(e) => handleChange("specialRequests", e.target.value)}
              className="mt-2 w-full resize-none rounded-lg border border-outline-variant/20 bg-surface-container-lowest px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none"
              placeholder="Alergias, celebración, preferencia de mesa..."
            />
          </div>

          {/* Notas internas */}
          <div>
            <label htmlFor="edit-internalNotes" className="text-xs font-bold uppercase tracking-[0.18em] text-on-surface-variant">
              <T>Notas internas</T>
            </label>
            <textarea
              id="edit-internalNotes"
              name="internalNotes"
              rows={2}
              value={formData.internalNotes}
              onChange={(e) => handleChange("internalNotes", e.target.value)}
              className="mt-2 w-full resize-none rounded-lg border border-outline-variant/20 bg-surface-container-lowest px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none"
              placeholder="Solo visible para el equipo del restaurante..."
            />
          </div>

          {/* Acciones */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg bg-surface-container-highest px-5 py-2.5 text-sm font-bold text-on-surface transition-colors hover:bg-surface-container-high"
            >
              <T>Cancelar</T>
            </button>
            <button
              type="submit"
              disabled={isPending || result?.success === true}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-on-primary transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isPending ? (
                <T>Guardando...</T>
              ) : (
                <>
                  <OnboardingIcon name="checkCircle" className="h-4 w-4" />
                  <T>Guardar cambios</T>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
//-aqui termina componente EditReservationModal-//
