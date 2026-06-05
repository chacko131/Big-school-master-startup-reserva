/**
 * Archivo: CostingTable.tsx
 * Responsabilidad: Tabla interactiva de costeo de platos con edición inline por fila.
 * Tipo: UI
 */

"use client";

import { useState, useTransition } from "react";
import { upsertMenuItemCostingAction } from "@/app/(dashboard)/dashboard/menu/costing/actions";
import type { MenuItemCostingWithMenuItemName } from "@/modules/service/domain/ports/menu-item-costing.repository.port";
import type { PreparationArea } from "@/modules/service/domain/types/service.types";
import { T } from "@/components/T";

// ---------------------------------------------------------------------------
// Tipos y constantes
// ---------------------------------------------------------------------------

const AREA_LABELS: Record<PreparationArea, string> = {
  KITCHEN: "Cocina",
  BAR: "Barra",
  NONE: "Sin estación",
};

interface RowState {
  costUnitPrice: string;
  area: PreparationArea;
  isActive: boolean;
  saving: boolean;
  error: string | null;
  saved: boolean;
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

interface CostingTableProps {
  rows: MenuItemCostingWithMenuItemName[];
}

//-aqui empieza componente CostingTable y es para editar el costeo de cada plato-//
export function CostingTable({ rows }: CostingTableProps) {
  const [, startTransition] = useTransition();

  const initialState = Object.fromEntries(
    rows.map((r) => [
      r.menuItemId,
      {
        costUnitPrice: r.costUnitPrice > 0 ? String(r.costUnitPrice) : "",
        area: r.area,
        isActive: r.isActive,
        saving: false,
        error: null,
        saved: false,
      } satisfies RowState,
    ])
  );

  const [state, setState] = useState<Record<string, RowState>>(initialState);

  //-aqui empieza funcion updateField y es para actualizar el estado local de un campo de una fila-//
  function updateField<K extends keyof RowState>(
    menuItemId: string,
    field: K,
    value: RowState[K]
  ) {
    setState((prev) => ({
      ...prev,
      [menuItemId]: { ...prev[menuItemId]!, [field]: value, saved: false, error: null },
    }));
  }
  //-aqui termina funcion updateField-//

  //-aqui empieza funcion handleSave y es para guardar el costeo de una fila via server action-//
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
      const result = await upsertMenuItemCostingAction({
        menuItemId,
        costUnitPrice: cost,
        area: row.area,
        isActive: row.isActive,
      });

      setState((prev) => ({
        ...prev,
        [menuItemId]: {
          ...prev[menuItemId]!,
          saving: false,
          error: result.ok ? null : result.error,
          saved: result.ok,
        },
      }));
    });
  }
  //-aqui termina funcion handleSave-//

  if (rows.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No hay platos en la carta. Agrégalos primero desde Configuración → Carta.
      </p>
    );
  }

  // Agrupar por categoría
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
    <div className="space-y-8">
      {Object.entries(byCategory).map(([category, items]) => (
        <section key={category}>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {category}
          </h2>

          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-xs font-medium text-muted-foreground">
                <tr>
                  <th className="px-4 py-3"><T>Plato</T></th>
                  <th className="px-4 py-3"><T>Costo (€)</T></th>
                  <th className="px-4 py-3"><T>Venta (€)</T></th>
                  <th className="px-4 py-3"><T>Margen</T></th>
                  <th className="px-4 py-3"><T>Estación</T></th>
                  <th className="px-4 py-3"><T>Activo</T></th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((item) => {
                  const row = state[item.menuItemId];
                  if (!row) return null;

                  const cost = parseFloat(row.costUnitPrice) || 0;
                  const pub = item.publicUnitPrice;
                  const margin = pub - cost;
                  const marginPct = pub > 0 ? Math.round((margin / pub) * 100) : 0;

                  return (
                    <tr key={item.menuItemId} className="bg-background hover:bg-muted/30 transition-colors">
                      {/* Nombre */}
                      <td className="px-4 py-3 font-medium">{item.menuItemName}</td>

                      {/* Costo */}
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={row.costUnitPrice}
                          onChange={(e) => updateField(item.menuItemId, "costUnitPrice", e.target.value)}
                          className="w-24 rounded border border-input bg-background px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                          placeholder="0.00"
                        />
                      </td>

                      {/* Precio venta — solo lectura, viene de la carta */}
                      <td className="px-4 py-3 text-muted-foreground">
                        {pub > 0 ? `${pub.toFixed(2)} €` : <span className="italic text-xs"><T>Sin precio</T></span>}
                      </td>

                      {/* Margen */}
                      <td className="px-4 py-3">
                        <span className={margin >= 0 ? "text-emerald-600" : "text-destructive"}>
                          {margin.toFixed(2)} € ({marginPct}%)
                        </span>
                      </td>

                      {/* Estación */}
                      <td className="px-4 py-3">
                        <select
                          value={row.area}
                          onChange={(e) => updateField(item.menuItemId, "area", e.target.value as PreparationArea)}
                          className="rounded border border-input bg-background px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                          {(Object.keys(AREA_LABELS) as PreparationArea[]).map((a) => (
                            <option key={a} value={a}>{AREA_LABELS[a]}</option>
                          ))}
                        </select>
                      </td>

                      {/* Activo */}
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={row.isActive}
                          onChange={(e) => updateField(item.menuItemId, "isActive", e.target.checked)}
                          className="h-4 w-4 rounded border-input accent-primary"
                        />
                      </td>

                      {/* Guardar */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleSave(item.menuItemId)}
                            disabled={row.saving}
                            className="rounded bg-emerald-600 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                          >
                            {row.saving ? <T>Guardando…</T> : <T>Guardar</T>}
                          </button>
                          {row.saved && (
                            <span className="text-xs text-emerald-600">✓</span>
                          )}
                          {row.error && (
                            <span className="text-xs text-destructive">{row.error}</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}
//-aqui termina componente CostingTable-//
