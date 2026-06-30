/**
 * Archivo: actions.ts
 * Responsabilidad: Server actions del KDS para el módulo de servicio independiente.
 *   Revalidan las rutas /service/kds/* y /service/floor.
 * Tipo: servicio
 */

"use server";

import { revalidatePath } from "next/cache";
import { getRestaurantIdFromSession } from "@/modules/auth/get-restaurant-id";
import { assertCanWrite } from "@/modules/billing/infrastructure/write-access-guard";
import { getServiceInfrastructure } from "@/modules/service/infrastructure/service-infrastructure";
import { getCatalogInfrastructure } from "@/modules/catalog/infrastructure/catalog-infrastructure";
import { PickItemForPrep } from "@/modules/service/application/use-cases/PickItemForPrep/pick-item-for-prep.use-case";
import { MarkItemReady } from "@/modules/service/application/use-cases/MarkItemReady/mark-item-ready.use-case";
import { captureUnexpectedError } from "@/lib/sentry";
import type { OrderItemPrimitives, PreparationArea } from "@/modules/service/domain/types/service.types";

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export interface KdsItem extends OrderItemPrimitives {
  tableId: string;
  tableName: string;
}

// ---------------------------------------------------------------------------
// Fetch: cola de ítems por estación
// ---------------------------------------------------------------------------

//-aqui empieza funcion fetchKdsQueueAction y es para obtener la cola de ítems de una estación del KDS-//
/**
 * Devuelve los ítems QUEUED y PREPARING para el área indicada.
 * Enriquece cada ítem con tableId y tableName cruzando con órdenes y mesas activas.
 * @sideEffect lectura de BD
 */
export async function fetchKdsQueueAction(
  area: PreparationArea
): Promise<ActionResult<KdsItem[]>> {
  try {
    const restaurantId = await getRestaurantIdFromSession();
    const { orderItemRepository, orderRepository } = getServiceInfrastructure();
    const { diningTableRepository } = getCatalogInfrastructure();

    const areasToFetch: PreparationArea[] =
      area === "KITCHEN" ? ["KITCHEN", "NONE"] : [area];

    const [allItems, activeOrders, tables] = await Promise.all([
      Promise.all(
        areasToFetch.map((a) =>
          orderItemRepository.findByRestaurantAreaAndStatus(restaurantId, a, [
            "QUEUED",
            "PREPARING",
          ])
        )
      ).then((r) => r.flat()),
      orderRepository.findActiveByRestaurantId(restaurantId),
      diningTableRepository.findByRestaurantId(restaurantId),
    ]);

    const orderMap = new Map(activeOrders.map((o) => [o.id, o]));
    const tableMap = new Map(
      tables.map((t) => {
        const p = t.toPrimitives();
        return [p.id, p.name];
      })
    );

    const enriched: KdsItem[] = allItems.map((item) => {
      const order = orderMap.get(item.orderId);
      const tableId = order?.tableId ?? "";
      const tableName = tableMap.get(tableId) ?? (tableId || "Mesa");
      return { ...item, tableId, tableName };
    });

    return { ok: true, data: enriched };
  } catch (err) {
    if (err instanceof Error) return { ok: false, error: err.message };
    captureUnexpectedError(err);
    return { ok: false, error: "Error inesperado." };
  }
}
//-aqui termina funcion fetchKdsQueueAction-//

// ---------------------------------------------------------------------------
// Action: tomar ítem (QUEUED → PREPARING)
// ---------------------------------------------------------------------------

//-aqui empieza funcion pickItemAction y es para que la cocina tome un ítem de la cola-//
/**
 * Marca un ítem como PREPARING (cocina lo toma).
 * @sideEffect escribe en BD y revalida KDS + sala
 */
export async function pickItemAction(
  orderItemId: string
): Promise<ActionResult<OrderItemPrimitives>> {
  try {
    await assertCanWrite();
    const { orderItemRepository } = getServiceInfrastructure();
    const useCase = new PickItemForPrep(orderItemRepository);
    const result = await useCase.execute({ orderItemId });

    revalidatePath("/service/kds/kitchen");
    revalidatePath("/service/kds/bar");
    return { ok: true, data: result };
  } catch (err) {
    if (err instanceof Error) return { ok: false, error: err.message };
    captureUnexpectedError(err);
    return { ok: false, error: "Error inesperado." };
  }
}
//-aqui termina funcion pickItemAction-//

// ---------------------------------------------------------------------------
// Action: marcar ítem listo (PREPARING → READY)
// ---------------------------------------------------------------------------

//-aqui empieza funcion markReadyAction y es para que la cocina marque un ítem como listo-//
/**
 * Marca un ítem como READY (cocina termina de prepararlo).
 * Revalida también /service/floor para que el mesero vea el badge de alerta.
 * @sideEffect escribe en BD y revalida KDS + sala
 */
export async function markReadyAction(
  orderItemId: string
): Promise<ActionResult<OrderItemPrimitives>> {
  try {
    await assertCanWrite();
    const { orderItemRepository } = getServiceInfrastructure();
    const useCase = new MarkItemReady(orderItemRepository);
    const result = await useCase.execute({ orderItemId });

    revalidatePath("/service/kds/kitchen");
    revalidatePath("/service/kds/bar");
    revalidatePath("/service/floor");
    return { ok: true, data: result };
  } catch (err) {
    if (err instanceof Error) return { ok: false, error: err.message };
    captureUnexpectedError(err);
    return { ok: false, error: "Error inesperado." };
  }
}
//-aqui termina funcion markReadyAction-//

// ---------------------------------------------------------------------------
// Wrappers void para form actions (Next.js form action requiere Promise<void>)
// ---------------------------------------------------------------------------

//-aqui empieza funcion pickItemFormAction y es para usarse directamente como form action-//
/** @sideEffect delega a pickItemAction; relanza el error si falla para que sea visible */
export async function pickItemFormAction(orderItemId: string): Promise<void> {
  const result = await pickItemAction(orderItemId);
  if (!result.ok) throw new Error(result.error);
}
//-aqui termina funcion pickItemFormAction-//

//-aqui empieza funcion markReadyFormAction y es para usarse directamente como form action-//
/** @sideEffect delega a markReadyAction; relanza el error si falla para que sea visible */
export async function markReadyFormAction(orderItemId: string): Promise<void> {
  const result = await markReadyAction(orderItemId);
  if (!result.ok) throw new Error(result.error);
}
//-aqui termina funcion markReadyFormAction-//

// ---------------------------------------------------------------------------
// Actions bulk por comanda (todos los ítems de una orden a la vez)
// ---------------------------------------------------------------------------

//-aqui empieza funcion pickAllItemsForOrderFormAction y es para tomar todos los ítems QUEUED de una comanda de una vez-//
/**
 * Toma todos los ítems QUEUED de una orden y los pasa a PREPARING en bloque.
 * Útil para que cocina tome toda una comanda de golpe.
 * @sideEffect escribe en BD y revalida KDS + sala
 */
export async function pickAllItemsForOrderFormAction(orderId: string, area: PreparationArea): Promise<void> {
  try {
    await assertCanWrite();
    const { orderItemRepository } = getServiceInfrastructure();
    const useCase = new PickItemForPrep(orderItemRepository);
    const items = await orderItemRepository.findByOrderId(orderId);
    const areasToMatch: PreparationArea[] = area === "KITCHEN" ? ["KITCHEN", "NONE"] : [area];
    const queued = items.filter((i) => i.status === "QUEUED" && areasToMatch.includes(i.area));
    await Promise.all(queued.map((i) => useCase.execute({ orderItemId: i.id })));
  } catch (err) {
    console.error(`[kds/pickAllItemsForOrderFormAction] ERROR orderId=${orderId}:`, err);
    throw err;
  } finally {
    revalidatePath("/service/kds/kitchen");
    revalidatePath("/service/kds/bar");
  }
}
//-aqui termina funcion pickAllItemsForOrderFormAction-//

//-aqui empieza funcion markAllReadyForOrderFormAction y es para marcar listos todos los ítems PREPARING de una comanda-//
/**
 * Marca como READY todos los ítems PREPARING de una orden en bloque.
 * Útil para terminar toda una comanda de golpe.
 * @sideEffect escribe en BD y revalida KDS + sala
 */
export async function markAllReadyForOrderFormAction(orderId: string, area: PreparationArea): Promise<void> {
  try {
    await assertCanWrite();
    const { orderItemRepository } = getServiceInfrastructure();
    const useCase = new MarkItemReady(orderItemRepository);
    const items = await orderItemRepository.findByOrderId(orderId);
    const areasToMatch: PreparationArea[] = area === "KITCHEN" ? ["KITCHEN", "NONE"] : [area];
    const preparing = items.filter((i) => i.status === "PREPARING" && areasToMatch.includes(i.area));
    await Promise.all(preparing.map((i) => useCase.execute({ orderItemId: i.id })));
  } catch (err) {
    console.error(`[kds/markAllReadyForOrderFormAction] ERROR orderId=${orderId}:`, err);
    throw err;
  } finally {
    revalidatePath("/service/kds/kitchen");
    revalidatePath("/service/kds/bar");
    revalidatePath("/service/floor");
  }
}
//-aqui termina funcion markAllReadyForOrderFormAction-//
