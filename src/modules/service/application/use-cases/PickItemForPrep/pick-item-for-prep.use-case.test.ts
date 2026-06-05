/**
 * Archivo: pick-item-for-prep.use-case.test.ts
 * Responsabilidad: Validar el comportamiento del caso de uso PickItemForPrep.
 * Tipo: lógica
 */

import { describe, expect, it } from "vitest";
import { PickItemForPrep } from "./pick-item-for-prep.use-case";
import { OrderValidationError } from "@/modules/service/domain/entities/order.entity";
import type { OrderItemRepository } from "@/modules/service/domain/ports/order.repository.port";
import type {
  OrderItemPrimitives,
  OrderItemStatus,
  PreparationArea,
} from "@/modules/service/domain/types/service.types";

// ---------------------------------------------------------------------------
// Stub in-memory
// ---------------------------------------------------------------------------

function makeItem(status: OrderItemStatus): OrderItemPrimitives {
  const now = new Date();
  return {
    id: "item_1",
    orderId: "order_1",
    menuItemId: "menu_1",
    menuItemName: "Seco de pollo",
    qty: 1,
    publicUnitPrice: 7.5,
    costUnitPrice: 3.0,
    area: "KITCHEN" as PreparationArea,
    status,
    queuedAt: now,
    preparingAt: null,
    readyAt: null,
    servedAt: null,
    cancelledAt: null,
    version: 1,
    createdAt: now,
    updatedAt: now,
  };
}

class InMemoryOrderItemRepository implements OrderItemRepository {
  public updatedStatus: OrderItemStatus | null = null;

  constructor(private readonly store: OrderItemPrimitives | null = null) {}

  async findById(id: string): Promise<OrderItemPrimitives | null> {
    return this.store?.id === id ? this.store : null;
  }
  async save(_i: OrderItemPrimitives): Promise<void> {}
  async saveMany(_i: OrderItemPrimitives[]): Promise<void> {}
  async findByOrderId(): Promise<OrderItemPrimitives[]> { return []; }
  async findByRestaurantAreaAndStatus(): Promise<OrderItemPrimitives[]> { return []; }
  async updateStatus(_id: string, status: OrderItemStatus): Promise<void> {
    this.updatedStatus = status;
  }
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("PickItemForPrep", () => {
  it("transiciona un ítem QUEUED a PREPARING y persiste el cambio", async () => {
    const repo = new InMemoryOrderItemRepository(makeItem("QUEUED"));
    const useCase = new PickItemForPrep(repo);

    const result = await useCase.execute({ orderItemId: "item_1" });

    expect(result.status).toBe("PREPARING");
    expect(result.preparingAt).not.toBeNull();
    expect(repo.updatedStatus).toBe("PREPARING");
  });

  it("lanza error si el ítem no existe", async () => {
    const repo = new InMemoryOrderItemRepository(null);
    const useCase = new PickItemForPrep(repo);

    await expect(useCase.execute({ orderItemId: "missing" }))
      .rejects.toThrow(OrderValidationError);
  });

  it("lanza error si el ítem ya está PREPARING", async () => {
    const repo = new InMemoryOrderItemRepository(makeItem("PREPARING"));
    const useCase = new PickItemForPrep(repo);

    await expect(useCase.execute({ orderItemId: "item_1" }))
      .rejects.toThrow(OrderValidationError);
  });

  it("lanza error si el ítem ya está READY", async () => {
    const repo = new InMemoryOrderItemRepository(makeItem("READY"));
    const useCase = new PickItemForPrep(repo);

    await expect(useCase.execute({ orderItemId: "item_1" }))
      .rejects.toThrow(OrderValidationError);
  });
});
