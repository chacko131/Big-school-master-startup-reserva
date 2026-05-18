/**
 * Archivo: upsert-role-page-permission.use-case.ts
 * Responsabilidad: Crear o actualizar el permiso de una sección para un rol,
 *   validando que sólo el propietario puede hacerlo.
 * Tipo: lógica
 */

import { UserValidationError } from "../../../domain/errors/user-validation.error";
import { type MembershipRepository } from "../../../domain/ports/membership.repository.port";
import { type RolePagePermissionRepository } from "../../../domain/ports/role-page-permission.repository.port";
import { type MembershipRole } from "../../../domain/entities/user-restaurant-membership.entity";
import { type DashboardSectionKey } from "@/constants/dashboard";
import { CONFIGURABLE_ROLES } from "../GetRolePagePermissions/get-role-page-permissions.use-case";

interface UpsertRolePagePermissionInput {
  requesterId: string;
  restaurantId: string;
  role: MembershipRole;
  pageKey: DashboardSectionKey;
  canView: boolean;
  canEdit: boolean;
}

//-aqui empieza clase UpsertRolePagePermission y es para que el owner actualice permisos de pagina por rol-//
/**
 * Valida que el solicitante sea el owner y persiste el permiso.
 * Si canEdit=true se fuerza canView=true (editar implica ver).
 * @sideEffect
 */
export class UpsertRolePagePermission {
  constructor(
    private readonly membershipRepository: MembershipRepository,
    private readonly permissionRepository: RolePagePermissionRepository
  ) {}

  async execute({
    requesterId,
    restaurantId,
    role,
    pageKey,
    canView,
    canEdit,
  }: UpsertRolePagePermissionInput): Promise<void> {
    const requester = await this.membershipRepository.findActiveByUserAndRestaurant(
      requesterId,
      restaurantId
    );

    if (requester === null || !requester.isOwner()) {
      throw new UserValidationError("requesterId", "Solo el propietario puede modificar permisos.");
    }

    if (!CONFIGURABLE_ROLES.includes(role)) {
      throw new UserValidationError("role", "No se pueden modificar los permisos del propietario.");
    }

    const effectiveCanView = canEdit ? true : canView;

    await this.permissionRepository.upsert({
      restaurantId,
      role,
      pageKey,
      canView: effectiveCanView,
      canEdit,
    });
  }
}
//-aqui termina clase UpsertRolePagePermission-//
