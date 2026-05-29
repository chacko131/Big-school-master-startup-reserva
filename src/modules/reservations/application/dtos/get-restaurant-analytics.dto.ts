/**
 * Archivo: get-restaurant-analytics.dto.ts
 * Responsabilidad: Definir las interfaces de entrada y salida para el caso de uso de analíticas del restaurante.
 * Tipo: lógica
 */

export interface GetRestaurantAnalyticsInput {
  restaurantId: string;
  startDate?: Date;
  endDate?: Date;
}

export interface RestaurantAnalyticsSummary {
  totalReservations: number;
  totalCovers: number;
  noShowCount: number;
  cancelledCount: number;
  completedCount: number;
  noShowRate: number;
  cancellationRate: number;
  averagePartySize: number;
  averageLeadTimeDays: number;
}

export interface TemporalMetric {
  key: string; // ej: "Lunes", "19:00", "2026-05-29"
  reservationsCount: number;
  coversCount: number;
}

export interface GuestRecurrenceMetric {
  repeatGuestsCount: number;
  oneTimeGuestsCount: number;
  repeatRate: number;
}

export interface ZoneUsageMetric {
  zoneId: string;
  zoneName: string;
  reservationsCount: number;
  coversCount: number;
}

export interface GetRestaurantAnalyticsOutput {
  summary: RestaurantAnalyticsSummary;
  byDayOfWeek: TemporalMetric[];
  byHour: TemporalMetric[];
  byDate: TemporalMetric[];
  guestsRecurrence: GuestRecurrenceMetric;
  byZone: ZoneUsageMetric[];
}
