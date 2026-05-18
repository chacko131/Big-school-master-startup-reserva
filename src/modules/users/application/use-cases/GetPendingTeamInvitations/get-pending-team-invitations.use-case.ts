/**
 * Archivo: get-pending-team-invitations.use-case.ts
 * Responsabilidad: Recuperar las invitaciones pendientes activas de un restaurante.
 * Tipo: lógica
 */

import { type MembershipRole } from "@/modules/users/domain/entities/user-restaurant-membership.entity";
import { type TeamInvitationTokenRepository } from "@/modules/users/domain/ports/team-invitation-token.repository.port";

export interface PendingTeamInvitationView {
  id: string;
  email: string;
  role: MembershipRole;
  status: "PENDING";
  expiresAt: Date;
  createdAt: Date;
}

export interface GetPendingTeamInvitationsInput {
  restaurantId: string;
}

//-aqui empieza clase GetPendingTeamInvitations y es para listar invitaciones pendientes reales-//
/**
 * Devuelve tokens activos y no expirados transformados a una vista simple para UI.
 * @sideEffect
 */
export class GetPendingTeamInvitations {
  constructor(private readonly invitationTokenRepository: TeamInvitationTokenRepository) {}

  //-aqui empieza funcion execute y es para recuperar invitaciones pendientes-//
  /**
   * @sideEffect
   */
  async execute({ restaurantId }: GetPendingTeamInvitationsInput): Promise<PendingTeamInvitationView[]> {
    const tokens = await this.invitationTokenRepository.findPendingByRestaurantId(restaurantId);

    return tokens.map((token) => ({
      id: token.id,
      email: token.email,
      role: token.role,
      status: "PENDING",
      expiresAt: token.expiresAt,
      createdAt: token.createdAt,
    }));
  }
  //-aqui termina funcion execute-//
}
//-aqui termina clase GetPendingTeamInvitations-//
