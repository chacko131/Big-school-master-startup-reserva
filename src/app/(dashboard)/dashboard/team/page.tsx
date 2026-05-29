/**
 * Archivo: page.tsx
 * Responsabilidad: Componer la vista de equipo del dashboard con datos reales de memberships,
 *   permisos por rol y gestión de invitaciones.
 * Tipo: UI
 */

"use server";

import { revalidatePath } from "next/cache";
import { TeamToolbar } from "@/components/team/TeamToolbar";
import { TeamMetricsGrid, type TeamMetric } from "@/components/team/TeamMetricsGrid";
import { TeamMembersPanel } from "@/components/team/TeamMembersPanel";
import { TeamInvitationPanel } from "@/components/team/TeamInvitationPanel";
import { TeamPermissionsPanel, type PermissionRowView } from "@/components/team/TeamPermissionsPanel";
import { TeamInviteModal } from "@/components/team/TeamInviteModal";
import { getRestaurantIdFromSession } from "@/modules/auth/get-restaurant-id";
import { requireCurrentUser } from "@/modules/auth/get-current-user";
import { GetRestaurantTeam } from "@/modules/users/application/use-cases/GetRestaurantTeam/get-restaurant-team.use-case";
import { GetRolePagePermissions } from "@/modules/users/application/use-cases/GetRolePagePermissions/get-role-page-permissions.use-case";
import { UpsertRolePagePermission } from "@/modules/users/application/use-cases/UpsertRolePagePermission/upsert-role-page-permission.use-case";
import { UpdateMemberRole } from "@/modules/users/application/use-cases/UpdateMemberRole/update-member-role.use-case";
import { InviteTeamMember } from "@/modules/users/application/use-cases/InviteTeamMember/invite-team-member.use-case";
import { RevokeMembership } from "@/modules/users/application/use-cases/RevokeMembership/revoke-membership.use-case";
import { GetPendingTeamInvitations } from "@/modules/users/application/use-cases/GetPendingTeamInvitations/get-pending-team-invitations.use-case";
import { type PendingTeamInvitationView } from "@/modules/users/application/use-cases/GetPendingTeamInvitations/get-pending-team-invitations.use-case";
import { getUsersInfrastructure } from "@/modules/users/infrastructure/users-infrastructure";
import { getCatalogInfrastructure } from "@/modules/catalog/infrastructure/catalog-infrastructure";
import { type MembershipRole } from "@/modules/users/domain/entities/user-restaurant-membership.entity";
import { dashboardNavigationDefinitions, type DashboardSectionKey } from "@/constants/dashboard";

const VALID_ROLES: ReadonlyArray<MembershipRole> = [
  "MANAGER",
  "STAFF_WAITER",
  "STAFF_KITCHEN",
  "STAFF_BAR",
] as const;

//-aqui empieza funcion updateMemberRoleAction y es para cambiar el rol de un miembro del equipo-//
/**
 * Server action que delega en UpdateMemberRole.
 * Valida que newRole sea uno de los roles asignables antes de ejecutar.
 * @sideEffect
 */
async function updateMemberRoleAction(formData: FormData): Promise<void> {
  "use server";

  const membershipId = String(formData.get("membershipId") ?? "").trim();
  const newRole = String(formData.get("newRole") ?? "").trim() as MembershipRole;

  if (!VALID_ROLES.includes(newRole)) return;
  if (membershipId.length === 0) return;

  const currentUser = await requireCurrentUser();
  const { membershipRepository } = getUsersInfrastructure();
  const useCase = new UpdateMemberRole(membershipRepository);

  await useCase.execute({ requesterId: currentUser.id, membershipId, newRole });
  revalidatePath("/dashboard/team");
}
//-aqui termina funcion updateMemberRoleAction-//

//-aqui empieza funcion upsertPermissionAction y es para que el owner actualice permisos de pagina por rol-//
/**
 * Server action que delega en UpsertRolePagePermission.
 * @sideEffect
 */
async function upsertPermissionAction(formData: FormData): Promise<void> {
  "use server";

  const restaurantId = String(formData.get("restaurantId") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim() as MembershipRole;
  const pageKey = String(formData.get("pageKey") ?? "").trim() as DashboardSectionKey;
  const canView = formData.get("canView") === "true";
  const canEdit = formData.get("canEdit") === "true";

  if (!restaurantId || !role || !pageKey) return;

  const currentUser = await requireCurrentUser();
  const { membershipRepository, rolePagePermissionRepository } = getUsersInfrastructure();

  await new UpsertRolePagePermission(membershipRepository, rolePagePermissionRepository).execute({
    requesterId: currentUser.id,
    restaurantId,
    role,
    pageKey,
    canView,
    canEdit,
  });

  revalidatePath("/dashboard/team");
}
//-aqui termina funcion upsertPermissionAction-//

//-aqui empieza funcion inviteMemberAction y es para invitar a un miembro al equipo por email-//
/**
 * Server action que delega en InviteTeamMember.
 * Devuelve { error } para que el modal muestre el mensaje en cliente.
 * @sideEffect
 */
async function inviteMemberAction(formData: FormData): Promise<{ error?: string }> {
  "use server";

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const role = String(formData.get("role") ?? "").trim() as MembershipRole;

  if (!email.includes("@")) return { error: "Email no válido" };
  if (!VALID_ROLES.includes(role)) return { error: "Rol no válido" };

  try {
    const currentUser = await requireCurrentUser();
    const restaurantId = await getRestaurantIdFromSession();

    const { membershipRepository, invitationTokenRepository, userRepository } = getUsersInfrastructure();
    const { restaurantRepository } = getCatalogInfrastructure();
    const restaurant = await restaurantRepository.findById(restaurantId);
    if (restaurant === null) return { error: "Restaurante no encontrado" };

    await new InviteTeamMember(membershipRepository, invitationTokenRepository, userRepository).execute({
      requesterId: currentUser.id,
      restaurantId,
      restaurantName: restaurant.name,
      inviterName: currentUser.fullName ?? currentUser.email,
      email,
      role,
    });

    revalidatePath("/dashboard/team");
    return {};
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al enviar la invitación";
    return { error: message };
  }
}
//-aqui termina funcion inviteMemberAction-//

//-aqui empieza funcion revokeMemberAction y es para revocar el acceso de un miembro al restaurante-//
/**
 * Server action que delega en RevokeMembership.
 * @sideEffect
 */
async function revokeMemberAction(formData: FormData): Promise<void> {
  "use server";

  const membershipId = String(formData.get("membershipId") ?? "").trim();
  if (membershipId.length === 0) return;

  const currentUser = await requireCurrentUser();
  const { membershipRepository } = getUsersInfrastructure();
  await new RevokeMembership(membershipRepository).execute({ requesterId: currentUser.id, membershipId });
  revalidatePath("/dashboard/team");
}
//-aqui termina funcion revokeMemberAction-//

//-aqui empieza funcion reactivateMemberAction y es para reactivar una membership revocada-//
/**
 * Server action que delega en RevokeMembership.reactivate.
 * @sideEffect
 */
async function reactivateMemberAction(formData: FormData): Promise<void> {
  "use server";

  const membershipId = String(formData.get("membershipId") ?? "").trim();
  if (membershipId.length === 0) return;

  const currentUser = await requireCurrentUser();
  const { membershipRepository } = getUsersInfrastructure();
  await new RevokeMembership(membershipRepository).reactivate({ requesterId: currentUser.id, membershipId });
  revalidatePath("/dashboard/team");
}
//-aqui termina funcion reactivateMemberAction-//

//-aqui empieza funcion deleteMemberPermanentlyAction y es para borrar una membership revocada-//
/**
 * Server action que delega en RevokeMembership.deletePermanently.
 * @sideEffect
 */
async function deleteMemberPermanentlyAction(formData: FormData): Promise<void> {
  "use server";

  const membershipId = String(formData.get("membershipId") ?? "").trim();
  if (membershipId.length === 0) return;

  const currentUser = await requireCurrentUser();
  const { membershipRepository } = getUsersInfrastructure();
  await new RevokeMembership(membershipRepository).deletePermanently({ requesterId: currentUser.id, membershipId });
  revalidatePath("/dashboard/team");
}
//-aqui termina funcion deleteMemberPermanentlyAction-//

//-aqui empieza pagina TeamPage y es para mostrar los accesos del equipo-//
/**
 * Presenta la vista de gestión de equipo del dashboard con miembros reales desde DB.
 */
export default async function TeamPage() {
  const [currentUser, restaurantId] = await Promise.all([
    requireCurrentUser(),
    getRestaurantIdFromSession(),
  ]);

  const { membershipRepository, userRepository, invitationTokenRepository, rolePagePermissionRepository } = getUsersInfrastructure();

  const [members, currentMembership] = await Promise.all([
    new GetRestaurantTeam(membershipRepository, userRepository).execute({ restaurantId }),
    membershipRepository.findActiveByUserAndRestaurant(currentUser.id, restaurantId),
  ]);

  const isOwner = currentMembership?.isOwner() ?? false;
  const PERMISSION_PAGE_KEYS: ReadonlyArray<DashboardSectionKey> = [
    "reservations", "tables", "schedule", "guests",
    "billing", "analytics",
  ];

  const pendingInvitations: ReadonlyArray<PendingTeamInvitationView> = isOwner
    ? await new GetPendingTeamInvitations(invitationTokenRepository).execute({ restaurantId })
    : [];

  const permissionRows: ReadonlyArray<PermissionRowView> = isOwner
    ? await new GetRolePagePermissions(rolePagePermissionRepository).execute({
        restaurantId,
        pageKeys: PERMISSION_PAGE_KEYS,
      })
    : [];

  const activeCount  = members.filter((m) => m.status === "ACTIVE").length;
  const pendingCount = pendingInvitations.length;
  const roleCount    = new Set(members.map((m) => m.role)).size;

  const metrics: ReadonlyArray<TeamMetric> = [
    { label: "Miembros activos",        value: String(activeCount),    caption: "usuarios con acceso al panel",    tone: "primary"   },
    { label: "Roles definidos",         value: String(roleCount),      caption: "roles distintos en el equipo",    tone: "secondary" },
    { label: "Invitaciones pendientes", value: String(pendingCount),   caption: "esperando aceptación",            tone: "surface"   },
    { label: "Total equipo",            value: String(members.length), caption: "miembros registrados en total",   tone: "warning"   },
  ];

  return (
    <>
      <TeamToolbar inviteModal={isOwner ? <TeamInviteModal inviteAction={inviteMemberAction} /> : null} />
      <TeamMetricsGrid metrics={metrics} />

      <section className="grid grid-cols-1 gap-8 xl:grid-cols-12">
        <div className="xl:col-span-8 space-y-8">
          <TeamMembersPanel
            currentUserId={currentUser.id}
            isOwner={isOwner}
            members={members}
            updateRoleAction={updateMemberRoleAction}
            revokeMemberAction={revokeMemberAction}
            reactivateMemberAction={reactivateMemberAction}
            deleteMemberPermanentlyAction={deleteMemberPermanentlyAction}
          />
          {isOwner ? <TeamInvitationPanel invitations={pendingInvitations} /> : null}
        </div>

        {isOwner ? (
          <div className="xl:col-span-4">
            <TeamPermissionsPanel
              restaurantId={restaurantId}
              rows={permissionRows as PermissionRowView[]}
              pageKeys={dashboardNavigationDefinitions
                .filter((n) => PERMISSION_PAGE_KEYS.includes(n.key as DashboardSectionKey))
                .map((n) => ({ key: n.key as DashboardSectionKey, label: n.label }))}
              upsertAction={upsertPermissionAction}
            />
          </div>
        ) : null}
      </section>
    </>
  );
}
//-aqui termina pagina TeamPage-//
