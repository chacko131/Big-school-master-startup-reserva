/**
 * Archivo: mark-item-ready.use-case.ts
 * Responsabilidad: Caso de uso para que cocina/bar marque un ítem como listo (PREPARING → READY).
 * Tipo: lógica
 */

import { OrderValidationError } from "@/modules/service/domain/entities/order.entity";
import type { OrderItemRepository } from "@/modules/service/domain/ports/order.repository.port";
import type { OrderItemPrimitives } from "@/modules/service/domain/types/service.types";

// ---------------------------------------------------------------------------
// DTO
// ---------------------------------------------------------------------------

export interface MarkItemReadyInput {
  orderItemId: string;
}

// ---------------------------------------------------------------------------
// Caso de uso
// ---------------------------------------------------------------------------

//-aqui empieza clase MarkItemReady y es para transicionar un ítem de PREPARING a READY-//
export class MarkItemReady {
  constructor(private readonly orderItemRepository: OrderItemRepository) {}

  //-aqui empieza funcion execute y es para validar y transicionar el ítem a READY-//
  /**
   * Transiciona el ítem de PREPARING a READY.
   * Falla si el ítem no existe o no está en preparación.
   * @sideEffect actualiza estado en BD
   */
  async execute(input: MarkItemReadyInput): Promise<OrderItemPrimitives> {
    const item = await this.orderItemRepository.findById(input.orderItemId);

    if (!item) {
      throw new OrderValidationError(`Ítem ${input.orderItemId} no encontrado.`);
    }
    if (item.status !== "PREPARING") {
      throw new OrderValidationError(
        `No se puede marcar como listo un ítem en estado ${item.status}.`
      );
    }

    const now = new Date();
    await this.orderItemRepository.updateStatus(input.orderItemId, "READY", now);

    return { ...item, status: "READY", readyAt: now, updatedAt: now };
  }
  //-aqui termina funcion execute-//
}
//-aqui termina clase MarkItemReady-//
