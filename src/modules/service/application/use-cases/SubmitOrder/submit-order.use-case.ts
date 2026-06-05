/**
 * Archivo: submit-order.use-case.ts
 * Responsabilidad: Caso de uso para enviar una orden a cocina/bar (OPEN → SUBMITTED).
 * Tipo: lógica
 */

import { Order, OrderValidationError } from "@/modules/service/domain/entities/order.entity";
import type { OrderRepository } from "@/modules/service/domain/ports/order.repository.port";
import type { OrderPrimitives } from "@/modules/service/domain/types/service.types";

// ---------------------------------------------------------------------------
// DTO
// ---------------------------------------------------------------------------

export interface SubmitOrderInput {
  orderId: string;
}

// ---------------------------------------------------------------------------
// Caso de uso
// ---------------------------------------------------------------------------

//-aqui empieza clase SubmitOrder y es para enviar la orden a cocina/bar-//
export class SubmitOrder {
  constructor(private readonly orderRepository: OrderRepository) {}

  //-aqui empieza funcion execute y es para transicionar la orden a SUBMITTED-//
  /**
   * Transiciona la orden de OPEN a SUBMITTED.
   * Falla si la orden no existe o ya fue enviada/cerrada.
   * @sideEffect actualiza estado en BD
   */
  async execute(input: SubmitOrderInput): Promise<OrderPrimitives> {
    const raw = await this.orderRepository.findById(input.orderId);
    if (!raw) {
      throw new OrderValidationError(`Orden ${input.orderId} no encontrada.`);
    }

    const order = Order.fromPrimitives(raw);
    order.submit(); // lanza OrderValidationError si no está OPEN

    await this.orderRepository.updateStatus(order.id, "SUBMITTED");

    return order.toPrimitives();
  }
  //-aqui termina funcion execute-//
}
//-aqui termina clase SubmitOrder-//
