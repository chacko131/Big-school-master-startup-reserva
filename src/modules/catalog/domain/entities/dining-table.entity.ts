/**
 * Archivo: dining-table.entity.ts
 * Responsabilidad: Representar la entidad de dominio DiningTable sin dependencias de framework.
 * Tipo: lógica
 */

import { DiningTableValidationError } from "../errors/dining-table-validation.error";

export interface DiningTablePrimitives {
  id: string;
  restaurantId: string;
  name: string;
  capacity: number;
  isActive: boolean;
  isCombinable: boolean;
  sortOrder: number;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDiningTableProps {
  id: string;
  restaurantId: string;
  name: string;
  capacity?: number;
  isActive?: boolean;
  isCombinable?: boolean;
  sortOrder?: number;
  version?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const DEFAULT_TABLE_CAPACITY = 4;
const MIN_TABLE_CAPACITY = 1;

export class DiningTable {
  private constructor(private readonly props: DiningTablePrimitives) {}

  //-aqui empieza funcion create y es para construir una entidad DiningTable valida-//
  /**
   * Crea una entidad DiningTable aplicando reglas mínimas del dominio.
   * @pure
   */
  static create(props: CreateDiningTableProps): DiningTable {
    validateRequiredText(props.id, "id");
    validateRequiredText(props.restaurantId, "restaurantId");
    validateRequiredText(props.name, "name");

    const capacity = props.capacity ?? DEFAULT_TABLE_CAPACITY;
    validateCapacity(capacity);

    const now = new Date();

    return new DiningTable({
      id: props.id.trim(),
      restaurantId: props.restaurantId.trim(),
      name: props.name.trim(),
      capacity,
      isActive: props.isActive ?? true,
      isCombinable: props.isCombinable ?? false,
      sortOrder: props.sortOrder ?? 0,
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
  static fromPrimitives(props: DiningTablePrimitives): DiningTable {
    return DiningTable.create(props);
  }
  //-aqui termina funcion fromPrimitives y se va autilizar en repositories-//

  get id(): string {
    return this.props.id;
  }

  get restaurantId(): string {
    return this.props.restaurantId;
  }

  get capacity(): number {
    return this.props.capacity;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get isCombinable(): boolean {
    return this.props.isCombinable;
  }

  //-aqui empieza funcion activate y es para activar la mesa dentro del dominio-//
  /**
   * Devuelve una nueva entidad con la mesa activa.
   * @pure
   */
  activate(): DiningTable {
    return new DiningTable({
      ...this.props,
      isActive: true,
      version: this.props.version + 1,
      updatedAt: new Date(),
    });
  }
  //-aqui termina funcion activate y se va autilizar en casos de uso de catalogo-//

  //-aqui empieza funcion deactivate y es para desactivar la mesa dentro del dominio-//
  /**
   * Devuelve una nueva entidad con la mesa inactiva.
   * @pure
   */
  deactivate(): DiningTable {
    return new DiningTable({
      ...this.props,
      isActive: false,
      version: this.props.version + 1,
      updatedAt: new Date(),
    });
  }
  //-aqui termina funcion deactivate y se va autilizar en casos de uso de catalogo-//

  //-aqui empieza funcion updateCapacity y es para cambiar la capacidad de la mesa respetando reglas del dominio-//
  /**
   * Devuelve una nueva entidad con capacidad actualizada.
   * @pure
   */
  updateCapacity(capacity: number): DiningTable {
    validateCapacity(capacity);

    return new DiningTable({
      ...this.props,
      capacity,
      version: this.props.version + 1,
      updatedAt: new Date(),
    });
  }
  //-aqui termina funcion updateCapacity y se va autilizar en casos de uso de catalogo-//

  //-aqui empieza funcion toPrimitives y es para exponer la entidad en formato serializable-//
  /**
   * Expone la entidad en formato primitivo.
   * @pure
   */
  toPrimitives(): DiningTablePrimitives {
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
    throw new DiningTableValidationError(fieldName);
  }
}
//-aqui termina funcion validateRequiredText y se va autilizar en create-//

//-aqui empieza funcion validateCapacity y es para validar la capacidad de la mesa dentro del dominio-//
/**
 * Valida que la capacidad de la mesa sea válida.
 * @pure
 */
function validateCapacity(capacity: number): void {
  if (!Number.isInteger(capacity) || capacity < MIN_TABLE_CAPACITY) {
    throw new DiningTableValidationError("capacity", "must be a positive integer.");
  }
}
//-aqui termina funcion validateCapacity y se va autilizar en create y updateCapacity-//
