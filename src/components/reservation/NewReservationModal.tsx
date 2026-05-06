/**
 * Archivo: NewReservationModal.tsx
 * Responsabilidad: Modal para crear una nueva reserva desde el dashboard.
 * Tipo: UI
 */

"use client";

import { useState, useTransition } from "react";
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
interface FormData {
  guestFullName: string;
  guestPhone: string;
  guestEmail: string;
  partySize: string;
  date: string;
  time: string;
  specialRequests: string;
}

function getInitialFormData(): FormData {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return {
    guestFullName: "",
    guestPhone: "",
    guestEmail: "",
    partySize: "2",
    date: `${year}-${month}-${day}`,
    time: "20:00",
    specialRequests: "",
  };
}

export function NewReservationModal({ isOpen, onClose }: NewReservationModalProps) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<CreateReservationActionResult | null>(null);
  const [selectedAlternative, setSelectedAlternative] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(getInitialFormData);

  if (!isOpen) {
    return null;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const submitData = new FormData();
    submitData.set("guestFullName", formData.guestFullName);
    submitData.set("guestPhone", formData.guestPhone);
    submitData.set("guestEmail", formData.guestEmail);
    submitData.set("partySize", formData.partySize);
    submitData.set("date", formData.date);
    submitData.set("time", selectedAlternative ?? formData.time);
    submitData.set("specialRequests", formData.specialRequests);

    startTransition(async () => {
      const actionResult = await createReservationAction(submitData);
      setResult(actionResult);

      if (actionResult.success) {
        setFormData(getInitialFormData());
        setSelectedAlternative(null);
        setTimeout(() => {
          setResult(null);
          onClose();
        }, 1500);
      }
      // En caso de error: NO limpiamos formData para preservar los datos
    });
  }

  function handleChange(field: keyof FormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpiar alternativa seleccionada si cambian fecha u hora
    if (field === "date" || field === "time") {
      setSelectedAlternative(null);
    }
  }

  function handleClose() {
    setResult(null);
    setSelectedAlternative(null);
    setFormData(getInitialFormData());
    onClose();
  }

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
          <div className="mt-4 rounded-xl bg-error-container p-4 text-on-error-container">
            <p className="text-sm font-bold">{result.error}</p>

            {result.alternativeSlots && result.alternativeSlots.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-bold uppercase tracking-[0.15em] opacity-80">
                  <T>Horarios disponibles cercanos:</T>
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {result.alternativeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedAlternative(slot)}
                      className={`rounded-lg px-3 py-1.5 text-sm font-bold transition-colors ${
                        selectedAlternative === slot
                          ? "bg-primary text-on-primary"
                          : "bg-error-container/60 text-on-error-container ring-1 ring-on-error-container/30 hover:bg-on-error-container/10"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
                {selectedAlternative !== null && (
                  <p className="mt-2 text-xs opacity-70">
                    <T>Seleccionado:</T> <strong>{selectedAlternative}</strong> — <T>pulsa &ldquo;Crear reserva&rdquo; para confirmar.</T>
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
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
                value={formData.guestFullName}
                onChange={(e) => handleChange("guestFullName", e.target.value)}
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
                value={formData.guestPhone}
                onChange={(e) => handleChange("guestPhone", e.target.value)}
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
              value={formData.guestEmail}
              onChange={(e) => handleChange("guestEmail", e.target.value)}
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
                value={formData.partySize}
                onChange={(e) => handleChange("partySize", e.target.value)}
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
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
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
                value={selectedAlternative ?? formData.time}
                onChange={(e) => handleChange("time", e.target.value)}
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
              value={formData.specialRequests}
              onChange={(e) => handleChange("specialRequests", e.target.value)}
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
