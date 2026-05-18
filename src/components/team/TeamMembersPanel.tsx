/**
 * Archivo: TeamMembersPanel.tsx
 * Responsabilidad: Listar los miembros del equipo con su rol y estado real desde DB.
 * Tipo: UI
 */

import { T } from "@/components/T";
import { OnboardingIcon } from "@/components/onboarding/OnboardingIcon";
import { type TeamMemberView } from "@/modules/users/application/use-cases/GetRestaurantTeam/get-restaurant-team.use-case";
import { TeamMemberRoleSelect, type MembershipRoleOption } from "@/components/team/TeamMemberRoleSelect";
import { TeamMemberRevokeButton } from "@/components/team/TeamMemberRevokeButton";

const ASSIGNABLE_ROLES: ReadonlyArray<MembershipRoleOption> = [
  { value: "MANAGER",       label: "Gerente"   },
  { value: "STAFF_WAITER",  label: "Camarero"  },
  { value: "STAFF_KITCHEN", label: "Cocina"    },
  { value: "STAFF_BAR",     label: "Barra"     },
] as const;

interface TeamMembersPanelProps {
  members: ReadonlyArray<TeamMemberView>;
  currentUserId: string;
  isOwner: boolean;
  updateRoleAction: (formData: FormData) => Promise<void>;
  revokeMemberAction: (formData: FormData) => Promise<void>;
  reactivateMemberAction: (formData: FormData) => Promise<void>;
  deleteMemberPermanentlyAction: (formData: FormData) => Promise<void>;
}

//-aqui empieza funcion getMemberInitials y es para generar las iniciales del avatar desde nombre o email-//
/**
 * Extrae las dos primeras iniciales del nombre completo.
 * Si no hay nombre, usa el email como fallback.
 *
 * @pure
 */
function getMemberInitials(fullName: string | null, email: string): string {
  const trimmed = (fullName ?? "").trim();
  const source = trimmed.length > 0 ? trimmed : email;
  const initials = source
    .split(" ")
    .filter((word) => word.length > 0)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
  return initials.length > 0 ? initials : "?";
}
//-aqui termina funcion getMemberInitials-//

//-aqui empieza funcion getRoleLabel y es para traducir el rol de dominio a texto legible-//
/**
 * Traduce el MembershipRole a una etiqueta legible en español.
 *
 * @pure
 */
function getRoleLabel(role: TeamMemberView["role"]): string {
  const labels: Record<TeamMemberView["role"], string> = {
    RESTAURANT_OWNER: "Propietario",
    MANAGER: "Gerente",
    STAFF_WAITER: "Camarero",
    STAFF_KITCHEN: "Cocina",
    STAFF_BAR: "Barra",
  };
  return labels[role];
}
//-aqui termina funcion getRoleLabel-//

//-aqui empieza funcion getStatusLabel y es para traducir el estado de membership a texto legible-//
/**
 * Traduce el MembershipStatus a una etiqueta legible en español.
 *
 * @pure
 */
function getStatusLabel(status: TeamMemberView["status"]): string {
  const labels: Record<TeamMemberView["status"], string> = {
    ACTIVE: "Activo",
    PENDING: "Pendiente",
    REVOKED: "Revocado",
  };
  return labels[status];
}
//-aqui termina funcion getStatusLabel-//

//-aqui empieza componente TeamMembersPanel y es para listar el equipo activo-//
/**
 * Renderiza el panel de miembros activos del equipo.
 *
 * @pure
 */
export function TeamMembersPanel({
  members,
  currentUserId,
  isOwner,
  updateRoleAction,
  revokeMemberAction,
  reactivateMemberAction,
  deleteMemberPermanentlyAction,
}: TeamMembersPanelProps) {
  return (
    <section className="rounded-[28px] bg-surface-container-lowest p-8 shadow-sm">
      <div className="flex items-center gap-2">
        <OnboardingIcon name="person" className="h-5 w-5 text-secondary" />
        <h3 className="text-lg font-bold text-on-surface">
          <T>Miembros del equipo</T>
        </h3>
      </div>

      <div className="mt-6 space-y-4">
        {members.map((member) => {
          const isSelf = member.userId === currentUserId;
          const isOwnerMember = member.role === "RESTAURANT_OWNER";
          const isRevoked = member.status === "REVOKED";
          const canEditRole = isOwner && !isSelf && !isOwnerMember && !isRevoked;
          const articleClassName = isRevoked
            ? "rounded-2xl border border-error/20 bg-error/5 p-5"
            : "rounded-2xl bg-surface-container-low p-5";
          const statusClassName = isRevoked
            ? "inline-flex rounded-full bg-error/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-error"
            : "inline-flex rounded-full bg-secondary-container px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-on-secondary-container";

          return (
            <article className={articleClassName} key={member.membershipId}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-high text-sm font-black text-on-surface-variant">
                    {getMemberInitials(member.userFullName, member.userEmail)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-primary">
                      {member.userFullName ?? member.userEmail}
                    </p>
                    <p className="mt-1 text-xs text-on-surface-variant">
                      {member.userEmail}
                    </p>
                  </div>
                </div>
                <span className={statusClassName}>
                  <T>{getStatusLabel(member.status)}</T>
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between gap-4 rounded-2xl bg-surface-container-lowest px-4 py-3">
                <span className="text-xs font-semibold text-on-surface-variant">
                  <T>Rol</T>
                </span>
                <div className="flex items-center gap-3">
                  {canEditRole ? (
                    <TeamMemberRoleSelect
                      currentRole={member.role}
                      disabled={false}
                      membershipId={member.membershipId}
                      roles={ASSIGNABLE_ROLES}
                      updateAction={updateRoleAction}
                    />
                  ) : (
                    <span className="text-xs font-bold text-on-surface">
                      <T>{getRoleLabel(member.role)}</T>
                      {isSelf && (
                        <span className="ml-1.5 text-on-surface-variant font-normal">(tú)</span>
                      )}
                    </span>
                  )}
                  {canEditRole && !isRevoked && (
                    <TeamMemberRevokeButton
                      membershipId={member.membershipId}
                      memberName={member.userFullName ?? member.userEmail}
                      memberStatus={member.status}
                      revokeAction={revokeMemberAction}
                      reactivateAction={reactivateMemberAction}
                      deletePermanentlyAction={deleteMemberPermanentlyAction}
                    />
                  )}
                  {isRevoked && isOwner && !isSelf && !isOwnerMember && (
                    <TeamMemberRevokeButton
                      membershipId={member.membershipId}
                      memberName={member.userFullName ?? member.userEmail}
                      memberStatus={member.status}
                      revokeAction={revokeMemberAction}
                      reactivateAction={reactivateMemberAction}
                      deletePermanentlyAction={deleteMemberPermanentlyAction}
                    />
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
//-aqui termina componente TeamMembersPanel-//
