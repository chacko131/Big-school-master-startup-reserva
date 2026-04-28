/**
 * Archivo: restaurant-settings.entity.ts
 * Responsabilidad: Representar la entidad de dominio RestaurantSettings sin dependencias de framework.
 * Tipo: lógica
 */

import { RestaurantSettingsValidationError } from "../errors/restaurant-settings-validation.error";

export type ReservationApprovalMode = "AUTO" | "MANUAL";
export type WaitlistMode = "MANUAL" | "AUTO";

export interface RestaurantSettingsPrimitives {
  id: string;
  restaurantId: string;
  reservationApprovalMode: ReservationApprovalMode;
  waitlistMode: WaitlistMode;
  defaultReservationDurationMinutes: number;
  reservationBufferMinutes: number;
  cancellationWindowHours: number;
  allowTableCombination: boolean;
  enableAutoTableAssignment: boolean;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRestaurantSettingsProps {
  id: string;
  restaurantId: string;
  reservationApprovalMode?: ReservationApprovalMode;
  waitlistMode?: WaitlistMode;
  defaultReservationDurationMinutes?: number;
  reservationBufferMinutes?: number;
  cancellationWindowHours?: number;
  allowTableCombination?: boolean;
  enableAutoTableAssignment?: boolean;
  version?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const DEFAULT_DURATION_MINUTES = 90;
const DEFAULT_BUFFER_MINUTES = 15;
const DEFAULT_CANCELLATION_WINDOW_HOURS = 24;
const MIN_ALLOWED_MINUTES = 0;
const MIN_RESERVATION_DURATION_MINUTES = 1;

export class RestaurantSettings {
  private constructor(private readonly props: RestaurantSettingsPrimitives) {}

  //-aqui empieza funcion create y es para construir una entidad RestaurantSettings valida-//
  /**
   * Crea una entidad RestaurantSettings aplicando reglas mínimas del dominio.
   * @pure
   */
  static create(props: CreateRestaurantSettingsProps): RestaurantSettings {
    validateRequiredText(props.id, "id");
    validateRequiredText(props.restaurantId, "restaurantId");

    const defaultReservationDurationMinutes = props.defaultReservationDurationMinutes ?? DEFAULT_DURATION_MINUTES;
    const reservationBufferMinutes = props.reservationBufferMinutes ?? DEFAULT_BUFFER_MINUTES;
    const cancellationWindowHours = props.cancellationWindowHours ?? DEFAULT_CANCELLATION_WINDOW_HOURS;

    validatePositiveInteger(defaultReservationDurationMinutes, "defaultReservationDurationMinutes", MIN_RESERVATION_DURATION_MINUTES);
    validatePositiveInteger(reservationBufferMinutes, "reservationBufferMinutes", MIN_ALLOWED_MINUTES);
    validatePositiveInteger(cancellationWindowHours, "cancellationWindowHours", MIN_ALLOWED_MINUTES);

    const now = new Date();

    return new RestaurantSettings({
      id: props.id.trim(),
      restaurantId: props.restaurantId.trim(),
      reservationApprovalMode: props.reservationApprovalMode ?? "AUTO",
      waitlistMode: props.waitlistMode ?? "MANUAL",
      defaultReservationDurationMinutes,
      reservationBufferMinutes,
      cancellationWindowHours,
      allowTableCombination: props.allowTableCombination ?? true,
      enableAutoTableAssignment: props.enableAutoTableAssignment ?? true,
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
  static fromPrimitives(props: RestaurantSettingsPrimitives): RestaurantSettings {
    return RestaurantSettings.create(props);
  }
  //-aqui termina funcion fromPrimitives y se va autilizar en repositories-//

  get restaurantId(): string {
    return this.props.restaurantId;
  }

  get reservationApprovalMode(): ReservationApprovalMode {
    return this.props.reservationApprovalMode;
  }

  get waitlistMode(): WaitlistMode {
    return this.props.waitlistMode;
  }

  get defaultReservationDurationMinutes(): number {
    return this.props.defaultReservationDurationMinutes;
  }

  get reservationBufferMinutes(): number {
    return this.props.reservationBufferMinutes;
  }

  get cancellationWindowHours(): number {
    return this.props.cancellationWindowHours;
  }

  get allowTableCombination(): boolean {
    return this.props.allowTableCombination;
  }

  get enableAutoTableAssignment(): boolean {
    return this.props.enableAutoTableAssignment;
  }

  //-aqui empieza funcion useManualApproval y es para cambiar la aprobacion de reservas a manual-//
  /**
   * Devuelve una nueva entidad con aprobación manual.
   * @pure
   */
  useManualApproval(): RestaurantSettings {
    return this.update({ reservationApprovalMode: "MANUAL" });
  }
  //-aqui termina funcion useManualApproval y se va autilizar en casos de uso de catalogo-//

  //-aqui empieza funcion useAutomaticApproval y es para cambiar la aprobacion de reservas a automatica-//
  /**
   * Devuelve una nueva entidad con aprobación automática.
   * @pure
   */
  useAutomaticApproval(): RestaurantSettings {
    return this.update({ reservationApprovalMode: "AUTO" });
  }
  //-aqui termina funcion useAutomaticApproval y se va autilizar en casos de uso de catalogo-//

  //-aqui empieza funcion update y es para actualizar configuraciones del restaurante respetando reglas del dominio-//
  /**
   * Devuelve una nueva entidad con ajustes actualizados.
   * @pure
   */
  update(
    changes: Partial<
      Pick<
        RestaurantSettingsPrimitives,
        | "reservationApprovalMode"
        | "waitlistMode"
        | "defaultReservationDurationMinutes"
        | "reservationBufferMinutes"
        | "cancellationWindowHours"
        | "allowTableCombination"
        | "enableAutoTableAssignment"
      >
    >,
  ): RestaurantSettings {
    const defaultReservationDurationMinutes =
      changes.defaultReservationDurationMinutes ?? this.props.defaultReservationDurationMinutes;
    const reservationBufferMinutes = changes.reservationBufferMinutes ?? this.props.reservationBufferMinutes;
    const cancellationWindowHours = changes.cancellationWindowHours ?? this.props.cancellationWindowHours;

    validatePositiveInteger(defaultReservationDurationMinutes, "defaultReservationDurationMinutes", MIN_RESERVATION_DURATION_MINUTES);
    validatePositiveInteger(reservationBufferMinutes, "reservationBufferMinutes", MIN_ALLOWED_MINUTES);
    validatePositiveInteger(cancellationWindowHours, "cancellationWindowHours", MIN_ALLOWED_MINUTES);

    return new RestaurantSettings({
      ...this.props,
      ...changes,
      defaultReservationDurationMinutes,
      reservationBufferMinutes,
      cancellationWindowHours,
      version: this.props.version + 1,
      updatedAt: new Date(),
    });
  }
  //-aqui termina funcion update y se va autilizar en casos de uso de catalogo-//

  //-aqui empieza funcion toPrimitives y es para exponer la entidad en formato serializable-//
  /**
   * Expone la entidad en formato primitivo.
   * @pure
   */
  toPrimitives(): RestaurantSettingsPrimitives {
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
    throw new RestaurantSettingsValidationError(fieldName);
  }
}
//-aqui termina funcion validateRequiredText y se va autilizar en create-//

//-aqui empieza funcion validatePositiveInteger y es para validar enteros no negativos o positivos segun la regla del dominio-//
/**
 * Valida enteros según el mínimo permitido por la regla del dominio.
 * @pure
 */
function validatePositiveInteger(value: number, fieldName: string, minimumValue: number): void {
  if (!Number.isInteger(value) || value < minimumValue) {
    throw new RestaurantSettingsValidationError(
      fieldName,
      `must be an integer greater than or equal to ${minimumValue}.`,
    );
  }
}
//-aqui termina funcion validatePositiveInteger y se va autilizar en create y update-//
