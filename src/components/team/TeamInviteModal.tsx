/**
 * Archivo: TeamInviteModal.tsx
 * Responsabilidad: Modal de invitación de miembro al equipo — captura email y rol, llama al server action.
 * Tipo: UI
 */

"use client";

import { useRef, useState, useTransition } from "react";
import { T } from "@/components/T";

const ASSIGNABLE_ROLES = [
  { value: "MANAGER",       label: "Gerente"  },
  { value: "STAFF_WAITER",  label: "Camarero" },
  { value: "STAFF_KITCHEN", label: "Cocina"   },
  { value: "STAFF_BAR",     label: "Barra"    },
] as const;

interface TeamInviteModalProps {
  inviteAction: (formData: FormData) => Promise<{ error?: string }>;
}

//-aqui empieza componente TeamInviteModal y es para capturar email+rol y enviar la invitacion-//
/**
 * Modal controlado con estado local. Abre/cierra sin navegación.
 * @sideEffect — llama a inviteAction (server action)
 */
export function TeamInviteModal({ inviteAction }: TeamInviteModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleOpen() {
    setError(null);
    setSuccess(false);
    setIsOpen(true);
  }

  function handleClose() {
    if (isPending) return;
    setIsOpen(false);
    setError(null);
    setSuccess(false);
    formRef.current?.reset();
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await inviteAction(formData);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        formRef.current?.reset();
      }
    });
  }

  return (
    <>
      <button
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-on-primary transition-colors hover:opacity-90"
        onClick={handleOpen}
        type="button"
      >
        <T>Invitar miembro</T>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
        >
          <div className="w-full max-w-md rounded-[28px] bg-surface-container-lowest p-8 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black tracking-tight text-primary">
                <T>Invitar al equipo</T>
              </h2>
              <button
                aria-label="Cerrar"
                className="rounded-full p-1.5 text-on-surface-variant hover:bg-surface-container-high"
                onClick={handleClose}
                type="button"
              >
                ✕
              </button>
            </div>
            <p className="mt-1 text-sm text-on-surface-variant">
              <T>El invitado recibirá un email con un enlace para unirse al restaurante.</T>
            </p>

            {success ? (
              <div className="mt-6 rounded-2xl bg-secondary-container px-5 py-4 text-sm font-semibold text-on-secondary-container">
                <T>Invitación enviada correctamente. El enlace expira en 48 horas.</T>
              </div>
            ) : (
              <form className="mt-6 space-y-4" onSubmit={handleSubmit} ref={formRef}>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.18em] text-on-surface-variant" htmlFor="invite-email">
                    <T>Email</T>
                  </label>
                  <input
                    className="mt-2 w-full rounded-xl border border-outline-variant/30 bg-surface-container-low px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/40"
                    id="invite-email"
                    name="email"
                    placeholder="nombre@ejemplo.com"
                    required
                    type="email"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.18em] text-on-surface-variant" htmlFor="invite-role">
                    <T>Rol</T>
                  </label>
                  <select
                    className="mt-2 w-full rounded-xl border border-outline-variant/30 bg-surface-container-low px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                    defaultValue="STAFF_WAITER"
                    id="invite-role"
                    name="role"
                  >
                    {ASSIGNABLE_ROLES.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>

                {error !== null && (
                  <p className="rounded-xl bg-error/10 px-4 py-3 text-sm font-semibold text-error">
                    {error}
                  </p>
                )}

                <button
                  className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-bold text-on-primary transition-opacity hover:opacity-90 disabled:opacity-50"
                  disabled={isPending}
                  type="submit"
                >
                  {isPending ? <T>Enviando…</T> : <T>Enviar invitación</T>}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
//-aqui termina componente TeamInviteModal-//
