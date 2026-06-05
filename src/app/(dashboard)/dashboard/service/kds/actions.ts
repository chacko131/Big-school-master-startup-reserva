/**
 * Archivo: actions.ts
 * Responsabilidad: Server actions para el KDS (Kitchen Display System) — cola de ítems por estación.
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
// Tipo de respuesta genérico
// ---------------------------------------------------------------------------

export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string };

// ---------------------------------------------------------------------------
// Proyección enriquecida para el KDS
// ---------------------------------------------------------------------------

export interface KdsItem extends OrderItemPrimitives {
  tableId: string;
  tableName: string;
}

// ---------------------------------------------------------------------------
// Fetch: cola de ítems por estación
// ---------------------------------------------------------------------------

//-aqui empieza funcion fetchKdsQueue y es para obtener la cola de ítems de una estación-//
/**
 * Devuelve los ítems en estado QUEUED o PREPARING para una estación concreta.
 * Enriquece con nombre de mesa uniendo con las órdenes activas.
 * @sideEffect lectura de BD
 */
export async function fetchKdsQueue(
  area: PreparationArea
): Promise<ActionResult<KdsItem[]>> {
  try {
    const restaurantId = await getRestaurantIdFromSession();
    console.log(`[kds/fetchKdsQueue] area=${area} restaurantId=${restaurantId}`);
    const { orderItemRepository, orderRepository } = getServiceInfrastructure();
    const { diningTableRepository } = getCatalogInfrastructure();

    // Áreas a buscar: KITCHEN incluye también NONE (platos sin área asignada)
    const areasToFetch: PreparationArea[] = area === "KITCHEN" ? ["KITCHEN", "NONE"] : [area];

    const [allItems, activeOrders, tables] = await Promise.all([
      Promise.all(
        areasToFetch.map((a) =>
          orderItemRepository.findByRestaurantAreaAndStatus(restaurantId, a, ["QUEUED", "PREPARING"])
        )
      ).then((results) => results.flat()),
      orderRepository.findActiveByRestaurantId(restaurantId),
      diningTableRepository.findByRestaurantId(restaurantId),
    ]);

    const orderMap = new Map(activeOrders.map((o) => [o.id, o]));
    const tableMap = new Map(tables.map((t) => {
      const p = t.toPrimitives();
      return [p.id, p.name];
    }));

    const enriched: KdsItem[] = allItems.map((item) => {
      const order = orderMap.get(item.orderId);
      const tableId = order?.tableId ?? "";
      const tableName = tableMap.get(tableId) ?? (tableId || "Mesa");
      return { ...item, tableId, tableName };
    });

    console.log(`[kds/fetchKdsQueue] ✓ area=${area} ítems=${enriched.length}`);
    return { ok: true, data: enriched };
  } catch (err) {
    console.error(`[kds/fetchKdsQueue] ERROR area=${area}:`, err);
    if (err instanceof Error) return { ok: false, error: err.message };
    captureUnexpectedError(err);
    return { ok: false, error: "Error inesperado." };
  }
}
//-aqui termina funcion fetchKdsQueue-//

// ---------------------------------------------------------------------------
// Action: tomar ítem (QUEUED → PREPARING)
// ---------------------------------------------------------------------------

//-aqui empieza funcion pickItemAction y es para que la cocina tome un ítem de la cola-//
/**
 * Marca un ítem como PREPARING (cocina lo toma).
 * @sideEffect escribe en BD y revalida
 */
export async function pickItemAction(
  orderItemId: string
): Promise<ActionResult<OrderItemPrimitives>> {
  try {
    console.log(`[kds/pickItemAction] orderItemId=${orderItemId}`);
    await assertCanWrite();
    const { orderItemRepository } = getServiceInfrastructure();
    const useCase = new PickItemForPrep(orderItemRepository);

    const result = await useCase.execute({ orderItemId });

    console.log(`[kds/pickItemAction] ✓ ítem=${orderItemId} estado=${result.status}`);
    revalidatePath("/dashboard/service/kds");
    return { ok: true, data: result };
  } catch (err) {
    console.error(`[kds/pickItemAction] ERROR ítem=${orderItemId}:`, err);
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
 * @sideEffect escribe en BD y revalida
 */
export async function markReadyAction(
  orderItemId: string
): Promise<ActionResult<OrderItemPrimitives>> {
  try {
    console.log(`[kds/markReadyAction] orderItemId=${orderItemId}`);
    await assertCanWrite();
    const { orderItemRepository } = getServiceInfrastructure();
    const useCase = new MarkItemReady(orderItemRepository);

    const result = await useCase.execute({ orderItemId });

    console.log(`[kds/markReadyAction] ✓ ítem=${orderItemId} estado=${result.status}`);
    revalidatePath("/dashboard/service/kds");
    revalidatePath("/dashboard/service");
    return { ok: true, data: result };
  } catch (err) {
    console.error(`[kds/markReadyAction] ERROR ítem=${orderItemId}:`, err);
    if (err instanceof Error) return { ok: false, error: err.message };
    captureUnexpectedError(err);
    return { ok: false, error: "Error inesperado." };
  }
}
//-aqui termina funcion markReadyAction-//
