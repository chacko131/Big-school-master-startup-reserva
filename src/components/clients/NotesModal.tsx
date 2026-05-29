/**
 * Archivo: NotesModal.tsx
 * Responsabilidad: Renderizar un modal interactivo con todas las notas históricas del comensal.
 * Tipo: UI (Client Component)
 */

"use client";

import { type GuestCrmPrimitives } from "@/modules/reservations/application/dtos/guest-crm.dto";
import { T } from "@/components/T";

export interface NotesModalProps {
  guest: GuestCrmPrimitives;
  onClose: () => void;
}

//-aqui empieza componente NotesModal y es para mostrar el historial de notas del cliente-//
/**
 * Renderiza el modal de revisión de notas históricas de reservas y notas del perfil.
 *
 * @pure
 */
export function NotesModal({ guest, onClose }: NotesModalProps) {
  const formattedDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-ES", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Fondo translúcido del modal (Glassmorphism) */}
      <div
        className="absolute inset-0 bg-black/45 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Contenedor del modal */}
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-[28px] bg-surface-container-lowest shadow-2xl border border-outline-variant/10 flex flex-col max-h-[85vh]">
        
        {/* Cabecera */}
        <header className="border-b border-outline-variant/10 bg-surface-container-low px-6 py-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
              <T>Revisar notas</T>
            </p>
            <h3 className="mt-1 text-xl font-black text-primary truncate max-w-[280px] sm:max-w-md">
              {guest.fullName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-surface-container-highest/60 p-2 text-on-surface-variant hover:bg-surface-container-highest transition-colors"
            type="button"
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        </header>

        {/* Contenido scrolleable */}
        <main className="overflow-y-auto p-6 space-y-6 flex-1">
          {/* Nota de ficha permanente */}
          {guest.notes && guest.notes.trim().length > 0 && (
            <section className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-secondary">
                <T>Nota en ficha permanente</T>
              </h4>
              <div className="rounded-2xl bg-secondary-container/30 border border-secondary-container/40 p-4 text-sm text-on-secondary-container leading-relaxed">
                {guest.notes}
              </div>
            </section>
          )}

          {/* Notas de historial de reservas */}
          <section className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-on-surface-variant">
              <T>Comentarios en reservas anteriores</T>
            </h4>

            {guest.historicalNotes.length === 0 ? (
              <p className="text-sm italic text-on-surface-variant/50 p-2">
                <T>No se registran peticiones especiales en visitas previas.</T>
              </p>
            ) : (
              <div className="space-y-4">
                {guest.historicalNotes.map((note, idx) => (
                  <article
                    key={`${note.startAt.toString()}-${idx}`}
                    className="flex flex-col gap-2 rounded-2xl bg-surface-container-low border border-outline-variant/5 p-4"
                  >
                    <time className="text-[10px] font-bold uppercase tracking-[0.12em] text-on-surface-variant/75">
                      {formattedDate(note.startAt)}
                    </time>
                    <p className="text-sm text-on-surface leading-relaxed whitespace-pre-line">
                      {note.specialRequests}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-outline-variant/10 bg-surface-container-low px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-on-primary transition-opacity hover:opacity-90"
            type="button"
          >
            <T>Entendido</T>
          </button>
        </footer>
      </div>
    </div>
  );
}
//-aqui termina componente NotesModal-//
