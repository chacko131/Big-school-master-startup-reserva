/**
 * Archivo: team-invitation-token.entity.ts
 * Responsabilidad: Representar el token de invitación de un solo uso para unirse a un restaurante.
 * Tipo: lógica
 */

import { type MembershipRole } from "./user-restaurant-membership.entity";
import { UserValidationError } from "../errors/user-validation.error";

export interface TeamInvitationTokenPrimitives {
  id: string;
  token: string;
  email: string;
  restaurantId: string;
  role: MembershipRole;
  invitedById: string;
  expiresAt: Date;
  usedAt: Date | null;
  createdAt: Date;
}

export interface CreateTeamInvitationTokenProps {
  id: string;
  token: string;
  email: string;
  restaurantId: string;
  role: MembershipRole;
  invitedById: string;
  expiresAt: Date;
}

const INVITATION_EXPIRY_HOURS = 48;

export class TeamInvitationToken {
  private constructor(private readonly props: TeamInvitationTokenPrimitives) {}

  //-aqui empieza funcion create y es para construir un token de invitacion valido-//
  /**
   * Construye un token de invitación con expiración de 48 horas.
   * @pure
   */
  static create(props: CreateTeamInvitationTokenProps): TeamInvitationToken {
    if (!props.token || props.token.trim().length === 0) {
      throw new UserValidationError("token");
    }
    if (!props.email || !props.email.includes("@")) {
      throw new UserValidationError("email");
    }

    return new TeamInvitationToken({
      ...props,
      email: props.email.trim().toLowerCase(),
      usedAt: null,
      createdAt: new Date(),
    });
  }
  //-aqui termina funcion create-//

  //-aqui empieza funcion fromPrimitives y es para rehidratar el token desde datos persistidos-//
  /**
   * @pure
   */
  static fromPrimitives(props: TeamInvitationTokenPrimitives): TeamInvitationToken {
    return new TeamInvitationToken(props);
  }
  //-aqui termina funcion fromPrimitives-//

  //-aqui empieza funcion buildExpiresAt y es para calcular la fecha de expiracion estandar-//
  /**
   * Devuelve la fecha de expiración estándar (ahora + 48 horas).
   * @pure
   */
  static buildExpiresAt(): Date {
    const date = new Date();
    date.setHours(date.getHours() + INVITATION_EXPIRY_HOURS);
    return date;
  }
  //-aqui termina funcion buildExpiresAt-//

  get id(): string { return this.props.id; }
  get token(): string { return this.props.token; }
  get email(): string { return this.props.email; }
  get restaurantId(): string { return this.props.restaurantId; }
  get role(): MembershipRole { return this.props.role; }
  get invitedById(): string { return this.props.invitedById; }
  get expiresAt(): Date { return this.props.expiresAt; }
  get usedAt(): Date | null { return this.props.usedAt; }
  get createdAt(): Date { return this.props.createdAt; }

  //-aqui empieza funcion isExpired y es para verificar si el token ya no es valido por tiempo-//
  /**
   * @pure
   */
  isExpired(): boolean {
    return new Date() > this.props.expiresAt;
  }
  //-aqui termina funcion isExpired-//

  //-aqui empieza funcion isUsed y es para verificar si el token ya fue consumido-//
  /**
   * @pure
   */
  isUsed(): boolean {
    return this.props.usedAt !== null;
  }
  //-aqui termina funcion isUsed-//

  //-aqui empieza funcion isValid y es para verificar si el token puede ser aceptado-//
  /**
   * Un token es válido si no ha expirado y no ha sido usado.
   * @pure
   */
  isValid(): boolean {
    return !this.isExpired() && !this.isUsed();
  }
  //-aqui termina funcion isValid-//

  //-aqui empieza funcion markAsUsed y es para consumir el token de forma inmutable-//
  /**
   * Devuelve una nueva instancia con usedAt = ahora.
   * @pure
   */
  markAsUsed(): TeamInvitationToken {
    return new TeamInvitationToken({
      ...this.props,
      usedAt: new Date(),
    });
  }
  //-aqui termina funcion markAsUsed-//

  toPrimitives(): TeamInvitationTokenPrimitives {
    return { ...this.props };
  }
}
