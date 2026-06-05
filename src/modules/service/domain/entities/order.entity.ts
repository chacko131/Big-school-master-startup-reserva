/**
 * Archivo: order.entity.ts
 * Responsabilidad: Entidad de dominio Order — representa una orden de mesa activa o cerrada.
 * Tipo: lógica
 */

import type {
  OrderPrimitives,
  OrderStatus,
  CreateOrderProps,
} from "../types/service.types";

// ---------------------------------------------------------------------------
// Errores de dominio inline (sin deps externas)
// ---------------------------------------------------------------------------

export class OrderValidationError extends Error {
  constructor(message: string) {
    super(`Order: ${message}`);
    this.name = "OrderValidationError";
  }
}

// ---------------------------------------------------------------------------
// Entidad Order
// ---------------------------------------------------------------------------

//-aqui empieza clase Order y es para encapsular la lógica de una orden de mesa-//
export class Order {
  private constructor(private readonly props: OrderPrimitives) {}

  //-aqui empieza funcion create y es para construir una Order nueva válida-//
  /**
   * Crea una nueva orden en estado OPEN.
   * @pure
   */
  static create(props: CreateOrderProps): Order {
    if (!props.restaurantId.trim()) {
      throw new OrderValidationError("restaurantId es obligatorio.");
    }
    if (!props.tableId.trim()) {
      throw new OrderValidationError("tableId es obligatorio.");
    }
    if (!props.openedByUserId.trim()) {
      throw new OrderValidationError("openedByUserId es obligatorio.");
    }

    const now = props.createdAt ?? new Date();

    return new Order({
      id: props.id,
      restaurantId: props.restaurantId.trim(),
      tableId: props.tableId.trim(),
      openedByUserId: props.openedByUserId.trim(),
      status: "OPEN",
      totalPublic: 0,
      totalCost: 0,
      openedAt: now,
      closedAt: null,
      version: 1,
      createdAt: now,
      updatedAt: now,
    });
  }
  //-aqui termina funcion create-//

  //-aqui empieza funcion fromPrimitives y es para rehidratar la entidad desde la BD-//
  /** @pure */
  static fromPrimitives(props: OrderPrimitives): Order {
    return new Order({ ...props });
  }
  //-aqui termina funcion fromPrimitives-//

  //-aqui empieza funcion submit y es para transicionar la orden a SUBMITTED-//
  /**
   * Transiciona la orden a SUBMITTED (enviada a cocina/bar).
   * Solo se puede hacer desde OPEN.
   * @sideEffect muta estado interno
   */
  submit(): void {
    if (this.props.status !== "OPEN") {
      throw new OrderValidationError(
        `No se puede enviar una orden en estado ${this.props.status}.`
      );
    }
    this.props.status = "SUBMITTED";
    this.props.updatedAt = new Date();
  }
  //-aqui termina funcion submit-//

  //-aqui empieza funcion close y es para cerrar la orden y registrar totales-//
  /**
   * Cierra la orden y persiste los totales calculados.
   * Solo se puede hacer desde SUBMITTED.
   * @sideEffect muta estado interno
   */
  close(totalPublic: number, totalCost: number): void {
    if (this.props.status !== "SUBMITTED") {
      throw new OrderValidationError(
        `No se puede cerrar una orden en estado ${this.props.status}.`
      );
    }
    if (totalPublic < 0 || totalCost < 0) {
      throw new OrderValidationError("Los totales no pueden ser negativos.");
    }

    const now = new Date();
    this.props.status = "CLOSED";
    this.props.totalPublic = totalPublic;
    this.props.totalCost = totalCost;
    this.props.closedAt = now;
    this.props.updatedAt = now;
  }
  //-aqui termina funcion close-//

  //-aqui empieza funcion cancel y es para anular la orden-//
  /**
   * Cancela la orden. Permitido desde OPEN o SUBMITTED.
   * @sideEffect muta estado interno
   */
  cancel(): void {
    const cancellableStatuses: OrderStatus[] = ["OPEN", "SUBMITTED"];
    if (!cancellableStatuses.includes(this.props.status)) {
      throw new OrderValidationError(
        `No se puede cancelar una orden en estado ${this.props.status}.`
      );
    }
    this.props.status = "CANCELLED";
    this.props.updatedAt = new Date();
  }
  //-aqui termina funcion cancel-//

  // Getters
  get id(): string { return this.props.id; }
  get restaurantId(): string { return this.props.restaurantId; }
  get tableId(): string { return this.props.tableId; }
  get openedByUserId(): string { return this.props.openedByUserId; }
  get status(): OrderStatus { return this.props.status; }
  get totalPublic(): number { return this.props.totalPublic; }
  get totalCost(): number { return this.props.totalCost; }
  get margin(): number { return this.props.totalPublic - this.props.totalCost; }
  get openedAt(): Date { return this.props.openedAt; }
  get closedAt(): Date | null { return this.props.closedAt; }
  get version(): number { return this.props.version; }

  //-aqui empieza funcion toPrimitives y es para serializar la entidad-//
  /** @pure */
  toPrimitives(): OrderPrimitives {
    return { ...this.props };
  }
  //-aqui termina funcion toPrimitives-//
}
//-aqui termina clase Order-//
