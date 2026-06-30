/**
 * Archivo: FloorOrderPanel.tsx
 * Responsabilidad: Panel lateral deslizante para gestionar la orden de una mesa.
 *   Diseño Stitch: tabs "Pedido actual" / "Añadir platos", footer con total y servir listos.
 * Tipo: UI (client)
 */

"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { T } from "@/components/T";
import { FloorMenuBook } from "./FloorMenuBook";
import {
  createOrderAction,
  addItemsToOrderAction,
  submitOrderAction,
  closeOrderAction,
  fetchOrderItemsAction,
  serveAllReadyItemsAction,
} from "@/app/(service)/service/floor/actions";
import type { TableWithOrder } from "@/app/(service)/service/floor/actions";
import type { OrderItemPrimitives } from "@/modules/service/domain/types/service.types";
import type { MenuItemCostingWithMenuItemName } from "@/modules/service/domain/ports/menu-item-costing.repository.port";

interface FloorOrderPanelProps {
  table: TableWithOrder | null;
  menuItems: MenuItemCostingWithMenuItemName[];
  onClose: () => void;
}

type PanelTab = "order" | "add";

//-aqui empieza componente FloorOrderPanel y es para gestionar la orden de una mesa desde la vista de sala-//
/**
 * Slide-over que abre al pulsar una mesa.
 * - Si no hay orden: muestra "Abrir mesa".
 * - Si hay orden: muestra tabs con Pedido actual / Añadir platos.
 * Usa useTransition para ejecutar server actions con feedback de carga.
 * @sideEffect llama a server actions y revalida /service/floor
 */
export function FloorOrderPanel({ table, menuItems, onClose }: FloorOrderPanelProps) {
  const [activeTab, setActiveTab] = useState<PanelTab>("order");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [items, setItems] = useState<OrderItemPrimitives[]>([]);
  const [loadingItems, setLoadingItems] = useState(() => !!(table?.order));
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const order = table?.order ?? null;
  const openedAt = order?.openedAt;

  //-aqui empieza efecto carga de ítems con guard de cancelación-//
  useEffect(() => {
    if (!order) {
      return;
    }

    let cancelled = false;
    fetchOrderItemsAction(order.id)
      .then((result) => {
        if (cancelled) return;
        if (result.ok) setItems(result.data);
        else setError(result.error);
      })
      .finally(() => {
        if (!cancelled) setLoadingItems(false);
      });

    return () => {
      cancelled = true;
    };
  }, [order]);
  //-aqui termina efecto carga de ítems-//

  const elapsed = openedAt ? formatElapsed(openedAt) : null;
  const readyItems = items.filter((i) => i.status === "READY");
  const partialTotal = items.reduce((sum, i) => sum + i.qty * i.publicUnitPrice, 0);

  //-aqui empieza funcion handleQtyChange y es para sumar o restar cantidad de un ítem de la carta-//
  function handleQtyChange(menuItemId: string, delta: number) {
    setQuantities((prev) => ({
      ...prev,
      [menuItemId]: Math.max(0, (prev[menuItemId] ?? 0) + delta),
    }));
  }
  //-aqui termina funcion handleQtyChange-//

  //-aqui empieza funcion selectedItems y es para convertir cantidades en AddItemInput-//
  function selectedItems() {
    return Object.entries(quantities)
      .filter(([, qty]) => qty > 0)
      .map(([menuItemId, qty]) => {
        const item = menuItems.find((m) => m.menuItemId === menuItemId);
        return {
          menuItemId,
          menuItemName: item?.menuItemName ?? "",
          qty,
          publicUnitPrice: item?.publicUnitPrice ?? 0,
          costUnitPrice: item?.costUnitPrice ?? 0,
          area: item?.area ?? "NONE",
        };
      });
  }
  //-aqui termina funcion selectedItems-//

  //-aqui empieza funcion handleCreateOrder y es para abrir una orden en la mesa seleccionada-//
  function handleCreateOrder() {
    if (!table) return;
    setError(null);
    startTransition(async () => {
      const result = await createOrderAction(table.tableId);
      if (!result.ok) {
        setError(result.error);
      } else {
        router.refresh();
      }
    });
  }
  //-aqui termina funcion handleCreateOrder-//

  //-aqui empieza funcion handleAddItems y es para añadir los ítems seleccionados a la orden-//
  function handleAddItems() {
    if (!order) return;
    const itemsToAdd = selectedItems();
    if (itemsToAdd.length === 0) return;

    setError(null);
    startTransition(async () => {
      const result = await addItemsToOrderAction(order.id, itemsToAdd);
      if (result.ok) {
        setQuantities({});
        setItems((prev) => [...prev, ...result.data]);
        setActiveTab("order");
      } else {
        setError(result.error);
      }
    });
  }
  //-aqui termina funcion handleAddItems-//

  //-aqui empieza funcion handleSubmit y es para enviar la orden a cocina-//
  function handleSubmit() {
    if (!order) return;
    setError(null);
    startTransition(async () => {
      const result = await submitOrderAction(order.id);
      if (!result.ok) {
        setError(result.error);
      } else {
        router.refresh();
      }
    });
  }
  //-aqui termina funcion handleSubmit-//

  //-aqui empieza funcion handleCloseOrder y es para cerrar la orden y liberar la mesa-//
  function handleCloseOrder() {
    if (!order) return;
    setError(null);
    startTransition(async () => {
      const result = await closeOrderAction(order.id);
      if (!result.ok) {
        setError(result.error);
      } else {
        router.refresh();
        onClose();
      }
    });
  }
  //-aqui termina funcion handleCloseOrder-//

  //-aqui empieza funcion handleServeAllReady y es para marcar todos los platos listos como servidos-//
  function handleServeAllReady() {
    if (!order || readyItems.length === 0) return;
    setError(null);
    startTransition(async () => {
      const result = await serveAllReadyItemsAction(order.id);
      if (result.ok) {
        setItems((prev) =>
          prev.map((item) =>
            result.data.find((served) => served.id === item.id)
              ? { ...item, status: "SERVED" as const, servedAt: new Date(), updatedAt: new Date() }
              : item
          )
        );
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }
  //-aqui termina funcion handleServeAllReady-//

  const totalSelected = Object.values(quantities).reduce((a, b) => a + b, 0);
  const queuedItems = items.filter((i) => i.status === "QUEUED");
  const unservedItems = items.filter(
    (i) => i.status !== "SERVED" && i.status !== "CANCELLED"
  );

  return (
    <AnimatePresence>
      {table && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={`Gestión de Mesa ${table.tableName}`}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.25 }}
            className="fixed right-0 top-0 z-50 h-full w-[400px] bg-surface-container-lowest border-l border-outline-variant/20 shadow-[-10px_0_30px_rgba(0,0,0,0.03)] flex flex-col"
          >
            {/* Header */}
            <header className="p-6 border-b border-surface-container flex justify-between items-start bg-surface-container-lowest shrink-0">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-heading text-3xl font-black tracking-tight text-on-surface">
                    <T>Mesa</T> {table.tableName}
                  </h2>
                  {order && (
                    <span className="bg-tertiary-container text-on-tertiary-container px-2 py-0.5 rounded text-xs font-bold uppercase">
                      {order.status}
                    </span>
                  )}
                </div>
                <p className="text-sm text-on-surface-variant font-sans">
                  {table.capacity} <T>Pax</T>
                  {elapsed && (
                    <>
                      {" "}• {elapsed} <T>transcurrido</T>
                    </>
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar panel de mesa"
                className="w-8 h-8 rounded-full bg-surface hover:bg-surface-container flex items-center justify-center text-on-surface transition-colors"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </header>

            {/* Tabs */}
            {order && (
              <nav className="flex border-b border-surface-container px-6 pt-4 bg-surface-container-lowest shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTab("order")}
                  className={`pb-3 px-2 mr-6 text-sm font-bold transition-colors border-b-2 ${
                    activeTab === "order"
                      ? "border-primary text-primary"
                      : "border-transparent text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  <T>PEDIDO ACTUAL</T>
                </button>
                {(order.status === "OPEN" || order.status === "SUBMITTED") && (
                  <button
                    type="button"
                    onClick={() => setActiveTab("add")}
                    className={`pb-3 px-2 mr-6 text-sm font-bold transition-colors border-b-2 ${
                      activeTab === "add"
                        ? "border-primary text-primary"
                        : "border-transparent text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    <T>AÑADIR PLATOS</T>
                  </button>
                )}
              </nav>
            )}

            {/* Contenido */}
            <div className="flex-1 overflow-y-auto p-6">
              {error && (
                <div className="rounded-xl bg-error-container text-on-error-container px-4 py-3 text-sm font-semibold mb-4">
                  {error}
                </div>
              )}

              {!order ? (
                <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center">
                    <svg className="h-8 w-8 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </div>
                  <p className="text-sm text-on-surface-variant">
                    <T>La mesa está libre. Abre una orden para empezar.</T>
                  </p>
                  <button
                    type="button"
                    onClick={handleCreateOrder}
                    disabled={isPending}
                    className="bg-primary text-on-primary px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-primary/90 disabled:opacity-50 transition-colors"
                  >
                    {isPending ? <T>Abriendo…</T> : <T>Abrir mesa</T>}
                  </button>
                </div>
              ) : activeTab === "order" ? (
                <OrderItemsList
                  items={items}
                  loading={loadingItems}
                  readyCount={readyItems.length}
                  onServeAll={handleServeAllReady}
                  isPending={isPending}
                  orderStatus={order.status}
                />
              ) : (
                <div className="flex flex-col gap-4">
                  <FloorMenuBook
                    menuItems={menuItems}
                    quantities={quantities}
                    onChangeQty={handleQtyChange}
                  />
                  <button
                    type="button"
                    onClick={handleAddItems}
                    disabled={isPending || totalSelected === 0}
                    className="w-full bg-primary text-on-primary py-3 rounded-xl text-sm font-bold hover:bg-primary/90 disabled:opacity-40 transition-colors"
                  >
                    {isPending ? <T>Añadiendo…</T> : <T>Añadir a la orden</T>}
                    {totalSelected > 0 && !isPending && (
                      <span className="ml-2 text-xs">({totalSelected})</span>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            {order && activeTab === "order" && (
              <footer className="p-6 border-t border-surface-container bg-surface-container-lowest shrink-0">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-on-surface-variant"><T>Total Parcial</T></span>
                  <span className="font-heading text-xl font-black">${partialTotal.toFixed(2)}</span>
                </div>
                {order.status === "OPEN" && items.length > 0 && (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isPending}
                    className="w-full bg-secondary text-on-secondary font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-secondary/80 transition-colors disabled:opacity-40"
                  >
                    <T>Enviar a cocina</T>
                  </button>
                )}
                {order.status === "SUBMITTED" && queuedItems.length > 0 && (
                  <p className="text-xs text-center text-on-surface-variant pb-2">
                    {queuedItems.length} <T>plato(s) nuevo(s) en cola en cocina</T>
                  </p>
                )}
                {order.status === "SUBMITTED" && readyItems.length > 0 && (
                  <button
                    type="button"
                    onClick={handleServeAllReady}
                    disabled={isPending}
                    className="w-full bg-primary text-on-primary font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-[0_8px_16px_rgba(0,0,0,0.1)] disabled:opacity-40"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                    <T>Marcar</T> {readyItems.length} <T>platos como Servidos</T>
                  </button>
                )}
                {order.status === "SUBMITTED" && unservedItems.length > 0 && readyItems.length === 0 && (
                  <p className="text-xs text-center text-on-surface-variant pb-2">
                    {unservedItems.length} <T>plato(s) aún en cocina. Espera a que estén listos.</T>
                  </p>
                )}
                {order.status === "SUBMITTED" && unservedItems.length === 0 && (
                  <button
                    type="button"
                    onClick={handleCloseOrder}
                    disabled={isPending}
                    className="w-full bg-tertiary-container text-on-tertiary-container font-bold py-4 rounded-xl hover:bg-tertiary-container/80 transition-colors disabled:opacity-40"
                  >
                    {isPending ? <T>Cerrando…</T> : <T>Cerrar mesa</T>}
                  </button>
                )}
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
//-aqui termina componente FloorOrderPanel-//

// ---------------------------------------------------------------------------
// Sub-componente: lista de ítems del pedido actual
// ---------------------------------------------------------------------------

interface OrderItemsListProps {
  items: OrderItemPrimitives[];
  loading: boolean;
  readyCount: number;
  onServeAll: () => void;
  isPending: boolean;
  orderStatus: string;
}

//-aqui empieza componente OrderItemsList y es para renderizar la lista de ítems del pedido actual-//
function OrderItemsList({ items, loading, readyCount }: OrderItemsListProps) {
  if (loading) {
    return <p className="text-sm text-on-surface-variant"><T>Cargando…</T></p>;
  }

  if (items.length === 0) {
    return (
      <p className="text-sm text-on-surface-variant text-center py-8">
        <T>Sin ítems. Abre la pestaña &quot;Añadir platos&quot;.</T>
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Alerta de atención si hay listos */}
      {readyCount > 0 && (
        <div className="bg-secondary-container/20 p-3 rounded-lg border border-secondary/20 flex items-center justify-between -mx-3">
          <span className="text-xs font-bold text-on-secondary-container">
            {readyCount} <T>platos listos para recoger</T>
          </span>
        </div>
      )}

      <ul className="space-y-4">
        {items.map((item) => (
          <OrderItemRow key={item.id} item={item} />
        ))}
      </ul>
    </div>
  );
}
//-aqui termina componente OrderItemsList-//

//-aqui empieza componente OrderItemRow y es para renderizar una fila de ítem con estilo según estado-//
function OrderItemRow({ item }: { item: OrderItemPrimitives }) {
  const isServed = item.status === "SERVED";
  const isReady = item.status === "READY";
  const isPreparing = item.status === "PREPARING";

  return (
    <li
      className={`flex items-start justify-between ${
        isReady ? "bg-secondary-container/20 p-3 rounded-lg -mx-3 border border-secondary/20" : "p-3"
      }`}
    >
      <div className="flex gap-3">
        <span
          className={`font-heading font-bold text-sm ${
            isReady ? "text-primary" : isServed ? "text-on-surface-variant" : "text-on-surface"
          }`}
        >
          {item.qty}
        </span>
        <div>
          <p
            className={`font-medium text-sm ${
              isServed ? "line-through opacity-70" : "text-on-surface"
            }`}
          >
            {item.menuItemName}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        {isReady ? (
          <span className="text-xs font-bold text-on-secondary-container bg-secondary-container px-2 py-1 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
            <T>READY</T>
          </span>
        ) : isPreparing ? (
          <span className="text-xs font-medium text-on-surface-variant bg-surface-container-high px-2 py-1 rounded flex items-center gap-1">
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 19H5V8h14m-3-5v2H8V3H6v2H5c-1.11 0-2 .89-2 2v12a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2h-1V3m-5 11h-2v2h2v-2m0-2h-2v-2h2v2m4 2h-2v2h2v-2m0-2h-2v-2h2v2z" />
            </svg>
            <T>PREPARING</T>
          </span>
        ) : (
          <span className="text-xs font-bold text-on-surface-variant bg-surface px-2 py-1 rounded">
            <T>{item.status}</T>
          </span>
        )}
      </div>
    </li>
  );
}
//-aqui termina componente OrderItemRow-//

//-aqui empieza funcion formatElapsed y es para mostrar minutos u horas transcurridas desde openedAt-//
/** @pure */
function formatElapsed(openedAt: Date): string {
  const minutes = Math.floor((Date.now() - openedAt.getTime()) / 60_000);
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}
//-aqui termina funcion formatElapsed-//
