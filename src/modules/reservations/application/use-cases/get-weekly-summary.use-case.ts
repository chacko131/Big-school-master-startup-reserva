/**
 * Archivo: get-weekly-summary.use-case.ts
 * Responsabilidad: Obtener el resumen semanal de reservas por mesa (lunes→domingo).
 * Tipo: lógica
 */

import { type BusinessHoursRepository } from "../ports/business-hours-repository.port";
import { type DiningTableRepository } from "../ports/dining-table-repository.port";
import { type ReservationRepository } from "../ports/reservation-repository.port";
import { type ReservationTableRepository } from "../ports/reservation-table-repository.port";
import {
  type GetWeeklySummaryInput,
  type GetWeeklySummaryOutput,
  type WeeklyDayCell,
  type WeeklyTableRow,
} from "../dtos/get-weekly-summary.dto";

const DAY_NAMES = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"] as const;

//-aqui empieza funcion getMondayOf y es para calcular el lunes de la semana de una fecha dada-//
/**
 * Devuelve el lunes (00:00:00) de la semana que contiene la fecha dada.
 * @pure
 */
function getMondayOf(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diffToMonday);
  return d;
}
//-aqui termina funcion getMondayOf-//

//-aqui empieza funcion buildWeekDates y es para generar los 7 dias de la semana desde el lunes-//
/**
 * Genera un array de 7 fechas (lunes→domingo) a partir del lunes dado.
 * @pure
 */
function buildWeekDates(monday: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}
//-aqui termina funcion buildWeekDates-//

export class GetWeeklySummary {
  constructor(
    private readonly diningTableRepository: DiningTableRepository,
    private readonly reservationRepository: ReservationRepository,
    private readonly businessHoursRepository: BusinessHoursRepository,
    private readonly reservationTableRepository: ReservationTableRepository
  ) {}

  //-aqui empieza funcion execute y es para construir el resumen semanal de reservas por mesa-//
  /**
   * Carga las mesas activas y para cada uno de los 7 días cuenta las reservas activas.
   * @sideEffect
   */
  async execute(input: GetWeeklySummaryInput): Promise<GetWeeklySummaryOutput> {
    const monday = getMondayOf(input.referenceDate);
    const weekDates = buildWeekDates(monday);

    const sunday = new Date(weekDates[6]);
    sunday.setHours(23, 59, 59, 999);

    // --- Cargar en paralelo: mesas, reservas de toda la semana, horarios y asignaciones ---
    const [activeTables, weekReservations, allBusinessHours, weekAssignments] = await Promise.all([
      this.diningTableRepository.findActiveByRestaurantId(input.restaurantId),
      this.reservationRepository.findByRestaurantAndDateRange(
        input.restaurantId,
        monday,
        sunday
      ),
      this.businessHoursRepository.findByRestaurantId(input.restaurantId),
      this.reservationTableRepository.findByDateRange(input.restaurantId, monday, sunday),
    ]);

    // --- Mapa reservationId → Set<tableId> para soportar múltiples mesas por reserva ---
    const reservationToTableMap = new Map<string, Set<string>>();
    for (const a of weekAssignments) {
      const existing = reservationToTableMap.get(a.reservationId);
      if (existing !== undefined) {
        existing.add(a.tableId);
      } else {
        reservationToTableMap.set(a.reservationId, new Set([a.tableId]));
      }
    }

    // --- Índice de días cerrados ---
    const closedDayNames = new Set(
      allBusinessHours.filter((bh) => bh.isClosed).map((bh) => bh.day)
    );

    // --- Construir rows ---
    const rows: WeeklyTableRow[] = activeTables.map((table) => {
      const tablePrimitives = table.toPrimitives();

      const days: WeeklyDayCell[] = weekDates.map((dayDate) => {
        const dayName = DAY_NAMES[dayDate.getDay()];
        const dayStart = new Date(dayDate);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(dayDate);
        dayEnd.setHours(23, 59, 59, 999);

        const reservationCount = weekReservations.filter((r) => {
          const p = r.toPrimitives();
          // Overlap: la reserva toca el día si empieza antes del fin y termina después del inicio
          const overlapsDay = p.startAt <= dayEnd && p.endAt >= dayStart;
          const assignedToTable = reservationToTableMap.get(p.id)?.has(tablePrimitives.id) === true;
          return overlapsDay && assignedToTable;
        }).length;

        return {
          date: dayDate,
          reservationCount,
          isClosed: closedDayNames.has(dayName),
        };
      });

      // TODO: zoneName se poblará cuando la entidad DiningTable exponga el nombre de zona
      return {
        tableId: tablePrimitives.id,
        tableName: tablePrimitives.name,
        tableCapacity: tablePrimitives.capacity,
        zoneName: null,
        days,
      };
    });

    return { weekStart: monday, rows };
  }
  //-aqui termina funcion execute-//
}
