/**
 * Archivo: page.tsx
 * Responsabilidad: Orquestar la obtención de datos y renderizar el reporte diario del dashboard importando componentes puros.
 * Tipo: UI (Server Component)
 */

import Link from "next/link";
import { T } from "@/components/T";
import { getRestaurantIdFromSession } from "@/modules/auth/get-restaurant-id";
import { getCurrentUser } from "@/modules/auth/get-current-user";
import { getReservationsInfrastructure } from "@/modules/reservations/infrastructure/reservations-infrastructure";
import { getCatalogInfrastructure } from "@/modules/catalog/infrastructure/catalog-infrastructure";
import { GetTodayReservations } from "@/modules/reservations/application/use-cases/get-today-reservations.use-case";
import { DashboardMetricCard } from "@/components/dashboard/DashboardMetricCard";
import { DashboardReservationsTable } from "@/components/dashboard/DashboardReservationsTable";
import { DashboardFloorSummary, type DashboardFloorZoneDefinition } from "@/components/dashboard/DashboardFloorSummary";
import { DashboardAlertStack, type DashboardAlertDefinition } from "@/components/dashboard/DashboardAlertStack";
import { DashboardSuccessBanner } from "@/components/dashboard/DashboardSuccessBanner";

export const dynamic = "force-dynamic";

interface DashboardHomePageProps {
  searchParams: Promise<{
    inviteAccepted?: string | string[];
  }>;
}

interface DashboardMetricDefinition {
  label: string;
  value: string;
  caption: string;
  tone: "primary" | "secondary" | "surface" | "warning";
  progress?: number;
}

//-aqui empieza pagina DashboardHomePage y es para mostrar el reporte diario del restaurante-//
/**
 * Presenta el reporte diario del restaurante dentro del dashboard conectándose al backend real.
 *
 * @sideEffect
 */
export default async function DashboardHomePage({ searchParams }: DashboardHomePageProps) {
  const resolvedSearchParams = await searchParams;
  const inviteAcceptedValue = resolvedSearchParams.inviteAccepted;
  const inviteAcceptedKey = Array.isArray(inviteAcceptedValue) ? inviteAcceptedValue[0] ?? "" : inviteAcceptedValue ?? "";
  const showInviteSuccess = inviteAcceptedKey === "1";

  // 1. Obtener usuario en sesión y restauranteId (sin lanzar errores)
  const user = await getCurrentUser();
  const restaurantId = await getRestaurantIdFromSession();
  const firstName = user?.fullName ? user.fullName.split(" ")[0] : "";

  // 2. Resolver dependencias a través de la infraestructura
  const { diningTableRepository, zoneRepository } = getCatalogInfrastructure();
  const { reservationRepository, guestRepository, reservationTableRepository } = getReservationsInfrastructure();

  // 3. Ejecutar caso de uso para obtener las reservas del día
  const getTodayReservations = new GetTodayReservations(reservationRepository, guestRepository);
  const todayReservationsResult = await getTodayReservations.execute({
    restaurantId,
    date: new Date(),
  });
  const todayReservations = todayReservationsResult.reservations;

  // Ordenar cronológicamente por hora de inicio
  const sortedReservations = [...todayReservations].sort(
    (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
  );

  // 4. Calcular métricas reales del panel
  const totalReservations = todayReservations.length;
  
  // Clientes previstos: suma partySize de reservas no canceladas
  const activeReservations = todayReservations.filter((r) => r.status !== "CANCELLED");
  const totalCovers = activeReservations.reduce((acc, r) => acc + r.partySize, 0);

  // No-shows
  const noShowsCount = todayReservations.filter((r) => r.status === "NO_SHOW").length;

  // 5. Cargar mesas y calcular ocupación
  const allTables = await diningTableRepository.findByRestaurantId(restaurantId);
  const activeTables = allTables.filter((t) => t.isActive);
  const activeTablesCount = activeTables.length;

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);
  const occupiedTableIds = await reservationTableRepository.findOccupiedTableIds(restaurantId, startOfDay, endOfDay);

  const occupiedActiveTables = activeTables.filter((t) => occupiedTableIds.includes(t.id));
  const occupiedTablesCount = occupiedActiveTables.length;

  const occupancyPercent = activeTablesCount > 0 ? Math.round((occupiedTablesCount / activeTablesCount) * 100) : 0;

  // 6. Cargar zonas y desglosar ocupación por zona
  const zones = await zoneRepository.findByRestaurantId(restaurantId);
  const floorZones: DashboardFloorZoneDefinition[] = zones.map((zone) => {
    const tablesInZone = activeTables.filter((t) => t.toPrimitives().zoneId === zone.id);
    const occupiedInZone = tablesInZone.filter((t) => occupiedTableIds.includes(t.id));
    return {
      label: zone.name,
      occupancy: `${occupiedInZone.length} / ${tablesInZone.length}`,
    };
  });

  // 7. Generar alertas operativas
  const alerts: DashboardAlertDefinition[] = [];

  const largeGroups = activeReservations.filter((r) => r.partySize >= 8);
  if (largeGroups.length > 0) {
    alerts.push({
      title: "Grupos grandes hoy",
      description: `Hay ${largeGroups.length} grupo(s) de 8 o más personas programados para hoy. Conviene reforzar el servicio.`,
      tone: "warning",
    });
  }

  const withSpecialRequests = activeReservations.filter(
    (r) => r.specialRequests && r.specialRequests.trim().length > 0
  );
  if (withSpecialRequests.length > 0) {
    alerts.push({
      title: "Peticiones especiales",
      description: `${withSpecialRequests.length} reserva(s) tienen requerimientos especiales o notas. Revisa los detalles en la agenda.`,
      tone: "success",
    });
  }

  if (noShowsCount > 0) {
    alerts.push({
      title: "Inasistencias (No-shows)",
      description: `Se han registrado ${noShowsCount} inasistencia(s) hoy. Revisa el estado de sus mesas asignadas.`,
      tone: "warning",
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      title: "Servicio al día",
      description: "No se registran alertas operativas especiales para el día de hoy. Todo marcha en orden.",
      tone: "success",
    });
  }

  // 8. Definición de métricas del panel
  const metrics: ReadonlyArray<DashboardMetricDefinition> = [
    {
      label: "Reservas hoy",
      value: totalReservations.toString(),
      caption: totalReservations === 1 ? "1 reserva programada" : `${totalReservations} reservas programadas`,
      tone: "primary",
    },
    {
      label: "Mesas activas",
      value: `${occupiedTablesCount} / ${activeTablesCount}`,
      caption: `${occupancyPercent}% de ocupación`,
      tone: "surface",
      progress: occupancyPercent,
    },
    {
      label: "Clientes previstos",
      value: totalCovers.toString(),
      caption: totalCovers === 1 ? "1 comensal esperado" : `${totalCovers} comensales esperados`,
      tone: "secondary",
    },
    {
      label: "No-shows",
      value: noShowsCount.toString(),
      caption: noShowsCount === 1 ? "1 inasistencia registrada" : `${noShowsCount} inasistencias registradas`,
      tone: "warning",
    },
  ];

  const welcomeGreeting = firstName ? `Buenos días, ${firstName}.` : "Buenos días.";
  const summaryParagraph =
    totalReservations === 0
      ? "La sala no tiene reservas programadas para hoy por el momento. Buen momento para preparar las mesas."
      : `La sala tiene ${totalReservations} ${
          totalReservations === 1 ? "reserva" : "reservas"
        } por atender durante el día de hoy. La cocina se mantiene estable y el ritmo operativo va por buen camino.`;

  return (
    <>
      {showInviteSuccess ? <DashboardSuccessBanner /> : null}

      <section className="flex flex-col gap-6 rounded-[28px] bg-surface-container-lowest p-8 shadow-sm md:flex-row md:items-end md:justify-between md:p-10">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
            <T>{welcomeGreeting}</T>
          </p>
          <h2 className="mt-4 text-5xl font-black tracking-tighter text-primary md:text-6xl">
            <T>El servicio de hoy está en marcha.</T>
          </h2>
          <p className="mt-4 max-w-xl text-on-surface-variant md:text-lg md:leading-8">
            <T>{summaryParagraph}</T>
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-on-primary transition-colors hover:opacity-90" href="/dashboard/tables">
            <T>Vista de sala</T>
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metricDefinition) => (
          <DashboardMetricCard
            caption={metricDefinition.caption}
            key={metricDefinition.label}
            label={metricDefinition.label}
            progress={metricDefinition.progress}
            tone={metricDefinition.tone}
            value={metricDefinition.value}
          />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <DashboardReservationsTable reservations={sortedReservations} />
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <DashboardFloorSummary floorZones={floorZones} occupancyPercent={occupancyPercent} />
          <DashboardAlertStack alerts={alerts} />
        </div>
      </section>
    </>
  );
}
//-aqui termina pagina DashboardHomePage-//
