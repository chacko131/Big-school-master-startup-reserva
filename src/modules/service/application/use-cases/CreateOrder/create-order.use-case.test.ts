/**
 * Archivo: create-order.use-case.test.ts
 * Responsabilidad: Validar el comportamiento del caso de uso CreateOrder.
 * Tipo: lógica
 */

import { describe, expect, it } from "vitest";
import { CreateOrder } from "./create-order.use-case";
import { OrderValidationError } from "@/modules/service/domain/entities/order.entity";
import type { OrderRepository } from "@/modules/service/domain/ports/order.repository.port";
import type {
  OrderPrimitives,
  OrderStatus,
} from "@/modules/service/domain/types/service.types";

// ---------------------------------------------------------------------------
// Stub in-memory
// ---------------------------------------------------------------------------

class InMemoryOrderRepository implements OrderRepository {
  public saved: OrderPrimitives | null = null;

  async save(order: OrderPrimitives): Promise<void> {
    this.saved = order;
  }

  async findById(id: string): Promise<OrderPrimitives | null> {
    return this.saved?.id === id ? this.saved : null;
  }

  async findActiveByRestaurantId(): Promise<OrderPrimitives[]> {
    return [];
  }

  async findByRestaurantAndDateRange(): Promise<OrderPrimitives[]> {
    return [];
  }

  async updateStatus(
    _id: string,
    _status: OrderStatus,
  ): Promise<void> {}
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("CreateOrder", () => {
  it("crea una orden en estado OPEN y la persiste", async () => {
    const repo = new InMemoryOrderRepository();
    const useCase = new CreateOrder(repo);

    const result = await useCase.execute({
      restaurantId: "rest_1",
      tableId: "table_1",
      openedByUserId: "user_1",
    });

    expect(result.status).toBe("OPEN");
    expect(result.restaurantId).toBe("rest_1");
    expect(result.tableId).toBe("table_1");
    expect(result.openedByUserId).toBe("user_1");
    expect(result.totalPublic).toBe(0);
    expect(result.totalCost).toBe(0);
    expect(result.id).toBeTruthy();
    expect(repo.saved).not.toBeNull();
    expect(repo.saved?.id).toBe(result.id);
  });

  it("lanza error si restaurantId está vacío", async () => {
    const repo = new InMemoryOrderRepository();
    const useCase = new CreateOrder(repo);

    await expect(
      useCase.execute({ restaurantId: "  ", tableId: "table_1", openedByUserId: "user_1" })
    ).rejects.toThrow(OrderValidationError);
  });

  it("lanza error si tableId está vacío", async () => {
    const repo = new InMemoryOrderRepository();
    const useCase = new CreateOrder(repo);

    await expect(
      useCase.execute({ restaurantId: "rest_1", tableId: "", openedByUserId: "user_1" })
    ).rejects.toThrow(OrderValidationError);
  });

  it("lanza error si openedByUserId está vacío", async () => {
    const repo = new InMemoryOrderRepository();
    const useCase = new CreateOrder(repo);

    await expect(
      useCase.execute({ restaurantId: "rest_1", tableId: "table_1", openedByUserId: "" })
    ).rejects.toThrow(OrderValidationError);
  });

  it("genera un id único en cada llamada", async () => {
    const repo1 = new InMemoryOrderRepository();
    const repo2 = new InMemoryOrderRepository();
    const useCase1 = new CreateOrder(repo1);
    const useCase2 = new CreateOrder(repo2);

    const r1 = await useCase1.execute({ restaurantId: "r", tableId: "t", openedByUserId: "u" });
    const r2 = await useCase2.execute({ restaurantId: "r", tableId: "t", openedByUserId: "u" });

    expect(r1.id).not.toBe(r2.id);
  });
});
