/**
 * Archivo: prisma-order.repository.ts
 * Responsabilidad: Adaptador Prisma de OrderRepository y OrderItemRepository.
 * Tipo: servicio / infraestructura
 */

import type { PrismaClient } from "@/generated/prisma/client";
import type {
  OrderRepository,
  OrderItemRepository,
} from "../../domain/ports/order.repository.port";
import type {
  OrderPrimitives,
  OrderItemPrimitives,
  OrderStatus,
  OrderItemStatus,
  PreparationArea,
  MenuItemSalesStat,
  HourlySalesStat,
} from "../../domain/types/service.types";

// ---------------------------------------------------------------------------
// OrderRepository
// ---------------------------------------------------------------------------

//-aqui empieza clase PrismaOrderRepository y es para persistir órdenes con Prisma-//
export class PrismaOrderRepository implements OrderRepository {
  constructor(private readonly prisma: PrismaClient) {}

  //-aqui empieza funcion save y es para crear o actualizar una orden en BD-//
  /** @sideEffect */
  async save(order: OrderPrimitives): Promise<void> {
    await this.prisma.order.upsert({
      where: { id: order.id },
      create: {
        id: order.id,
        restaurantId: order.restaurantId,
        tableId: order.tableId,
        openedByUserId: order.openedByUserId,
        status: order.status,
        totalPublic: order.totalPublic,
        totalCost: order.totalCost,
        openedAt: order.openedAt,
        closedAt: order.closedAt,
        version: order.version,
      },
      update: {
        status: order.status,
        totalPublic: order.totalPublic,
        totalCost: order.totalCost,
        closedAt: order.closedAt,
        version: { increment: 1 },
      },
    });
  }
  //-aqui termina funcion save-//

  //-aqui empieza funcion findById y es para buscar una orden por id-//
  /** @pure */
  async findById(id: string): Promise<OrderPrimitives | null> {
    const record = await this.prisma.order.findUnique({ where: { id } });
    return record ? this.toPrimitives(record) : null;
  }
  //-aqui termina funcion findById-//

  //-aqui empieza funcion findActiveByRestaurantId y es para el panel de servicio en tiempo real-//
  /** @pure */
  async findActiveByRestaurantId(restaurantId: string): Promise<OrderPrimitives[]> {
    const records = await this.prisma.order.findMany({
      where: {
        restaurantId,
        status: { in: ["OPEN", "SUBMITTED"] },
      },
      orderBy: { openedAt: "asc" },
    });
    return records.map((r) => this.toPrimitives(r));
  }
  //-aqui termina funcion findActiveByRestaurantId-//

  //-aqui empieza funcion findByRestaurantAndDateRange y es para analytics y cierre diario-//
  /** @pure */
  async findByRestaurantAndDateRange(
    restaurantId: string,
    from: Date,
    to: Date
  ): Promise<OrderPrimitives[]> {
    const records = await this.prisma.order.findMany({
      where: {
        restaurantId,
        openedAt: { gte: from, lte: to },
      },
      orderBy: { openedAt: "asc" },
    });
    return records.map((r) => this.toPrimitives(r));
  }
  //-aqui termina funcion findByRestaurantAndDateRange-//

  //-aqui empieza funcion updateStatus y es para transicionar el estado de una orden-//
  /** @sideEffect */
  async updateStatus(
    id: string,
    status: OrderStatus,
    totals?: { totalPublic: number; totalCost: number },
    closedAt?: Date
  ): Promise<void> {
    await this.prisma.order.update({
      where: { id },
      data: {
        status,
        ...(totals ? { totalPublic: totals.totalPublic, totalCost: totals.totalCost } : {}),
        ...(closedAt ? { closedAt } : {}),
        version: { increment: 1 },
      },
    });
  }
  //-aqui termina funcion updateStatus-//

  //-aqui empieza funcion toPrimitives y es para mapear el registro Prisma a primitivos-//
  /** @pure */
  private toPrimitives(
    record: Awaited<ReturnType<PrismaClient["order"]["findUniqueOrThrow"]>>
  ): OrderPrimitives {
    return {
      id: record.id,
      restaurantId: record.restaurantId,
      tableId: record.tableId,
      openedByUserId: record.openedByUserId,
      status: record.status as OrderStatus,
      totalPublic: Number(record.totalPublic),
      totalCost: Number(record.totalCost),
      openedAt: record.openedAt,
      closedAt: record.closedAt,
      version: record.version,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }
  //-aqui termina funcion toPrimitives-//
}
//-aqui termina clase PrismaOrderRepository-//

// ---------------------------------------------------------------------------
// OrderItemRepository
// ---------------------------------------------------------------------------

//-aqui empieza clase PrismaOrderItemRepository y es para persistir ítems de orden con Prisma-//
export class PrismaOrderItemRepository implements OrderItemRepository {
  constructor(private readonly prisma: PrismaClient) {}

  //-aqui empieza funcion save y es para crear un ítem de orden-//
  /** @sideEffect */
  async save(item: OrderItemPrimitives): Promise<void> {
    await this.prisma.orderItem.create({ data: this.toCreateInput(item) });
  }
  //-aqui termina funcion save-//

  //-aqui empieza funcion saveMany y es para crear múltiples ítems en una transacción-//
  /** @sideEffect */
  async saveMany(items: OrderItemPrimitives[]): Promise<void> {
    await this.prisma.$transaction(
      items.map((item) => this.prisma.orderItem.create({ data: this.toCreateInput(item) }))
    );
  }
  //-aqui termina funcion saveMany-//

  //-aqui empieza funcion findById y es para buscar un ítem de orden por id-//
  /** @pure */
  async findById(id: string): Promise<OrderItemPrimitives | null> {
    const record = await this.prisma.orderItem.findUnique({ where: { id } });
    return record ? this.itemToPrimitives(record) : null;
  }
  //-aqui termina funcion findById-//

  //-aqui empieza funcion findByOrderId y es para obtener todos los ítems de una orden-//
  /** @pure */
  async findByOrderId(orderId: string): Promise<OrderItemPrimitives[]> {
    const records = await this.prisma.orderItem.findMany({
      where: { orderId },
      orderBy: { createdAt: "asc" },
    });
    return records.map((r) => this.itemToPrimitives(r));
  }
  //-aqui termina funcion findByOrderId-//

  //-aqui empieza funcion findByRestaurantAreaAndStatus y es para la cola del KDS-//
  /** @pure */
  async findByRestaurantAreaAndStatus(
    restaurantId: string,
    area: PreparationArea,
    statuses: OrderItemStatus[]
  ): Promise<OrderItemPrimitives[]> {
    const records = await this.prisma.orderItem.findMany({
      where: {
        order: { restaurantId },
        area,
        status: { in: statuses },
      },
      orderBy: { queuedAt: "asc" },
    });
    return records.map((r) => this.itemToPrimitives(r));
  }
  //-aqui termina funcion findByRestaurantAreaAndStatus-//

  //-aqui empieza funcion updateStatus y es para transicionar el estado de un ítem-//
  /** @sideEffect */
  async updateStatus(
    id: string,
    status: OrderItemStatus,
    timestamp: Date
  ): Promise<void> {
    const tsField: Record<OrderItemStatus, string | null> = {
      QUEUED: null,
      PREPARING: "preparingAt",
      READY: "readyAt",
      SERVED: "servedAt",
      CANCELLED: "cancelledAt",
    };

    const field = tsField[status];

    await this.prisma.orderItem.update({
      where: { id },
      data: {
        status,
        ...(field ? { [field]: timestamp } : {}),
        version: { increment: 1 },
      },
    });
  }
  //-aqui termina funcion updateStatus-//

  //-aqui empieza funcion toCreateInput y es para mapear primitivos al input de Prisma create-//
  /** @pure */
  private toCreateInput(item: OrderItemPrimitives) {
    return {
      id: item.id,
      orderId: item.orderId,
      menuItemId: item.menuItemId,
      menuItemName: item.menuItemName,
      qty: item.qty,
      publicUnitPrice: item.publicUnitPrice,
      costUnitPrice: item.costUnitPrice,
      area: item.area,
      status: item.status,
      queuedAt: item.queuedAt,
    };
  }
  //-aqui termina funcion toCreateInput-//

  //-aqui empieza funcion getMenuItemSalesStats y es para calcular ventas agrupadas por plato-//
  /**
   * Agrega en memoria los ítems de órdenes CLOSED del rango.
   * Agrupa por menuItemId sumando qty, revenue y cost.
   * @pure
   */
  async getMenuItemSalesStats(
    restaurantId: string,
    from: Date,
    to: Date
  ): Promise<MenuItemSalesStat[]> {
    const items = await this.prisma.orderItem.findMany({
      where: {
        order: {
          restaurantId,
          status: "CLOSED",
          closedAt: { gte: from, lte: to },
        },
        status: { not: "CANCELLED" },
      },
      select: {
        menuItemId: true,
        menuItemName: true,
        qty: true,
        publicUnitPrice: true,
        costUnitPrice: true,
      },
    });

    const map = new Map<string, MenuItemSalesStat>();

    for (const item of items) {
      const revenue = Number(item.publicUnitPrice) * item.qty;
      const cost = Number(item.costUnitPrice) * item.qty;
      const existing = map.get(item.menuItemId);

      if (existing) {
        existing.qtySold += item.qty;
        existing.revenue += revenue;
        existing.cost += cost;
        existing.margin = existing.revenue - existing.cost;
      } else {
        map.set(item.menuItemId, {
          menuItemId: item.menuItemId,
          menuItemName: item.menuItemName,
          qtySold: item.qty,
          revenue,
          cost,
          margin: revenue - cost,
        });
      }
    }

    return Array.from(map.values()).sort((a, b) => b.revenue - a.revenue);
  }
  //-aqui termina funcion getMenuItemSalesStats-//

  //-aqui empieza funcion getHourlySalesStats y es para calcular ventas por franja horaria-//
  /**
   * Agrupa las órdenes CLOSED del rango por hora de apertura.
   * Cuenta órdenes y suma revenue por franja horaria (0–23).
   * @pure
   */
  async getHourlySalesStats(
    restaurantId: string,
    from: Date,
    to: Date
  ): Promise<HourlySalesStat[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        restaurantId,
        status: "CLOSED",
        closedAt: { gte: from, lte: to },
      },
      select: {
        openedAt: true,
        totalPublic: true,
      },
    });

    const map = new Map<number, HourlySalesStat>();

    for (const order of orders) {
      const hour = order.openedAt.getHours();
      const existing = map.get(hour);

      if (existing) {
        existing.orderCount += 1;
        existing.revenue += Number(order.totalPublic);
      } else {
        map.set(hour, {
          hour,
          orderCount: 1,
          revenue: Number(order.totalPublic),
        });
      }
    }

    return Array.from(map.values()).sort((a, b) => a.hour - b.hour);
  }
  //-aqui termina funcion getHourlySalesStats-//

  //-aqui empieza funcion itemToPrimitives y es para mapear el registro Prisma a primitivos-//
  /** @pure */
  private itemToPrimitives(
    record: Awaited<ReturnType<PrismaClient["orderItem"]["findUniqueOrThrow"]>>
  ): OrderItemPrimitives {
    return {
      id: record.id,
      orderId: record.orderId,
      menuItemId: record.menuItemId,
      menuItemName: record.menuItemName,
      qty: record.qty,
      publicUnitPrice: Number(record.publicUnitPrice),
      costUnitPrice: Number(record.costUnitPrice),
      area: record.area as PreparationArea,
      status: record.status as OrderItemStatus,
      queuedAt: record.queuedAt,
      preparingAt: record.preparingAt,
      readyAt: record.readyAt,
      servedAt: record.servedAt,
      cancelledAt: record.cancelledAt,
      version: record.version,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }
  //-aqui termina funcion itemToPrimitives-//
}
//-aqui termina clase PrismaOrderItemRepository-//
