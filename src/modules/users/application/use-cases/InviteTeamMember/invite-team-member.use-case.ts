/**
 * Archivo: invite-team-member.use-case.ts
 * Responsabilidad: Generar el token de invitación, persistirlo y enviar el email al invitado.
 * Tipo: lógica
 */

import { randomUUID } from "crypto";
import { type MembershipRepository } from "@/modules/users/domain/ports/membership.repository.port";
import { type TeamInvitationTokenRepository } from "@/modules/users/domain/ports/team-invitation-token.repository.port";
import { type UserRepository } from "@/modules/users/domain/ports/user.repository.port";
import { TeamInvitationToken } from "@/modules/users/domain/entities/team-invitation-token.entity";
import { UserRestaurantMembership } from "@/modules/users/domain/entities/user-restaurant-membership.entity";
import { type MembershipRole } from "@/modules/users/domain/entities/user-restaurant-membership.entity";
import { UserValidationError } from "@/modules/users/domain/errors/user-validation.error";
import { sendInvitationEmail } from "@/services/resend.service";

export interface InviteTeamMemberInput {
  requesterId: string;
  restaurantId: string;
  restaurantName: string;
  inviterName: string;
  email: string;
  role: MembershipRole;
}

// Extraemos solo el origen (scheme+host+port) para que el path /invite/accept sea siempre correcto
// independientemente de si NEXT_PUBLIC_HOST_NAME tiene paths adicionales como /dashboard/
const RAW_HOST = process.env.NEXT_PUBLIC_HOST_NAME ?? "http://localhost:3000";
const HOST = (() => {
  try { return new URL(RAW_HOST).origin; } catch { return "http://localhost:3000"; }
})();

//-aqui empieza clase InviteTeamMember y es para invitar un miembro al equipo del restaurante-//
/**
 * Genera el token, invalida los anteriores, persiste y envía el email.
 */
export class InviteTeamMember {
  constructor(
    private readonly membershipRepository: MembershipRepository,
    private readonly invitationTokenRepository: TeamInvitationTokenRepository,
    private readonly userRepository: UserRepository
  ) {}

  //-aqui empieza funcion execute y es para orquestar el flujo completo de invitacion-//
  /**
   * @sideEffect
   */
  async execute({
    requesterId,
    restaurantId,
    restaurantName,
    inviterName,
    email,
    role,
  }: InviteTeamMemberInput): Promise<void> {
    if (role === "RESTAURANT_OWNER") {
      throw new UserValidationError("role — no se puede invitar con rol RESTAURANT_OWNER");
    }

    const requesterMembership = await this.membershipRepository.findActiveByUserAndRestaurant(
      requesterId,
      restaurantId
    );
    if (requesterMembership === null || !requesterMembership.isOwner()) {
      throw new UserValidationError("requesterId — solo el propietario puede invitar miembros");
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await this.userRepository.findByEmail(normalizedEmail);
    if (existingUser !== null) {
      const existingMembership = await this.membershipRepository.findActiveByUserAndRestaurant(
        existingUser.id,
        restaurantId
      );
      if (existingMembership !== null) {
        throw new UserValidationError("email — este usuario ya es miembro activo del restaurante");
      }

      // Si existe pero no tiene membership activa, creamos la membership directamente como PENDING
      const membershipId = randomUUID();
      const membership = UserRestaurantMembership.create({
        id: membershipId,
        userId: existingUser.id,
        restaurantId,
        role,
        status: "PENDING",
        invitedById: requesterId,
      });
      await this.membershipRepository.save(membership);
    }

    // Invalida tokens anteriores para evitar links múltiples activos
    await this.invitationTokenRepository.invalidatePendingForEmailAndRestaurant(
      normalizedEmail,
      restaurantId
    );

    const tokenId = randomUUID();
    const tokenValue = randomUUID();
    const invitationToken = TeamInvitationToken.create({
      id: tokenId,
      token: tokenValue,
      email: normalizedEmail,
      restaurantId,
      role,
      invitedById: requesterId,
      expiresAt: TeamInvitationToken.buildExpiresAt(),
    });

    await this.invitationTokenRepository.save(invitationToken);

    const acceptUrl = `${HOST.replace(/\/$/, "")}/invite/accept?token=${tokenValue}`;

    const roleLabels: Record<MembershipRole, string> = {
      RESTAURANT_OWNER: "Propietario",
      MANAGER: "Manager",
      STAFF_WAITER: "Camarero",
      STAFF_KITCHEN: "Cocina",
      STAFF_BAR: "Barra",
    };

    await sendInvitationEmail({
      toEmail: normalizedEmail,
      restaurantName,
      inviterName,
      roleLabel: roleLabels[role],
      acceptUrl,
    });
  }
  //-aqui termina funcion execute-//
}
//-aqui termina clase InviteTeamMember-//
