/**
 * Archivo: submit-order.use-case.test.ts
 * Responsabilidad: Validar el comportamiento del caso de uso SubmitOrder.
 * Tipo: lógica
 */

import { describe, expect, it } from "vitest";
import { SubmitOrder } from "./submit-order.use-case";
import { Order, OrderValidationError } from "@/modules/service/domain/entities/order.entity";
import type { OrderRepository } from "@/modules/service/domain/ports/order.repository.port";
import type {
  OrderPrimitives,
  OrderStatus,
} from "@/modules/service/domain/types/service.types";

// ---------------------------------------------------------------------------
// Stub in-memory
// ---------------------------------------------------------------------------

class InMemoryOrderRepository implements OrderRepository {
  public updatedId: string | null = null;
  public updatedStatus: OrderStatus | null = null;

  constructor(private readonly store: OrderPrimitives | null = null) {}

  async save(_o: OrderPrimitives): Promise<void> {}

  async findById(id: string): Promise<OrderPrimitives | null> {
    return this.store?.id === id ? this.store : null;
  }

  async findActiveByRestaurantId(): Promise<OrderPrimitives[]> { return []; }
  async findByRestaurantAndDateRange(): Promise<OrderPrimitives[]> { return []; }

  async updateStatus(id: string, status: OrderStatus): Promise<void> {
    this.updatedId = id;
    this.updatedStatus = status;
  }
}

function makeOpenOrder(): OrderPrimitives {
  return Order.create({
    id: "order_1",
    restaurantId: "rest_1",
    tableId: "table_1",
    openedByUserId: "user_1",
  }).toPrimitives();
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("SubmitOrder", () => {
  it("transiciona una orden OPEN a SUBMITTED y persiste el cambio", async () => {
    const repo = new InMemoryOrderRepository(makeOpenOrder());
    const useCase = new SubmitOrder(repo);

    const result = await useCase.execute({ orderId: "order_1" });

    expect(result.status).toBe("SUBMITTED");
    expect(repo.updatedId).toBe("order_1");
    expect(repo.updatedStatus).toBe("SUBMITTED");
  });

  it("lanza error si la orden no existe", async () => {
    const repo = new InMemoryOrderRepository(null);
    const useCase = new SubmitOrder(repo);

    await expect(
      useCase.execute({ orderId: "order_missing" })
    ).rejects.toThrow(OrderValidationError);
  });

  it("lanza error si la orden ya está SUBMITTED", async () => {
    const submitted: OrderPrimitives = { ...makeOpenOrder(), status: "SUBMITTED" };
    const repo = new InMemoryOrderRepository(submitted);
    const useCase = new SubmitOrder(repo);

    await expect(
      useCase.execute({ orderId: "order_1" })
    ).rejects.toThrow(OrderValidationError);
  });

  it("lanza error si la orden está CLOSED", async () => {
    const closed: OrderPrimitives = { ...makeOpenOrder(), status: "CLOSED" };
    const repo = new InMemoryOrderRepository(closed);
    const useCase = new SubmitOrder(repo);

    await expect(
      useCase.execute({ orderId: "order_1" })
    ).rejects.toThrow(OrderValidationError);
  });

  it("lanza error si la orden está CANCELLED", async () => {
    const cancelled: OrderPrimitives = { ...makeOpenOrder(), status: "CANCELLED" };
    const repo = new InMemoryOrderRepository(cancelled);
    const useCase = new SubmitOrder(repo);

    await expect(
      useCase.execute({ orderId: "order_1" })
    ).rejects.toThrow(OrderValidationError);
  });
});
