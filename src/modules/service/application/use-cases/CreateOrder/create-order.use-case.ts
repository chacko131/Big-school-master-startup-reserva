/**
 * Archivo: create-order.use-case.ts
 * Responsabilidad: Caso de uso para abrir una nueva orden en una mesa.
 * Tipo: lógica
 */

import { randomUUID } from "crypto";
import { Order } from "@/modules/service/domain/entities/order.entity";
import type { OrderRepository } from "@/modules/service/domain/ports/order.repository.port";
import type { OrderPrimitives } from "@/modules/service/domain/types/service.types";

// ---------------------------------------------------------------------------
// DTO de entrada
// ---------------------------------------------------------------------------

export interface CreateOrderInput {
  restaurantId: string;
  tableId: string;
  openedByUserId: string;
}

// ---------------------------------------------------------------------------
// Caso de uso
// ---------------------------------------------------------------------------

//-aqui empieza clase CreateOrder y es para abrir una nueva orden en una mesa-//
export class CreateOrder {
  constructor(private readonly orderRepository: OrderRepository) {}

  //-aqui empieza funcion execute y es para crear y persistir la orden-//
  /**
   * Crea una orden en estado OPEN y la persiste.
   * @sideEffect escribe en BD
   */
  async execute(input: CreateOrderInput): Promise<OrderPrimitives> {
    const order = Order.create({
      id: randomUUID(),
      restaurantId: input.restaurantId,
      tableId: input.tableId,
      openedByUserId: input.openedByUserId,
    });

    await this.orderRepository.save(order.toPrimitives());

    return order.toPrimitives();
  }
  //-aqui termina funcion execute-//
}
//-aqui termina clase CreateOrder-//
