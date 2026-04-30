/**
 * Archivo: restaurant-zone.entity.ts
 * Responsabilidad: Representar la entidad de dominio RestaurantZone sin dependencias de framework.
 * Tipo: lógica
 */

import { RestaurantZoneValidationError } from "@/modules/catalog/domain/errors/restaurant-zone-validation.error";

export interface RestaurantZonePrimitives {
  id: string;
  restaurantId: string;
  name: string;
  color: string;
  sortOrder: number;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRestaurantZoneProps {
  id: string;
  restaurantId: string;
  name: string;
  color?: string;
  sortOrder?: number;
  version?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const DEFAULT_ZONE_COLOR = "#6366f1";

export class RestaurantZone {
  private constructor(private readonly props: RestaurantZonePrimitives) {}

  //-aqui empieza funcion create y es para construir una entidad RestaurantZone valida-//
  /**
   * Crea una entidad RestaurantZone aplicando reglas mínimas del dominio.
   * @pure
   */
  static create(props: CreateRestaurantZoneProps): RestaurantZone {
    validateRequiredText(props.id, "id");
    validateRequiredText(props.restaurantId, "restaurantId");
    validateRequiredText(props.name, "name");

    const now = new Date();

    return new RestaurantZone({
      id: props.id.trim(),
      restaurantId: props.restaurantId.trim(),
      name: props.name.trim(),
      color: props.color ?? DEFAULT_ZONE_COLOR,
      sortOrder: props.sortOrder ?? 0,
      version: props.version ?? 1,
      createdAt: props.createdAt ?? now,
      updatedAt: props.updatedAt ?? now,
    });
  }
  //-aqui termina funcion create-//

  //-aqui empieza funcion fromPrimitives y es para rehidratar la entidad desde datos persistidos-//
  /**
   * Rehidrata la entidad desde datos primitivos ya persistidos.
   * @pure
   */
  static fromPrimitives(props: RestaurantZonePrimitives): RestaurantZone {
    return RestaurantZone.create(props);
  }
  //-aqui termina funcion fromPrimitives-//

  get id(): string {
    return this.props.id;
  }

  get restaurantId(): string {
    return this.props.restaurantId;
  }

  get name(): string {
    return this.props.name;
  }

  get color(): string {
    return this.props.color;
  }

  get sortOrder(): number {
    return this.props.sortOrder;
  }

  //-aqui empieza funcion rename y es para cambiar el nombre de la zona respetando reglas del dominio-//
  /**
   * Devuelve una nueva entidad con el nombre actualizado.
   * @pure
   */
  rename(name: string): RestaurantZone {
    validateRequiredText(name, "name");

    return new RestaurantZone({
      ...this.props,
      name: name.trim(),
      version: this.props.version + 1,
      updatedAt: new Date(),
    });
  }
  //-aqui termina funcion rename-//

  //-aqui empieza funcion toPrimitives y es para exponer la entidad en formato serializable-//
  /**
   * Expone la entidad en formato primitivo.
   * @pure
   */
  toPrimitives(): RestaurantZonePrimitives {
    return { ...this.props };
  }
  //-aqui termina funcion toPrimitives-//
}

//-aqui empieza funcion validateRequiredText y es para validar strings obligatorios del dominio-//
/**
 * Valida que un texto obligatorio no esté vacío.
 * @pure
 */
function validateRequiredText(value: string, fieldName: string): void {
  if (value.trim().length === 0) {
    throw new RestaurantZoneValidationError(fieldName);
  }
}
//-aqui termina funcion validateRequiredText-//
