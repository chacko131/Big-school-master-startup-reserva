/**
 * Archivo: RestaurantMenuSection.tsx
 * Responsabilidad: Mostrar la carta pública del restaurante con selector de categorías,
 *                  grid paginado de platos y modal de detalle.
 * Tipo: UI (interactiva)
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { T } from "@/components/T";
import { type PriceRange } from "@/modules/catalog/domain/entities/restaurant.entity";
import {
  getPriceRangeDescription,
} from "@/constants/price-range";

interface MenuItemView {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  imageUrl: string | null;
  allergens: string[];
}

interface MenuCategoryView {
  id: string;
  name: string;
  description: string | null;
  items: MenuItemView[];
}

interface RestaurantMenuSectionProps {
  categories: MenuCategoryView[];
  priceRange?: PriceRange | null;
  cuisineType?: string | null;
}

const ITEMS_PER_PAGE = 6;

//-aqui empieza funcion formatPrice y es para dar formato legible al precio-//
/**
 * @pure
 */
function formatPrice(price: number): string {
  return price.toLocaleString("es", { style: "currency", currency: "EUR", minimumFractionDigits: 2 });
}
//-aqui termina funcion formatPrice-//


// ════════════════════════════════════════════════════════════════════════════════
// ItemViewer — visor fullscreen con swipe tipo TikTok
// ════════════════════════════════════════════════════════════════════════════════

interface ItemViewerProps {
  items: MenuItemView[];
  initialIndex: number;
  onClose: () => void;
}

//-aqui empieza funcion ItemViewer y es para mostrar el detalle a pantalla completa con navegación swipe-//
/**
 * Visor fullscreen: ocupa todo el viewport, permite deslizar vertical u horizontal
 * para navegar entre platos de la misma categoría. Botón cerrar siempre visible.
 */
function ItemViewer({ items, initialIndex, onClose }: ItemViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex >= 0 ? initialIndex : 0);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    containerRef.current?.focus();
    return () => { document.body.style.overflow = ""; };
  }, []);

  const current = items[currentIndex];
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < items.length - 1;

  function goNext() {
    if (hasNext) setCurrentIndex((i) => i + 1);
  }

  function goPrev() {
    if (hasPrev) setCurrentIndex((i) => i - 1);
  }

  function handleTouchStart(e: React.TouchEvent) {
    setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    setDragOffset(0);
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (!touchStart) return;
    const deltaY = e.touches[0].clientY - touchStart.y;
    const deltaX = e.touches[0].clientX - touchStart.x;
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      setDragOffset(deltaY);
    } else {
      setDragOffset(deltaX);
    }
  }

  function handleTouchEnd() {
    const threshold = 80;
    if (dragOffset < -threshold) {
      goNext();
    } else if (dragOffset > threshold) {
      goPrev();
    }
    setTouchStart(null);
    setDragOffset(0);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowDown" || e.key === "ArrowRight") goNext();
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") goPrev();
  }

  if (typeof window === "undefined") return null;

  const content = (
    <div
      ref={containerRef}
      className="fixed inset-0 z-9999 flex flex-col bg-black/80 backdrop-blur-md"
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      tabIndex={0}
      role="dialog"
      aria-modal="true"
    >
      {/* Botón cerrar */}
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
        aria-label="Cerrar"
      >
        ✕
      </button>

      {/* Indicador de posición */}
      <div className="absolute left-4 top-4 z-10 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
        {currentIndex + 1} / {items.length}
      </div>

      {/* Contenido principal */}
      <div className="flex flex-1 flex-col items-center justify-center px-4">
        {current.imageUrl ? (
          <div className="relative aspect-square w-full max-w-sm overflow-hidden rounded-2xl sm:max-w-md">
            <Image
              src={current.imageUrl}
              alt={current.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 400px"
            />
          </div>
        ) : (
          <div className="flex aspect-square w-full max-w-sm items-center justify-center rounded-2xl bg-white/5 text-6xl text-white! sm:max-w-md">
            🍽
          </div>
        )}

        <div className="mt-6 w-full max-w-sm space-y-2 text-center sm:max-w-md">
          <h3 className="text-xl font-bold text-white! sm:text-2xl"><T>{current.name}</T></h3>

          {current.price !== null ? (
            <p className="text-lg font-bold text-amber-400">{formatPrice(current.price)}</p>
          ) : null}

          {current.description ? (
            <p className="text-sm leading-relaxed text-white!"><T>{current.description}</T></p>
          ) : null}

          {current.allergens.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-1 pt-2">
              {current.allergens.map((allergen) => (
                <span
                  className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/80"
                  key={allergen}
                >
                  <T>{allergen}</T>
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {/* Flechas desktop */}
      <div className="pointer-events-none absolute inset-y-0 left-0 right-0 hidden items-center justify-between px-4 sm:flex">
        <button
          type="button"
          onClick={goPrev}
          disabled={!hasPrev}
          className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-opacity disabled:opacity-0"
          aria-label="Anterior"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={goNext}
          disabled={!hasNext}
          className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-opacity disabled:opacity-0"
          aria-label="Siguiente"
        >
          ›
        </button>
      </div>

      {/* Indicador swipe mobile */}
      <div className="pb-6 pt-4 text-center text-xs text-white/40 sm:hidden">
        <T>Desliza para navegar</T>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
//-aqui termina funcion ItemViewer-//

//-aqui empieza funcion RestaurantMenuSection y es para mostrar la carta interactiva del restaurante-//
/**
 * Muestra la carta con selector de categorías, grid paginado y modal de detalle.
 */
export function RestaurantMenuSection({ categories, priceRange, cuisineType }: RestaurantMenuSectionProps) {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [page, setPage] = useState(0);
  const [selectedItem, setSelectedItem] = useState<MenuItemView | null>(null);

  if (categories.length === 0) return null;

  const activeCategory = categories[activeCategoryIndex];
  const totalItems = activeCategory.items.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const paginatedItems = activeCategory.items.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE
  );

  function handleCategoryChange(index: number) {
    setActiveCategoryIndex(index);
    setPage(0);
  }

  return (
    <>
      <div className="space-y-6">
        {/* ─── Título ──────────────────────────────────────────────── */}
        <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
          <T>Nuestra Carta</T>
        </h2>

        {/* ─── Tipo de cocina y rango de precio ───────────────────── */}
        {(cuisineType || priceRange) && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-on-surface-variant">
            {cuisineType && (
              <span className="inline-flex items-center gap-1.5">
                <span className="text-base">🍴</span>
                <span className="font-medium"><T>{cuisineType}</T></span>
              </span>
            )}
            {cuisineType && priceRange && <span className="text-on-surface-variant/30">|</span>}
            {priceRange && (
              <span className="inline-flex items-center gap-1.5">
                <span className="text-base">💰</span>            
                <span className="text-on-surface-variant/60">
                  — <T>{getPriceRangeDescription(priceRange)}</T>
                </span>
              </span>
            )}
          </div>
        )}

        {/* ─── Selector de categorías ─────────────────────────────── */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat, idx) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryChange(idx)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                idx === activeCategoryIndex
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container-low text-on-surface hover:bg-surface-container"
              }`}
            >
              <T>{cat.name}</T>
            </button>
          ))}
        </div>

        {/* ─── Descripción de categoría ───────────────────────────── */}
        {activeCategory.description ? (
          <p className="text-sm text-on-surface-variant"><T>{activeCategory.description}</T></p>
        ) : null}

        {/* ─── Grid de platos (altura contenida) ──────────────────── */}
        <div className="max-h-[420px] overflow-y-auto rounded-2xl sm:max-h-[480px]">
          <div className="grid grid-cols-2 gap-3 p-1 sm:grid-cols-3">
            {paginatedItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedItem(item)}
                className="group flex flex-col items-center gap-2 rounded-2xl bg-surface-container-low p-3 text-center transition-colors hover:bg-surface-container"
              >
                <div className="aspect-square w-full overflow-hidden rounded-xl bg-surface-container">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      width={200}
                      height={200}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-3xl text-on-surface-variant/30">
                      🍽
                    </div>
                  )}
                </div>
                <p className="line-clamp-2 text-xs font-semibold text-on-surface sm:text-sm">
                  <T>{item.name}</T>
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* ─── Paginación ─────────────────────────────────────────── */}
        {totalPages > 1 ? (
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="rounded-lg px-3 py-1.5 text-sm font-semibold text-primary transition-opacity disabled:opacity-30"
            >
              ← <T>Anterior</T>
            </button>
            <span className="text-xs text-on-surface-variant">
              {page + 1} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="rounded-lg px-3 py-1.5 text-sm font-semibold text-primary transition-opacity disabled:opacity-30"
            >
              <T>Siguiente</T> →
            </button>
          </div>
        ) : null}
      </div>

      {/* ─── Visor fullscreen tipo feed (swipe vertical/horizontal) ─ */}
      {selectedItem ? (
        <ItemViewer
          items={activeCategory.items}
          initialIndex={activeCategory.items.findIndex((i) => i.id === selectedItem.id)}
          onClose={() => setSelectedItem(null)}
        />
      ) : null}
    </>
  );
}
//-aqui termina funcion RestaurantMenuSection-//
