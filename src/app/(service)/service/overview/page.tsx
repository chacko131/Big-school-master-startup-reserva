/**
 * Archivo: page.tsx
 * Responsabilidad: Vista de control total del turno para RESTAURANT_OWNER y MANAGER.
 *   Muestra métricas globales, plano de sala en modo supervisión y resumen de KDS.
 * Tipo: UI (server)
 */

import { requireServiceRole } from "@/modules/auth/require-service-role";
import { fetchFloorOverviewAction } from "@/app/(service)/service/floor/actions";
import { fetchKdsQueueAction } from "@/app/(service)/service/kds/actions";
import { OverviewMetricBar } from "@/components/service/overview/OverviewMetricBar";
import { OverviewFloorPlan } from "@/components/service/overview/OverviewFloorPlan";
import { OverviewKdsSummary } from "@/components/service/overview/OverviewKdsSummary";
import { KdsAutoRefresh } from "@/components/service/kds/KdsAutoRefresh";
import { T } from "@/components/T";

export const dynamic = "force-dynamic";

export default async function OverviewPage() {
  const { role } = await requireServiceRole(["RESTAURANT_OWNER", "MANAGER"]);

  const [floorResult, kitchenResult, barResult] = await Promise.all([
    fetchFloorOverviewAction(),
    fetchKdsQueueAction("KITCHEN"),
    fetchKdsQueueAction("BAR"),
  ]);

  if (!floorResult.ok || !kitchenResult.ok || !barResult.ok) {
    const errors = [
      !floorResult.ok ? `Sala: ${floorResult.error}` : null,
      !kitchenResult.ok ? `Cocina: ${kitchenResult.error}` : null,
      !barResult.ok ? `Barra: ${barResult.error}` : null,
    ].filter(Boolean);
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8 text-center">
        <KdsAutoRefresh />
        <p className="text-sm font-bold text-on-surface">
          <T>Error al cargar los datos del turno. Recarga la página.</T>
        </p>
        {errors.map((e) => (
          <p key={e as string} className="text-xs text-on-surface-variant">{e}</p>
        ))}
      </div>
    );
  }

  const tables = floorResult.data.tables;
  const kitchenItems = kitchenResult.data;
  const barItems = barResult.data;

  const roleLabel = role === "RESTAURANT_OWNER" ? "Propietario" : "Manager";

  return (
    <div className="flex-1 flex flex-col bg-surface min-h-0">
      <KdsAutoRefresh />

      <div className="flex flex-col gap-8 p-6">
        {/* Encabezado */}
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
            <T>{roleLabel}</T> — <T>Control del turno</T>
          </p>
        </div>

        {/* KPIs */}
        <section>
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">
            <T>Métricas del turno</T>
          </h2>
          <OverviewMetricBar
            tables={tables}
            kitchenItems={kitchenItems}
            barItems={barItems}
          />
        </section>

        {/* Plano de sala */}
        <section>
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">
            <T>Plano de sala</T>
          </h2>
          <OverviewFloorPlan tables={tables} />
        </section>

        {/* Resumen KDS */}
        <section>
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">
            <T>Estado de cocina y barra</T>
          </h2>
          <OverviewKdsSummary kitchenItems={kitchenItems} barItems={barItems} />
        </section>
      </div>
    </div>
  );
}
