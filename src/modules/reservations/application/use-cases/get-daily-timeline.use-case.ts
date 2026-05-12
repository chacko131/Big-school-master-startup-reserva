/**
 * Archivo: get-daily-timeline.use-case.ts
 * Responsabilidad: Obtener el timeline diario de mesas con sus reservas enriquecidas con datos del guest.
 * Tipo: lógica
 */

import { type BusinessHoursRepository } from "../ports/business-hours-repository.port";
import { type DiningTableRepository } from "../ports/dining-table-repository.port";
import { type GuestRepository } from "../ports/guest-repository.port";
import { type ReservationRepository } from "../ports/reservation-repository.port";
import { type ReservationTableRepository } from "../ports/reservation-table-repository.port";
import {
  type GetDailyTimelineInput,
  type GetDailyTimelineOutput,
  type TimelineBooking,
  type TimelineLane,
} from "../dtos/get-daily-timeline.dto";

const DAYS_OF_WEEK = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"] as const;

export class GetDailyTimeline {
  constructor(
    private readonly diningTableRepository: DiningTableRepository,
    private readonly reservationRepository: ReservationRepository,
    private readonly reservationTableRepository: ReservationTableRepository,
    private readonly guestRepository: GuestRepository,
    private readonly businessHoursRepository: BusinessHoursRepository
  ) {}

  //-aqui empieza funcion execute y es para construir el timeline diario de mesas con sus reservas-//
  /**
   * Obtiene todas las mesas activas del restaurante y enriquece cada una
   * con las reservas asignadas para el día solicitado.
   * @sideEffect
   */
  async execute(input: GetDailyTimelineInput): Promise<GetDailyTimelineOutput> {
    const startOfDay = new Date(input.date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(input.date);
    endOfDay.setHours(23, 59, 59, 999);

    // --- Cargar mesas activas, reservas del día y horarios en paralelo ---
    const [activeTables, reservations, allBusinessHours] = await Promise.all([
      this.diningTableRepository.findActiveByRestaurantId(input.restaurantId),
      this.reservationRepository.findByRestaurantAndDateRange(
        input.restaurantId,
        startOfDay,
        endOfDay
      ),
      this.businessHoursRepository.findByRestaurantId(input.restaurantId),
    ]);

    // --- Extraer horario del día actual ---
    const todayName = DAYS_OF_WEEK[input.date.getDay()];
    const todayHours = allBusinessHours.find((bh) => bh.day === todayName && !bh.isClosed) ?? null;
    const timelineStart = todayHours?.opensAt ?? null;
    const timelineEnd = todayHours?.closesAt ?? null;

    // --- Enriquecer reservas con nombre del guest ---
    const guestIds = [...new Set(reservations.map((r) => r.guestId))];
    const guests = await Promise.all(
      guestIds.map((id) => this.guestRepository.findById(id))
    );
    const guestMap = new Map(
      guests.filter((g) => g !== null).map((g) => [g.id, g])
    );

    // --- Obtener asignaciones mesa↔reserva para el día ---
    const occupiedTableIds = await this.reservationTableRepository.findOccupiedTableIds(
      input.restaurantId,
      startOfDay,
      endOfDay
    );
    const occupiedSet = new Set(occupiedTableIds);

    // --- Obtener qué reserva está asignada a qué mesa ---
    // Construimos un mapa tableId → reservations usando los IDs que ya tenemos
    // La relación se infiere cruzando: reservas del día cuyas mesas están en occupiedSet
    // Para una asignación precisa necesitamos la query inversa: reservaId → tableId
    const reservationToTableMap = await this.buildReservationToTableMap(
      input.restaurantId,
      startOfDay,
      endOfDay
    );

    // --- Construir lanes ---
    const lanes: TimelineLane[] = activeTables.map((table) => {
      const tablePrimitives = table.toPrimitives();

      const tableBookings: TimelineBooking[] = reservations
        .filter((r) => reservationToTableMap.get(r.id) === tablePrimitives.id)
        .map((r) => {
          const primitives = r.toPrimitives();
          const guest = guestMap.get(primitives.guestId);

          return {
            reservationId: primitives.id,
            guestFullName: guest?.fullName ?? "Desconocido",
            partySize: primitives.partySize,
            startAt: primitives.startAt,
            endAt: primitives.endAt,
            status: primitives.status,
            specialRequests: primitives.specialRequests,
          };
        });

      return {
        tableId: tablePrimitives.id,
        tableName: tablePrimitives.name,
        tableCapacity: tablePrimitives.capacity,
        zoneName: null,
        bookings: tableBookings,
      };
    });

    // Las mesas sin reservas del día también se muestran (línea vacía = mesa disponible)
    void occupiedSet; // referenciado implícitamente a través de reservationToTableMap

    return { lanes, date: input.date, timelineStart, timelineEnd };
  }
  //-aqui termina funcion execute-//

  //-aqui empieza funcion buildReservationToTableMap y es para obtener el mapa reservaId→tableId del dia-//
  /**
   * Construye un mapa reservationId → tableId consultando las asignaciones activas del día.
   * Usa findOccupiedTableIds como base pero necesita la relación inversa — se obtiene
   * via el repositorio de ReservationTable con una query directa.
   * @sideEffect
   */
  private async buildReservationToTableMap(
    restaurantId: string,
    from: Date,
    to: Date
  ): Promise<Map<string, string>> {
    const assignments = await this.reservationTableRepository.findByDateRange(
      restaurantId,
      from,
      to
    );

    return new Map(assignments.map((a) => [a.reservationId, a.tableId]));
  }
  //-aqui termina funcion buildReservationToTableMap-//
}
