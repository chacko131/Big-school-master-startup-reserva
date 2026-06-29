/**
 * Archivo: OverviewKdsSummary.tsx
 * Responsabilidad: Resumen compacto de las colas de cocina y barra para la vista del manager.
 * Tipo: UI
 */

import { T } from "@/components/T";
import type { KdsItem } from "@/app/(service)/service/kds/actions";

interface OverviewKdsSummaryProps {
  kitchenItems: KdsItem[];
  barItems: KdsItem[];
}

//-aqui empieza componente OverviewKdsSummary y es para mostrar el estado de cocina y barra al manager-//
/**
 * Muestra dos columnas (Cocina / Barra) con las comandas activas agrupadas por mesa.
 * Read-only — el manager ve sin poder modificar.
 * @pure
 */
export function OverviewKdsSummary({ kitchenItems, barItems }: OverviewKdsSummaryProps) {
  //-aqui empieza funcion groupByTable y es para agrupar ítems por nombre de mesa-//
  function groupByTable(items: KdsItem[]): Record<string, { queued: number; preparing: number }> {
    const result: Record<string, { queued: number; preparing: number }> = {};
    for (const item of items) {
      const key = item.tableName;
      if (!result[key]) result[key] = { queued: 0, preparing: 0 };
      if (item.status === "QUEUED") result[key]!.queued++;
      if (item.status === "PREPARING") result[key]!.preparing++;
    }
    return result;
  }
  //-aqui termina funcion groupByTable-//

  const kitchenByTable = groupByTable(kitchenItems);
  const barByTable = groupByTable(barItems);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Cocina */}
      <KdsSummaryColumn
        title="Cocina"
        color="amber"
        groupedItems={kitchenByTable}
        total={kitchenItems.length}
      />
      {/* Barra */}
      <KdsSummaryColumn
        title="Barra"
        color="indigo"
        groupedItems={barByTable}
        total={barItems.length}
      />
    </div>
  );
}
//-aqui termina componente OverviewKdsSummary-//

// ---------------------------------------------------------------------------
// Sub-componente: columna por estación
// ---------------------------------------------------------------------------

interface KdsSummaryColumnProps {
  title: string;
  color: "amber" | "indigo";
  groupedItems: Record<string, { queued: number; preparing: number }>;
  total: number;
}

//-aqui empieza componente KdsSummaryColumn y es para mostrar las comandas de una estación-//
function KdsSummaryColumn({ title, color, groupedItems, total }: KdsSummaryColumnProps) {
  const entries = Object.entries(groupedItems);
  const dotColor = color === "amber" ? "bg-amber-400" : "bg-indigo-400";
  const badgeColor =
    color === "amber"
      ? "bg-amber-100 text-amber-800 border-amber-200"
      : "bg-indigo-100 text-indigo-800 border-indigo-200";

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <span className={`w-2.5 h-2.5 rounded-full ${dotColor}`} />
        <h3 className="font-bold text-on-surface text-sm">
          <T>{title}</T>
        </h3>
        <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>
          {total} <T>ítems</T>
        </span>
      </div>

      {entries.length === 0 ? (
        <p className="text-xs text-on-surface-variant text-center py-4">
          <T>Sin comandas pendientes</T>
        </p>
      ) : (
        <ul className="space-y-2">
          {entries.map(([tableName, counts]) => (
            <li
              key={tableName}
              className="flex items-center justify-between rounded-lg bg-surface-container px-3 py-2 text-sm"
            >
              <span className="font-semibold text-on-surface">{tableName}</span>
              <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                {counts.queued > 0 && (
                  <span className="bg-surface-container-high rounded px-1.5 py-0.5">
                    {counts.queued} <T>en cola</T>
                  </span>
                )}
                {counts.preparing > 0 && (
                  <span className={`rounded px-1.5 py-0.5 ${badgeColor}`}>
                    {counts.preparing} <T>prep.</T>
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
//-aqui termina componente KdsSummaryColumn-//
