/**
 * Archivo: ReservationStatusSelect.tsx
 * Responsabilidad: Selector de estado de reserva con feedback visual e integración con server action.
 * Tipo: UI
 */

"use client";

import { useState, useTransition } from "react";
import { type ReservationStatus } from "@/modules/reservations/domain/entities/reservation.entity";
import {
  updateReservationStatusAction,
} from "@/app/(dashboard)/dashboard/reservations/actions";

interface ReservationStatusSelectProps {
  reservationId: string;
  currentStatus: ReservationStatus;
}

interface StatusOption {
  value: ReservationStatus;
  label: string;
}

//-aqui empieza funcion getAvailableTransitions y es para calcular los estados destino válidos según el estado actual-//
/**
 * Devuelve las transiciones válidas desde el estado actual según el dominio.
 * @pure
 */
function getAvailableTransitions(current: ReservationStatus): StatusOption[] {
  switch (current) {
    case "PENDING":
      return [
        { value: "CONFIRMED", label: "Confirmar" },
        { value: "CANCELLED", label: "Cancelar" },
      ];
    case "CONFIRMED":
      return [
        { value: "CHECKED_IN", label: "Check-in" },
        { value: "NO_SHOW", label: "No-show" },
        { value: "CANCELLED", label: "Cancelar" },
      ];
    case "CHECKED_IN":
      return [
        { value: "COMPLETED", label: "Completar" },
      ];
    case "WAITLISTED":
      return [
        { value: "CONFIRMED", label: "Confirmar" },
        { value: "CANCELLED", label: "Cancelar" },
      ];
    case "COMPLETED":
    case "CANCELLED":
    case "NO_SHOW":
      return [];
    default:
      return [];
  }
}
//-aqui termina funcion getAvailableTransitions-//

//-aqui empieza componente ReservationStatusSelect y es para cambiar el estado de una reserva desde el ledger-//
/**
 * Selector de estado inline que dispara una server action al cambiar.
 * @sideEffect
 */
export function ReservationStatusSelect({
  reservationId,
  currentStatus,
}: ReservationStatusSelectProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const transitions = getAvailableTransitions(currentStatus);

  if (transitions.length === 0) {
    return null;
  }

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const targetStatus = event.target.value;

    if (targetStatus === "") return;

    setError(null);

    startTransition(async () => {
      const result = await updateReservationStatusAction(reservationId, targetStatus);

      if (!result.success) {
        setError(result.error ?? "Error al actualizar el estado.");
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <select
        onChange={handleChange}
        disabled={isPending}
        defaultValue=""
        aria-label="Cambiar estado de reserva"
        className="rounded-lg border border-outline-variant/20 bg-surface-container-low px-2 py-1.5 text-xs font-bold text-on-surface transition-opacity focus:border-primary focus:outline-none disabled:opacity-50"
      >
        <option value="" disabled>
          Cambiar…
        </option>
        {transitions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error !== null && (
        <p className="max-w-[160px] text-right text-[10px] font-bold text-error">
          {error}
        </p>
      )}
    </div>
  );
}
//-aqui termina componente ReservationStatusSelect-//
