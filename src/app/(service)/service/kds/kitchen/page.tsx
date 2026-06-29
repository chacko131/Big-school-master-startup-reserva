/**
 * Archivo: page.tsx
 * Responsabilidad: KDS de cocina — cola de ítems KITCHEN/NONE en estado QUEUED o PREPARING.
 * Tipo: UI (server)
 */

import { requireServiceRole } from "@/modules/auth/require-service-role";
import { fetchKdsQueueAction } from "@/app/(service)/service/kds/actions";
import { KdsOrderCard } from "@/components/service/kds/KdsOrderCard";
import { KdsAutoRefresh } from "@/components/service/kds/KdsAutoRefresh";
import { T } from "@/components/T";
import { groupByOrder } from "@/components/service/kds/kds-group-by-order";

export const dynamic = "force-dynamic";

export default async function KitchenKdsPage() {
  await requireServiceRole(["STAFF_KITCHEN", "RESTAURANT_OWNER", "MANAGER"]);

  const result = await fetchKdsQueueAction("KITCHEN");

  if (!result.ok) {
    return (
      <div className="flex-1 flex flex-col bg-black min-h-0 items-center justify-center gap-3">
        <KdsAutoRefresh />
        <p className="text-sm font-semibold text-red-400">
          <T>Error al cargar la cola de cocina</T>: {result.error}
        </p>
      </div>
    );
  }

  const groups = groupByOrder(result.data);
  const now = new Date();

  return (
    <div className="flex-1 flex flex-col bg-black min-h-0">
      <KdsAutoRefresh />

      {/* Contador de comandas */}
      <div className="px-6 py-3 border-b border-zinc-800 flex items-center gap-3">
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
          <T>Cocina</T>
        </span>
        <span className="bg-zinc-800 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
          {groups.length} <T>comandas</T>
        </span>
      </div>

      {/* Cola de comandas */}
      {groups.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-zinc-600">
          <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
          <p className="text-sm font-semibold">
            <T>Sin comandas pendientes</T>
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-x-auto">
          <div className="flex gap-6 p-6 items-start min-h-full pb-12">
            {groups.map((group) => (
              <KdsOrderCard key={group.orderId} group={group} now={now} />
            ))}
            <div className="w-8 shrink-0" />
          </div>
        </div>
      )}
    </div>
  );
}
