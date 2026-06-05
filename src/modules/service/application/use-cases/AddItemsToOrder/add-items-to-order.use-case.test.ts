/**
 * Archivo: add-items-to-order.use-case.test.ts
 * Responsabilidad: Validar el comportamiento del caso de uso AddItemsToOrder.
 * Tipo: lógica
 */

import { describe, expect, it } from "vitest";
import { AddItemsToOrder } from "./add-items-to-order.use-case";
import { Order, OrderValidationError } from "@/modules/service/domain/entities/order.entity";
import type {
  OrderRepository,
  OrderItemRepository,
} from "@/modules/service/domain/ports/order.repository.port";
import type {
  OrderPrimitives,
  OrderItemPrimitives,
  OrderStatus,
  OrderItemStatus,
  PreparationArea,
} from "@/modules/service/domain/types/service.types";

// ---------------------------------------------------------------------------
// Stubs in-memory
// ---------------------------------------------------------------------------

function makeOpenOrder(): OrderPrimitives {
  return Order.create({
    id: "order_1",
    restaurantId: "rest_1",
    tableId: "table_1",
    openedByUserId: "user_1",
  }).toPrimitives();
}

class InMemoryOrderRepository implements OrderRepository {
  constructor(private readonly store: OrderPrimitives | null = null) {}

  async save(_o: OrderPrimitives): Promise<void> {}
  async findById(id: string): Promise<OrderPrimitives | null> {
    return this.store?.id === id ? this.store : null;
  }
  async findActiveByRestaurantId(): Promise<OrderPrimitives[]> { return []; }
  async findByRestaurantAndDateRange(): Promise<OrderPrimitives[]> { return []; }
  async updateStatus(_id: string, _status: OrderStatus): Promise<void> {}
}

class InMemoryOrderItemRepository implements OrderItemRepository {
  public saved: OrderItemPrimitives[] = [];

  async save(item: OrderItemPrimitives): Promise<void> {
    this.saved.push(item);
  }
  async saveMany(items: OrderItemPrimitives[]): Promise<void> {
    this.saved.push(...items);
  }
  async findByOrderId(_orderId: string): Promise<OrderItemPrimitives[]> { return []; }
  async findByRestaurantAreaAndStatus(
    _restaurantId: string,
    _area: PreparationArea,
    _statuses: OrderItemStatus[]
  ): Promise<OrderItemPrimitives[]> { return []; }
  async updateStatus(_id: string, _status: OrderItemStatus, _ts: Date): Promise<void> {}
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("AddItemsToOrder", () => {
  it("añade ítems a una orden abierta y los persiste", async () => {
    const orderRepo = new InMemoryOrderRepository(makeOpenOrder());
    const itemRepo = new InMemoryOrderItemRepository();
    const useCase = new AddItemsToOrder(orderRepo, itemRepo);

    const items = await useCase.execute({
      orderId: "order_1",
      items: [
        { menuItemId: "m1", menuItemName: "Seco de pollo", qty: 2, publicUnitPrice: 7.5, costUnitPrice: 3.0, area: "KITCHEN" },
        { menuItemId: "m2", menuItemName: "Jugo de naranjilla", qty: 1, publicUnitPrice: 2.5, costUnitPrice: 0.8, area: "BAR" },
      ],
    });

    expect(items).toHaveLength(2);
    expect(itemRepo.saved).toHaveLength(2);
    expect(items[0]!.status).toBe("QUEUED");
    expect(items[0]!.orderId).toBe("order_1");
    expect(items[1]!.area).toBe("BAR");
  });

  it("lanza error si la orden no existe", async () => {
    const orderRepo = new InMemoryOrderRepository(null);
    const itemRepo = new InMemoryOrderItemRepository();
    const useCase = new AddItemsToOrder(orderRepo, itemRepo);

    await expect(
      useCase.execute({
        orderId: "order_missing",
        items: [{ menuItemId: "m1", menuItemName: "Test", qty: 1, publicUnitPrice: 5, costUnitPrice: 2, area: "NONE" }],
      })
    ).rejects.toThrow(OrderValidationError);
  });

  it("lanza error si la lista de ítems está vacía", async () => {
    const orderRepo = new InMemoryOrderRepository(makeOpenOrder());
    const itemRepo = new InMemoryOrderItemRepository();
    const useCase = new AddItemsToOrder(orderRepo, itemRepo);

    await expect(
      useCase.execute({ orderId: "order_1", items: [] })
    ).rejects.toThrow(OrderValidationError);
  });

  it("lanza error si qty es 0", async () => {
    const orderRepo = new InMemoryOrderRepository(makeOpenOrder());
    const itemRepo = new InMemoryOrderItemRepository();
    const useCase = new AddItemsToOrder(orderRepo, itemRepo);

    await expect(
      useCase.execute({
        orderId: "order_1",
        items: [{ menuItemId: "m1", menuItemName: "Test", qty: 0, publicUnitPrice: 5, costUnitPrice: 2, area: "NONE" }],
      })
    ).rejects.toThrow(OrderValidationError);
  });

  it("lanza error si la orden está en estado SUBMITTED", async () => {
    const submittedOrder: OrderPrimitives = { ...makeOpenOrder(), status: "SUBMITTED" };
    const orderRepo = new InMemoryOrderRepository(submittedOrder);
    const itemRepo = new InMemoryOrderItemRepository();
    const useCase = new AddItemsToOrder(orderRepo, itemRepo);

    await expect(
      useCase.execute({
        orderId: "order_1",
        items: [{ menuItemId: "m1", menuItemName: "Test", qty: 1, publicUnitPrice: 5, costUnitPrice: 2, area: "NONE" }],
      })
    ).rejects.toThrow(OrderValidationError);
  });

  it("guarda el snapshot de publicUnitPrice y costUnitPrice del momento del pedido", async () => {
    const orderRepo = new InMemoryOrderRepository(makeOpenOrder());
    const itemRepo = new InMemoryOrderItemRepository();
    const useCase = new AddItemsToOrder(orderRepo, itemRepo);

    await useCase.execute({
      orderId: "order_1",
      items: [{ menuItemId: "m1", menuItemName: "Hornado", qty: 1, publicUnitPrice: 9.5, costUnitPrice: 4.2, area: "KITCHEN" }],
    });

    expect(itemRepo.saved[0]!.publicUnitPrice).toBe(9.5);
    expect(itemRepo.saved[0]!.costUnitPrice).toBe(4.2);
  });
});
