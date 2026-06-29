/**
 * Archivo: mark-item-served.use-case.ts
 * Responsabilidad: Caso de uso para que el mesero marque un ítem como servido (READY → SERVED).
 * Tipo: lógica
 */

import { OrderValidationError } from "@/modules/service/domain/entities/order.entity";
import type { OrderItemRepository } from "@/modules/service/domain/ports/order.repository.port";
import type { OrderItemPrimitives } from "@/modules/service/domain/types/service.types";

// ---------------------------------------------------------------------------
// DTO
// ---------------------------------------------------------------------------

export interface MarkItemServedInput {
  orderItemId: string;
}

// ---------------------------------------------------------------------------
// Caso de uso
// ---------------------------------------------------------------------------

//-aqui empieza clase MarkItemServed y es para transicionar un ítem de READY a SERVED-//
export class MarkItemServed {
  constructor(private readonly orderItemRepository: OrderItemRepository) {}

  //-aqui empieza funcion execute y es para marcar un ítem como servido-//
  /**
   * Transiciona el ítem de READY a SERVED.
   * Falla si el ítem no existe o no está listo para servir.
   * @sideEffect actualiza estado en BD
   */
  async execute(input: MarkItemServedInput): Promise<OrderItemPrimitives> {
    const item = await this.orderItemRepository.findById(input.orderItemId);

    if (!item) {
      throw new OrderValidationError(`Ítem ${input.orderItemId} no encontrado.`);
    }
    if (item.status !== "READY") {
      throw new OrderValidationError(
        `No se puede marcar como servido un ítem en estado ${item.status}.`
      );
    }

    const now = new Date();
    await this.orderItemRepository.updateStatus(input.orderItemId, "SERVED", now);

    return { ...item, status: "SERVED", servedAt: now, updatedAt: now };
  }
  //-aqui termina funcion execute-//
}
//-aqui termina clase MarkItemServed-//
