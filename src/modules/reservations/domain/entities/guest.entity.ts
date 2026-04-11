/**
 * Archivo: guest.entity.ts
 * Responsabilidad: Representar la entidad de dominio Guest sin dependencias de framework.
 * Tipo: lógica
 */

import { GuestValidationError } from "../errors/guest-validation.error";

export interface GuestPrimitives {
  id: string;
  restaurantId: string;
  fullName: string;
  phone: string;
  email: string | null;
  notes: string | null;
  noShowCount: number;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateGuestProps {
  id: string;
  restaurantId: string;
  fullName: string;
  phone: string;
  email?: string | null;
  notes?: string | null;
  noShowCount?: number;
  version?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Guest {
  private constructor(private readonly props: GuestPrimitives) {}

  //-aqui empieza funcion create y es para construir una entidad Guest valida-//
  /**
   * Crea una entidad Guest aplicando reglas mínimas del dominio.
   * @pure
   */
  static create(props: CreateGuestProps): Guest {
    validateRequiredText(props.id, "id");
    validateRequiredText(props.restaurantId, "restaurantId");
    validateRequiredText(props.fullName, "fullName");
    validateRequiredText(props.phone, "phone");

    const now = new Date();

    return new Guest({
      id: props.id.trim(),
      restaurantId: props.restaurantId.trim(),
      fullName: props.fullName.trim(),
      phone: props.phone.trim(),
      email: normalizeOptionalText(props.email),
      notes: normalizeOptionalText(props.notes),
      noShowCount: props.noShowCount ?? 0,
      version: props.version ?? 1,
      createdAt: props.createdAt ?? now,
      updatedAt: props.updatedAt ?? now,
    });
  }
  //-aqui termina funcion create y se va autilizar en application e infrastructure-//

  //-aqui empieza funcion fromPrimitives y es para rehidratar la entidad desde datos persistidos-//
  /**
   * Rehidrata la entidad desde datos primitivos ya persistidos.
   * @pure
   */
  static fromPrimitives(props: GuestPrimitives): Guest {
    return Guest.create(props);
  }
  //-aqui termina funcion fromPrimitives y se va autilizar en repositories-//

  get id(): string {
    return this.props.id;
  }

  get restaurantId(): string {
    return this.props.restaurantId;
  }

  get fullName(): string {
    return this.props.fullName;
  }

  get phone(): string {
    return this.props.phone;
  }

  get noShowCount(): number {
    return this.props.noShowCount;
  }

  //-aqui empieza funcion registerNoShow y es para registrar una ausencia dentro del dominio-//
  /**
   * Devuelve una nueva entidad incrementando el contador de no-show.
   * @pure
   */
  registerNoShow(): Guest {
    return new Guest({
      ...this.props,
      noShowCount: this.props.noShowCount + 1,
      version: this.props.version + 1,
      updatedAt: new Date(),
    });
  }
  //-aqui termina funcion registerNoShow y se va autilizar en casos de uso de reservas-//

  //-aqui empieza funcion toPrimitives y es para exponer la entidad en formato serializable-//
  /**
   * Expone la entidad en formato primitivo.
   * @pure
   */
  toPrimitives(): GuestPrimitives {
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
  if (value.trim().length === 0) {
    throw new GuestValidationError(fieldName);
  }
}
//-aqui termina funcion validateRequiredText y se va autilizar en create-//

//-aqui empieza funcion normalizeOptionalText y es para normalizar textos opcionales del dominio-//
/**
 * Normaliza strings opcionales convirtiendo vacíos en null.
 * @pure
 */
function normalizeOptionalText(value?: string | null): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  const normalizedValue = value.trim();

  if (normalizedValue.length === 0) {
    return null;
  }

  return normalizedValue;
}
//-aqui termina funcion normalizeOptionalText y se va autilizar en create-//
