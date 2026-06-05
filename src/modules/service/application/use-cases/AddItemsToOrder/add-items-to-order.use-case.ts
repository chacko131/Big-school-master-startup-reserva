/**
 * Archivo: add-items-to-order.use-case.ts
 * Responsabilidad: Caso de uso para añadir ítems a una orden abierta.
 *   Guarda snapshot de precios en el momento del pedido (auditoría histórica inmutable).
 * Tipo: lógica
 */

import { randomUUID } from "crypto";
import { Order, OrderValidationError } from "@/modules/service/domain/entities/order.entity";
import type {
  OrderRepository,
  OrderItemRepository,
} from "@/modules/service/domain/ports/order.repository.port";
import type {
  OrderItemPrimitives,
  PreparationArea,
} from "@/modules/service/domain/types/service.types";

// ---------------------------------------------------------------------------
// DTOs
// ---------------------------------------------------------------------------

export interface AddItemInput {
  menuItemId: string;
  menuItemName: string;
  qty: number;
  publicUnitPrice: number;   // snapshot del precio público en el momento del pedido
  costUnitPrice: number;     // snapshot del costo en el momento del pedido
  area: PreparationArea;
}

export interface AddItemsToOrderInput {
  orderId: string;
  items: AddItemInput[];
}

// ---------------------------------------------------------------------------
// Caso de uso
// ---------------------------------------------------------------------------

//-aqui empieza clase AddItemsToOrder y es para añadir platos a una orden abierta-//
export class AddItemsToOrder {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly orderItemRepository: OrderItemRepository
  ) {}

  //-aqui empieza funcion execute y es para validar la orden y persistir los ítems-//
  /**
   * Añade ítems a una orden OPEN. Falla si la orden no existe o no está abierta.
   * @sideEffect escribe en BD
   */
  async execute(input: AddItemsToOrderInput): Promise<OrderItemPrimitives[]> {
    if (input.items.length === 0) {
      throw new OrderValidationError("Debes añadir al menos un ítem.");
    }

    // Rehidratar la orden y validar su estado
    const raw = await this.orderRepository.findById(input.orderId);
    if (!raw) {
      throw new OrderValidationError(`Orden ${input.orderId} no encontrada.`);
    }

    const order = Order.fromPrimitives(raw);
    if (order.status !== "OPEN") {
      throw new OrderValidationError(
        `No se pueden añadir ítems a una orden en estado ${order.status}.`
      );
    }

    // Construir primitivos de OrderItem
    const now = new Date();
    const orderItems: OrderItemPrimitives[] = input.items.map((item) => {
      if (item.qty < 1) {
        throw new OrderValidationError(
          `La cantidad de "${item.menuItemName}" debe ser mayor que 0.`
        );
      }
      if (item.publicUnitPrice < 0 || item.costUnitPrice < 0) {
        throw new OrderValidationError(
          `Los precios de "${item.menuItemName}" no pueden ser negativos.`
        );
      }

      return {
        id: randomUUID(),
        orderId: input.orderId,
        menuItemId: item.menuItemId,
        menuItemName: item.menuItemName,
        qty: item.qty,
        publicUnitPrice: item.publicUnitPrice,
        costUnitPrice: item.costUnitPrice,
        area: item.area,
        status: "QUEUED",
        queuedAt: now,
        preparingAt: null,
        readyAt: null,
        servedAt: null,
        cancelledAt: null,
        version: 1,
        createdAt: now,
        updatedAt: now,
      } satisfies OrderItemPrimitives;
    });

    await this.orderItemRepository.saveMany(orderItems);

    return orderItems;
  }
  //-aqui termina funcion execute-//
}
//-aqui termina clase AddItemsToOrder-//
