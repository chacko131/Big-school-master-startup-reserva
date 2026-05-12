/**
 * Archivo: get-weekly-summary.dto.ts
 * Responsabilidad: Contratos de entrada/salida para el caso de uso GetWeeklySummary.
 * Tipo: lógica
 */

export interface GetWeeklySummaryInput {
  restaurantId: string;
  /** Cualquier fecha de la semana — el use case calcula el lunes correspondiente. */
  referenceDate: Date;
}

export interface WeeklyDayCell {
  /** Fecha del día (medianoche local). */
  date: Date;
  /** Número de reservas activas ese día para esta mesa. */
  reservationCount: number;
  /** true si el restaurante cierra ese día según BusinessHours. */
  isClosed: boolean;
}

export interface WeeklyTableRow {
  tableId: string;
  tableName: string;
  tableCapacity: number;
  zoneName: string | null;
  /** Siempre 7 elementos, lunes→domingo. */
  days: WeeklyDayCell[];
}

export interface GetWeeklySummaryOutput {
  /** Lunes de la semana consultada. */
  weekStart: Date;
  rows: WeeklyTableRow[];
}
