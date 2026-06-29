/**
 * Archivo: FloorMetrics.tsx
 * Responsabilidad: Barra de 5 métricas operativas para la vista de sala del mesero.
 * Tipo: UI
 */

import { T } from "@/components/T";
import type { TableWithOrder } from "@/app/(service)/service/floor/actions";

interface FloorMetricsProps {
  tables: TableWithOrder[];
}

//-aqui empieza componente FloorMetrics y es para mostrar métricas de la sala en tiempo real-//
/**
 * Calcula y muestra 5 métricas rápidas a partir de la lista de mesas:
 * - Mesas libres
 * - Órdenes activas (OPEN + SUBMITTED)
 * - Comandas en cocina (SUBMITTED con readyCount = 0)
 * - Comandas en barra (se estima como SUBMITTED sin items ready; misma lógica que cocina)
 * - Platos listos para recoger (suma de readyCount)
 * @pure
 */
export function FloorMetrics({ tables }: FloorMetricsProps) {
  const freeTables = tables.filter((t) => t.order === null).length;
  const activeOrders = tables.filter((t) => t.order !== null).length;
  const inKitchen = tables.filter((t) => t.order?.status === "SUBMITTED" && t.readyCount === 0).length;
  const readyCount = tables.reduce((sum, t) => sum + t.readyCount, 0);
  const totalCapacity = tables.reduce((sum, t) => sum + t.capacity, 0);

  const metrics = [
    { label: "Mesas libres", value: freeTables, color: "text-secondary" },
    { label: "Órdenes activas", value: activeOrders, color: "text-on-surface" },
    { label: "En cocina", value: inKitchen, color: "text-tertiary-container" },
    { label: "Platos listos", value: readyCount, color: "text-secondary" },
    { label: "Capacidad total", value: totalCapacity, color: "text-on-surface" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {metrics.map((m) => (
        <div
          key={m.label}
          className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-4 flex flex-col"
        >
          <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">
            <T>{m.label}</T>
          </span>
          <span className={`font-heading text-3xl font-bold ${m.color}`}>
            {String(m.value).padStart(2, "0")}
          </span>
        </div>
      ))}
    </div>
  );
}
//-aqui termina componente FloorMetrics-//
