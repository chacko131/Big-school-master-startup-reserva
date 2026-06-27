/**
 * Archivo: get-service-analytics.use-case.ts
 * Responsabilidad: Calcular el resumen de analíticas operativas del servicio en sala
 *                  para un restaurante y período dados.
 * Tipo: lógica
 */

import type { OrderRepository, OrderItemRepository } from "../../../domain/ports/order.repository.port";
import type {
  DailySalesSummary,
  MenuItemSalesStat,
  HourlySalesStat,
} from "../../../domain/types/service.types";

// ---------------------------------------------------------------------------
// Tipos de entrada y salida del use case
// ---------------------------------------------------------------------------

export interface GetServiceAnalyticsInput {
  restaurantId: string;
  from: Date;
  to: Date;
}

export interface ServiceAnalyticsResult {
  /** Resumen global del período */
  summary: DailySalesSummary;
  /** Top platos ordenados por revenue descendente */
  topMenuItems: MenuItemSalesStat[];
  /** Distribución de ventas por hora del día (0–23) */
  hourlyStats: HourlySalesStat[];
}

// ---------------------------------------------------------------------------
// Use case
// ---------------------------------------------------------------------------

//-aqui empieza clase GetServiceAnalytics y es para calcular analíticas del módulo de servicio-//
/**
 * Orquesta la consulta de órdenes cerradas y sus ítems en un período,
 * y devuelve las proyecciones necesarias para el panel de analíticas de servicio.
 *
 * @pure — no modifica estado, solo lee
 */
export class GetServiceAnalytics {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly orderItemRepository: OrderItemRepository
  ) {}

  //-aqui empieza funcion execute y es para ejecutar el cálculo de analíticas del período-//
  /**
   * Ejecuta el cálculo de analíticas para el restaurante en el rango de fechas.
   *
   * @pure
   */
  async execute(input: GetServiceAnalyticsInput): Promise<ServiceAnalyticsResult> {
    const { restaurantId, from, to } = input;

    // 1. Leer órdenes cerradas del período
    const orders = await this.orderRepository.findByRestaurantAndDateRange(
      restaurantId,
      from,
      to
    );

    // 2. Filtrar solo las cerradas para el resumen
    const closedOrders = orders.filter((o) => o.status === "CLOSED");

    // 3. Calcular resumen global
    const totalRevenue = closedOrders.reduce((sum, o) => sum + o.totalPublic, 0);
    const totalCost = closedOrders.reduce((sum, o) => sum + o.totalCost, 0);
    const orderCount = closedOrders.length;

    const summary: DailySalesSummary = {
      restaurantId,
      date: from.toISOString().slice(0, 10),
      totalRevenue,
      totalCost,
      totalMargin: totalRevenue - totalCost,
      orderCount,
      avgTicket: orderCount > 0 ? totalRevenue / orderCount : 0,
    };

    // 4. Top platos y distribución horaria en paralelo
    const [topMenuItems, hourlyStats] = await Promise.all([
      this.orderItemRepository.getMenuItemSalesStats(restaurantId, from, to),
      this.orderItemRepository.getHourlySalesStats(restaurantId, from, to),
    ]);

    return { summary, topMenuItems, hourlyStats };
  }
  //-aqui termina funcion execute-//
}
//-aqui termina clase GetServiceAnalytics-//
