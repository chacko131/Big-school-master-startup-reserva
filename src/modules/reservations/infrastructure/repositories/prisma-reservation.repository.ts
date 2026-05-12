/**
 * Archivo: prisma-reservation.repository.ts
 * Responsabilidad: Implementar el puerto ReservationRepository usando Prisma.
 * Tipo: servicio
 */

import { type PrismaClient, type Reservation as PrismaReservationRecord } from "@/generated/prisma/client";
import {
  Reservation,
  type ReservationPrimitives,
} from "../../domain/entities/reservation.entity";
import { type ReservationRepository } from "../../application/ports/reservation-repository.port";

export class PrismaReservationRepository implements ReservationRepository {
  constructor(private readonly prismaClient: PrismaClient) {}

  //-aqui empieza funcion findById y es para buscar una reserva persistida por id-//
  /**
   * Busca una reserva persistida por su identificador.
   * @sideEffect
   */
  async findById(id: string): Promise<Reservation | null> {
    const reservationRecord = await this.prismaClient.reservation.findUnique({
      where: { id },
    });

    if (reservationRecord === null) {
      return null;
    }

    return mapReservationRecordToEntity(reservationRecord);
  }
  //-aqui termina funcion findById y se va autilizar en casos de uso de reservas-//

  //-aqui empieza funcion findByRestaurantAndDateRange y es para buscar reservas en un rango de fechas-//
  /**
   * Busca reservas de un restaurante cuyo startAt caiga dentro del rango [from, to).
   * Inicio inclusivo, fin exclusivo. Excluye canceladas y no-show para cálculos de disponibilidad.
   * @sideEffect
   */
  async findByRestaurantAndDateRange(
    restaurantId: string,
    from: Date,
    to: Date,
    includeAllStatuses = false
  ): Promise<Reservation[]> {
    const records = await this.prismaClient.reservation.findMany({
      where: {
        restaurantId,
        startAt: { lt: to },
        endAt: { gt: from },
        ...(includeAllStatuses ? {} : { status: { notIn: ["CANCELLED", "NO_SHOW", "COMPLETED"] } }),
      },
      orderBy: { startAt: "asc" },
    });

    return records.map(mapReservationRecordToEntity);
  }
  //-aqui termina funcion findByRestaurantAndDateRange y se va autilizar en disponibilidad-//

  //-aqui empieza funcion findActiveByGuestAndDateRange y es para detectar reservas duplicadas de un guest en un restaurante-//
  /**
   * Busca reservas activas (no CANCELLED, NO_SHOW ni COMPLETED) de un guest específico
   * en un restaurante específico que solapen el rango dado. Usado para detección de duplicados.
   * @sideEffect
   */
  async findActiveByGuestAndDateRange(
    guestId: string,
    restaurantId: string,
    from: Date,
    to: Date
  ): Promise<Reservation[]> {
    const records = await this.prismaClient.reservation.findMany({
      where: {
        guestId,
        restaurantId,
        startAt: { lt: to },
        endAt: { gt: from },
        status: { notIn: ["CANCELLED", "NO_SHOW", "COMPLETED"] },
      },
      orderBy: { startAt: "asc" },
    });

    return records.map(mapReservationRecordToEntity);
  }
  //-aqui termina funcion findActiveByGuestAndDateRange y se va autilizar en detección de duplicados-//

  //-aqui empieza funcion findByGuestId y es para buscar el historial de reservas de un guest-//
  /**
   * Busca todas las reservas de un guest ordenadas por fecha descendente.
   * @sideEffect
   */
  async findByGuestId(guestId: string): Promise<Reservation[]> {
    const records = await this.prismaClient.reservation.findMany({
      where: { guestId },
      orderBy: { startAt: "desc" },
    });

    return records.map(mapReservationRecordToEntity);
  }
  //-aqui termina funcion findByGuestId y se va autilizar en historial del guest-//

  //-aqui empieza funcion save y es para persistir una reserva usando Prisma-//
  /**
   * Guarda una reserva en la base de datos mediante upsert.
   * @sideEffect
   */
  async save(reservation: Reservation): Promise<Reservation> {
    const reservationPrimitives = reservation.toPrimitives();

    const persistedReservation = await this.prismaClient.reservation.upsert({
      where: { id: reservationPrimitives.id },
      create: reservationPrimitives,
      update: {
        restaurantId: reservationPrimitives.restaurantId,
        guestId: reservationPrimitives.guestId,
        status: reservationPrimitives.status,
        partySize: reservationPrimitives.partySize,
        startAt: reservationPrimitives.startAt,
        endAt: reservationPrimitives.endAt,
        cancellationDeadlineAt: reservationPrimitives.cancellationDeadlineAt,
        cancelledAt: reservationPrimitives.cancelledAt,
        checkedInAt: reservationPrimitives.checkedInAt,
        completedAt: reservationPrimitives.completedAt,
        noShowMarkedAt: reservationPrimitives.noShowMarkedAt,
        specialRequests: reservationPrimitives.specialRequests,
        internalNotes: reservationPrimitives.internalNotes,
        version: reservationPrimitives.version,
        createdAt: reservationPrimitives.createdAt,
        updatedAt: reservationPrimitives.updatedAt,
      },
    });

    return mapReservationRecordToEntity(persistedReservation);
  }
  //-aqui termina funcion save y se va autilizar en application-//

  //-aqui empieza funcion delete y es para eliminar una reserva por id (rollback compensatorio)-//
  /**
   * Elimina una reserva por su id. Usado como rollback compensatorio si la asignación de mesa falla.
   * @sideEffect
   */
  async delete(id: string): Promise<void> {
    await this.prismaClient.reservation.delete({ where: { id } });
  }
  //-aqui termina funcion delete y se va autilizar en rollback de CreateReservationFull-//
}

//-aqui empieza funcion mapReservationRecordToEntity y es para rehidratar la entidad Reservation-//
/**
 * Convierte un registro Prisma en una entidad de dominio Reservation.
 * @pure
 */
function mapReservationRecordToEntity(reservationRecord: PrismaReservationRecord): Reservation {
  const reservationPrimitives: ReservationPrimitives = {
    id: reservationRecord.id,
    restaurantId: reservationRecord.restaurantId,
    guestId: reservationRecord.guestId,
    status: reservationRecord.status,
    partySize: reservationRecord.partySize,
    startAt: reservationRecord.startAt,
    endAt: reservationRecord.endAt,
    cancellationDeadlineAt: reservationRecord.cancellationDeadlineAt,
    cancelledAt: reservationRecord.cancelledAt,
    checkedInAt: reservationRecord.checkedInAt,
    completedAt: reservationRecord.completedAt,
    noShowMarkedAt: reservationRecord.noShowMarkedAt,
    specialRequests: reservationRecord.specialRequests,
    internalNotes: reservationRecord.internalNotes,
    version: reservationRecord.version,
    createdAt: reservationRecord.createdAt,
    updatedAt: reservationRecord.updatedAt,
  };

  return Reservation.fromPrimitives(reservationPrimitives);
}
//-aqui termina funcion mapReservationRecordToEntity y se va autilizar en infrastructure-//
