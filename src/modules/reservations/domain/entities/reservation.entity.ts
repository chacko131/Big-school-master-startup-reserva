/**
 * Archivo: reservation.entity.ts
 * Responsabilidad: Representar la entidad de dominio Reservation sin dependencias de framework.
 * Tipo: lógica
 */

import { ReservationValidationError } from "../errors/reservation-validation.error";

export type ReservationStatus =
  | "PENDING"
  | "CONFIRMED"
  | "WAITLISTED"
  | "CHECKED_IN"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW";

export interface ReservationPrimitives {
  id: string;
  restaurantId: string;
  guestId: string;
  status: ReservationStatus;
  partySize: number;
  startAt: Date;
  endAt: Date;
  cancellationDeadlineAt: Date | null;
  cancelledAt: Date | null;
  checkedInAt: Date | null;
  completedAt: Date | null;
  noShowMarkedAt: Date | null;
  specialRequests: string | null;
  internalNotes: string | null;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReservationProps {
  id: string;
  restaurantId: string;
  guestId: string;
  partySize: number;
  startAt: Date;
  endAt: Date;
  status?: ReservationStatus;
  cancellationDeadlineAt?: Date | null;
  specialRequests?: string | null;
  internalNotes?: string | null;
  cancelledAt?: Date | null;
  checkedInAt?: Date | null;
  completedAt?: Date | null;
  noShowMarkedAt?: Date | null;
  version?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const MIN_PARTY_SIZE = 1;

export class Reservation {
  private constructor(private readonly props: ReservationPrimitives) {}

  //-aqui empieza funcion create y es para construir una entidad Reservation valida-//
  /**
   * Crea una entidad Reservation aplicando reglas mínimas del dominio.
   * @pure
   */
  static create(props: CreateReservationProps): Reservation {
    validateRequiredText(props.id, "id");
    validateRequiredText(props.restaurantId, "restaurantId");
    validateRequiredText(props.guestId, "guestId");
    validatePartySize(props.partySize);
    validateDateOrder(props.startAt, props.endAt);

    const now = new Date();

    return new Reservation({
      id: props.id.trim(),
      restaurantId: props.restaurantId.trim(),
      guestId: props.guestId.trim(),
      status: props.status ?? "PENDING",
      partySize: props.partySize,
      startAt: props.startAt,
      endAt: props.endAt,
      cancellationDeadlineAt: props.cancellationDeadlineAt ?? null,
      cancelledAt: props.cancelledAt ?? null,
      checkedInAt: props.checkedInAt ?? null,
      completedAt: props.completedAt ?? null,
      noShowMarkedAt: props.noShowMarkedAt ?? null,
      specialRequests: normalizeOptionalText(props.specialRequests),
      internalNotes: normalizeOptionalText(props.internalNotes),
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
  static fromPrimitives(props: ReservationPrimitives): Reservation {
    return Reservation.create(props);
  }
  //-aqui termina funcion fromPrimitives y se va autilizar en repositories-//

  get id(): string {
    return this.props.id;
  }

  get restaurantId(): string {
    return this.props.restaurantId;
  }

  get guestId(): string {
    return this.props.guestId;
  }

  get status(): ReservationStatus {
    return this.props.status;
  }

  get partySize(): number {
    return this.props.partySize;
  }

  //-aqui empieza funcion confirm y es para confirmar una reserva dentro del dominio-//
  /**
   * Devuelve una nueva entidad con estado confirmado.
   * @pure
   */
  confirm(): Reservation {
    return this.updateStatus("CONFIRMED");
  }
  //-aqui termina funcion confirm y se va autilizar en casos de uso de reservas-//

  //-aqui empieza funcion cancel y es para cancelar una reserva dentro del dominio-//
  /**
   * Devuelve una nueva entidad con estado cancelado.
   * @pure
   */
  cancel(): Reservation {
    return new Reservation({
      ...this.props,
      status: "CANCELLED",
      cancelledAt: new Date(),
      version: this.props.version + 1,
      updatedAt: new Date(),
    });
  }
  //-aqui termina funcion cancel y se va autilizar en casos de uso de reservas-//

  //-aqui empieza funcion markNoShow y es para marcar un no-show dentro del dominio-//
  /**
   * Devuelve una nueva entidad marcando un no-show.
   * @pure
   */
  markNoShow(): Reservation {
    return new Reservation({
      ...this.props,
      status: "NO_SHOW",
      noShowMarkedAt: new Date(),
      version: this.props.version + 1,
      updatedAt: new Date(),
    });
  }
  //-aqui termina funcion markNoShow y se va autilizar en casos de uso de reservas-//

  //-aqui empieza funcion toPrimitives y es para exponer la entidad en formato serializable-//
  /**
   * Expone la entidad en formato primitivo.
   * @pure
   */
  toPrimitives(): ReservationPrimitives {
    return { ...this.props };
  }
  //-aqui termina funcion toPrimitives y se va autilizar en infrastructure y testing-//

  //-aqui empieza funcion updateStatus y es para cambiar el estado respetando las reglas del dominio-//
  /**
   * Devuelve una nueva entidad con un estado actualizado.
   * @pure
   */
  private updateStatus(status: ReservationStatus): Reservation {
    return new Reservation({
      ...this.props,
      status,
      version: this.props.version + 1,
      updatedAt: new Date(),
    });
  }
  //-aqui termina funcion updateStatus y se va autilizar en los metodos de estado-//
}

//-aqui empieza funcion validateRequiredText y es para validar strings obligatorios del dominio-//
/**
 * Valida que un texto obligatorio no esté vacío.
 * @pure
 */
function validateRequiredText(value: string, fieldName: string): void {
  if (value.trim().length === 0) {
    throw new ReservationValidationError(fieldName);
  }
}
//-aqui termina funcion validateRequiredText y se va autilizar en create-//

//-aqui empieza funcion validatePartySize y es para validar el tamaño de la reserva dentro del dominio-//
/**
 * Valida que el tamaño del grupo sea válido.
 * @pure
 */
function validatePartySize(partySize: number): void {
  if (!Number.isInteger(partySize) || partySize < MIN_PARTY_SIZE) {
    throw new ReservationValidationError("partySize", "must be a positive integer.");
  }
}
//-aqui termina funcion validatePartySize y se va autilizar en create-//

//-aqui empieza funcion validateDateOrder y es para validar el orden temporal de la reserva-//
/**
 * Valida que la fecha de inicio sea anterior a la fecha de fin.
 * @pure
 */
function validateDateOrder(startAt: Date, endAt: Date): void {
  if (!(startAt instanceof Date) || Number.isNaN(startAt.getTime())) {
    throw new ReservationValidationError("startAt", "must be a valid date.");
  }

  if (!(endAt instanceof Date) || Number.isNaN(endAt.getTime())) {
    throw new ReservationValidationError("endAt", "must be a valid date.");
  }

  if (startAt.getTime() >= endAt.getTime()) {
    throw new ReservationValidationError("startAt", "must be before endAt.");
  }
}
//-aqui termina funcion validateDateOrder y se va autilizar en create-//

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
