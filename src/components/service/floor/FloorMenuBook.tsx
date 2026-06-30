/**
 * Archivo: FloorMenuBook.tsx
 * Responsabilidad: Carta de ítems para añadir a una orden dentro del panel de sala.
 *   Organizado por categorías, con buscador y selector de cantidades.
 * Tipo: UI (client)
 */

"use client";

import { useState, useMemo, useRef } from "react";
import { T } from "@/components/T";
import type { MenuItemCostingWithMenuItemName } from "@/modules/service/domain/ports/menu-item-costing.repository.port";

interface FloorMenuBookProps {
  menuItems: MenuItemCostingWithMenuItemName[];
  quantities: Record<string, number>;
  onChangeQty: (menuItemId: string, delta: number) => void;
}

//-aqui empieza componente FloorMenuBook y es para mostrar la carta y seleccionar cantidades-//
/**
 * Muestra la carta agrupada por categorías con un buscador y botones +/-.
 * @pure
 */
export function FloorMenuBook({ menuItems, quantities, onChangeQty }: FloorMenuBookProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("");
  const tabsRef = useRef<HTMLDivElement>(null);

  const categories = useMemo(
    () => Array.from(new Set(menuItems.map((m) => m.categoryName))),
    [menuItems]
  );

  //-aqui empieza sincronizacion de categoria activa cuando cambia el menu-//
  const resolvedCategory = categories.includes(activeCategory)
    ? activeCategory
    : (categories[0] ?? "");
  //-aqui termina sincronizacion de categoria activa-//

  const isSearching = search.trim().length > 0;

  const filteredItems = useMemo(() => {
    if (isSearching) {
      return menuItems.filter((m) =>
        m.menuItemName.toLowerCase().includes(search.toLowerCase())
      );
    }
    return menuItems.filter((m) => m.categoryName === resolvedCategory);
  }, [menuItems, search, resolvedCategory, isSearching]);

  return (
    <div className="flex flex-col gap-3">
      {/* Buscador */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder="Buscar plato…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest py-2.5 pl-9 pr-4 text-sm outline-none focus:border-primary"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Tabs de categorías con botones de scroll */}
      {!isSearching && categories.length > 0 && (
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              const el = tabsRef.current;
              if (!el) return;
              el.scrollBy({ left: -Math.max(120, el.clientWidth * 0.6), behavior: "smooth" });
            }}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-lg bg-surface-container px-1.5 py-1 text-xs font-bold text-on-surface shadow-sm hover:bg-surface-container-high"
            aria-label="Desplazar categorías a la izquierda"
          >
            ‹
          </button>

          <div
            ref={tabsRef}
            className="mx-6 overflow-x-auto no-scrollbar"
            style={{ scrollbarWidth: "none" }}
          >
            <div className="flex gap-1.5 pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`shrink-0 whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                    resolvedCategory === cat
                      ? "bg-primary text-on-primary"
                      : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              const el = tabsRef.current;
              if (!el) return;
              el.scrollBy({ left: Math.max(120, el.clientWidth * 0.6), behavior: "smooth" });
            }}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-lg bg-surface-container px-1.5 py-1 text-xs font-bold text-on-surface shadow-sm hover:bg-surface-container-high"
            aria-label="Desplazar categorías a la derecha"
          >
            ›
          </button>
        </div>
      )}

      {/* Lista de ítems */}
      <div className="flex flex-col gap-1.5 max-h-64 overflow-y-auto pr-1">
        {filteredItems.map((m) => {
          const qty = quantities[m.menuItemId] ?? 0;
          return (
            <div
              key={m.menuItemId}
              className={`flex items-center justify-between gap-3 rounded-xl px-3 py-2 transition-colors ${
                qty > 0
                  ? "bg-primary/5 ring-1 ring-primary/25"
                  : "bg-surface-container hover:bg-surface-container-high"
              }`}
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold leading-tight">{m.menuItemName}</p>
                <p className="mt-0.5 text-xs text-on-surface-variant">
                  ${m.publicUnitPrice.toFixed(2)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onChangeQty(m.menuItemId, -1)}
                  disabled={qty === 0}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-outline-variant bg-surface text-lg font-bold hover:bg-surface-container disabled:opacity-30"
                >
                  −
                </button>
                <span
                  className={`w-6 text-center text-sm font-bold tabular-nums ${
                    qty > 0 ? "text-primary" : "text-on-surface-variant"
                  }`}
                >
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => onChangeQty(m.menuItemId, +1)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-lg font-bold text-on-primary hover:bg-primary/80 active:scale-90"
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
        {filteredItems.length === 0 && (
          <p className="py-6 text-center text-sm text-on-surface-variant">
            <T>Sin resultados.</T>
          </p>
        )}
      </div>
    </div>
  );
}
//-aqui termina componente FloorMenuBook-//
