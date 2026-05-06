/**
 * Archivo: NewReservationModal.tsx
 * Responsabilidad: Modal para crear una nueva reserva desde el dashboard.
 * Tipo: UI
 */

"use client";

import { useRef, useState, useTransition } from "react";
import { T } from "@/components/T";
import { OnboardingIcon } from "@/components/onboarding/OnboardingIcon";
import {
  createReservationAction,
  type CreateReservationActionResult,
} from "@/app/(dashboard)/dashboard/reservations/actions";

interface NewReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

//-aqui empieza componente NewReservationModal y es para capturar los datos de una nueva reserva-//
/**
 * Modal con formulario para crear una reserva desde el dashboard.
 * @sideEffect
 */
export function NewReservationModal({ isOpen, onClose }: NewReservationModalProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<CreateReservationActionResult | null>(null);

  if (!isOpen) {
    return null;
  }

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const actionResult = await createReservationAction(formData);
      setResult(actionResult);

      if (actionResult.success) {
        formRef.current?.reset();
        setTimeout(() => {
          setResult(null);
          onClose();
        }, 1500);
      }
    });
  }

  function handleClose() {
    setResult(null);
    onClose();
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} aria-hidden="true" />

      <div className="relative w-full max-w-lg rounded-2xl bg-surface-container-lowest p-8 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black tracking-tight text-primary">
            <T>Nueva reserva</T>
          </h2>
          <button className="rounded-lg p-2 transition-colors hover:bg-surface-container-high" onClick={handleClose} type="button" aria-label="Cerrar">
            <OnboardingIcon name="close" className="h-5 w-5 text-on-surface-variant" />
          </button>
        </div>

        {result?.success && (
          <div className="mt-4 rounded-xl bg-secondary-container p-4 text-sm font-bold text-on-secondary-container">
            <T>Reserva creada correctamente.</T>
          </div>
        )}

        {result?.error && (
          <div className="mt-4 rounded-xl bg-error-container p-4 text-sm font-bold text-on-error-container">
            {result.error}
          </div>
        )}

        <form ref={formRef} action={handleSubmit} className="mt-6 space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="guestFullName" className="text-xs font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                <T>Nombre completo *</T>
              </label>
              <input
                id="guestFullName"
                name="guestFullName"
                type="text"
                required
                className="mt-2 w-full rounded-lg border border-outline-variant/20 bg-surface-container-lowest px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none"
                placeholder="Ej: María López"
              />
            </div>

            <div>
              <label htmlFor="guestPhone" className="text-xs font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                <T>Teléfono *</T>
              </label>
              <input
                id="guestPhone"
                name="guestPhone"
                type="tel"
                required
                className="mt-2 w-full rounded-lg border border-outline-variant/20 bg-surface-container-lowest px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none"
                placeholder="+34 612 345 678"
              />
            </div>
          </div>

          <div>
            <label htmlFor="guestEmail" className="text-xs font-bold uppercase tracking-[0.18em] text-on-surface-variant">
              <T>Email (opcional)</T>
            </label>
            <input
              id="guestEmail"
              name="guestEmail"
              type="email"
              className="mt-2 w-full rounded-lg border border-outline-variant/20 bg-surface-container-lowest px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none"
              placeholder="email@ejemplo.com"
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div>
              <label htmlFor="partySize" className="text-xs font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                <T>Personas *</T>
              </label>
              <input
                id="partySize"
                name="partySize"
                type="number"
                min="1"
                max="20"
                required
                defaultValue="2"
                className="mt-2 w-full rounded-lg border border-outline-variant/20 bg-surface-container-lowest px-4 py-3 text-sm text-on-surface focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="date" className="text-xs font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                <T>Fecha *</T>
              </label>
              <input
                id="date"
                name="date"
                type="date"
                required
                defaultValue={today}
                className="mt-2 w-full rounded-lg border border-outline-variant/20 bg-surface-container-lowest px-4 py-3 text-sm text-on-surface focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="time" className="text-xs font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                <T>Hora *</T>
              </label>
              <input
                id="time"
                name="time"
                type="time"
                required
                defaultValue="20:00"
                className="mt-2 w-full rounded-lg border border-outline-variant/20 bg-surface-container-lowest px-4 py-3 text-sm text-on-surface focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label htmlFor="specialRequests" className="text-xs font-bold uppercase tracking-[0.18em] text-on-surface-variant">
              <T>Peticiones especiales</T>
            </label>
            <textarea
              id="specialRequests"
              name="specialRequests"
              rows={2}
              className="mt-2 w-full resize-none rounded-lg border border-outline-variant/20 bg-surface-container-lowest px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none"
              placeholder="Alergias, celebración, preferencia de mesa..."
            />
          </div>

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
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-on-primary transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isPending ? (
                <T>Creando...</T>
              ) : (
                <>
                  <OnboardingIcon name="checkCircle" className="h-4 w-4" />
                  <T>Crear reserva</T>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
//-aqui termina componente NewReservationModal-//
