/**
 * Archivo: revoke-membership.use-case.ts
 * Responsabilidad: Revocar el acceso de un miembro a un restaurante.
 * Tipo: lógica
 */

import { type MembershipRepository } from "@/modules/users/domain/ports/membership.repository.port";
import { UserValidationError } from "@/modules/users/domain/errors/user-validation.error";

export interface RevokeMembershipInput {
  requesterId: string;
  membershipId: string;
}

//-aqui empieza clase RevokeMembership y es para revocar el acceso de un miembro al restaurante-//
/**
 * Reglas de negocio:
 * - Solo el RESTAURANT_OWNER puede revocar memberships.
 * - El owner no puede revocarse a sí mismo.
 * - No se puede revocar a otro RESTAURANT_OWNER.
 */
export class RevokeMembership {
  constructor(private readonly membershipRepository: MembershipRepository) {}

  //-aqui empieza funcion execute y es para ejecutar la revocacion de la membership-//
  /**
   * @sideEffect
   */
  async execute({ requesterId, membershipId }: RevokeMembershipInput): Promise<void> {
    console.log("[RevokeMembership] inicio", { requesterId, membershipId });

    const target = await this.membershipRepository.findById(membershipId);
    console.log("[RevokeMembership] target cargado", {
      found: target !== null,
      targetId: target?.id ?? null,
      targetUserId: target?.userId ?? null,
      targetRestaurantId: target?.restaurantId ?? null,
      targetRole: target?.role ?? null,
      targetStatus: target?.status ?? null,
    });

    if (target === null) {
      console.warn("[RevokeMembership] abortado: membership no encontrada", { membershipId });
      throw new UserValidationError("membershipId", "El miembro no existe.");
    }

    const requester = await this.membershipRepository.findActiveByUserAndRestaurant(
      requesterId,
      target.restaurantId
    );
    console.log("[RevokeMembership] requester cargado", {
      requesterFound: requester !== null,
      requesterId,
      requesterRestaurantId: target.restaurantId,
      requesterRole: requester?.role ?? null,
      requesterStatus: requester?.status ?? null,
    });

    if (requester === null || !requester.isOwner()) {
      console.warn("[RevokeMembership] abortado: requester sin permisos", { requesterId, membershipId });
      throw new UserValidationError("requesterId", "Solo el propietario puede eliminar miembros.");
    }

    if (target.userId === requesterId) {
      console.warn("[RevokeMembership] abortado: intento de autoeliminación", { requesterId, membershipId });
      throw new UserValidationError("membershipId", "No puedes eliminarte a ti mismo del equipo.");
    }

    if (target.role === "RESTAURANT_OWNER") {
      console.warn("[RevokeMembership] abortado: no se puede eliminar al owner", { requesterId, membershipId });
      throw new UserValidationError("membershipId", "No se puede eliminar al propietario del restaurante.");
    }

    const revoked = target.revoke();
    console.log("[RevokeMembership] guardando membership revocada", {
      membershipId: revoked.id,
      userId: revoked.userId,
      restaurantId: revoked.restaurantId,
      status: revoked.status,
      updatedAt: revoked.updatedAt,
    });

    await this.membershipRepository.save(revoked);
    console.log("[RevokeMembership] persistencia completada", { membershipId: revoked.id });
  }
  //-aqui termina funcion execute-//

  //-aqui empieza funcion reactivate y es para restaurar una membership revocada-//
  /**
   * Reactiva una membership revocada.
   * @sideEffect
   */
  async reactivate({ requesterId, membershipId }: RevokeMembershipInput): Promise<void> {
    console.log("[RevokeMembership.reactivate] inicio", { requesterId, membershipId });

    const target = await this.membershipRepository.findById(membershipId);
    console.log("[RevokeMembership.reactivate] target cargado", {
      found: target !== null,
      targetId: target?.id ?? null,
      targetUserId: target?.userId ?? null,
      targetRestaurantId: target?.restaurantId ?? null,
      targetRole: target?.role ?? null,
      targetStatus: target?.status ?? null,
    });

    if (target === null) {
      throw new UserValidationError("membershipId", "El miembro no existe.");
    }

    const requester = await this.membershipRepository.findActiveByUserAndRestaurant(
      requesterId,
      target.restaurantId
    );

    if (requester === null || !requester.isOwner()) {
      throw new UserValidationError("requesterId", "Solo el propietario puede reactivar miembros.");
    }

    if (target.userId === requesterId) {
      throw new UserValidationError("membershipId", "No puedes reactivarte a ti mismo.");
    }

    if (target.role === "RESTAURANT_OWNER") {
      throw new UserValidationError("membershipId", "No se puede reactivar al propietario del restaurante.");
    }

    if (target.status !== "REVOKED") {
      throw new UserValidationError("membershipId", "Solo se pueden reactivar miembros revocados.");
    }

    const reactivated = target.activate();
    console.log("[RevokeMembership.reactivate] guardando membership reactivada", {
      membershipId: reactivated.id,
      userId: reactivated.userId,
      restaurantId: reactivated.restaurantId,
      status: reactivated.status,
      updatedAt: reactivated.updatedAt,
    });

    await this.membershipRepository.save(reactivated);
    console.log("[RevokeMembership.reactivate] persistencia completada", { membershipId: reactivated.id });
  }
  //-aqui termina funcion reactivate-//

  //-aqui empieza funcion deletePermanently y es para borrar definitivamente una membership revocada-//
  /**
   * Borra definitivamente una membership revocada.
   * @sideEffect
   */
  async deletePermanently({ requesterId, membershipId }: RevokeMembershipInput): Promise<void> {
    console.log("[RevokeMembership.deletePermanently] inicio", { requesterId, membershipId });

    const target = await this.membershipRepository.findById(membershipId);
    console.log("[RevokeMembership.deletePermanently] target cargado", {
      found: target !== null,
      targetId: target?.id ?? null,
      targetUserId: target?.userId ?? null,
      targetRestaurantId: target?.restaurantId ?? null,
      targetRole: target?.role ?? null,
      targetStatus: target?.status ?? null,
    });

    if (target === null) {
      throw new UserValidationError("membershipId", "El miembro no existe.");
    }

    const requester = await this.membershipRepository.findActiveByUserAndRestaurant(
      requesterId,
      target.restaurantId
    );

    if (requester === null || !requester.isOwner()) {
      throw new UserValidationError("requesterId", "Solo el propietario puede borrar miembros permanentemente.");
    }

    if (target.userId === requesterId) {
      throw new UserValidationError("membershipId", "No puedes borrarte a ti mismo.");
    }

    if (target.role === "RESTAURANT_OWNER") {
      throw new UserValidationError("membershipId", "No se puede borrar al propietario del restaurante.");
    }

    if (target.status !== "REVOKED") {
      throw new UserValidationError("membershipId", "Solo se pueden borrar miembros revocados permanentemente.");
    }

    await this.membershipRepository.deleteById(target.id);
    console.log("[RevokeMembership.deletePermanently] borrado completado", { membershipId: target.id });
  }
  //-aqui termina funcion deletePermanently-//
}
//-aqui termina clase RevokeMembership-//
