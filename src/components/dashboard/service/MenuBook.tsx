/**
 * Archivo: MenuBook.tsx
 * Responsabilidad: Carta organizada por categorías con tabs, buscador y selector de cantidades.
 *   Las categorías usan el patrón slider translateX igual que FloorPlanToolRail.
 * Tipo: UI
 */

"use client";

import React, { useState, useRef } from "react";
import { T } from "@/components/T";
import type { MenuBookProps } from "./service-table.types";

//-aqui empieza componente MenuBook y es para mostrar la carta por categorías con tabs y buscador-//
export function MenuBook({
  menuItems,
  quantities,
  setQty,
  search,
  setSearch,
  error,
  submitting,
  totalItems,
  onSend,
}: MenuBookProps) {
  const categories = Array.from(new Set(menuItems.map((m) => m.categoryName)));
  const [activeCategory, setActiveCategory] = useState<string>(categories[0] ?? "");

  const isSearching = search.trim().length > 0;
  const searchResults = menuItems.filter((m) =>
    m.menuItemName.toLowerCase().includes(search.toLowerCase())
  );

  const tabsRef = useRef<HTMLDivElement>(null);

  //-aqui empieza funcion renderItem y es para mostrar una fila de plato con controles de cantidad-//
  function renderItem(m: (typeof menuItems)[number], showCategory = false) {
    const qty = quantities[m.menuItemId] ?? 0;
    return (
      <div
        key={m.menuItemId}
        className={`flex items-center justify-between gap-3 rounded-xl px-3 py-3 transition-colors ${
          qty > 0 ? "bg-primary/5 ring-1 ring-primary/25" : "bg-muted/30 hover:bg-muted/60"
        }`}
      >
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-tight">{m.menuItemName}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {showCategory && (
              <span className="mr-1 text-primary/60">{m.categoryName} ·</span>
            )}
            ${m.publicUnitPrice.toFixed(2)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setQty(m.menuItemId, -1)}
            disabled={qty === 0}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-base font-bold hover:bg-muted disabled:opacity-25"
          >−</button>
          <span className={`w-7 text-center text-sm font-bold tabular-nums ${qty > 0 ? "text-primary" : "text-muted-foreground"}`}>
            {qty}
          </span>
          <button
            onClick={() => setQty(m.menuItemId, +1)}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-base font-bold text-white hover:bg-emerald-700 active:scale-90"
          >+</button>
        </div>
      </div>
    );
  }
  //-aqui termina funcion renderItem-//

  return (
    <div className="flex flex-1 flex-col overflow-hidden">

      {/* Buscador */}
      <div className="relative px-4 pb-2 pt-3 shrink-0">
        <svg
          className="absolute left-7 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
        >
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder="Buscar plato…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-border bg-muted/40 py-2.5 pl-9 pr-4 text-sm outline-none focus:border-primary focus:bg-background"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-7 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Tabs de categorías — pills scrollables horizontalmente */}
      {!isSearching && categories.length > 0 && (
        <div className="relative mb-2 shrink-0 px-8">
          <button
            type="button"
            onClick={() => {
              const el = tabsRef.current; if (!el) return; el.scrollBy({ left: -Math.max(120, el.clientWidth * 0.6), behavior: "smooth" });
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-lg bg-muted px-2 py-1 text-xs font-bold text-foreground shadow-sm hover:bg-muted/80"
            aria-label="Desplazar categorías a la izquierda"
          >
            ‹
          </button>

          <div
            ref={tabsRef}
            className="px-0"
            style={{ overflowX: "auto", scrollbarWidth: "none", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
          >
            <div className="flex gap-1.5 pb-1">
              {categories.map((cat) => {
                const count = menuItems.filter(
                  (m) => m.categoryName === cat && (quantities[m.menuItemId] ?? 0) > 0
                ).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`relative shrink-0 whitespace-nowrap rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 ${
                      activeCategory === cat
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {cat}
                    {count > 0 && (
                      <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 text-[8px] font-black text-white ring-1 ring-background">
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              const el = tabsRef.current; if (!el) return; el.scrollBy({ left: Math.max(120, el.clientWidth * 0.6), behavior: "smooth" });
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-muted px-2 py-1 text-xs font-bold text-foreground shadow-sm hover:bg-muted/80"
            aria-label="Desplazar categorías a la derecha"
          >
            ›
          </button>
        </div>
      )}

      {/* Área de contenido: slider entre paneles de categoría */}
      <div className="relative flex-1 overflow-hidden">

        {isSearching ? (
          /* Panel de búsqueda */
          <div className="absolute inset-0 overflow-y-auto px-4 pb-2">
            <p className="mb-2 text-xs text-muted-foreground">
              {searchResults.length} <T>resultado(s)</T>
            </p>
            <div className="space-y-1.5">
              {searchResults.map((m) => renderItem(m, true))}
              {searchResults.length === 0 && (
                <p className="py-8 text-center text-sm italic text-muted-foreground">
                  <T>Sin resultados.</T>
                </p>
              )}
            </div>
          </div>
        ) : (
          /* Slider: un panel por categoría */
          <div
            className="absolute inset-y-0 left-0 flex transition-transform duration-300 ease-in-out"
            style={{
              width: `${categories.length * 100}%`,
              transform: `translateX(-${(categories.indexOf(activeCategory) * 100) / categories.length}%)`,
            }}
          >
            {categories.map((cat) => (
              <div
                key={cat}
                className="h-full overflow-y-auto px-4 pb-2"
                style={{ width: `${100 / categories.length}%` }}
              >
                <div className="space-y-1.5">
                  {menuItems
                    .filter((m) => m.categoryName === cat)
                    .map((m) => renderItem(m))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer sticky */}
      <div className="border-t border-border bg-background px-4 pb-4 pt-3 shrink-0">
        {error && <p className="mb-2 text-xs text-destructive">{error}</p>}
        <button
          onClick={onSend}
          disabled={submitting || totalItems === 0}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-40"
        >
          {submitting ? (
            <T>Enviando…</T>
          ) : (
            <>
              <T>Enviar a cocina</T>
              {totalItems > 0 && (
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">
                  {totalItems} <T>plato(s)</T>
                </span>
              )}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
//-aqui termina componente MenuBook-//
