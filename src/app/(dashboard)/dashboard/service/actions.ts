/**
 * Archivo: actions.ts
 * Responsabilidad: Server actions para el panel de servicio (POS + KDS).
 * Tipo: servicio
 */

"use server";

import { revalidatePath } from "next/cache";
import { getRestaurantIdFromSession } from "@/modules/auth/get-restaurant-id";
import { requireCurrentUser } from "@/modules/auth/get-current-user";
import { assertCanWrite } from "@/modules/billing/infrastructure/write-access-guard";
import { getServiceInfrastructure } from "@/modules/service/infrastructure/service-infrastructure";
import { getCatalogInfrastructure } from "@/modules/catalog/infrastructure/catalog-infrastructure";
import { CreateOrder } from "@/modules/service/application/use-cases/CreateOrder/create-order.use-case";
import { AddItemsToOrder } from "@/modules/service/application/use-cases/AddItemsToOrder/add-items-to-order.use-case";
import { SubmitOrder } from "@/modules/service/application/use-cases/SubmitOrder/submit-order.use-case";
import { CloseOrder } from "@/modules/service/application/use-cases/CloseOrder/close-order.use-case";
import { captureUnexpectedError } from "@/lib/sentry";
import type { AddItemInput } from "@/modules/service/application/use-cases/AddItemsToOrder/add-items-to-order.use-case";
import type { OrderPrimitives, OrderItemPrimitives } from "@/modules/service/domain/types/service.types";
import type { MenuItemCostingWithMenuItemName } from "@/modules/service/domain/ports/menu-item-costing.repository.port";

// ---------------------------------------------------------------------------
// Tipo de respuesta genérico (igual que en costing/actions.ts)
// ---------------------------------------------------------------------------

export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string };

// ---------------------------------------------------------------------------
// Proyección pública de mesas activas con su orden si existe
// ---------------------------------------------------------------------------

export interface TableWithOrder {
  tableId: string;
  tableName: string;
  capacity: number;
  order: OrderPrimitives | null;
  readyCount: number;
}

// ---------------------------------------------------------------------------
// Fetch: mesas activas + órdenes abiertas para el panel de servicio
// ---------------------------------------------------------------------------

//-aqui empieza funcion fetchServiceOverview y es para obtener mesas y órdenes activas-//
/**
 * Obtiene las mesas del restaurante con su orden activa si existe.
 * @sideEffect lectura de BD
 */
export async function fetchServiceOverview(): Promise<
  ActionResult<{ tables: TableWithOrder[]; menuItems: MenuItemCostingWithMenuItemName[] }>
> {
  try {
    const restaurantId = await getRestaurantIdFromSession();
    console.log(`[service/fetchServiceOverview] restaurantId=${restaurantId}`);
    const { diningTableRepository } = getCatalogInfrastructure();
    const { orderRepository, costingRepository, orderItemRepository } = getServiceInfrastructure();

    const [tables, activeOrders, menuItems] = await Promise.all([
      diningTableRepository.findByRestaurantId(restaurantId),
      orderRepository.findActiveByRestaurantId(restaurantId),
      costingRepository.findAllByRestaurantId(restaurantId),
    ]);

    const orderByTable = new Map(activeOrders.map((o) => [o.tableId, o]));

    // Contar ítems READY por orden en paralelo para mostrar dot de alerta al camarero
    const readyCountByOrder = new Map<string, number>();
    if (activeOrders.length > 0) {
      const readyCounts = await Promise.all(
        activeOrders.map(async (o) => {
          const items = await orderItemRepository.findByOrderId(o.id);
          const count = items.filter((i) => i.status === "READY").length;
          return [o.id, count] as const;
        })
      );
      for (const [orderId, count] of readyCounts) readyCountByOrder.set(orderId, count);
    }

    const result: TableWithOrder[] = tables.map((t) => {
      const tp = t.toPrimitives();
      const order = orderByTable.get(tp.id) ?? null;
      return {
        tableId: tp.id,
        tableName: tp.name,
        capacity: tp.capacity,
        order,
        readyCount: order ? (readyCountByOrder.get(order.id) ?? 0) : 0,
      };
    });

    console.log(`[service/fetchServiceOverview] mesas=${result.length} menuItems=${menuItems.length} ordenesActivas=${activeOrders.length}`);
    return { ok: true, data: { tables: result, menuItems } };
  } catch (err) {
    console.error(`[service/fetchServiceOverview] ERROR:`, err);
    if (err instanceof Error) return { ok: false, error: err.message };
    captureUnexpectedError(err);
    return { ok: false, error: "Error inesperado." };
  }
}
//-aqui termina funcion fetchServiceOverview-//

// ---------------------------------------------------------------------------
// Action: abrir una nueva orden en una mesa
// ---------------------------------------------------------------------------

//-aqui empieza funcion createOrderAction y es para abrir una orden en una mesa-//
/**
 * Abre una nueva orden en estado OPEN para la mesa indicada.
 * @sideEffect escribe en BD y revalida la página
 */
export async function createOrderAction(
  tableId: string
): Promise<ActionResult<OrderPrimitives>> {
  try {
    console.log(`[service/createOrderAction] tableId=${tableId}`);
    await assertCanWrite();
    const user = await requireCurrentUser();
    const restaurantId = await getRestaurantIdFromSession();

    const { orderRepository } = getServiceInfrastructure();
    const useCase = new CreateOrder(orderRepository);

    const order = await useCase.execute({
      restaurantId,
      tableId,
      openedByUserId: user.id,
    });

    console.log(`[service/createOrderAction] ✓ orden creada orderId=${order.id} tableId=${tableId}`);
    revalidatePath("/dashboard/service");
    return { ok: true, data: order };
  } catch (err) {
    console.error(`[service/createOrderAction] ERROR tableId=${tableId}:`, err);
    if (err instanceof Error) return { ok: false, error: err.message };
    captureUnexpectedError(err);
    return { ok: false, error: "Error inesperado." };
  }
}
//-aqui termina funcion createOrderAction-//

// ---------------------------------------------------------------------------
// Action: añadir ítems a una orden abierta
// ---------------------------------------------------------------------------

//-aqui empieza funcion addItemsToOrderAction y es para añadir platos a una orden abierta-//
/**
 * Añade ítems a una orden OPEN con snapshot de precios del momento del pedido.
 * @sideEffect escribe en BD y revalida la página
 */
export async function addItemsToOrderAction(
  orderId: string,
  items: AddItemInput[]
): Promise<ActionResult<OrderItemPrimitives[]>> {
  try {
    console.log(`[service/addItemsToOrderAction] orderId=${orderId} items=${items.length}`, items.map(i => `${i.menuItemName}x${i.qty}`));
    await assertCanWrite();

    const { orderRepository, orderItemRepository } = getServiceInfrastructure();
    const useCase = new AddItemsToOrder(orderRepository, orderItemRepository);

    const result = await useCase.execute({ orderId, items });

    console.log(`[service/addItemsToOrderAction] ✓ ${result.length} ítems guardados en orden=${orderId}`);
    revalidatePath("/dashboard/service");
    return { ok: true, data: result };
  } catch (err) {
    console.error(`[service/addItemsToOrderAction] ERROR orderId=${orderId}:`, err);
    if (err instanceof Error) return { ok: false, error: err.message };
    captureUnexpectedError(err);
    return { ok: false, error: "Error inesperado." };
  }
}
//-aqui termina funcion addItemsToOrderAction-//

// ---------------------------------------------------------------------------
// Action: obtener ítems de una orden (para mostrar en el modal)
// ---------------------------------------------------------------------------

//-aqui empieza funcion fetchOrderItemsAction y es para obtener los ítems actuales de una orden-//
/**
 * Devuelve los ítems de una orden para mostrarlos en el panel de servicio.
 * @sideEffect lectura de BD
 */
export async function fetchOrderItemsAction(
  orderId: string
): Promise<ActionResult<OrderItemPrimitives[]>> {
  try {
    const { orderItemRepository } = getServiceInfrastructure();
    const items = await orderItemRepository.findByOrderId(orderId);
    return { ok: true, data: items };
  } catch (err) {
    if (err instanceof Error) return { ok: false, error: err.message };
    captureUnexpectedError(err);
    return { ok: false, error: "Error inesperado." };
  }
}
//-aqui termina funcion fetchOrderItemsAction-//

//-aqui empieza funcion submitOrderAction y es para enviar la orden a cocina-//
/**
 * Transiciona la orden de OPEN a SUBMITTED (va a cocina/bar).
 * @sideEffect escribe en BD y revalida la página
 */
export async function submitOrderAction(
  orderId: string
): Promise<ActionResult<OrderPrimitives>> {

  try {
    console.log(`[service/submitOrderAction] orderId=${orderId}`);
    await assertCanWrite();

    const { orderRepository } = getServiceInfrastructure();
    const useCase = new SubmitOrder(orderRepository);

    const result = await useCase.execute({ orderId });

    console.log(`[service/submitOrderAction] ✓ orden=${orderId} estado=${result.status}`);
    revalidatePath("/dashboard/service");
    return { ok: true, data: result };
  } catch (err) {
    console.error(`[service/submitOrderAction] ERROR orderId=${orderId}:`, err);
    if (err instanceof Error) return { ok: false, error: err.message };
    captureUnexpectedError(err);
    return { ok: false, error: "Error inesperado." };
  }
}
//-aqui termina funcion submitOrderAction-//

// ---------------------------------------------------------------------------
// Action: cerrar orden y liberar mesa
// ---------------------------------------------------------------------------

//-aqui empieza funcion closeOrderAction y es para cerrar la orden calcular totales y liberar la mesa-//
/**
 * Cierra la orden (SUBMITTED → CLOSED), calcula totales y libera la mesa.
 * Los datos quedan guardados en BD para histórico/analítica.
 * @sideEffect escribe en BD y revalida la página
 */
export async function closeOrderAction(
  orderId: string
): Promise<ActionResult<OrderPrimitives>> {
  try {
    console.log(`[service/closeOrderAction] orderId=${orderId}`);
    await assertCanWrite();

    const { orderRepository, orderItemRepository } = getServiceInfrastructure();
    const useCase = new CloseOrder(orderRepository, orderItemRepository);

    const result = await useCase.execute({ orderId });

    console.log(`[service/closeOrderAction] ✓ orden=${orderId} cerrada total=${result.totalPublic}`);
    revalidatePath("/dashboard/service");
    return { ok: true, data: result };
  } catch (err) {
    console.error(`[service/closeOrderAction] ERROR orderId=${orderId}:`, err);
    if (err instanceof Error) return { ok: false, error: err.message };
    captureUnexpectedError(err);
    return { ok: false, error: "Error inesperado." };
  }
}
//-aqui termina funcion closeOrderAction-//
