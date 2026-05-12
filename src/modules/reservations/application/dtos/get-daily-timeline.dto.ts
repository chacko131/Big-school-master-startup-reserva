/**
 * Archivo: get-daily-timeline.dto.ts
 * Responsabilidad: Contratos de entrada/salida para el caso de uso GetDailyTimeline.
 * Tipo: lógica
 */

import { type ReservationStatus } from "../../domain/entities/reservation.entity";

export interface GetDailyTimelineInput {
  restaurantId: string;
  date: Date;
}

export interface TimelineBooking {
  reservationId: string;
  guestFullName: string;
  partySize: number;
  startAt: Date;
  endAt: Date;
  status: ReservationStatus;
  specialRequests: string | null;
}

export interface TimelineLane {
  tableId: string;
  tableName: string;
  tableCapacity: number;
  zoneName: string | null;
  bookings: TimelineBooking[];
}

export interface GetDailyTimelineOutput {
  lanes: TimelineLane[];
  date: Date;
  /** Hora de apertura en formato HH:mm — origen del grid. Null si el restaurante cierra ese día. */
  timelineStart: string | null;
  /** Hora de cierre en formato HH:mm — fin del grid. Null si el restaurante cierra ese día. */
  timelineEnd: string | null;
}
