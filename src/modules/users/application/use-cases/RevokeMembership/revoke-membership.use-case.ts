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
    const target = await this.membershipRepository.findById(membershipId);

    if (target === null) {
      throw new UserValidationError("membershipId", "El miembro no existe.");
    }

    const requester = await this.membershipRepository.findActiveByUserAndRestaurant(
      requesterId,
      target.restaurantId
    );

    if (requester === null || !requester.isOwner()) {
      throw new UserValidationError("requesterId", "Solo el propietario puede eliminar miembros.");
    }

    if (target.userId === requesterId) {
      throw new UserValidationError("membershipId", "No puedes eliminarte a ti mismo del equipo.");
    }

    if (target.role === "RESTAURANT_OWNER") {
      throw new UserValidationError("membershipId", "No se puede eliminar al propietario del restaurante.");
    }

    const revoked = target.revoke();
    await this.membershipRepository.save(revoked);
  }
  //-aqui termina funcion execute-//

  //-aqui empieza funcion reactivate y es para restaurar una membership revocada-//
  /**
   * Reactiva una membership revocada.
   * @sideEffect
   */
  async reactivate({ requesterId, membershipId }: RevokeMembershipInput): Promise<void> {
    const target = await this.membershipRepository.findById(membershipId);

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
    await this.membershipRepository.save(reactivated);
  }
  //-aqui termina funcion reactivate-//

  //-aqui empieza funcion deletePermanently y es para borrar definitivamente una membership revocada-//
  /**
   * Borra definitivamente una membership revocada.
   * @sideEffect
   */
  async deletePermanently({ requesterId, membershipId }: RevokeMembershipInput): Promise<void> {
    const target = await this.membershipRepository.findById(membershipId);

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
  }
  //-aqui termina funcion deletePermanently-//
}
//-aqui termina clase RevokeMembership-//
