/**
 * Archivo: prisma-reservation-table.repository.ts
 * Responsabilidad: Implementar el puerto ReservationTableRepository usando Prisma.
 * Tipo: servicio
 */

import { type PrismaClient } from "@/generated/prisma/client";
import {
  ReservationTable,
} from "../../domain/entities/reservation-table.entity";
import { type ReservationTableRepository } from "../../application/ports/reservation-table-repository.port";

export class PrismaReservationTableRepository implements ReservationTableRepository {
  constructor(private readonly prismaClient: PrismaClient) {}

  //-aqui empieza funcion findOccupiedTableIds y es para encontrar las mesas ocupadas en un rango-//
  /**
   * Devuelve los IDs de mesas que tienen asignaciones a reservas activas solapando [from, to).
   * Excluye reservas canceladas, no-show y completadas.
   * @sideEffect
   */
  async findOccupiedTableIds(restaurantId: string, from: Date, to: Date): Promise<string[]> {
    const assignments = await this.prismaClient.reservationTable.findMany({
      where: {
        reservation: {
          restaurantId,
          startAt: { lt: to },
          endAt: { gt: from },
          status: { notIn: ["CANCELLED", "NO_SHOW", "COMPLETED"] },
        },
      },
      select: { tableId: true },
    });

    // Devolver IDs únicos (una mesa puede tener múltiples asignaciones si se combinan mesas)
    return [...new Set(assignments.map((a) => a.tableId))];
  }
  //-aqui termina funcion findOccupiedTableIds-//

  //-aqui empieza funcion save y es para persistir una asignación mesa↔reserva-//
  /**
   * Persiste una asignación mesa↔reserva usando upsert para idempotencia.
   * @sideEffect
   */
  async save(reservationTable: ReservationTable): Promise<ReservationTable> {
    const primitives = reservationTable.toPrimitives();

    const record = await this.prismaClient.reservationTable.upsert({
      where: { id: primitives.id },
      create: {
        id: primitives.id,
        reservationId: primitives.reservationId,
        tableId: primitives.tableId,
        assignedSeats: primitives.assignedSeats,
        version: primitives.version,
        assignedAt: primitives.assignedAt,
      },
      update: {
        assignedSeats: primitives.assignedSeats,
        version: primitives.version,
      },
    });

    return ReservationTable.fromPrimitives({
      id: record.id,
      reservationId: record.reservationId,
      tableId: record.tableId,
      assignedSeats: record.assignedSeats,
      version: record.version,
      assignedAt: record.assignedAt,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
  //-aqui termina funcion save-//
}
