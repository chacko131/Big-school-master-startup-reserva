/**
 * Archivo: accept-team-invitation.use-case.ts
 * Responsabilidad: Validar el token de invitación y activar la membership del usuario.
 * Tipo: lógica
 */

import { randomUUID } from "crypto";
import { type MembershipRepository } from "@/modules/users/domain/ports/membership.repository.port";
import { type TeamInvitationTokenRepository } from "@/modules/users/domain/ports/team-invitation-token.repository.port";
import { UserRestaurantMembership } from "@/modules/users/domain/entities/user-restaurant-membership.entity";
import { UserValidationError } from "@/modules/users/domain/errors/user-validation.error";

export interface AcceptTeamInvitationInput {
  token: string;
  acceptingUserId: string;
  acceptingUserEmail: string;
}

export interface AcceptTeamInvitationOutput {
  restaurantId: string;
}

//-aqui empieza clase AcceptTeamInvitation y es para activar la membership al aceptar la invitacion-//
/**
 * Valida el token, crea o activa la membership y marca el token como usado.
 * Es idempotente: si la membership ya existe como ACTIVE, no falla.
 */
export class AcceptTeamInvitation {
  constructor(
    private readonly membershipRepository: MembershipRepository,
    private readonly invitationTokenRepository: TeamInvitationTokenRepository
  ) {}

  //-aqui empieza funcion execute y es para aceptar la invitacion y activar el acceso al restaurante-//
  /**
   * @sideEffect
   */
  async execute({
    token,
    acceptingUserId,
    acceptingUserEmail,
  }: AcceptTeamInvitationInput): Promise<AcceptTeamInvitationOutput> {
    const invitationToken = await this.invitationTokenRepository.findByToken(token);

    if (invitationToken === null) {
      throw new UserValidationError("token", "Esta invitación no existe o el enlace no es válido.");
    }
    if (!invitationToken.isValid()) {
      throw new UserValidationError("token", "Esta invitación ha expirado o ya fue utilizada. Pide al propietario que te envíe una nueva.");
    }
    if (invitationToken.email !== acceptingUserEmail.toLowerCase().trim()) {
      throw new UserValidationError("token", "Este enlace de invitación no corresponde a tu cuenta. Asegúrate de haber iniciado sesión con el email correcto.");
    }

    const { restaurantId, role, invitedById } = invitationToken;

    // Idempotencia: si ya tiene membership activa, no hacemos nada
    const existing = await this.membershipRepository.findActiveByUserAndRestaurant(
      acceptingUserId,
      restaurantId
    );

    if (existing === null) {
      // Buscar membership PENDING que pudo haberse creado en InviteTeamMember
      const allMemberships = await this.membershipRepository.findByRestaurantId(restaurantId);
      const pendingMembership = allMemberships.find(
        (m) => m.userId === acceptingUserId && m.status === "PENDING"
      );

      if (pendingMembership !== null && pendingMembership !== undefined) {
        await this.membershipRepository.save(pendingMembership.activate());
      } else {
        const newMembership = UserRestaurantMembership.create({
          id: randomUUID(),
          userId: acceptingUserId,
          restaurantId,
          role,
          status: "ACTIVE",
          invitedById,
        });
        await this.membershipRepository.save(newMembership);
      }
    }

    // Marcar token como usado (un solo uso)
    await this.invitationTokenRepository.save(invitationToken.markAsUsed());

    return { restaurantId };
  }
  //-aqui termina funcion execute-//
}
//-aqui termina clase AcceptTeamInvitation-//
