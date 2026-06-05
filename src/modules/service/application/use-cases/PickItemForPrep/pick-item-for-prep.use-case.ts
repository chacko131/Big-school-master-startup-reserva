/**
 * Archivo: pick-item-for-prep.use-case.ts
 * Responsabilidad: Caso de uso para que cocina/bar tome un ítem de la cola (QUEUED → PREPARING).
 * Tipo: lógica
 */

import { OrderValidationError } from "@/modules/service/domain/entities/order.entity";
import type { OrderItemRepository } from "@/modules/service/domain/ports/order.repository.port";
import type { OrderItemPrimitives } from "@/modules/service/domain/types/service.types";

// ---------------------------------------------------------------------------
// DTO
// ---------------------------------------------------------------------------

export interface PickItemForPrepInput {
  orderItemId: string;
}

// ---------------------------------------------------------------------------
// Caso de uso
// ---------------------------------------------------------------------------

//-aqui empieza clase PickItemForPrep y es para transicionar un ítem de QUEUED a PREPARING-//
export class PickItemForPrep {
  constructor(private readonly orderItemRepository: OrderItemRepository) {}

  //-aqui empieza funcion execute y es para validar y transicionar el ítem a PREPARING-//
  /**
   * Transiciona el ítem de QUEUED a PREPARING.
   * Falla si el ítem no existe o ya no está en cola.
   * @sideEffect actualiza estado en BD
   */
  async execute(input: PickItemForPrepInput): Promise<OrderItemPrimitives> {
    const item = await this.orderItemRepository.findById(input.orderItemId);

    if (!item) {
      throw new OrderValidationError(`Ítem ${input.orderItemId} no encontrado.`);
    }
    if (item.status !== "QUEUED") {
      throw new OrderValidationError(
        `No se puede preparar un ítem en estado ${item.status}.`
      );
    }

    const now = new Date();
    await this.orderItemRepository.updateStatus(input.orderItemId, "PREPARING", now);

    return { ...item, status: "PREPARING", preparingAt: now, updatedAt: now };
  }
  //-aqui termina funcion execute-//
}
//-aqui termina clase PickItemForPrep-//
