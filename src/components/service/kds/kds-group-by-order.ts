/**
 * Archivo: kds-group-by-order.ts
 * Responsabilidad: Agrupar una lista plana de KdsItem por orderId
 *   y calcular la fecha de queuedAt más antigua para determinar urgencia.
 * Tipo: lógica
 */

import type { KdsItem } from "@/app/(service)/service/kds/actions";
import type { KdsOrderGroup } from "./KdsOrderCard";

//-aqui empieza funcion groupByOrder y es para agrupar ítems de KDS por orden y calcular antigüedad-//
/**
 * Recibe la lista plana de ítems del KDS y devuelve grupos por orderId
 * ordenados de más antiguo a más reciente (el más urgente primero).
 * @pure
 */
export function groupByOrder(items: KdsItem[]): KdsOrderGroup[] {
  const map = new Map<string, KdsOrderGroup>();

  for (const item of items) {
    const existing = map.get(item.orderId);
    if (existing) {
      existing.items.push(item);
      if (item.queuedAt < existing.oldestQueuedAt) {
        existing.oldestQueuedAt = item.queuedAt;
      }
    } else {
      map.set(item.orderId, {
        orderId: item.orderId,
        tableName: item.tableName,
        items: [item],
        oldestQueuedAt: item.queuedAt,
      });
    }
  }

  return Array.from(map.values()).sort(
    (a, b) => a.oldestQueuedAt.getTime() - b.oldestQueuedAt.getTime()
  );
}
//-aqui termina funcion groupByOrder-//
