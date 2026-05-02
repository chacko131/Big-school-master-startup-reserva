/**
 * Archivo: business-hours.entity.ts
 * Responsabilidad: Representar los horarios de apertura de un restaurante sin dependencias de framework.
 * Tipo: lógica
 */

export type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export interface BusinessHoursPrimitives {
  id: string;
  restaurantId: string;
  day: DayOfWeek;
  opensAt: string; // HH:mm
  closesAt: string; // HH:mm
  isClosed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBusinessHoursProps {
  id: string;
  restaurantId: string;
  day: DayOfWeek;
  opensAt: string;
  closesAt: string;
  isClosed?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Expresión regular para validar el formato HH:mm
const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

export class BusinessHours {
  private constructor(private readonly props: BusinessHoursPrimitives) {}

  //-aqui empieza funcion create y es para construir un BusinessHours válido-//
  /**
   * Crea una entidad BusinessHours validando el formato de los horarios.
   * @pure
   */
  static create(props: CreateBusinessHoursProps): BusinessHours {
    if (!props.restaurantId.trim()) {
      throw new Error("BusinessHours: restaurantId es obligatorio.");
    }

    if (!props.isClosed) {
      if (!TIME_REGEX.test(props.opensAt)) {
        throw new Error(`BusinessHours: opensAt "${props.opensAt}" no tiene formato HH:mm válido.`);
      }
      if (!TIME_REGEX.test(props.closesAt)) {
        throw new Error(`BusinessHours: closesAt "${props.closesAt}" no tiene formato HH:mm válido.`);
      }
    }

    const now = new Date();

    return new BusinessHours({
      id: props.id,
      restaurantId: props.restaurantId.trim(),
      day: props.day,
      opensAt: props.opensAt,
      closesAt: props.closesAt,
      isClosed: props.isClosed ?? false,
      createdAt: props.createdAt ?? now,
      updatedAt: props.updatedAt ?? now,
    });
  }
  //-aqui termina funcion create y se va autilizar en application e infrastructure-//

  //-aqui empieza funcion fromPrimitives y es para rehidratar la entidad desde datos persistidos-//
  /**
   * Rehidrata la entidad desde primitivos ya persistidos.
   * @pure
   */
  static fromPrimitives(props: BusinessHoursPrimitives): BusinessHours {
    return BusinessHours.create(props);
  }
  //-aqui termina funcion fromPrimitives y se va autilizar en repositories-//

  get id(): string { return this.props.id; }
  get restaurantId(): string { return this.props.restaurantId; }
  get day(): DayOfWeek { return this.props.day; }
  get opensAt(): string { return this.props.opensAt; }
  get closesAt(): string { return this.props.closesAt; }
  get isClosed(): boolean { return this.props.isClosed; }

  //-aqui empieza funcion toPrimitives y es para exponer la entidad en formato serializable-//
  /**
   * Expone la entidad en formato primitivo.
   * @pure
   */
  toPrimitives(): BusinessHoursPrimitives {
    return { ...this.props };
  }
  //-aqui termina funcion toPrimitives y se va autilizar en infrastructure y testing-//
}
