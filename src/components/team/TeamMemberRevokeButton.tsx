/**
 * Archivo: TeamMemberRevokeButton.tsx
 * Responsabilidad: Botón de eliminar miembro con confirmación nativa del navegador.
 * Tipo: UI
 */

"use client";

import { T } from "@/components/T";

interface TeamMemberRevokeButtonProps {
  membershipId: string;
  memberName: string;
  memberStatus: "ACTIVE" | "PENDING" | "REVOKED";
  revokeAction: (formData: FormData) => Promise<void>;
  reactivateAction: (formData: FormData) => Promise<void>;
  deletePermanentlyAction: (formData: FormData) => Promise<void>;
}

//-aqui empieza componente TeamMemberRevokeButton y es para confirmar y ejecutar la eliminacion de un miembro-//
/**
 * Muestra un confirm nativo antes de enviar el form de revocación.
 * @sideEffect — llama a revokeAction (server action)
 */
export function TeamMemberRevokeButton({
  membershipId,
  memberName,
  memberStatus,
  revokeAction,
  reactivateAction,
  deletePermanentlyAction,
}: TeamMemberRevokeButtonProps) {
  //-aqui empieza funcion handleSubmit y es para confirmar y enviar el form real de revocacion-//
  /**
   * Confirma en cliente antes de dejar que el form dispare el Server Action.
   * @sideEffect
   */
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const confirmed = confirm(`¿Eliminar a ${memberName} del equipo? Esta acción revocará su acceso al restaurante.`);

    if (!confirmed) {
      event.preventDefault();
      return;
    }
  }
  //-aqui termina funcion handleSubmit-//

  //-aqui empieza funcion handleReactivateSubmit y es para confirmar la reactivacion del miembro-//
  /**
   * Confirma antes de reactivar una membership revocada.
   * @sideEffect
   */
  function handleReactivateSubmit(event: React.FormEvent<HTMLFormElement>) {
    const confirmed = confirm(`¿Reactivar a ${memberName} y devolverle el acceso al restaurante?`);

    if (!confirmed) {
      event.preventDefault();
      return;
    }
  }
  //-aqui termina funcion handleReactivateSubmit-//

  //-aqui empieza funcion handleDeletePermanentSubmit y es para confirmar el borrado permanente-//
  /**
   * Confirma antes de borrar permanentemente una membership revocada.
   * @sideEffect
   */
  function handleDeletePermanentSubmit(event: React.FormEvent<HTMLFormElement>) {
    const confirmed = confirm(
      `¿Eliminar permanentemente a ${memberName}? Esta acción no se puede deshacer.`
    );

    if (!confirmed) {
      event.preventDefault();
      return;
    }
  }
  //-aqui termina funcion handleDeletePermanentSubmit-//

  if (memberStatus === "REVOKED") {
    return (
      <div className="flex items-center gap-2">
        <form action={reactivateAction} onSubmit={handleReactivateSubmit}>
          <input name="membershipId" type="hidden" value={membershipId} />
          <button
            className="rounded-lg bg-secondary-container px-3 py-1.5 text-xs font-semibold text-on-secondary-container transition-colors hover:opacity-90"
            type="submit"
          >
            <T>Reactivar</T>
          </button>
        </form>

        <form action={deletePermanentlyAction} onSubmit={handleDeletePermanentSubmit}>
          <input name="membershipId" type="hidden" value={membershipId} />
          <button
            className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-error hover:bg-error/10 transition-colors"
            type="submit"
          >
            <T>Eliminar permanente</T>
          </button>
        </form>
      </div>
    );
  }

  return (
    <form action={revokeAction} onSubmit={handleSubmit}>
      <input name="membershipId" type="hidden" value={membershipId} />
      <button
        className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-error hover:bg-error/10 transition-colors"
        type="submit"
      >
        <T>Eliminar</T>
      </button>
    </form>
  );
}
//-aqui termina componente TeamMemberRevokeButton-//
