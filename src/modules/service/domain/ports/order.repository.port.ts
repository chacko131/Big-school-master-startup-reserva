/**
 * Archivo: order.repository.port.ts
 * Responsabilidad: Puerto (interfaz) del repositorio de órdenes de mesa.
 * Tipo: lógica
 */

import type {
  OrderPrimitives,
  OrderItemPrimitives,
  OrderStatus,
  OrderItemStatus,
  PreparationArea,
  MenuItemSalesStat,
  HourlySalesStat,
} from "../types/service.types";

// ---------------------------------------------------------------------------
// Puerto principal de Order
// ---------------------------------------------------------------------------

//-aqui empieza interfaz OrderRepository y es para abstraer la persistencia de órdenes-//
export interface OrderRepository {
  /**
   * Guarda una nueva orden. Idempotente si ya existe el id.
   * @sideEffect persiste en base de datos
   */
  save(order: OrderPrimitives): Promise<void>;

  /**
   * Busca una orden por id.
   * @pure (solo lectura)
   */
  findById(id: string): Promise<OrderPrimitives | null>;

  /**
   * Devuelve las órdenes activas (OPEN | SUBMITTED) de un restaurante.
   * @pure
   */
  findActiveByRestaurantId(restaurantId: string): Promise<OrderPrimitives[]>;

  /**
   * Devuelve las órdenes de un restaurante en un rango de fechas (para analytics/cierre).
   * @pure
   */
  findByRestaurantAndDateRange(
    restaurantId: string,
    from: Date,
    to: Date
  ): Promise<OrderPrimitives[]>;

  /**
   * Actualiza el status y los totales de una orden. Usa control de versión optimista.
   * @sideEffect
   */
  updateStatus(
    id: string,
    status: OrderStatus,
    totals?: { totalPublic: number; totalCost: number },
    closedAt?: Date
  ): Promise<void>;
}
//-aqui termina interfaz OrderRepository-//

// ---------------------------------------------------------------------------
// Puerto de OrderItem
// ---------------------------------------------------------------------------

//-aqui empieza interfaz OrderItemRepository y es para abstraer la persistencia de ítems de orden-//
export interface OrderItemRepository {
  /**
   * Guarda un ítem de orden.
   * @sideEffect
   */
  save(item: OrderItemPrimitives): Promise<void>;

  /**
   * Guarda múltiples ítems en una operación.
   * @sideEffect
   */
  saveMany(items: OrderItemPrimitives[]): Promise<void>;

  /**
   * Busca un ítem de orden por su id.
   * @pure
   */
  findById(id: string): Promise<OrderItemPrimitives | null>;

  /**
   * Devuelve todos los ítems de una orden.
   * @pure
   */
  findByOrderId(orderId: string): Promise<OrderItemPrimitives[]>;

  /**
   * Devuelve ítems por estación y estado (para cola KDS).
   * @pure
   */
  findByRestaurantAreaAndStatus(
    restaurantId: string,
    area: PreparationArea,
    statuses: OrderItemStatus[]
  ): Promise<OrderItemPrimitives[]>;

  /**
   * Actualiza el estado de un ítem y registra el timestamp correspondiente.
   * @sideEffect
   */
  updateStatus(
    id: string,
    status: OrderItemStatus,
    timestamp: Date
  ): Promise<void>;

  /**
   * Devuelve estadísticas de ventas agrupadas por menuItem en un rango de fechas.
   * Solo incluye ítems de órdenes CLOSED en el rango.
   * @pure
   */
  getMenuItemSalesStats(
    restaurantId: string,
    from: Date,
    to: Date
  ): Promise<MenuItemSalesStat[]>;

  /**
   * Devuelve estadísticas de ventas agrupadas por hora del día en un rango de fechas.
   * Solo incluye ítems de órdenes CLOSED en el rango.
   * @pure
   */
  getHourlySalesStats(
    restaurantId: string,
    from: Date,
    to: Date
  ): Promise<HourlySalesStat[]>;
}
//-aqui termina interfaz OrderItemRepository-//
