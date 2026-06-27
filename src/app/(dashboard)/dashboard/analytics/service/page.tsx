/**
 * Archivo: page.tsx
 * Responsabilidad: Página de analíticas de servicio (Server Component).
 *   Resuelve el período, llama al use case GetServiceAnalytics y pasa
 *   los datos a los componentes de presentación.
 * Tipo: UI (server)
 */

import { T } from "@/components/T";
import { getRestaurantIdFromSession } from "@/modules/auth/get-restaurant-id";
import { getServiceInfrastructure } from "@/modules/service/infrastructure/service-infrastructure";
import { GetServiceAnalytics } from "@/modules/service/application/use-cases/GetServiceAnalytics/get-service-analytics.use-case";
import { ServiceAnalyticsPeriodToolbar } from "@/components/dashboard/analytics/service/ServiceAnalyticsPeriodToolbar";
import { ServiceAnalyticsKpiGrid } from "@/components/dashboard/analytics/service/ServiceAnalyticsKpiGrid";
import { ServiceAnalyticsChartPanel } from "@/components/dashboard/analytics/service/ServiceAnalyticsChartPanel";
import { ServiceAnalyticsInsightPanel } from "@/components/dashboard/analytics/service/ServiceAnalyticsInsightPanel";

export const dynamic = "force-dynamic";

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

type Period = "today" | "week" | "month";

interface ServiceAnalyticsPageProps {
  searchParams: Promise<{ period?: string }>;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

//-aqui empieza funcion resolveDateRange y es para calcular from/to según el período seleccionado-//
/**
 * Devuelve el rango de fechas correspondiente al período.
 * @pure
 */
function resolveDateRange(period: Period): { from: Date; to: Date } {
  const now = new Date();
  const to = new Date(now);

  if (period === "today") {
    const from = new Date(now);
    from.setHours(0, 0, 0, 0);
    return { from, to };
  }

  if (period === "week") {
    const from = new Date(now);
    from.setDate(now.getDate() - 6);
    from.setHours(0, 0, 0, 0);
    return { from, to };
  }

  // month
  const from = new Date(now);
  from.setDate(1);
  from.setHours(0, 0, 0, 0);
  return { from, to };
}
//-aqui termina funcion resolveDateRange-//

// ---------------------------------------------------------------------------
// Página
// ---------------------------------------------------------------------------

//-aqui empieza componente ServiceAnalyticsPage y es para orquestar las analíticas del servicio-//
/**
 * Página de analíticas de servicio.
 * Lee el período del searchParam, calcula el rango, ejecuta el use case
 * y reparte los datos entre los componentes de presentación.
 * @sideEffect lee de base de datos
 */
export default async function ServiceAnalyticsPage({ searchParams }: ServiceAnalyticsPageProps) {
  const resolvedParams = await searchParams;
  const rawPeriod = resolvedParams.period;
  const period: Period =
    rawPeriod === "week" || rawPeriod === "month" ? rawPeriod : "today";

  const { from, to } = resolveDateRange(period);

  // 1. Resolver restaurante de la sesión
  const restaurantId = await getRestaurantIdFromSession();

  // 2. Ejecutar use case
  const { orderRepository, orderItemRepository } = getServiceInfrastructure();
  const useCase = new GetServiceAnalytics(orderRepository, orderItemRepository);
  const analytics = await useCase.execute({ restaurantId, from, to });

  return (
    <>
      {/* Cabecera de página + selector de período */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant mb-2">
            <T>Módulo de Servicio</T>
          </p>
          <h1 className="text-4xl font-black tracking-tight text-primary">
            <T>Analíticas de Servicio</T>
          </h1>
          <p className="mt-2 text-sm text-on-surface-variant max-w-xl">
            <T>Rendimiento de ventas, márgenes y eficiencia operativa del servicio en sala.</T>
          </p>
        </div>
        <ServiceAnalyticsPeriodToolbar />
      </div>

      {/* KPIs */}
      <div className="mb-10">
        <ServiceAnalyticsKpiGrid summary={analytics.summary} />
      </div>

      {/* Grid principal: gráfico + tabla (izq) — insights + heatmap (der) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <ServiceAnalyticsChartPanel
          hourlyStats={analytics.hourlyStats}
          topMenuItems={analytics.topMenuItems}
        />
        <ServiceAnalyticsInsightPanel
          topMenuItems={analytics.topMenuItems}
          hourlyStats={analytics.hourlyStats}
        />
      </div>
    </>
  );
}
//-aqui termina componente ServiceAnalyticsPage-//
