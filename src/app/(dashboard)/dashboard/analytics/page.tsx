/**
 * Archivo: page.tsx
 * Responsabilidad: Orquestar la obtención de datos y renderizar el panel de analíticas operativas y de clientes del restaurante.
 * Tipo: UI (Server Component)
 */

import { getRestaurantIdFromSession } from "@/modules/auth/get-restaurant-id";
import { getCatalogInfrastructure } from "@/modules/catalog/infrastructure/catalog-infrastructure";
import { getReservationsInfrastructure } from "@/modules/reservations/infrastructure/reservations-infrastructure";
import { GetRestaurantAnalytics } from "@/modules/reservations/application/use-cases/get-restaurant-analytics.use-case";
import { AnalyticsToolbar } from "@/components/analytics/AnalyticsToolbar";
import { AnalyticsMetricsGrid } from "@/components/analytics/AnalyticsMetricsGrid";
import { AnalyticsZonesPanel } from "@/components/analytics/AnalyticsZonesPanel";
import { AnalyticsInsightRail } from "@/components/analytics/AnalyticsInsightRail";

export const dynamic = "force-dynamic";

interface AnalyticsPageProps {
  searchParams: Promise<{
    startDate?: string;
    endDate?: string;
  }>;
}

//-aqui empieza pagina AnalyticsPage y es para mostrar la analitica del restaurante-//
/**
 * Presenta el panel de analíticas operativas y de clientes del restaurante con datos dinámicos.
 *
 * @sideEffect
 */
export default async function AnalyticsPage({ searchParams }: AnalyticsPageProps) {
  const resolvedSearchParams = await searchParams;
  const startParam = resolvedSearchParams.startDate;
  const endParam = resolvedSearchParams.endDate;

  const startDate = startParam ? new Date(startParam) : undefined;
  const endDate = endParam ? new Date(endParam) : undefined;

  // 1. Obtener restaurante de la sesión activa
  const restaurantId = await getRestaurantIdFromSession();

  // 2. Resolver repositorios e infraestructura
  const { diningTableRepository } = getReservationsInfrastructure();
  const { zoneRepository } = getCatalogInfrastructure();
  const { reservationRepository, reservationTableRepository } = getReservationsInfrastructure();

  // 3. Ejecutar caso de uso para calcular analíticas reales
  const getAnalytics = new GetRestaurantAnalytics(
    reservationRepository,
    reservationTableRepository,
    diningTableRepository,
    zoneRepository
  );

  const analytics = await getAnalytics.execute({
    restaurantId,
    startDate,
    endDate,
  });

  return (
    <>
      <AnalyticsToolbar />
      <AnalyticsMetricsGrid summary={analytics.summary} />

      <section className="grid grid-cols-1 gap-8 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <AnalyticsZonesPanel byZone={analytics.byZone} />
        </div>

        <div className="xl:col-span-4">
          <AnalyticsInsightRail
            byDayOfWeek={analytics.byDayOfWeek}
            guestsRecurrence={analytics.guestsRecurrence}
            summary={analytics.summary}
          />
        </div>
      </section>
    </>
  );
}
//-aqui termina pagina AnalyticsPage-//
