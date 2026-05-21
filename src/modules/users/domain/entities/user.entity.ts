/**
 * Archivo: user.entity.ts
 * Responsabilidad: Representar la entidad de dominio User sin dependencias de framework.
 * Tipo: lógica
 */

import { UserValidationError } from "../errors/user-validation.error";

/// Rol global del usuario dentro de la plataforma SaaS.
/// SUPER_ADMIN → dueño de la startup, acceso total a todos los restaurantes.
/// USER        → cualquier usuario autenticado sin privilegios globales.
export type GlobalRole = "SUPER_ADMIN" | "USER";

export interface UserPrimitives {
  id: string;
  clerkId: string;
  email: string;
  fullName: string | null;
  globalRole: GlobalRole;
  novuSyncedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserProps {
  id: string;
  clerkId: string;
  email: string;
  fullName?: string | null;
  globalRole?: GlobalRole;
  novuSyncedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UpdateUserProps {
  email?: string;
  fullName?: string | null;
}

/// Email hardcodeado del SUPER_ADMIN único de la plataforma.
const SUPER_ADMIN_EMAIL = "jesusnodarse7@gmail.com";

export class User {
  private constructor(private readonly props: UserPrimitives) {}

  //-aqui empieza funcion create y es para construir una entidad User valida-//
  /**
   * Crea una entidad User aplicando las reglas del dominio.
   * Asigna automáticamente SUPER_ADMIN al email del dueño de la startup.
   * @pure
   */
  static create(props: CreateUserProps): User {
    validateRequiredText(props.id, "id");
    validateRequiredText(props.clerkId, "clerkId");
    validateRequiredEmail(props.email);

    const now = new Date();

    // El rol SUPER_ADMIN se asigna automáticamente al email del dueño de la startup.
    // Cualquier otro email recibe rol USER por defecto.
    const globalRole: GlobalRole =
      props.email.trim().toLowerCase() === SUPER_ADMIN_EMAIL
        ? "SUPER_ADMIN"
        : (props.globalRole ?? "USER");

    return new User({
      id: props.id.trim(),
      clerkId: props.clerkId.trim(),
      email: props.email.trim().toLowerCase(),
      fullName: normalizeOptionalText(props.fullName),
      globalRole,
      novuSyncedAt: props.novuSyncedAt ?? null,
      createdAt: props.createdAt ?? now,
      updatedAt: props.updatedAt ?? now,
    });
  }
  //-aqui termina funcion create y se va autilizar en application e infrastructure-//

  //-aqui empieza funcion fromPrimitives y es para rehidratar la entidad desde datos persistidos-//
  /**
   * Rehidrata la entidad desde datos primitivos ya persistidos en DB.
   * @pure
   */
  static fromPrimitives(props: UserPrimitives): User {
    return new User(props);
  }
  //-aqui termina funcion fromPrimitives y se va autilizar en repositories-//

  get id(): string {
    return this.props.id;
  }

  get clerkId(): string {
    return this.props.clerkId;
  }

  get email(): string {
    return this.props.email;
  }

  get fullName(): string | null {
    return this.props.fullName;
  }

  get globalRole(): GlobalRole {
    return this.props.globalRole;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get novuSyncedAt(): Date | null {
    return this.props.novuSyncedAt;
  }

  //-aqui empieza funcion markNovuSynced y es para marcar al usuario como registrado en Novu-//
  /**
   * Devuelve una nueva entidad User con novuSyncedAt establecido a la fecha actual.
   * @pure
   */
  markNovuSynced(): User {
    return new User({
      ...this.props,
      novuSyncedAt: new Date(),
      updatedAt: new Date(),
    });
  }
  //-aqui termina funcion markNovuSynced-//

  //-aqui empieza funcion isSuperAdmin y es para verificar si el usuario tiene privilegios globales-//
  /**
   * Indica si el usuario tiene rol de superadmin de la plataforma.
   * @pure
   */
  isSuperAdmin(): boolean {
    return this.props.globalRole === "SUPER_ADMIN";
  }
  //-aqui termina funcion isSuperAdmin-//

  //-aqui empieza funcion updateProfile y es para actualizar los datos del perfil del usuario-//
  /**
   * Devuelve una nueva entidad User con el perfil actualizado.
   * El globalRole no puede modificarse desde este método por seguridad.
   * @pure
   */
  updateProfile(props: UpdateUserProps): User {
    return new User({
      ...this.props,
      email: props.email ? props.email.trim().toLowerCase() : this.props.email,
      fullName: "fullName" in props ? normalizeOptionalText(props.fullName) : this.props.fullName,
      updatedAt: new Date(),
    });
  }
  //-aqui termina funcion updateProfile y se va autilizar en SyncUserFromClerk-//

  //-aqui empieza funcion toPrimitives y es para exponer la entidad en formato serializable-//
  /**
   * Expone la entidad en formato primitivo serializable.
   * @pure
   */
  toPrimitives(): UserPrimitives {
    return {
      id: this.props.id,
      clerkId: this.props.clerkId,
      email: this.props.email,
      fullName: this.props.fullName,
      globalRole: this.props.globalRole,
      novuSyncedAt: this.props.novuSyncedAt,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
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

//-aqui empieza funcion validateRequiredEmail y es para validar el formato basico del email-//
/**
 * Valida que el email tenga formato mínimo válido.
 * @pure
 */
function validateRequiredEmail(email: string): void {
  if (!email || email.trim().length === 0) {
    throw new UserValidationError("email");
  }
  if (!email.includes("@")) {
    throw new UserValidationError("email (formato inválido)");
  }
}
//-aqui termina funcion validateRequiredEmail-//

//-aqui empieza funcion normalizeOptionalText y es para normalizar textos opcionales del dominio-//
/**
 * Normaliza strings opcionales convirtiendo vacíos en null.
 * @pure
 */
function normalizeOptionalText(value?: string | null): string | null {
  if (value === undefined || value === null) return null;
  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
}
//-aqui termina funcion normalizeOptionalText-//
