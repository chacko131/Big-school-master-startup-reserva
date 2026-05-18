/**
 * Archivo: TeamInvitationPanel.tsx
 * Responsabilidad: Mostrar invitaciones pendientes reales del restaurante.
 * Tipo: UI
 */

import { T } from "@/components/T";
import { OnboardingIcon } from "@/components/onboarding/OnboardingIcon";
import { type PendingTeamInvitationView } from "@/modules/users/application/use-cases/GetPendingTeamInvitations/get-pending-team-invitations.use-case";

interface TeamInvitationPanelProps {
  invitations: ReadonlyArray<PendingTeamInvitationView>;
}

//-aqui empieza componente TeamInvitationPanel y es para listar accesos pendientes y enviar nuevas invitaciones-//
/**
 * Renderiza las invitaciones pendientes del equipo y el botón de acción.
 *
 * @pure
 */
export function TeamInvitationPanel({ invitations }: TeamInvitationPanelProps) {
  const hasInvitations = invitations.length > 0;

  return (
    <section className="rounded-[28px] bg-surface-container-lowest p-8 shadow-sm">
      <h3 className="text-xl font-black tracking-tight text-primary md:text-2xl">
        <T>Invitaciones pendientes</T>
      </h3>
      <p className="mt-1 text-sm text-on-surface-variant">
        <T>Invitaciones activas que todavía no han sido aceptadas por sus destinatarios.</T>
      </p>

      <div className="mt-6 space-y-4">
        {hasInvitations ? (
          invitations.map((invitation) => (
            <article
              className="flex items-start justify-between gap-4 rounded-2xl bg-surface-container-low px-5 py-4"
              key={invitation.id}
            >
              <div>
                <p className="text-sm font-bold text-on-surface">{invitation.email}</p>
                <p className="mt-1 text-xs text-on-surface-variant">
                  <T>{invitation.role}</T>
                </p>
                <p className="mt-1 text-[11px] text-on-surface-variant/80">
                  <T>Expira el</T>{" "}
                  {invitation.expiresAt.toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </p>
              </div>
              <span className="inline-flex rounded-full bg-tertiary-fixed px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-on-tertiary-fixed">
                <T>{invitation.status}</T>
              </span>
            </article>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-outline-variant/30 bg-surface-container-low px-5 py-6 text-sm text-on-surface-variant">
            <T>No hay invitaciones pendientes en este momento.</T>
          </div>
        )}
      </div>

      <button
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-bold text-on-primary transition-opacity hover:opacity-90"
        type="button"
      >
        <OnboardingIcon name="arrowForward" className="h-4 w-4" />
        <T>Enviar invitación</T>
      </button>
    </section>
  );
}
//-aqui termina componente TeamInvitationPanel-//
