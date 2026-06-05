/**
 * Archivo: KdsBoard.tsx
 * Responsabilidad: Board interactivo de una estación del KDS (KITCHEN o BAR).
 *   Muestra la cola de ítems y permite transicionarlos de QUEUED → PREPARING → READY.
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
// Badge de estado de ítem
// ---------------------------------------------------------------------------

//-aqui empieza funcion ItemStatusBadge y es para mostrar el estado del ítem con color-//
function ItemStatusBadge({ status }: { status: string }) {
  if (status === "QUEUED") {
    return (
      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
        <T>En cola</T>
      </span>
    );
  }
  if (status === "PREPARING") {
    return (
      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
        <T>Preparando</T>
      </span>
    );
  }
  return null;
}
//-aqui termina funcion ItemStatusBadge-//

// ---------------------------------------------------------------------------
// Tarjeta de ítem individual
// ---------------------------------------------------------------------------

//-aqui empieza componente KdsItemCard y es para mostrar un ítem con sus acciones-//
function KdsItemCard({ item, onUpdate }: { item: KdsItem; onUpdate: (id: string, newStatus: string) => void }) {
  const [, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handlePick() {
    setLoading(true);
    setError(null);
    startTransition(async () => {
      const result = await pickItemAction(item.id);
      if (!result.ok) {
        setError(result.error);
      } else {
        onUpdate(item.id, "PREPARING");
      }
      setLoading(false);
    });
  }

  function handleReady() {
    setLoading(true);
    setError(null);
    startTransition(async () => {
      const result = await markReadyAction(item.id);
      if (!result.ok) {
        setError(result.error);
      } else {
        onUpdate(item.id, "READY");
      }
      setLoading(false);
    });
  }

  return (
    <div className="rounded-xl border border-border bg-background p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <p className="font-semibold">{item.menuItemName}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            <T>Mesa</T>: {item.tableName} · <span className="font-medium">×{item.qty}</span>
          </p>
        </div>
        <ItemStatusBadge status={item.status} />
      </div>

      {error && (
        <p className="mt-2 text-xs text-destructive">{error}</p>
      )}

      <div className="mt-3 flex gap-2">
        {item.status === "QUEUED" && (
          <button
            onClick={handlePick}
            disabled={loading}
            className="flex-1 rounded-lg border border-border py-1.5 text-xs font-semibold hover:bg-muted/50 disabled:opacity-50"
          >
            <T>Preparando</T>
          </button>
        )}
        {item.status === "PREPARING" && (
          <button
            onClick={handleReady}
            disabled={loading}
            className="flex-1 rounded-lg bg-emerald-600 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {loading ? <T>Guardando…</T> : <T>Listo ✓</T>}
          </button>
        )}
      </div>
    </div>
  );
}
//-aqui termina componente KdsItemCard-//

// ---------------------------------------------------------------------------
// Board principal por estación
// ---------------------------------------------------------------------------

//-aqui empieza componente KdsBoard y es para mostrar la cola completa de una estación-//
export function KdsBoard({ area, items: initialItems }: KdsBoardProps) {
  const [items, setItems] = useState<KdsItem[]>(initialItems);

  function handleUpdate(id: string, newStatus: string) {
    setItems((prev) =>
      newStatus === "READY"
        ? prev.filter((i) => i.id !== id)
        : prev.map((i) => (i.id === id ? { ...i, status: newStatus as KdsItem["status"] } : i))
    );
  }

  const areaLabel = area === "KITCHEN" ? "Cocina" : "Barra";

  return (
    <div className="rounded-2xl border border-border bg-surface-container-lowest p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold">
          <T>{areaLabel}</T>
        </h3>
        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
          {items.length} <T>ítems</T>
        </span>
      </div>

      {items.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground italic">
          <T>Sin ítems en cola.</T> ✓
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <KdsItemCard key={item.id} item={item} onUpdate={handleUpdate} />
          ))}
        </div>
      )}
    </div>
  );
}
//-aqui termina componente KdsBoard-//
