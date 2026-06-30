/**
 * Archivo: CostingTable.tsx
 * Responsabilidad: Tabla interactiva de costeo de platos con edición inline por fila.
 * Tipo: UI
 */

"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import {
  upsertMenuItemCostingAction,
  updateMenuItemAction,
  generateCostingImageSignatureAction,
} from "@/app/(dashboard)/dashboard/menu/costing/actions";
import { uploadFileToCloudinary } from "@/lib/cloudinary-client-upload.lib";
import type { MenuItemCostingWithMenuItemName } from "@/modules/service/domain/ports/menu-item-costing.repository.port";
import type { PreparationArea } from "@/modules/service/domain/types/service.types";
import { T } from "@/components/T";
import { OnboardingIcon } from "@/components/onboarding/OnboardingIcon";

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

interface RowState {
  costUnitPrice: string;
  publicUnitPrice: string;
  area: PreparationArea;
  isActive: boolean;
  imageUrl: string | null;
  imagePublicId: string | null;
  saving: boolean;
  uploadingImage: boolean;
  error: string | null;
  saved: boolean;
  dirty: boolean;
}

interface CostingTableProps {
  rows: MenuItemCostingWithMenuItemName[];
}

// ---------------------------------------------------------------------------
// Helpers de UI
// ---------------------------------------------------------------------------

const AREA_CYCLE: PreparationArea[] = ["KITCHEN", "BAR", "NONE"];

//-aqui empieza funcion AreaBadge y es para mostrar la estación activa como badge cliclable para ciclar-//
function AreaBadge({ area, onChange }: { area: PreparationArea; onChange: (a: PreparationArea) => void }) {
  const next = AREA_CYCLE[(AREA_CYCLE.indexOf(area) + 1) % AREA_CYCLE.length]!;
  const config: Record<PreparationArea, { label: string; icon: "kitchen" | "localBar" | "warningArea"; cls: string }> = {
    KITCHEN: { label: "Cocina",       icon: "kitchen",     cls: "bg-emerald-600 text-white hover:bg-emerald-700" },
    BAR:     { label: "Barra",        icon: "localBar",    cls: "bg-blue-600 text-white hover:bg-blue-700" },
    NONE:    { label: "Sin estación", icon: "warningArea", cls: "bg-amber-100 text-amber-700 animate-pulse hover:bg-amber-200" },
  };
  const c = config[area];
  return (
    <button
      type="button"
      onClick={() => onChange(next)}
      title="Clic para cambiar estación"
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-bold transition-all ${c.cls}`}
    >
      <OnboardingIcon name={c.icon} className="h-3.5 w-3.5" />
      <T>{c.label}</T>
    </button>
  );
}
//-aqui termina funcion AreaBadge-//

//-aqui empieza funcion MarginBadge y es para mostrar el margen con semáforo de color-//
function MarginBadge({ pct }: { pct: number }) {
  const cls =
    pct >= 60 ? "bg-emerald-100 text-emerald-800" :
    pct >= 40 ? "bg-amber-100 text-amber-700" :
                "bg-red-100 text-red-700";
  return <span className={`rounded-full px-3 py-1 text-[10px] font-bold ${cls}`}>{pct}%</span>;
}
//-aqui termina funcion MarginBadge-//

//-aqui empieza funcion DishAvatar y es para mostrar la foto del plato o su inicial, con botón de subida al hacer hover-//
function DishAvatar({
  name,
  imageUrl,
  uploading,
  onFileSelected,
}: {
  name: string;
  imageUrl: string | null;
  uploading: boolean;
  onFileSelected: (file: File) => void;
}) {
  return (
    <label
      className="relative h-12 w-12 shrink-0 rounded-lg overflow-hidden cursor-pointer group block"
      title="Cambiar foto del plato"
      aria-label={`Cambiar foto de ${name}`}
    >
      {imageUrl ? (
        <Image src={imageUrl} alt={name} fill className="object-cover" sizes="48px" />
      ) : (
        <div className="h-full w-full bg-muted flex items-center justify-center">
          <span className="text-lg font-bold text-muted-foreground">{name.charAt(0).toUpperCase()}</span>
        </div>
      )}
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        {uploading ? (
          <span className="text-white text-[10px] font-bold">...</span>
        ) : (
          <OnboardingIcon name="edit" className="h-4 w-4 text-white" />
        )}
      </div>
      <input
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onFileSelected(f); }}
      />
    </label>
  );
}
//-aqui termina funcion DishAvatar-//

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

//-aqui empieza componente CostingTable y es para editar el costeo de cada plato-//
export function CostingTable({ rows }: CostingTableProps) {
  const [, startTransition] = useTransition();
  const [warningDismissed, setWarningDismissed] = useState(false);

  const initialState = Object.fromEntries(
    rows.map((r) => [
      r.menuItemId,
      {
        costUnitPrice: r.costUnitPrice > 0 ? String(r.costUnitPrice) : "",
        publicUnitPrice: r.publicUnitPrice > 0 ? String(r.publicUnitPrice) : "",
        area: r.area,
        isActive: r.isActive,
        imageUrl: r.imageUrl,
        imagePublicId: r.imagePublicId,
        saving: false,
        uploadingImage: false,
        error: null,
        saved: false,
        dirty: false,
      } satisfies RowState,
    ])
  );

  const [state, setState] = useState<Record<string, RowState>>(initialState);

  //-aqui empieza funcion updateField y es para actualizar el estado local de un campo de una fila-//
  function updateField<K extends keyof RowState>(menuItemId: string, field: K, value: RowState[K]) {
    setState((prev) => ({
      ...prev,
      [menuItemId]: { ...prev[menuItemId]!, [field]: value, saved: false, error: null, dirty: true },
    }));
  }
  //-aqui termina funcion updateField-//

  //-aqui empieza funcion handleSave y es para guardar costeo y precio de venta de una fila via server actions-//
  function handleSave(menuItemId: string) {
    const row = state[menuItemId];
    if (!row) return;

    const cost = parseFloat(row.costUnitPrice);
    if (isNaN(cost)) {
      setState((prev) => ({
        ...prev,
        [menuItemId]: { ...prev[menuItemId]!, error: "El costo debe ser un número válido." },
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      [menuItemId]: { ...prev[menuItemId]!, saving: true, error: null },
    }));

    startTransition(async () => {
      const parsedPrice = row.publicUnitPrice.trim() === "" ? null : Number(row.publicUnitPrice);
      let ok = false;
      let error: string | null = null;

      try {
        const [costingResult, priceResult] = await Promise.all([
          upsertMenuItemCostingAction({
            menuItemId,
            costUnitPrice: cost,
            area: row.area,
            isActive: row.isActive,
          }),
          updateMenuItemAction(menuItemId, { price: parsedPrice }),
        ]);
        ok = costingResult.ok && priceResult.success;
        error = !costingResult.ok ? (costingResult.error ?? null) : !priceResult.success ? (priceResult.error ?? null) : null;
      } catch (err) {
        error = err instanceof Error ? err.message : "Error inesperado.";
      } finally {
        setState((prev) => ({
          ...prev,
          [menuItemId]: {
            ...prev[menuItemId]!,
            saving: false,
            error,
            saved: ok,
            dirty: ok ? false : prev[menuItemId]!.dirty,
          },
        }));
      }
    });
  }
  //-aqui termina funcion handleSave-//

  //-aqui empieza funcion handleImageUpload y es para subir la foto de un plato a Cloudinary y sincronizar-//
  function handleImageUpload(menuItemId: string, file: File) {
    const row = state[menuItemId];
    if (!row) return;

    setState((prev) => ({ ...prev, [menuItemId]: { ...prev[menuItemId]!, uploadingImage: true } }));

    startTransition(async () => {
      try {
        const sig = await generateCostingImageSignatureAction();
        const uploaded = await uploadFileToCloudinary(file, sig);
        const result = await updateMenuItemAction(menuItemId, { imageUrl: uploaded.url, imagePublicId: uploaded.publicId });
        if (result.success) {
          setState((prev) => ({
            ...prev,
            [menuItemId]: {
              ...prev[menuItemId]!,
              imageUrl: uploaded.url,
              imagePublicId: uploaded.publicId,
              uploadingImage: false,
            },
          }));
        } else {
          setState((prev) => ({ ...prev, [menuItemId]: { ...prev[menuItemId]!, uploadingImage: false, error: result.error ?? "Error al guardar la imagen." } }));
        }
      } catch {
        setState((prev) => ({ ...prev, [menuItemId]: { ...prev[menuItemId]!, uploadingImage: false } }));
      }
    });
  }
  //-aqui termina funcion handleImageUpload-//

  if (rows.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        <T>No hay platos en la carta. Agrégalos primero desde Configuración → Carta.</T>
      </p>
    );
  }

  const noStationCount = Object.values(state).filter((s) => s.area === "NONE").length;

  const byCategory = rows.reduce<Record<string, MenuItemCostingWithMenuItemName[]>>(
    (acc, row) => {
      const key = row.categoryName;
      if (!acc[key]) acc[key] = [];
      acc[key]!.push(row);
      return acc;
    },
    {}
  );

  return (
    <div className="space-y-10">

      {/* Banner advertencia sin estación */}
      {noStationCount > 0 && !warningDismissed && (
        <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-8 py-3 shadow-sm">
          <div className="flex items-center gap-3">
            <OnboardingIcon name="warningArea" className="h-5 w-5 text-amber-600 animate-pulse" />
            <p className="text-sm font-medium text-amber-800">
              {noStationCount} {noStationCount === 1 ? "plato no tiene" : "platos no tienen"} estación asignada y no {noStationCount === 1 ? "llegará" : "llegarán"} a ninguna pantalla de cocina.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setWarningDismissed(true)}
            className="ml-4 rounded-full p-1 text-amber-600 hover:bg-amber-100 transition-colors"
            aria-label="Cerrar aviso"
          >
            <OnboardingIcon name="close" className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Categorías */}
      {Object.entries(byCategory).map(([category, items]) => (
        <div key={category} className="mb-12">

          {/* Cabecera de categoría */}
          <div className="flex items-center gap-4 mb-6">
            <h3 className="font-heading font-extrabold text-xl tracking-widest text-muted-foreground uppercase">
              {category}
            </h3>
            <span className="h-px flex-1 bg-border" />
            <span className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-bold text-muted-foreground">
              {items.length} {items.length === 1 ? "plato" : "platos"}
            </span>
          </div>

          {/* Contenedor tipo card */}
          <div className="rounded-2xl overflow-hidden border border-border shadow-sm bg-background">

            {/* Cabecera de columnas */}
            <div className="grid grid-cols-12 px-8 py-4 bg-muted/50 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <div className="col-span-4"><T>Nombre del Plato</T></div>
              <div className="col-span-2"><T>Costo</T></div>
              <div className="col-span-2"><T>Precio Venta</T></div>
              <div className="col-span-1"><T>Margen</T></div>
              <div className="col-span-2"><T>Estación</T></div>
              <div className="col-span-1 text-center"><T>Estado</T></div>
            </div>

            {/* Filas */}
            {items.map((item, idx) => {
              const row = state[item.menuItemId];
              if (!row) return null;

              const cost = parseFloat(row.costUnitPrice) || 0;
              const pub = parseFloat(row.publicUnitPrice) || 0;
              const marginPct = pub > 0 ? Math.round(((pub - cost) / pub) * 100) : 0;
              const costIsEmpty = !row.costUnitPrice || cost === 0;
              const isLast = idx === items.length - 1;

              return (
                <div key={item.menuItemId}>
                <div
                  className={`grid grid-cols-12 items-center px-8 py-6 transition-colors hover:bg-muted/30 ${!isLast && !row.error ? "border-b border-border" : ""}`}
                >
                  {/* Nombre con avatar */}
                  <div className="col-span-4 flex items-center gap-4">
                    <DishAvatar
                      name={item.menuItemName}
                      imageUrl={row.imageUrl}
                      uploading={row.uploadingImage}
                      onFileSelected={(f) => handleImageUpload(item.menuItemId, f)}
                    />
                    <span className="font-heading font-bold text-lg text-foreground">{item.menuItemName}</span>
                  </div>

                  {/* Costo editable */}
                  <div className="col-span-2 pr-4">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">€</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={row.costUnitPrice}
                        onChange={(e) => updateField(item.menuItemId, "costUnitPrice", e.target.value)}
                        placeholder="0.00"
                        className={`w-full rounded-lg bg-muted/40 pl-8 pr-3 py-2 text-sm font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-foreground ${
                          costIsEmpty ? "border-2 border-red-300" : "border-0"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Precio venta editable */}
                  <div className="col-span-2 pr-4">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">€</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={row.publicUnitPrice}
                        onChange={(e) => updateField(item.menuItemId, "publicUnitPrice", e.target.value)}
                        placeholder="0.00"
                        className="w-full rounded-lg bg-muted/40 border-0 pl-8 pr-3 py-2 text-sm font-light text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
                      />
                    </div>
                  </div>

                  {/* Margen */}
                  <div className="col-span-1">
                    <MarginBadge pct={marginPct} />
                  </div>

                  {/* Estación — un solo badge cliclable */}
                  <div className="col-span-2">
                    <AreaBadge
                      area={row.area}
                      onChange={(a) => updateField(item.menuItemId, "area", a)}
                    />
                  </div>

                  {/* Toggle activo + botón guardar */}
                  <div className="col-span-1 flex items-center justify-center gap-3">
                    <label
                      className="relative inline-flex cursor-pointer items-center"
                      title="Desactivar oculta este plato del menú de sala"
                    >
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={row.isActive}
                        onChange={(e) => updateField(item.menuItemId, "isActive", e.target.checked)}
                      />
                      <div className="relative h-6 w-11 rounded-full bg-gray-200 transition-colors peer-checked:bg-emerald-500">
                        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${row.isActive ? "left-5" : "left-0.5"}`} />
                      </div>
                    </label>

                    {row.dirty && (
                      <button
                        onClick={() => handleSave(item.menuItemId)}
                        disabled={row.saving}
                        className="rounded-md bg-gray-900 px-3 py-1 text-[10px] font-bold uppercase text-white shadow-md hover:opacity-80 transition-all disabled:opacity-50"
                      >
                        {row.saving ? "…" : <T>Guardar</T>}
                      </button>
                    )}
                    {row.saved && !row.dirty && (
                      <span className="text-xs font-bold text-emerald-600">✓</span>
                    )}
                  </div>
                </div>
                {row.error && (
                  <p className={`px-8 pb-3 text-xs text-red-600 ${!isLast ? "border-b border-border" : ""}`}>{row.error}</p>
                )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
//-aqui termina componente CostingTable-//
