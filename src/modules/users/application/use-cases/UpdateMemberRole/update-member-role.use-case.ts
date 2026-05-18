/**
 * Archivo: update-member-role.use-case.ts
 * Responsabilidad: Permitir al RESTAURANT_OWNER cambiar el rol de un miembro de su equipo.
 * Tipo: lógica
 */

import { type MembershipRepository } from "@/modules/users/domain/ports/membership.repository.port";
import { type MembershipRole } from "@/modules/users/domain/entities/user-restaurant-membership.entity";
import { UserValidationError } from "@/modules/users/domain/errors/user-validation.error";

export interface UpdateMemberRoleInput {
  requesterId: string;
  membershipId: string;
  newRole: MembershipRole;
}

//-aqui empieza clase UpdateMemberRole y es para cambiar el rol de un miembro del equipo-//
/**
 * Solo el RESTAURANT_OWNER puede ejecutar este caso de uso.
 * No se permite asignar RESTAURANT_OWNER ni modificar el propio rol.
 */
export class UpdateMemberRole {
  constructor(private readonly membershipRepository: MembershipRepository) {}

  //-aqui empieza funcion execute y es para aplicar el cambio de rol con validaciones de dominio-//
  /**
   * @sideEffect
   */
  async execute({ requesterId, membershipId, newRole }: UpdateMemberRoleInput): Promise<void> {
    if (newRole === "RESTAURANT_OWNER") {
      throw new UserValidationError("newRole — no se puede asignar RESTAURANT_OWNER");
    }

    const target = await this.membershipRepository.findById(membershipId);
    if (target === null) {
      throw new UserValidationError("membershipId — membership no encontrada");
    }

    const requesterMembership = await this.membershipRepository.findActiveByUserAndRestaurant(
      requesterId,
      target.restaurantId
    );

    if (requesterMembership === null || !requesterMembership.isOwner()) {
      throw new UserValidationError("requesterId — solo el propietario puede cambiar roles");
    }

    if (target.userId === requesterId) {
      throw new UserValidationError("membershipId — no puedes cambiar tu propio rol");
    }

    const updated = target.withRole(newRole);
    await this.membershipRepository.save(updated);
  }
  //-aqui termina funcion execute-//
}
//-aqui termina clase UpdateMemberRole-//
