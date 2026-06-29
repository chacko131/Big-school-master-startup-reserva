/**
 * Archivo: KdsOrderItem.tsx
 * Responsabilidad: Renderizar una fila de ítem dentro de una comanda del KDS.
 *   Muestra cantidad, nombre, notas y el botón de acción según el estado.
 * Tipo: UI
 */

import { T } from "@/components/T";
import { pickItemFormAction, markReadyFormAction } from "@/app/(service)/service/kds/actions";
import type { KdsItem } from "@/app/(service)/service/kds/actions";

interface KdsOrderItemProps {
  item: KdsItem;
}

//-aqui empieza componente KdsOrderItem y es para mostrar un ítem de la comanda en el KDS-//
/**
 * Renderiza un ítem con su estado y el botón de acción correspondiente:
 * - QUEUED → botón "Tomar" (QUEUED → PREPARING)
 * - PREPARING → botón "Listo" (PREPARING → READY)
 * Usa form actions para funcionar sin JS en el cliente.
 * @pure
 */
export function KdsOrderItem({ item }: KdsOrderItemProps) {
  const isQueued = item.status === "QUEUED";
  const isPreparing = item.status === "PREPARING";

  return (
    <div
      className={`rounded-lg p-3 flex justify-between items-center group transition-colors hover:bg-zinc-800 ${
        isQueued
          ? "bg-zinc-800/60 border border-zinc-700/50"
          : "bg-zinc-800/80"
      }`}
    >
      {/* Info del ítem */}
      <div className="flex items-start gap-3 min-w-0">
        {/* Badge de cantidad */}
        <span
          className={`mt-0.5 shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
            isPreparing
              ? "bg-secondary-container text-secondary"
              : "bg-zinc-700 text-zinc-400"
          }`}
        >
          {item.qty}
        </span>

        <div className="min-w-0">
          <p
            className={`text-sm font-medium truncate ${
              isQueued ? "text-zinc-300" : "text-white"
            }`}
          >
            {item.menuItemName}
          </p>

          {/* Estado */}
          <div className="flex items-center gap-1.5 mt-1.5">
            {isPreparing && (
              <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse shrink-0" />
            )}
            <span
              className={`text-xs font-semibold ${
                isPreparing ? "text-yellow-500" : "text-zinc-500"
              }`}
            >
              <T>{isQueued ? "En cola" : "Preparando"}</T>
            </span>
          </div>
        </div>
      </div>

      {/* Botón de acción via form action (sin JS) */}
      {isQueued && (
        <form action={pickItemFormAction.bind(null, item.id)}>
          <button
            type="submit"
            className="bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors shrink-0"
          >
            <T>Tomar</T>
          </button>
        </form>
      )}

      {isPreparing && (
        <form action={markReadyFormAction.bind(null, item.id)}>
          <button
            type="submit"
            className="bg-secondary hover:bg-secondary/90 text-on-secondary rounded-lg px-4 py-2 text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            <T>Listo</T>
          </button>
        </form>
      )}
    </div>
  );
}
//-aqui termina componente KdsOrderItem-//
