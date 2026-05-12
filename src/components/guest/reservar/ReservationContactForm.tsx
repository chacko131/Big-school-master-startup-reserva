"use client";

/**
 * Archivo: ReservationContactForm.tsx
 * Responsabilidad: Sección 4 del flujo — campos de contacto del guest y botón de confirmación.
 *   Recibe el onSubmit del orquestador ReservationForm y muestra errores / slots alternativos.
 * Tipo: UI
 */

import { T } from "@/components/T";

// ─── Props ────────────────────────────────────────────────────────────────────

interface ReservationContactFormProps {
  isPending: boolean;
  submitError: string | null;
  alternativeSlots: string[];
  selectedAlternative: string | null;
  onSelectAlternative: (slot: string) => void;
  onSubmit: (formData: FormData) => void;
}

//-aqui empieza componente ReservationContactForm y es para recoger datos de contacto y confirmar la reserva-//
/**
 * @sideEffect — llama onSubmit con FormData al confirmar
 */
export function ReservationContactForm({
  isPending,
  submitError,
  alternativeSlots,
  selectedAlternative,
  onSelectAlternative,
  onSubmit,
}: ReservationContactFormProps) {
  //-aqui empieza funcion handleSubmit y es para prevenir el default y pasar FormData al orquestador-//
  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    onSubmit(new FormData(e.currentTarget));
  }
  //-aqui termina funcion handleSubmit-//

  return (
    <section className="space-y-8 border-t border-zinc-200 pt-8">
      <div className="flex items-center gap-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-on-primary">
          4
        </span>
        <h2 className="font-headline text-2xl font-bold">
          <T>Datos de Contacto</T>
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="cf-name" className="px-1 text-sm font-semibold text-on-surface">
              <T>Nombre completo</T>
            </label>
            <input
              id="cf-name"
              name="guestFullName"
              required
              className="h-14 w-full rounded-xl border bg-surface-container-highest px-6 transition-all focus:ring-2 focus:ring-primary border-slate-100"
              placeholder="Ej. Juan Pérez"
              type="text"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="cf-phone" className="px-1 text-sm font-semibold text-on-surface">
              <T>Teléfono</T>
            </label>
            <input
              id="cf-phone"
              name="guestPhone"
              required
              className="h-14 w-full rounded-xl border bg-surface-container-highest px-6 transition-all focus:ring-2 focus:ring-primary border-slate-100"
              placeholder="+52 55..."
              type="tel"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="cf-email" className="px-1 text-sm font-semibold text-on-surface">
            <T>Email (opcional)</T>
          </label>
          <input
            id="cf-email"
            name="guestEmail"
            className="h-14 w-full rounded-xl border bg-surface-container-highest px-6 transition-all focus:ring-2 focus:ring-primary border-slate-100"
            placeholder="email@ejemplo.com"
            type="email"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="cf-notes" className="px-1 text-sm font-semibold text-on-surface">
            <T>Notas o Peticiones Especiales</T>
          </label>
          <textarea
            id="cf-notes"
            name="specialRequests"
            className="min-h-32 w-full resize-none rounded-xl border bg-surface-container-highest p-6 transition-all focus:ring-2 focus:ring-primary border-slate-100"
            placeholder="Cuéntanos si celebras algo o tienes alguna alergia..."
            rows={4}
          />
        </div>

        {/* Error de submit */}
        {submitError !== null && (
          <div className="rounded-xl border border-error/30 bg-error/10 px-5 py-4 text-sm font-medium text-error">
            <p>{submitError}</p>
            {alternativeSlots.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-bold uppercase tracking-wide opacity-80">
                  <T>Horarios disponibles cercanos:</T>
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {alternativeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => onSelectAlternative(slot)}
                      className={`rounded-lg px-3 py-1.5 text-sm font-bold transition-colors ${
                        selectedAlternative === slot
                          ? "bg-primary text-on-primary"
                          : "bg-error/20 text-error ring-1 ring-error/30 hover:bg-error/30"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
                {selectedAlternative !== null && (
                  <p className="mt-2 text-xs opacity-70">
                    <T>Seleccionado:</T> <strong>{selectedAlternative}</strong> — <T>pulsa Confirmar para reservar.</T>
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        <div className="pt-6">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-12 py-5 font-headline text-xl font-extrabold text-on-primary transition-transform active:scale-95 md:w-auto shadow-xl shadow-primary/30 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? <T>Confirmando...</T> : <T>Confirmar Reserva</T>}
          </button>
          <p className="mt-4 text-center text-xs text-on-surface/60 md:text-left">
            <T>Al reservar, aceptas nuestras políticas de cancelación y términos de servicio.</T>
          </p>
        </div>
      </form>
    </section>
  );
}
//-aqui termina componente ReservationContactForm-//
