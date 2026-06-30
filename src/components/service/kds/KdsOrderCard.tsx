/**
 * Archivo: KdsOrderCard.tsx
 * Responsabilidad: Tarjeta de comanda del KDS. Agrupa todos los ítems de una orden,
 *   muestra tiempo transcurrido y señala visualmente las comandas urgentes (>15 min).
 * Tipo: UI
 */

import { T } from "@/components/T";
import { KdsOrderItem } from "./KdsOrderItem";
import {
  pickAllItemsForOrderFormAction,
  markAllReadyForOrderFormAction,
} from "@/app/(service)/service/kds/actions";
import type { KdsItem } from "@/app/(service)/service/kds/actions";
import type { PreparationArea } from "@/modules/service/domain/types/service.types";

// ---------------------------------------------------------------------------
// Tipo de grupo de comanda
// ---------------------------------------------------------------------------

export interface KdsOrderGroup {
  orderId: string;
  tableName: string;
  items: KdsItem[];
  oldestQueuedAt: Date;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

//-aqui empieza funcion getElapsedMinutes y es para calcular minutos transcurridos desde una fecha-//
/** @pure */
function getElapsedMinutes(since: Date, now: Date): number {
  return Math.floor((now.getTime() - since.getTime()) / 60_000);
}
//-aqui termina funcion getElapsedMinutes-//

//-aqui empieza funcion formatElapsed y es para mostrar el tiempo transcurrido en formato legible-//
/** @pure */
function formatElapsed(minutes: number): string {
  if (minutes < 60) return `${String(minutes).padStart(2, "0")}:00`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
//-aqui termina funcion formatElapsed-//

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

interface KdsOrderCardProps {
  group: KdsOrderGroup;
  now: Date;
  area: PreparationArea;
}

//-aqui empieza componente KdsOrderCard y es para mostrar una comanda completa en el KDS-//
/**
 * Renderiza la tarjeta de una comanda con todos sus ítems.
 * - Fondo rojo pulsante si la comanda lleva más de 15 minutos (elapsed > 15).
 * - Franja roja en la parte superior si es urgente.
 * - Lista de ítems con botones de acción por estado.
 * @pure
 */
export function KdsOrderCard({ group, now, area }: KdsOrderCardProps) {
  const elapsed = getElapsedMinutes(group.oldestQueuedAt, now);
  const isUrgent = elapsed > 15;

  const queuedCount = group.items.filter((i) => i.status === "QUEUED").length;
  const preparingCount = group.items.filter((i) => i.status === "PREPARING").length;

  return (
    <article
      className={`rounded-xl flex-shrink-0 w-80 flex flex-col shadow-lg overflow-hidden border ${
        isUrgent
          ? "border-error/60 animate-[pulseRed_2s_infinite]"
          : "border-zinc-800"
      }`}
      style={{ backgroundColor: "#1a1c1c" }}
    >
      {/* Franja de urgencia */}
      {isUrgent && <div className="h-1 w-full bg-error" />}

      {/* Cabecera de comanda */}
      <header
        className={`p-4 border-b border-zinc-800 flex justify-between items-start ${
          isUrgent ? "bg-red-950/30" : "bg-zinc-900/50"
        }`}
      >
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {group.tableName}
          </h2>
        </div>
        <div className="flex flex-col items-end">
          <span
            className={`text-lg font-bold tabular-nums ${
              isUrgent ? "text-error" : "text-white"
            }`}
          >
            {formatElapsed(elapsed)}
          </span>
          <span className={`text-xs ${isUrgent ? "text-error/70" : "text-zinc-400"}`}>
            {isUrgent ? <T>Urgente</T> : <T>Transcurrido</T>}
          </span>
        </div>
      </header>

      {/* Ítems */}
      <div className="p-2 space-y-2 flex-1 overflow-y-auto">
        {group.items.map((item) => (
          <KdsOrderItem key={item.id} item={item} />
        ))}
      </div>

      {/* Footer: acciones bulk por comanda */}
      {(queuedCount > 0 || preparingCount > 0) && (
        <footer className="p-3 border-t border-zinc-800 bg-zinc-900/50 flex gap-2">
          {queuedCount > 0 && (
            <form
              action={pickAllItemsForOrderFormAction.bind(null, group.orderId, area)}
              className="flex-1"
            >
              <button
                type="submit"
                className="w-full bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg px-3 py-2 text-xs font-bold transition-colors"
              >
                <T>Tomar todo</T>
                <span className="ml-1 opacity-70">({queuedCount})</span>
              </button>
            </form>
          )}
          {preparingCount > 0 && (
            <form
              action={markAllReadyForOrderFormAction.bind(null, group.orderId, area)}
              className="flex-1"
            >
              <button
                type="submit"
                className="w-full bg-secondary hover:bg-secondary/90 text-on-secondary rounded-lg px-3 py-2 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <T>Todo listo</T>
                <span className="opacity-70">({preparingCount})</span>
              </button>
            </form>
          )}
        </footer>
      )}
    </article>
  );
}
//-aqui termina componente KdsOrderCard-//
