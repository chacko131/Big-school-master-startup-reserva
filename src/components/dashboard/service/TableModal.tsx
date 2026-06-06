/**
 * Archivo: TableModal.tsx
 * Responsabilidad: Modal animado con framer-motion para gestionar la orden de una mesa.
 *   Delega la carta al componente MenuBook.
 * Tipo: UI
 */

"use client";

import { useState, useTransition, useEffect } from "react";
import { motion } from "framer-motion";
import { T } from "@/components/T";
import {
  createOrderAction,
  addItemsToOrderAction,
  submitOrderAction,
  fetchOrderItemsAction,
  closeOrderAction,
} from "@/app/(dashboard)/dashboard/service/actions";
import type { OrderItemPrimitives } from "@/modules/service/domain/types/service.types";
import type { PreparationArea } from "@/modules/service/domain/types/service.types";
import { StatusBadge } from "./StatusBadge";
import { MenuBook } from "./MenuBook";
import type { TableModalProps } from "./service-table.types";

//-aqui empieza componente TableModal y es para gestionar una mesa desde un modal centrado-//
export function TableModal({ table, menuItems, onClose }: TableModalProps) {
  const [, startTransition] = useTransition();
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [existingItems, setExistingItems] = useState<OrderItemPrimitives[]>([]);

  useEffect(() => {
    if (table.order) {
      fetchOrderItemsAction(table.order.id).then((r) => {
        if (r.ok) setExistingItems(r.data);
      });
    }
  }, [table.order?.id]);

  const [closing, setClosing] = useState(false);
  const [closeError, setCloseError] = useState<string | null>(null);

  const hasOrder = table.order !== null;
  const isOpen = table.order?.status === "OPEN";
  const isSubmitted = table.order?.status === "SUBMITTED";

  // Puede cerrar si todos los ítems están READY o no hay ítems pendientes
  const hasPendingItems = existingItems.some(
    (i) => i.status === "QUEUED" || i.status === "PREPARING"
  );

  async function handleCloseOrder() {
    if (!table.order) return;
    setClosing(true);
    setCloseError(null);
    const result = await closeOrderAction(table.order.id);
    if (!result.ok) { setCloseError(result.error); setClosing(false); return; }
    onClose();
  }

  function setQty(menuItemId: string, delta: number) {
    setQuantities((prev) => ({
      ...prev,
      [menuItemId]: Math.max(0, (prev[menuItemId] ?? 0) + delta),
    }));
  }

  const selectedItems = menuItems.filter((m) => (quantities[m.menuItemId] ?? 0) > 0);
  const totalItems = selectedItems.reduce((acc, m) => acc + quantities[m.menuItemId]!, 0);

  async function handleOpenOrder() {
    setError(null);
    const result = await createOrderAction(table.tableId);
    if (!result.ok) setError(result.error);
    else onClose();
  }

  function handleSendToKitchen() {
    if (!table.order) return;
    if (selectedItems.length === 0) { setError("Selecciona al menos un plato."); return; }

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
      if (!addResult.ok) { setError(addResult.error); setSubmitting(false); return; }

      // Solo re-submit si la orden estaba OPEN; si ya era SUBMITTED los ítems
      // quedan QUEUED y cocina los recoge sin necesidad de re-enviar.
      if (table.order!.status === "OPEN") {
        const submitResult = await submitOrderAction(table.order!.id);
        if (!submitResult.ok) { setError(submitResult.error); setSubmitting(false); return; }
      }

      setSubmitting(false);
      onClose();
    });
  }

  return (
    <>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        key="modal"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-[85vh] max-h-[780px] w-full max-w-lg flex-col rounded-2xl bg-background shadow-2xl ring-1 ring-border">

          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <p className="text-lg font-bold">{table.tableName}</p>
              <p className="text-xs text-muted-foreground">{table.capacity} <T>personas</T></p>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={table.order?.status ?? null} />
              <button
                onClick={onClose}
                className="rounded-full p-1.5 text-muted-foreground hover:bg-muted"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Cuerpo */}
          <div className="flex flex-1 flex-col overflow-hidden">

            {/* Mesa libre */}
            {!hasOrder && (
              <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
                <div className="rounded-full bg-primary/10 p-6">
                  <svg className="h-10 w-10 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path d="M12 4v16m8-8H4" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-bold"><T>Mesa libre</T></p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    <T>Abre una orden para empezar a tomar el pedido.</T>
                  </p>
                </div>
                <button
                  onClick={handleOpenOrder}
                  className="rounded-xl bg-emerald-600 px-8 py-3 text-base font-bold text-primary-foreground shadow-sm hover:bg-emerald-700 active:scale-95"
                >
                  <T>Abrir orden</T>
                </button>
                {error && <p className="text-sm text-destructive">{error}</p>}
              </div>
            )}

            {/* Botón cerrar mesa — solo cuando está SUBMITTED */}
            {isSubmitted && (
              <div className="border-t border-border px-4 pb-3 pt-3">
                {closeError && <p className="mb-2 text-xs text-destructive">{closeError}</p>}
                <button
                  onClick={handleCloseOrder}
                  disabled={closing}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl border-2 py-3 text-sm font-bold transition-all active:scale-[0.98] disabled:opacity-40 ${
                    hasPendingItems
                      ? "border-border text-muted-foreground hover:border-destructive/40 hover:text-destructive"
                      : "border-emerald-500 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  }`}
                >
                  {closing ? (
                    <T>Cerrando…</T>
                  ) : (
                    <>
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 0 0 1.946-.806 3.42 3.42 0 0 1 4.438 0 3.42 3.42 0 0 0 1.946.806 3.42 3.42 0 0 1 3.138 3.138 3.42 3.42 0 0 0 .806 1.946 3.42 3.42 0 0 1 0 4.438 3.42 3.42 0 0 0-.806 1.946 3.42 3.42 0 0 1-3.138 3.138 3.42 3.42 0 0 0-1.946.806 3.42 3.42 0 0 1-4.438 0 3.42 3.42 0 0 0-1.946-.806 3.42 3.42 0 0 1-3.138-3.138 3.42 3.42 0 0 0-.806-1.946 3.42 3.42 0 0 1 0-4.438 3.42 3.42 0 0 0 .806-1.946 3.42 3.42 0 0 1 3.138-3.138z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {hasPendingItems ? <T>Cerrar mesa (hay platos pendientes)</T> : <T>Cerrar mesa y cobrar</T>}
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Orden abierta o en cocina → carta (se pueden añadir más rondas) */}
            {hasOrder && (isOpen || isSubmitted) && (
              <>
                {/* Banner con resumen de lo que ya está en cocina */}
                {isSubmitted && (
                  <div className="mx-4 mt-3 rounded-xl bg-emerald-50 px-3 py-3 ring-1 ring-emerald-200">
                    <div className="mb-2 flex items-center gap-2">
                      <svg className="h-4 w-4 shrink-0 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="12" cy="12" r="10" />
                      </svg>
                      <p className="text-xs font-semibold text-emerald-700"><T>En cocina ahora</T></p>
                    </div>
                    {existingItems.length === 0 ? (
                      <p className="text-xs text-emerald-600 italic"><T>Cargando pedido…</T></p>
                    ) : (
                      <ul className="space-y-0.5">
                        {existingItems.map((item) => (
                          <li key={item.id} className="flex items-center justify-between gap-2">
                            <span className="text-xs text-emerald-800">{item.menuItemName}</span>
                            <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                              item.status === "READY" ? "bg-emerald-200 text-emerald-800" :
                              item.status === "PREPARING" ? "bg-amber-100 text-amber-700" :
                              "bg-emerald-100 text-emerald-700"
                            }`}>
                              x{item.qty} · {item.status === "READY" ? "Listo" : item.status === "PREPARING" ? "Preparando" : "En cola"}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                    <p className="mt-2 text-[11px] text-emerald-600"><T>Añade más platos si lo necesitas</T></p>
                  </div>
                )}
                <MenuBook
                  menuItems={menuItems}
                  quantities={quantities}
                  setQty={setQty}
                  search={search}
                  setSearch={setSearch}
                  error={error}
                  submitting={submitting}
                  totalItems={totalItems}
                  onSend={handleSendToKitchen}
                />
              </>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}
//-aqui termina componente TableModal-//
