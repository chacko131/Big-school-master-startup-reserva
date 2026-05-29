/**
 * Archivo: get-restaurant-analytics.use-case.ts
 * Responsabilidad: Procesar e indexar las reservas del restaurante en un rango de fechas para generar analíticas operativas y de clientes.
 * Tipo: lógica
 */

import { type ReservationRepository } from "../ports/reservation-repository.port";
import { type ReservationTableRepository } from "../ports/reservation-table-repository.port";
import { type DiningTableRepository } from "../ports/dining-table-repository.port";
import { type ZoneRepository } from "@/modules/catalog/application/ports/zone-repository.port";
import {
  type GetRestaurantAnalyticsInput,
  type GetRestaurantAnalyticsOutput,
  type TemporalMetric,
  type ZoneUsageMetric,
} from "../dtos/get-restaurant-analytics.dto";

export class GetRestaurantAnalytics {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    private readonly reservationTableRepository: ReservationTableRepository,
    private readonly diningTableRepository: DiningTableRepository,
    private readonly zoneRepository: ZoneRepository
  ) {}

  //-aqui empieza funcion execute y es para procesar las analiticas del restaurante-//
  /**
   * Ejecuta el cálculo y agrupación de analíticas del restaurante en base al rango de fechas provisto.
   *
   * @sideEffect
   */
  async execute(input: GetRestaurantAnalyticsInput): Promise<GetRestaurantAnalyticsOutput> {
    // 1. Establecer rango de fechas por defecto (últimos 30 días)
    const startDate = input.startDate ? new Date(input.startDate) : new Date();
    if (!input.startDate) {
      startDate.setDate(startDate.getDate() - 30);
    }
    startDate.setHours(0, 0, 0, 0);

    const endDate = input.endDate ? new Date(input.endDate) : new Date();
    endDate.setHours(23, 59, 59, 999);

    // 2. Obtener datos crudos
    const reservations = await this.reservationRepository.findByRestaurantAndDateRange(
      input.restaurantId,
      startDate,
      endDate,
      true
    );

    const tables = await this.diningTableRepository.findActiveByRestaurantId(input.restaurantId);
    const zones = await this.zoneRepository.findByRestaurantId(input.restaurantId);
    const assignments = await this.reservationTableRepository.findByDateRange(
      input.restaurantId,
      startDate,
      endDate
    );

    // 3. Procesar KPIs generales
    const totalReservations = reservations.length;
    const completedCount = reservations.filter(
      (r) => r.status === "COMPLETED" || r.status === "CHECKED_IN"
    ).length;
    const cancelledCount = reservations.filter((r) => r.status === "CANCELLED").length;
    const noShowCount = reservations.filter((r) => r.status === "NO_SHOW").length;

    const noShowRate = totalReservations > 0 ? (noShowCount / totalReservations) * 100 : 0;
    const cancellationRate = totalReservations > 0 ? (cancelledCount / totalReservations) * 100 : 0;

    // Métricas para reservas no canceladas (activas/válidas)
    const validReservations = reservations.filter((r) => r.status !== "CANCELLED");
    const totalCovers = validReservations.reduce((acc, r) => acc + r.partySize, 0);
    const averagePartySize = validReservations.length > 0 ? totalCovers / validReservations.length : 0;

    // Calcular antelación media de la reserva en días
    let totalLeadTimeMs = 0;
    for (const r of reservations) {
      const primitives = r.toPrimitives();
      const leadTimeMs = r.startAt.getTime() - new Date(primitives.createdAt).getTime();
      totalLeadTimeMs += Math.max(0, leadTimeMs);
    }
    const averageLeadTimeDays =
      totalReservations > 0
        ? totalLeadTimeMs / (1000 * 60 * 60 * 24 * totalReservations)
        : 0;

    // 4. Agrupación por día de la semana (Lunes a Domingo)
    const dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const daysMap = new Map<number, { count: number; covers: number }>();
    for (let i = 0; i < 7; i++) {
      daysMap.set(i, { count: 0, covers: 0 });
    }

    for (const r of validReservations) {
      const dayIndex = r.startAt.getDay();
      const current = daysMap.get(dayIndex)!;
      current.count += 1;
      current.covers += r.partySize;
    }

    const byDayOfWeek: TemporalMetric[] = [1, 2, 3, 4, 5, 6, 0].map((dayIdx) => {
      const data = daysMap.get(dayIdx)!;
      return {
        key: dayNames[dayIdx],
        reservationsCount: data.count,
        coversCount: data.covers,
      };
    });

    // 5. Agrupación por hora del día (HH:00)
    const hoursMap = new Map<string, { count: number; covers: number }>();
    for (const r of validReservations) {
      const hour = r.startAt.getHours();
      const hourKey = `${hour.toString().padStart(2, "0")}:00`;
      const current = hoursMap.get(hourKey) ?? { count: 0, covers: 0 };
      current.count += 1;
      current.covers += r.partySize;
      hoursMap.set(hourKey, current);
    }

    const byHour: TemporalMetric[] = Array.from(hoursMap.entries())
      .map(([key, data]) => ({
        key,
        reservationsCount: data.count,
        coversCount: data.covers,
      }))
      .sort((a, b) => a.key.localeCompare(b.key));

    // 6. Agrupación por fecha (YYYY-MM-DD) para tendencias
    const datesMap = new Map<string, { count: number; covers: number }>();
    for (const r of validReservations) {
      const year = r.startAt.getFullYear();
      const month = (r.startAt.getMonth() + 1).toString().padStart(2, "0");
      const day = r.startAt.getDate().toString().padStart(2, "0");
      const dateKey = `${year}-${month}-${day}`;

      const current = datesMap.get(dateKey) ?? { count: 0, covers: 0 };
      current.count += 1;
      current.covers += r.partySize;
      datesMap.set(dateKey, current);
    }

    const byDate: TemporalMetric[] = Array.from(datesMap.entries())
      .map(([key, data]) => ({
        key,
        reservationsCount: data.count,
        coversCount: data.covers,
      }))
      .sort((a, b) => a.key.localeCompare(b.key));

    // 7. Analítica de recurrencia de huéspedes
    // Clasifica a los clientes por su volumen de visitas completadas/llegadas en el periodo
    const guestVisitsMap = new Map<string, number>();
    for (const r of reservations) {
      if (r.status === "COMPLETED" || r.status === "CHECKED_IN") {
        guestVisitsMap.set(r.guestId, (guestVisitsMap.get(r.guestId) ?? 0) + 1);
      }
    }

    let repeatGuestsCount = 0;
    let oneTimeGuestsCount = 0;
    for (const visits of guestVisitsMap.values()) {
      if (visits >= 2) {
        repeatGuestsCount += 1;
      } else if (visits === 1) {
        oneTimeGuestsCount += 1;
      }
    }

    const totalGuestsWithVisits = repeatGuestsCount + oneTimeGuestsCount;
    const repeatRate = totalGuestsWithVisits > 0 ? (repeatGuestsCount / totalGuestsWithVisits) * 100 : 0;

    // 8. Ocupación por zonas reales de restaurante
    const zonesMap = new Map(zones.map((z) => [z.id, z.name]));
    const tableToZoneMap = new Map<string, { zoneId: string; zoneName: string }>();

    for (const t of tables) {
      const primitives = t.toPrimitives();
      if (primitives.zoneId) {
        tableToZoneMap.set(primitives.id, {
          zoneId: primitives.zoneId,
          zoneName: zonesMap.get(primitives.zoneId) ?? "Desconocida",
        });
      }
    }

    // Mapa de reservas válidas a su comensales para cruzar con asignaciones
    const reservationCoversMap = new Map(validReservations.map((r) => [r.id, r.partySize]));

    // Agrupación por zonas de salón
    const zoneMetricsMap = new Map<string, { name: string; count: number; covers: number }>();
    
    // Inicializar con todas las zonas reales
    for (const z of zones) {
      zoneMetricsMap.set(z.id, { name: z.name, count: 0, covers: 0 });
    }
    // Clave para asignaciones sin zona o mesas huérfanas
    const ORPHAN_ZONE_KEY = "ORPHAN";
    zoneMetricsMap.set(ORPHAN_ZONE_KEY, { name: "Sin Zona", count: 0, covers: 0 });

    for (const assign of assignments) {
      const partySize = reservationCoversMap.get(assign.reservationId);
      if (partySize === undefined) {
        continue; // La reserva fue cancelada o no pertenece al subconjunto analizado
      }

      const zoneInfo = tableToZoneMap.get(assign.tableId);
      if (zoneInfo) {
        const metrics = zoneMetricsMap.get(zoneInfo.zoneId)!;
        metrics.count += 1;
        metrics.covers += partySize;
      } else {
        const metrics = zoneMetricsMap.get(ORPHAN_ZONE_KEY)!;
        metrics.count += 1;
        metrics.covers += partySize;
      }
    }

    const byZone: ZoneUsageMetric[] = Array.from(zoneMetricsMap.entries())
      .map(([id, data]) => ({
        zoneId: id,
        zoneName: data.name,
        reservationsCount: data.count,
        coversCount: data.covers,
      }))
      // Filtrar el grupo "Sin Zona" si no tiene datos para no saturar la respuesta
      .filter((z) => z.zoneId !== ORPHAN_ZONE_KEY || z.reservationsCount > 0);

    return {
      summary: {
        totalReservations,
        totalCovers,
        noShowCount,
        cancelledCount,
        completedCount,
        noShowRate: Math.round(noShowRate * 10) / 10,
        cancellationRate: Math.round(cancellationRate * 10) / 10,
        averagePartySize: Math.round(averagePartySize * 10) / 10,
        averageLeadTimeDays: Math.round(averageLeadTimeDays * 10) / 10,
      },
      byDayOfWeek,
      byHour,
      byDate,
      guestsRecurrence: {
        repeatGuestsCount,
        oneTimeGuestsCount,
        repeatRate: Math.round(repeatRate * 10) / 10,
      },
      byZone,
    };
  }
  //-aqui termina funcion execute y se utilizara en endpoints o actions de analitica-//
}
