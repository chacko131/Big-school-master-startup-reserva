/**
 * Archivo: ServiceTableGrid.tsx
 * Responsabilidad: Grid interactivo de mesas con estado de orden y acciones POS.
 * Tipo: UI
 */

"use client";

import { useState, useTransition } from "react";
import { T } from "@/components/T";
import {
  createOrderAction,
  addItemsToOrderAction,
  submitOrderAction,
} from "@/app/(dashboard)/dashboard/service/actions";
import type { TableWithOrder } from "@/app/(dashboard)/dashboard/service/actions";
import type { MenuItemCostingWithMenuItemName } from "@/modules/service/domain/ports/menu-item-costing.repository.port";
import type { PreparationArea } from "@/modules/service/domain/types/service.types";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ServiceTableGridProps {
  tables: TableWithOrder[];
  menuItems: MenuItemCostingWithMenuItemName[];
}

// ---------------------------------------------------------------------------
// Badge de estado de mesa
// ---------------------------------------------------------------------------

//-aqui empieza funcion StatusBadge y es para mostrar el estado de la orden de una mesa-//
function StatusBadge({ status }: { status: string | null }) {
  if (!status) {
    return (
      <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
        <T>Libre</T>
      </span>
    );
  }
  if (status === "OPEN") {
    return (
      <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
        <T>Orden abierta</T>
      </span>
    );
  }
  if (status === "SUBMITTED") {
    return (
      <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
        <T>En cocina</T>
      </span>
    );
  }
  return null;
}
//-aqui termina funcion StatusBadge-//

// ---------------------------------------------------------------------------
// Panel de selección de platos (inline, por mesa)
// ---------------------------------------------------------------------------

interface OrderPanelProps {
  table: TableWithOrder;
  menuItems: MenuItemCostingWithMenuItemName[];
  onDone: () => void;
}

//-aqui empieza componente OrderPanel y es para añadir platos y enviar la orden a cocina-//
function OrderPanel({ table, menuItems, onDone }: OrderPanelProps) {
  const [, startTransition] = useTransition();
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const hasOrder = table.order !== null;
  const isOpen = table.order?.status === "OPEN";

  function setQty(menuItemId: string, qty: number) {
    setQuantities((prev) => ({ ...prev, [menuItemId]: Math.max(0, qty) }));
  }

  const selectedItems = menuItems.filter((m) => (quantities[m.menuItemId] ?? 0) > 0);

  function handleSendToKitchen() {
    if (!table.order) return;
    if (selectedItems.length === 0) {
      setError("Selecciona al menos un plato.");
      return;
    }

    setSubmitting(true);
    setError(null);

    startTransition(async () => {
      const items = selectedItems.map((m) => ({
        menuItemId: m.menuItemId,
        menuItemName: m.menuItemName,
        qty: quantities[m.menuItemId]!,
        publicUnitPrice: m.publicUnitPrice,
        costUnitPrice: m.costUnitPrice,
        area: m.area as PreparationArea,
      }));

      const addResult = await addItemsToOrderAction(table.order!.id, items);
      if (!addResult.ok) {
        setError(addResult.error);
        setSubmitting(false);
        return;
      }

      const submitResult = await submitOrderAction(table.order!.id);
      if (!submitResult.ok) {
        setError(submitResult.error);
        setSubmitting(false);
        return;
      }

      setSubmitting(false);
      onDone();
    });
  }

  async function handleOpenOrder() {
    setError(null);
    const result = await createOrderAction(table.tableId);
    if (!result.ok) setError(result.error);
  }

  return (
    <div className="mt-3 space-y-3">
      {!hasOrder && (
        <button
          onClick={handleOpenOrder}
          className="w-full rounded-lg bg-primary py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          <T>Abrir orden</T>
        </button>
      )}

      {hasOrder && isOpen && (
        <>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <T>Añadir platos</T>
          </p>
          <div className="max-h-56 overflow-y-auto space-y-1">
            {menuItems.map((m) => (
              <div key={m.menuItemId} className="flex items-center justify-between gap-2">
                <span className="flex-1 truncate text-sm">{m.menuItemName}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setQty(m.menuItemId, (quantities[m.menuItemId] ?? 0) - 1)}
                    className="h-6 w-6 rounded border border-border text-sm leading-none hover:bg-muted"
                  >−</button>
                  <span className="w-5 text-center text-sm font-medium">
                    {quantities[m.menuItemId] ?? 0}
                  </span>
                  <button
                    onClick={() => setQty(m.menuItemId, (quantities[m.menuItemId] ?? 0) + 1)}
                    className="h-6 w-6 rounded border border-border text-sm leading-none hover:bg-muted"
                  >+</button>
                </div>
              </div>
            ))}
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}

          <button
            onClick={handleSendToKitchen}
            disabled={submitting || selectedItems.length === 0}
            className="w-full rounded-lg bg-emerald-600 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {submitting ? <T>Enviando…</T> : <T>Enviar a cocina</T>}
          </button>
        </>
      )}

      {hasOrder && !isOpen && (
        <p className="text-xs text-muted-foreground italic">
          <T>Orden ya enviada a cocina.</T>
        </p>
      )}
    </div>
  );
}
//-aqui termina componente OrderPanel-//

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

//-aqui empieza componente ServiceTableGrid y es para mostrar todas las mesas con su estado-//
export function ServiceTableGrid({ tables, menuItems }: ServiceTableGridProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (tables.length === 0) {
    return (
      <p className="text-sm text-muted-foreground italic">
        <T>No hay mesas configuradas. Ve a Configuración para añadirlas.</T>
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {tables.map((table) => (
        <div
          key={table.tableId}
          className="rounded-xl border border-border bg-background p-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">{table.tableName}</p>
              <p className="text-xs text-muted-foreground">
                {table.capacity} <T>personas</T>
              </p>
            </div>
            <StatusBadge status={table.order?.status ?? null} />
          </div>

          <button
            onClick={() => setExpanded(expanded === table.tableId ? null : table.tableId)}
            className="mt-3 w-full rounded-lg border border-border py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted/40"
          >
            {expanded === table.tableId ? <T>Cerrar</T> : <T>Gestionar</T>}
          </button>

          {expanded === table.tableId && (
            <OrderPanel
              table={table}
              menuItems={menuItems}
              onDone={() => setExpanded(null)}
            />
          )}
        </div>
      ))}
    </div>
  );
}
//-aqui termina componente ServiceTableGrid-//
