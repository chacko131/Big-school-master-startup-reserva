/**
 * Archivo: reservation-table.entity.ts
 * Responsabilidad: Representar la relación entre Reservation y DiningTable sin dependencias de framework.
 * Tipo: lógica
 */

import { ReservationTableValidationError } from "../errors/reservation-table-validation.error";

export interface ReservationTablePrimitives {
  id: string;
  reservationId: string;
  tableId: string;
  assignedSeats: number | null;
  version: number;
  assignedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReservationTableProps {
  id: string;
  reservationId: string;
  tableId: string;
  assignedSeats?: number | null;
  version?: number;
  assignedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const MIN_ASSIGNED_SEATS = 1;

export class ReservationTable {
  private constructor(private readonly props: ReservationTablePrimitives) {}

  //-aqui empieza funcion create y es para construir una entidad ReservationTable valida-//
  /**
   * Crea una entidad ReservationTable aplicando reglas mínimas del dominio.
   * @pure
   */
  static create(props: CreateReservationTableProps): ReservationTable {
    validateRequiredText(props.id, "id");
    validateRequiredText(props.reservationId, "reservationId");
    validateRequiredText(props.tableId, "tableId");

    const now = new Date();
    const assignedSeats = normalizeAssignedSeats(props.assignedSeats);

    return new ReservationTable({
      id: props.id.trim(),
      reservationId: props.reservationId.trim(),
      tableId: props.tableId.trim(),
      assignedSeats,
      version: props.version ?? 1,
      assignedAt: props.assignedAt ?? now,
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
  static fromPrimitives(props: ReservationTablePrimitives): ReservationTable {
    return ReservationTable.create(props);
  }
  //-aqui termina funcion fromPrimitives y se va autilizar en repositories-//

  get reservationId(): string {
    return this.props.reservationId;
  }

  get tableId(): string {
    return this.props.tableId;
  }

  get assignedSeats(): number | null {
    return this.props.assignedSeats;
  }

  //-aqui empieza funcion withAssignedSeats y es para ajustar plazas asignadas dentro del dominio-//
  /**
   * Devuelve una nueva entidad con plazas asignadas actualizadas.
   * @pure
   */
  withAssignedSeats(assignedSeats: number | null): ReservationTable {
    const normalizedAssignedSeats = normalizeAssignedSeats(assignedSeats);

    return new ReservationTable({
      ...this.props,
      assignedSeats: normalizedAssignedSeats,
      version: this.props.version + 1,
      updatedAt: new Date(),
    });
  }
  //-aqui termina funcion withAssignedSeats y se va autilizar en casos de uso de reservas-//

  //-aqui empieza funcion toPrimitives y es para exponer la entidad en formato serializable-//
  /**
   * Expone la entidad en formato primitivo.
   * @pure
   */
  toPrimitives(): ReservationTablePrimitives {
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
    throw new ReservationTableValidationError(fieldName);
  }
}
//-aqui termina funcion validateRequiredText y se va autilizar en create-//

//-aqui empieza funcion normalizeAssignedSeats y es para normalizar la cantidad de plazas asignadas-//
/**
 * Normaliza las plazas asignadas validando si el valor es correcto.
 * @pure
 */
function normalizeAssignedSeats(value?: number | null): number | null {
  if (value === undefined || value === null) {
    return null;
  }

  if (!Number.isInteger(value) || value < MIN_ASSIGNED_SEATS) {
    throw new ReservationTableValidationError("assignedSeats", "must be a positive integer when provided.");
  }

  return value;
}
//-aqui termina funcion normalizeAssignedSeats y se va autilizar en create y withAssignedSeats-//
