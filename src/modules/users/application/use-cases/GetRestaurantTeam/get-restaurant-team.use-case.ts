/**
 * Archivo: get-restaurant-team.use-case.ts
 * Responsabilidad: Obtener el equipo completo de un restaurante combinando memberships y datos de usuario.
 * Tipo: lógica
 */

import { type MembershipRepository } from "@/modules/users/domain/ports/membership.repository.port";
import { type UserRepository } from "@/modules/users/domain/ports/user.repository.port";
import { type MembershipRole, type MembershipStatus } from "@/modules/users/domain/entities/user-restaurant-membership.entity";

export interface TeamMemberView {
  membershipId: string;
  userId: string;
  role: MembershipRole;
  status: MembershipStatus;
  invitedById: string | null;
  joinedAt: Date;
  userFullName: string | null;
  userEmail: string;
}

export interface GetRestaurantTeamInput {
  restaurantId: string;
}

//-aqui empieza clase GetRestaurantTeam y es para obtener el equipo de un restaurante-//
/**
 * Devuelve todas las memberships del restaurante enriquecidas con los datos del usuario.
 * Usa una sola query adicional para los usuarios (findManyByIds) en lugar de N llamadas.
 */
export class GetRestaurantTeam {
  constructor(
    private readonly membershipRepository: MembershipRepository,
    private readonly userRepository: UserRepository
  ) {}

  //-aqui empieza funcion execute y es para obtener los miembros del restaurante-//
  /**
   * @sideEffect
   */
  async execute({ restaurantId }: GetRestaurantTeamInput): Promise<TeamMemberView[]> {
    const memberships = await this.membershipRepository.findByRestaurantId(restaurantId);

    if (memberships.length === 0) return [];

    const userIds = memberships.map((m) => m.userId);
    const users = await this.userRepository.findManyByIds(userIds);

    const userMap = new Map(users.map((u) => [u.id, u]));

    return memberships.map((membership) => {
      const p = membership.toPrimitives();
      const user = userMap.get(p.userId);

      return {
        membershipId: p.id,
        userId: p.userId,
        role: p.role,
        status: p.status,
        invitedById: p.invitedById,
        joinedAt: p.createdAt,
        userFullName: user?.fullName ?? null,
        userEmail: user?.email ?? "",
      };
    });
  }
  //-aqui termina funcion execute-//
}
//-aqui termina clase GetRestaurantTeam-//
