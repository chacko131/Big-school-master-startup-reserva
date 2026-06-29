/**
 * Archivo: actions.ts
 * Responsabilidad: Server actions para la vista de sala del módulo de servicio.
 *   Revalidan las rutas /service/floor y /service/overview.
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
import { MarkItemServed } from "@/modules/service/application/use-cases/MarkItemServed/mark-item-served.use-case";
import { OrderValidationError } from "@/modules/service/domain/entities/order.entity";
import { captureUnexpectedError } from "@/lib/sentry";
import type { AddItemInput } from "@/modules/service/application/use-cases/AddItemsToOrder/add-items-to-order.use-case";
import type { OrderPrimitives, OrderItemPrimitives } from "@/modules/service/domain/types/service.types";
import type { MenuItemCostingWithMenuItemName } from "@/modules/service/domain/ports/menu-item-costing.repository.port";

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export interface TableWithOrder {
  tableId: string;
  tableName: string;
  capacity: number;
  order: OrderPrimitives | null;
  readyCount: number;
}

// ---------------------------------------------------------------------------
// Fetch: mesas activas + órdenes abiertas + carta
// ---------------------------------------------------------------------------

//-aqui empieza funcion fetchFloorOverviewAction y es para obtener mesas, órdenes y carta del día-//
/**
 * Devuelve todas las mesas del restaurante con su orden activa si existe,
 * más la carta de ítems disponibles para agregar a una orden.
 * @sideEffect lectura de BD
 */
export async function fetchFloorOverviewAction(): Promise<
  ActionResult<{ tables: TableWithOrder[]; menuItems: MenuItemCostingWithMenuItemName[] }>
> {
  try {
    const restaurantId = await getRestaurantIdFromSession();
    const { diningTableRepository } = getCatalogInfrastructure();
    const { orderRepository, costingRepository, orderItemRepository } = getServiceInfrastructure();

    const [tables, activeOrders, menuItems] = await Promise.all([
      diningTableRepository.findByRestaurantId(restaurantId),
      orderRepository.findActiveByRestaurantId(restaurantId),
      costingRepository.findAllActiveForService(restaurantId),
    ]);

    const orderByTable = new Map(activeOrders.map((o) => [o.tableId, o]));

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

    return { ok: true, data: { tables: result, menuItems } };
  } catch (err) {
    if (err instanceof OrderValidationError) return { ok: false, error: err.message };
    captureUnexpectedError(err);
    return { ok: false, error: "Error inesperado al cargar el plano de sala." };
  }
}
//-aqui termina funcion fetchFloorOverviewAction-//

// ---------------------------------------------------------------------------
// Action: abrir una nueva orden en una mesa
// ---------------------------------------------------------------------------

//-aqui empieza funcion createOrderAction y es para abrir una orden en una mesa libre-//
/**
 * Abre una nueva orden en estado OPEN para la mesa indicada.
 * @sideEffect escribe en BD y revalida /service/floor y /service/overview
 */
export async function createOrderAction(
  tableId: string
): Promise<ActionResult<OrderPrimitives>> {
  try {
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

    revalidatePath("/service/floor");
    revalidatePath("/service/overview");
    return { ok: true, data: order };
  } catch (err) {
    if (err instanceof OrderValidationError) return { ok: false, error: err.message };
    captureUnexpectedError(err);
    return { ok: false, error: "Error inesperado al abrir la orden." };
  }
}
//-aqui termina funcion createOrderAction-//

// ---------------------------------------------------------------------------
// Action: añadir ítems a una orden
// ---------------------------------------------------------------------------

//-aqui empieza funcion addItemsToOrderAction y es para añadir platos a una orden OPEN-//
/**
 * Añade ítems a una orden OPEN con el precio actual del momento del pedido.
 * @sideEffect escribe en BD y revalida /service/floor y /service/overview
 */
export async function addItemsToOrderAction(
  orderId: string,
  items: AddItemInput[]
): Promise<ActionResult<OrderItemPrimitives[]>> {
  try {
    await assertCanWrite();

    const { orderRepository, orderItemRepository } = getServiceInfrastructure();
    const useCase = new AddItemsToOrder(orderRepository, orderItemRepository);

    const result = await useCase.execute({ orderId, items });

    revalidatePath("/service/floor");
    revalidatePath("/service/overview");
    return { ok: true, data: result };
  } catch (err) {
    if (err instanceof OrderValidationError) return { ok: false, error: err.message };
    captureUnexpectedError(err);
    return { ok: false, error: "Error inesperado al añadir los platos." };
  }
}
//-aqui termina funcion addItemsToOrderAction-//

// ---------------------------------------------------------------------------
// Action: obtener ítems de una orden
// ---------------------------------------------------------------------------

//-aqui empieza funcion fetchOrderItemsAction y es para obtener los ítems de una orden-//
/**
 * Devuelve los ítems actuales de una orden para mostrar en el panel de gestión.
 * @sideEffect lectura de BD
 */
export async function fetchOrderItemsAction(
  orderId: string
): Promise<ActionResult<OrderItemPrimitives[]>> {
  try {
    const restaurantId = await getRestaurantIdFromSession();
    const { orderItemRepository, orderRepository } = getServiceInfrastructure();
    const order = await orderRepository.findById(orderId);
    if (!order || order.restaurantId !== restaurantId) {
      return { ok: false, error: "Orden no encontrada." };
    }
    const items = await orderItemRepository.findByOrderId(orderId);
    return { ok: true, data: items };
  } catch (err) {
    if (err instanceof OrderValidationError) return { ok: false, error: err.message };
    captureUnexpectedError(err);
    return { ok: false, error: "Error inesperado al cargar los ítems." };
  }
}
//-aqui termina funcion fetchOrderItemsAction-//

// ---------------------------------------------------------------------------
// Action: enviar orden a cocina/bar
// ---------------------------------------------------------------------------

//-aqui empieza funcion submitOrderAction y es para enviar la orden OPEN a SUBMITTED-//
/**
 * Transiciona una orden de OPEN a SUBMITTED (envía a cocina y/o barra).
 * @sideEffect escribe en BD y revalida /service/floor, /service/overview y /service/kds
 */
export async function submitOrderAction(
  orderId: string
): Promise<ActionResult<OrderPrimitives>> {
  try {
    await assertCanWrite();

    const { orderRepository } = getServiceInfrastructure();
    const useCase = new SubmitOrder(orderRepository);

    const result = await useCase.execute({ orderId });

    revalidatePath("/service/floor");
    revalidatePath("/service/overview");
    revalidatePath("/service/kds/kitchen");
    revalidatePath("/service/kds/bar");
    return { ok: true, data: result };
  } catch (err) {
    if (err instanceof OrderValidationError) return { ok: false, error: err.message };
    captureUnexpectedError(err);
    return { ok: false, error: "Error inesperado al enviar la orden." };
  }
}
//-aqui termina funcion submitOrderAction-//

// ---------------------------------------------------------------------------
// Action: cerrar orden y liberar mesa
// ---------------------------------------------------------------------------

//-aqui empieza funcion closeOrderAction y es para cerrar la orden y liberar la mesa-//
/**
 * Cierra la orden (SUBMITTED → CLOSED), calcula totales y libera la mesa.
 * @sideEffect escribe en BD y revalida /service/floor y /service/overview
 */
export async function closeOrderAction(
  orderId: string
): Promise<ActionResult<OrderPrimitives>> {
  try {
    await assertCanWrite();

    const { orderRepository, orderItemRepository } = getServiceInfrastructure();
    const useCase = new CloseOrder(orderRepository, orderItemRepository);

    const result = await useCase.execute({ orderId });

    revalidatePath("/service/floor");
    revalidatePath("/service/overview");
    return { ok: true, data: result };
  } catch (err) {
    if (err instanceof OrderValidationError) return { ok: false, error: err.message };
    captureUnexpectedError(err);
    return { ok: false, error: "Error inesperado al cerrar la orden." };
  }
}
//-aqui termina funcion closeOrderAction-//

// ---------------------------------------------------------------------------
// Action: marcar un ítem listo como servido
// ---------------------------------------------------------------------------

//-aqui empieza funcion serveItemAction y es para marcar un ítem READY como SERVED-//
/**
 * Marca un ítem de orden READY como SERVED por el mesero.
 * @sideEffect escribe en BD y revalida /service/floor y /service/overview
 */
export async function serveItemAction(
  orderItemId: string
): Promise<ActionResult<OrderItemPrimitives>> {
  try {
    await assertCanWrite();

    const { orderItemRepository } = getServiceInfrastructure();
    const useCase = new MarkItemServed(orderItemRepository);

    const result = await useCase.execute({ orderItemId });

    revalidatePath("/service/floor");
    revalidatePath("/service/overview");
    return { ok: true, data: result };
  } catch (err) {
    if (err instanceof OrderValidationError) return { ok: false, error: err.message };
    captureUnexpectedError(err);
    return { ok: false, error: "Error inesperado al servir el plato." };
  }
}
//-aqui termina funcion serveItemAction-//

// ---------------------------------------------------------------------------
// Action: marcar todos los ítems listos de una orden como servidos
// ---------------------------------------------------------------------------

//-aqui empieza funcion serveAllReadyItemsAction y es para marcar todos los ítems READY como SERVED-//
/**
 * Marca todos los ítems en estado READY de una orden como SERVED.
 * Útil desde el botón "Marcar X platos como servidos" del panel de mesa.
 * @sideEffect escribe en BD y revalida /service/floor y /service/overview
 */
export async function serveAllReadyItemsAction(
  orderId: string
): Promise<ActionResult<OrderItemPrimitives[]>> {
  try {
    await assertCanWrite();

    const { orderItemRepository } = getServiceInfrastructure();
    const useCase = new MarkItemServed(orderItemRepository);
    const items = await orderItemRepository.findByOrderId(orderId);
    const readyItems = items.filter((i) => i.status === "READY");

    if (readyItems.length === 0) {
      return { ok: false, error: "No hay platos listos para servir." };
    }

    const results = await Promise.allSettled(
      readyItems.map((item) => useCase.execute({ orderItemId: item.id }))
    );
    const served = results
      .filter((r): r is PromiseFulfilledResult<OrderItemPrimitives> => r.status === "fulfilled")
      .map((r) => r.value);

    if (served.length === 0) {
      return { ok: false, error: "No se pudo marcar ningún plato como servido." };
    }

    revalidatePath("/service/floor");
    revalidatePath("/service/overview");
    return { ok: true, data: served };
  } catch (err) {
    if (err instanceof OrderValidationError) return { ok: false, error: err.message };
    captureUnexpectedError(err);
    return { ok: false, error: "Error inesperado al servir los platos." };
  }
}
//-aqui termina funcion serveAllReadyItemsAction-//
