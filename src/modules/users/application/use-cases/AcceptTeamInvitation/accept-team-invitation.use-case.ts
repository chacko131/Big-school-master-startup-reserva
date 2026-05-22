/**
 * Archivo: accept-team-invitation.use-case.ts
 * Responsabilidad: Validar el token de invitación y activar la membership del usuario.
 * Tipo: lógica
 */

import { randomUUID } from "crypto";
import { type MembershipRepository } from "@/modules/users/domain/ports/membership.repository.port";
import { type TeamInvitationTokenRepository } from "@/modules/users/domain/ports/team-invitation-token.repository.port";
import { type UserRepository } from "@/modules/users/domain/ports/user.repository.port";
import { type RestaurantRepository } from "@/modules/catalog/application/ports/restaurant-repository.port";
import { type NotificationProvider } from "@/modules/notifications/domain/ports/notification-provider.port";
import { UserRestaurantMembership } from "@/modules/users/domain/entities/user-restaurant-membership.entity";
import { UserValidationError } from "@/modules/users/domain/errors/user-validation.error";
import { NotifyMemberAccepted } from "@/modules/notifications/application/use-cases/NotifyMemberAccepted/notify-member-accepted.use-case";

export interface AcceptTeamInvitationInput {
  token: string;
  acceptingUserId: string;
  acceptingUserEmail: string;
}

export interface AcceptTeamInvitationOutput {
  restaurantId: string;
}

export interface AcceptTeamInvitationDeps {
  membershipRepository: MembershipRepository;
  invitationTokenRepository: TeamInvitationTokenRepository;
  userRepository?: UserRepository;
  restaurantRepository?: RestaurantRepository;
  notificationProvider?: NotificationProvider;
}

//-aqui empieza clase AcceptTeamInvitation y es para activar la membership al aceptar la invitacion-//
/**
 * Valida el token, crea o activa la membership y marca el token como usado.
 * Es idempotente: si la membership ya existe como ACTIVE, no falla.
 * Si se inyectan userRepository, restaurantRepository y notificationProvider,
 * notifica al owner en el momento en que el miembro acepta.
 */
export class AcceptTeamInvitation {
  private readonly membershipRepository: MembershipRepository;
  private readonly invitationTokenRepository: TeamInvitationTokenRepository;
  private readonly userRepository?: UserRepository;
  private readonly restaurantRepository?: RestaurantRepository;
  private readonly notificationProvider?: NotificationProvider;

  constructor(deps: AcceptTeamInvitationDeps) {
    this.membershipRepository = deps.membershipRepository;
    this.invitationTokenRepository = deps.invitationTokenRepository;
    this.userRepository = deps.userRepository;
    this.restaurantRepository = deps.restaurantRepository;
    this.notificationProvider = deps.notificationProvider;
  }

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
    const normalizedAcceptingEmail = acceptingUserEmail.trim().toLowerCase();
    if (invitationToken.email !== normalizedAcceptingEmail) {
      throw new UserValidationError("token", "Este enlace de invitación no corresponde a tu cuenta. Asegúrate de haber iniciado sesión con el email correcto.");
    }

    const { restaurantId, role, invitedById } = invitationToken;

    //-aqui empieza logica de idempotencia y activacion de membership-//
    const existing = await this.membershipRepository.findActiveByUserAndRestaurant(
      acceptingUserId,
      restaurantId
    );

    if (existing !== null) {
      return { restaurantId };
    }

    if (!invitationToken.isValid()) {
      throw new UserValidationError("token", "Esta invitación ha expirado o ya fue utilizada. Pide al propietario que te envíe una nueva.");
    }

    let membershipWasJustActivated = false;

    if (existing === null) {
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
      membershipWasJustActivated = true;
    }
    //-aqui termina logica de idempotencia y activacion de membership-//

    await this.invitationTokenRepository.save(invitationToken.markAsUsed());

    //-aqui empieza disparo de notificacion al owner si estan disponibles las dependencias-//
    if (
      membershipWasJustActivated &&
      invitedById !== null &&
      invitedById !== undefined &&
      this.notificationProvider !== undefined &&
      this.userRepository !== undefined &&
      this.restaurantRepository !== undefined
    ) {
      try {
        await this.notifyOwner({
          invitedById,
          acceptingUserId,
          restaurantId,
          role,
        });
      } catch (error: unknown) {
        console.error('[AcceptTeamInvitation] No se pudo notificar al owner', {
          invitedById,
          acceptingUserId,
          restaurantId,
          role,
          error,
        });
      }
    }
    //-aqui termina disparo de notificacion al owner-//

    return { restaurantId };
  }
  //-aqui termina funcion execute-//

  //-aqui empieza funcion notifyOwner y es para resolver los datos del owner y disparar la notificacion-//
  /**
   * Resuelve owner, nuevo miembro y restaurante para construir el payload de notificación.
   * @sideEffect
   */
  private async notifyOwner({
    invitedById,
    acceptingUserId,
    restaurantId,
    role,
  }: {
    invitedById: string;
    acceptingUserId: string;
    restaurantId: string;
    role: string;
  }): Promise<void> {
    console.log('[NotifyMember] Resolviendo datos para notificación...', { invitedById, acceptingUserId, restaurantId, role });

    const [owner, newMember, restaurant] = await Promise.all([
      this.userRepository!.findById(invitedById),
      this.userRepository!.findById(acceptingUserId),
      this.restaurantRepository!.findById(restaurantId),
    ]);

    if (owner === null || newMember === null || restaurant === null) {
      console.log('[NotifyMember] ❌ Dato no encontrado:', { owner: owner?.id, newMember: newMember?.id, restaurant: restaurant?.id });
      return;
    }

    console.log('[NotifyMember] Disparando notificación a owner...', {
      ownerSubscriberId: owner.clerkId,
      newMemberName: newMember.fullName ?? newMember.email,
      newMemberRole: role,
      restaurantName: restaurant.name,
    });

    await new NotifyMemberAccepted(this.notificationProvider!).execute({
      ownerSubscriberId: owner.clerkId,
      newMemberName: newMember.fullName ?? newMember.email,
      newMemberRole: role,
      restaurantName: restaurant.name,
    });

    console.log('[NotifyMember] ✅ Notificación enviada al owner');
  }
  //-aqui termina funcion notifyOwner-//
}
//-aqui termina clase AcceptTeamInvitation-//
