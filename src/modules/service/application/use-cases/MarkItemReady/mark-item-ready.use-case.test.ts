/**
 * Archivo: mark-item-ready.use-case.test.ts
 * Responsabilidad: Validar el comportamiento del caso de uso MarkItemReady.
 * Tipo: lógica
 */

import { describe, expect, it } from "vitest";
import { MarkItemReady } from "./mark-item-ready.use-case";
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
    menuItemName: "Hornado de Riobamba",
    qty: 2,
    publicUnitPrice: 9.5,
    costUnitPrice: 4.2,
    area: "KITCHEN" as PreparationArea,
    status,
    queuedAt: now,
    preparingAt: status === "PREPARING" ? now : null,
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

describe("MarkItemReady", () => {
  it("transiciona un ítem PREPARING a READY y persiste el cambio", async () => {
    const repo = new InMemoryOrderItemRepository(makeItem("PREPARING"));
    const useCase = new MarkItemReady(repo);

    const result = await useCase.execute({ orderItemId: "item_1" });

    expect(result.status).toBe("READY");
    expect(result.readyAt).not.toBeNull();
    expect(repo.updatedStatus).toBe("READY");
  });

  it("lanza error si el ítem no existe", async () => {
    const repo = new InMemoryOrderItemRepository(null);
    const useCase = new MarkItemReady(repo);

    await expect(useCase.execute({ orderItemId: "missing" }))
      .rejects.toThrow(OrderValidationError);
  });

  it("lanza error si el ítem está QUEUED (aún no tomado)", async () => {
    const repo = new InMemoryOrderItemRepository(makeItem("QUEUED"));
    const useCase = new MarkItemReady(repo);

    await expect(useCase.execute({ orderItemId: "item_1" }))
      .rejects.toThrow(OrderValidationError);
  });

  it("lanza error si el ítem ya está READY", async () => {
    const repo = new InMemoryOrderItemRepository(makeItem("READY"));
    const useCase = new MarkItemReady(repo);

    await expect(useCase.execute({ orderItemId: "item_1" }))
      .rejects.toThrow(OrderValidationError);
  });

  it("lanza error si el ítem ya fue servido", async () => {
    const repo = new InMemoryOrderItemRepository(makeItem("SERVED"));
    const useCase = new MarkItemReady(repo);

    await expect(useCase.execute({ orderItemId: "item_1" }))
      .rejects.toThrow(OrderValidationError);
  });
});
