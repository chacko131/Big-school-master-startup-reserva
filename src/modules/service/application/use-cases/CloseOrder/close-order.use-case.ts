/**
 * Archivo: close-order.use-case.ts
 * Responsabilidad: Caso de uso para cerrar una orden (SUBMITTED → CLOSED).
 *   Calcula los totales sumando los ítems y libera la mesa.
 * Tipo: lógica
 */

import { Order, OrderValidationError } from "@/modules/service/domain/entities/order.entity";
import type { OrderRepository, OrderItemRepository } from "@/modules/service/domain/ports/order.repository.port";
import type { OrderPrimitives } from "@/modules/service/domain/types/service.types";

// ---------------------------------------------------------------------------
// DTO
// ---------------------------------------------------------------------------

export interface CloseOrderInput {
  orderId: string;
}

// ---------------------------------------------------------------------------
// Caso de uso
// ---------------------------------------------------------------------------

//-aqui empieza clase CloseOrder y es para cerrar la orden y liberar la mesa-//
export class CloseOrder {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly orderItemRepository: OrderItemRepository
  ) {}

  //-aqui empieza funcion execute y es para calcular totales y transicionar a CLOSED-//
  /**
   * Cierra la orden sumando los totales de sus ítems.
   * La orden queda CLOSED y la mesa queda libre.
   * @sideEffect escribe en BD
   */
  async execute(input: CloseOrderInput): Promise<OrderPrimitives> {
    const raw = await this.orderRepository.findById(input.orderId);
    if (!raw) {
      throw new OrderValidationError(`Orden ${input.orderId} no encontrada.`);
    }

    const order = Order.fromPrimitives(raw);

    // Calcular totales desde los ítems reales
    const items = await this.orderItemRepository.findByOrderId(input.orderId);
    const totalPublic = items.reduce((acc, i) => acc + i.publicUnitPrice * i.qty, 0);
    const totalCost   = items.reduce((acc, i) => acc + i.costUnitPrice   * i.qty, 0);

    order.close(totalPublic, totalCost);

    await this.orderRepository.updateStatus(
      order.id,
      "CLOSED",
      { totalPublic, totalCost },
      order.closedAt ?? new Date()
    );

    return order.toPrimitives();
  }
  //-aqui termina funcion execute-//
}
//-aqui termina clase CloseOrder-//
