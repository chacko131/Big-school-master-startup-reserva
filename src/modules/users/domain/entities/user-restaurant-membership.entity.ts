/**
 * Archivo: user-restaurant-membership.entity.ts
 * Responsabilidad: Representar el vínculo entre un User y un Restaurant con su rol y estado.
 * Tipo: lógica
 */

import { UserValidationError } from "../errors/user-validation.error";

/// Rol del usuario dentro de un restaurante concreto.
export type MembershipRole =
  | "RESTAURANT_OWNER"
  | "MANAGER"
  | "STAFF_WAITER"
  | "STAFF_KITCHEN"
  | "STAFF_BAR";

/// Estado del vínculo usuario-restaurante.
/// PENDING  → invitado, aún no ha aceptado.
/// ACTIVE   → acceso operativo activo.
/// REVOKED  → acceso revocado por el owner o el admin.
export type MembershipStatus = "PENDING" | "ACTIVE" | "REVOKED";

export interface UserRestaurantMembershipPrimitives {
  id: string;
  userId: string;
  restaurantId: string;
  role: MembershipRole;
  status: MembershipStatus;
  invitedById: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMembershipProps {
  id: string;
  userId: string;
  restaurantId: string;
  role: MembershipRole;
  status?: MembershipStatus;
  invitedById?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class UserRestaurantMembership {
  private constructor(private readonly props: UserRestaurantMembershipPrimitives) {}

  //-aqui empieza funcion create y es para construir una membership valida entre user y restaurante-//
  /**
   * Crea un vínculo entre un User y un Restaurant con las reglas del dominio.
   * Por defecto el estado es PENDING (para invitaciones) salvo que sea el owner original.
   * @pure
   */
  static create(props: CreateMembershipProps): UserRestaurantMembership {
    validateRequiredText(props.id, "id");
    validateRequiredText(props.userId, "userId");
    validateRequiredText(props.restaurantId, "restaurantId");

    const now = new Date();

    return new UserRestaurantMembership({
      id: props.id.trim(),
      userId: props.userId.trim(),
      restaurantId: props.restaurantId.trim(),
      role: props.role,
      status: props.status ?? "PENDING",
      invitedById: props.invitedById ?? null,
      createdAt: props.createdAt ?? now,
      updatedAt: props.updatedAt ?? now,
    });
  }
  //-aqui termina funcion create y se va autilizar en application e infrastructure-//

  //-aqui empieza funcion fromPrimitives y es para rehidratar la membership desde datos persistidos-//
  /**
   * Rehidrata la entidad desde datos primitivos ya persistidos en DB.
   * @pure
   */
  static fromPrimitives(props: UserRestaurantMembershipPrimitives): UserRestaurantMembership {
    return new UserRestaurantMembership(props);
  }
  //-aqui termina funcion fromPrimitives y se va autilizar en repositories-//

  get id(): string {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get restaurantId(): string {
    return this.props.restaurantId;
  }

  get role(): MembershipRole {
    return this.props.role;
  }

  get status(): MembershipStatus {
    return this.props.status;
  }

  get invitedById(): string | null {
    return this.props.invitedById;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  //-aqui empieza funcion isActive y es para verificar si el acceso al restaurante esta activo-//
  /**
   * Indica si la membership está activa y permite acceso al restaurante.
   * @pure
   */
  isActive(): boolean {
    return this.props.status === "ACTIVE";
  }
  //-aqui termina funcion isActive-//

  //-aqui empieza funcion isOwner y es para verificar si el usuario es dueno del restaurante-//
  /**
   * Indica si el usuario es el dueño del restaurante.
   * @pure
   */
  isOwner(): boolean {
    return this.props.role === "RESTAURANT_OWNER";
  }
  //-aqui termina funcion isOwner-//

  //-aqui empieza funcion activate y es para activar una membership pendiente-//
  /**
   * Devuelve una nueva membership con estado ACTIVE.
   * Se usa cuando el usuario acepta la invitación.
   * @pure
   */
  activate(): UserRestaurantMembership {
    return new UserRestaurantMembership({
      ...this.props,
      status: "ACTIVE",
      updatedAt: new Date(),
    });
  }
  //-aqui termina funcion activate-//

  //-aqui empieza funcion revoke y es para revocar el acceso de un usuario a un restaurante-//
  /**
   * Devuelve una nueva membership con estado REVOKED.
   * Solo el owner o el superadmin pueden revocar accesos.
   * @pure
   */
  revoke(): UserRestaurantMembership {
    return new UserRestaurantMembership({
      ...this.props,
      status: "REVOKED",
      updatedAt: new Date(),
    });
  }
  //-aqui termina funcion revoke-//

  //-aqui empieza funcion toPrimitives y es para exponer la membership en formato serializable-//
  /**
   * Expone la entidad en formato primitivo serializable.
   * @pure
   */
  toPrimitives(): UserRestaurantMembershipPrimitives {
    return { ...this.props };
  }
  //-aqui termina funcion toPrimitives y se va autilizar en infrastructure y testing-//
}

//-aqui empieza funcion validateRequiredText y es para validar strings obligatorios del dominio-//
/**
 * Valida que un texto obligatorio no esté vacío.
 * @pure
 */
function validateRequiredText(value: string, fieldName: string): void {
  if (!value || value.trim().length === 0) {
    throw new UserValidationError(fieldName);
  }
}
//-aqui termina funcion validateRequiredText-//
