/**
 * Archivo: KdsBoard.tsx
 * Responsabilidad: KDS rediseñado por comandas de mesa.
 *   Agrupa ítems por mesa (tableId), ordenados por hora de llegada del primer ítem.
 *   El cocinero ve cada mesa como una comanda completa, con estado por plato.
 * Tipo: UI
 */

"use client";

import { useState, useTransition } from "react";
import { T } from "@/components/T";
import { pickItemAction, markReadyAction } from "@/app/(dashboard)/dashboard/service/kds/actions";
import type { KdsItem } from "@/app/(dashboard)/dashboard/service/kds/actions";
import type { PreparationArea } from "@/modules/service/domain/types/service.types";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface KdsBoardProps {
  area: PreparationArea;
  items: KdsItem[];
}

// ---------------------------------------------------------------------------
// Tipos internos
// ---------------------------------------------------------------------------

interface TableTicket {
  tableId: string;
  tableName: string;
  arrivedAt: Date;
  items: KdsItem[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

//-aqui empieza funcion groupByTable y es para agrupar ítems por mesa ordenados por llegada-//
function groupByTable(items: KdsItem[]): TableTicket[] {
  const map = new Map<string, TableTicket>();

  for (const item of items) {
    const key = item.tableId || item.orderId;
    const existing = map.get(key);
    const arrivedAt = item.queuedAt ? new Date(item.queuedAt) : new Date(0);

    if (!existing) {
      map.set(key, { tableId: key, tableName: item.tableName, arrivedAt, items: [item] });
    } else {
      existing.items.push(item);
      if (arrivedAt < existing.arrivedAt) existing.arrivedAt = arrivedAt;
    }
  }

  return Array.from(map.values()).sort((a, b) => a.arrivedAt.getTime() - b.arrivedAt.getTime());
}
//-aqui termina funcion groupByTable-//

//-aqui empieza funcion elapsedMinutes y es para calcular minutos desde que llegó la comanda-//
function elapsedMinutes(arrivedAt: Date): number {
  return Math.floor((Date.now() - arrivedAt.getTime()) / 60_000);
}
//-aqui termina funcion elapsedMinutes-//

// ---------------------------------------------------------------------------
// Fila de un ítem dentro de la comanda
// ---------------------------------------------------------------------------

//-aqui empieza componente TicketRow y es para mostrar un plato con su acción dentro de la comanda-//
function TicketRow({
  item,
  onUpdate,
}: {
  item: KdsItem;
  onUpdate: (id: string, newStatus: string) => void;
}) {
  const [, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handlePick() {
    setLoading(true);
    startTransition(async () => {
      const r = await pickItemAction(item.id);
      if (r.ok) onUpdate(item.id, "PREPARING");
      else setError(r.error);
      setLoading(false);
    });
  }

  function handleReady() {
    setLoading(true);
    startTransition(async () => {
      const r = await markReadyAction(item.id);
      if (r.ok) onUpdate(item.id, "READY");
      else setError(r.error);
      setLoading(false);
    });
  }

  const isPreparing = item.status === "PREPARING";
  const isQueued = item.status === "QUEUED";

  return (
    <div
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${
        isPreparing ? "bg-amber-50 ring-1 ring-amber-200" :
        "bg-muted/30"
      }`}
    >
      {/* Indicador de estado */}
      <div className={`h-2.5 w-2.5 shrink-0 rounded-full ${
        isPreparing ? "bg-amber-400" : "bg-muted-foreground/30"
      }`} />

      {/* Nombre + qty */}
      <div className="flex-1">
        <span className={`text-sm font-semibold ${
          isPreparing ? "text-amber-900" : "text-foreground"
        }`}>
          {item.menuItemName}
        </span>
        {item.qty > 1 && (
          <span className="ml-2 rounded-full bg-foreground/10 px-1.5 py-0.5 text-xs font-bold">
            ×{item.qty}
          </span>
        )}
      </div>

      {/* Acción */}
      {isQueued && (
        <button
          onClick={handlePick}
          disabled={loading}
          className="shrink-0 rounded-lg bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-800 hover:bg-amber-200 disabled:opacity-50"
        >
          <T>Tomar</T>
        </button>
      )}
      {isPreparing && (
        <button
          onClick={handleReady}
          disabled={loading}
          className="shrink-0 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {loading ? "…" : <T>Listo ✓</T>}
        </button>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
//-aqui termina componente TicketRow-//

// ---------------------------------------------------------------------------
// Tarjeta de comanda por mesa
// ---------------------------------------------------------------------------

//-aqui empieza componente TableTicketCard y es para mostrar la comanda completa de una mesa-//
function TableTicketCard({
  ticket,
  index,
  onUpdate,
}: {
  ticket: TableTicket;
  index: number;
  onUpdate: (id: string, newStatus: string) => void;
}) {
  const [, startTransition] = useTransition();
  const [takingAll, setTakingAll] = useState(false);

  const elapsed = elapsedMinutes(ticket.arrivedAt);
  const allPreparing = ticket.items.every((i) => i.status === "PREPARING");
  const hasPreparing = ticket.items.some((i) => i.status === "PREPARING");
  const queuedItems = ticket.items.filter((i) => i.status === "QUEUED");
  const urgency = elapsed >= 15 ? "high" : elapsed >= 8 ? "medium" : "low";

  //-aqui empieza funcion handleTakeAll y es para tomar todos los ítems QUEUED de la mesa a la vez-//
  function handleTakeAll() {
    if (queuedItems.length === 0) return;
    setTakingAll(true);
    startTransition(async () => {
      await Promise.all(
        queuedItems.map(async (item) => {
          const r = await pickItemAction(item.id);
          if (r.ok) onUpdate(item.id, "PREPARING");
        })
      );
      setTakingAll(false);
    });
  }
  //-aqui termina funcion handleTakeAll-//

  return (
    <div
      className={`flex flex-col rounded-2xl border-2 bg-background shadow-sm ${
        urgency === "high" ? "border-red-400" :
        urgency === "medium" ? "border-amber-300" :
        hasPreparing ? "border-amber-200" :
        "border-border"
      }`}
    >
      {/* Header de la comanda */}
      <div className={`flex items-center justify-between rounded-t-2xl px-4 py-3 ${
        urgency === "high" ? "bg-red-50" :
        urgency === "medium" ? "bg-amber-50" :
        "bg-muted/40"
      }`}>
        <div className="flex items-center gap-3">
          {/* Número de orden de llegada */}
          <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-black ${
            urgency === "high" ? "bg-red-500 text-white" :
            urgency === "medium" ? "bg-amber-400 text-white" :
            "bg-foreground/10 text-foreground"
          }`}>
            {index + 1}
          </span>
          <div>
            <p className="text-base font-black leading-none">{ticket.tableName}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {ticket.items.length} <T>plato(s)</T>
            </p>
          </div>
        </div>

        {/* Derecha: tiempo + botón tomar todos */}
        <div className="flex items-center gap-3">
          {/* Botón tomar todos — solo si hay ítems QUEUED */}
          {queuedItems.length > 0 && (
            <button
              onClick={handleTakeAll}
              disabled={takingAll}
              className="rounded-xl bg-amber-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-600 active:scale-95 disabled:opacity-50"
            >
              {takingAll ? "…" : <><T>Tomar todos</T> ({queuedItems.length})</>}
            </button>
          )}

          <div className={`text-right ${
            urgency === "high" ? "text-red-600" :
            urgency === "medium" ? "text-amber-600" :
            "text-muted-foreground"
          }`}>
            <p className="text-lg font-black tabular-nums leading-none">{elapsed}′</p>
            <p className="text-[10px]">
              {allPreparing ? <T>preparando</T> : hasPreparing ? <T>en progreso</T> : <T>en cola</T>}
            </p>
          </div>
        </div>
      </div>

      {/* Lista de platos */}
      <div className="flex flex-col gap-1.5 p-3">
        {ticket.items.map((item) => (
          <TicketRow key={item.id} item={item} onUpdate={onUpdate} />
        ))}
      </div>
    </div>
  );
}
//-aqui termina componente TableTicketCard-//

// ---------------------------------------------------------------------------
// Board principal por estación
// ---------------------------------------------------------------------------

//-aqui empieza componente KdsBoard y es para mostrar las comandas por mesa de una estación-//
export function KdsBoard({ area, items: initialItems }: KdsBoardProps) {
  const [items, setItems] = useState<KdsItem[]>(initialItems);

  function handleUpdate(id: string, newStatus: string) {
    setItems((prev) =>
      newStatus === "READY"
        ? prev.filter((i) => i.id !== id)
        : prev.map((i) => (i.id === id ? { ...i, status: newStatus as KdsItem["status"] } : i))
    );
  }

  const tickets = groupByTable(items);
  const areaLabel = area === "KITCHEN" ? "Cocina" : "Barra";

  return (
    <div className="flex flex-col gap-4">
      {/* Header de estación */}
      <div className="flex items-center gap-3">
        <div className={`rounded-xl px-3 py-1.5 text-xs font-black uppercase tracking-wider ${
          area === "KITCHEN" ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"
        }`}>
          <T>{areaLabel}</T>
        </div>
        <span className="text-sm font-semibold text-muted-foreground">
          {tickets.length} <T>mesa(s) en cola</T>
        </span>
      </div>

      {tickets.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border py-16 text-center">
          <span className="text-4xl">✓</span>
          <p className="mt-2 font-semibold text-muted-foreground"><T>Sin comandas pendientes</T></p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {tickets.map((ticket, i) => (
            <TableTicketCard
              key={ticket.tableId}
              ticket={ticket}
              index={i}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
//-aqui termina componente KdsBoard-//
