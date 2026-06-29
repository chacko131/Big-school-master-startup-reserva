/**
 * Archivo: page.tsx
 * Responsabilidad: Vista de sala — grid de mesas, métricas operativas y panel de orden.
 *   Para STAFF_WAITER, RESTAURANT_OWNER y MANAGER.
 * Tipo: UI (server)
 */

import { requireServiceRole } from "@/modules/auth/require-service-role";
import { fetchFloorOverviewAction } from "@/app/(service)/service/floor/actions";
import { FloorMetrics } from "@/components/service/floor/FloorMetrics";
import { FloorTableGrid } from "@/components/service/floor/FloorTableGrid";
import { KdsAutoRefresh } from "@/components/service/kds/KdsAutoRefresh";
import { T } from "@/components/T";

export const dynamic = "force-dynamic";

export default async function FloorPage() {
  await requireServiceRole(["STAFF_WAITER", "RESTAURANT_OWNER", "MANAGER"]);

  const result = await fetchFloorOverviewAction();

  if (!result.ok) {
    return (
      <div className="flex-1 flex items-center justify-center bg-surface p-8">
        <p className="text-sm text-error font-semibold">{result.error}</p>
      </div>
    );
  }

  const { tables, menuItems } = result.data;

  return (
    <div className="flex-1 flex flex-col bg-surface min-h-0">
      <KdsAutoRefresh />

      <div className="flex flex-col gap-6 p-6">
        {/* Métricas operativas */}
        <section>
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">
            <T>Estado del turno</T>
          </h2>
          <FloorMetrics tables={tables} />
        </section>

        {/* Grid de mesas + panel lateral */}
        <section>
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">
            <T>Mesas</T>
          </h2>
          <FloorTableGrid tables={tables} menuItems={menuItems} />
        </section>
      </div>
    </div>
  );
}
