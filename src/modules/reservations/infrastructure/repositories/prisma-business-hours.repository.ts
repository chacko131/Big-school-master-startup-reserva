/**
 * Archivo: prisma-business-hours.repository.ts
 * Responsabilidad: Implementar el puerto BusinessHoursRepository usando Prisma.
 * Tipo: servicio
 */

import { type PrismaClient } from "@/generated/prisma/client";
import {
  type BusinessHoursRepository,
  type BusinessHoursSlot,
} from "../../application/ports/business-hours-repository.port";

export class PrismaBusinessHoursRepository implements BusinessHoursRepository {
  constructor(private readonly prismaClient: PrismaClient) {}

  //-aqui empieza funcion findByRestaurantId y es para buscar horarios de apertura-//
  /**
   * Busca todos los horarios de apertura de un restaurante.
   * @sideEffect
   */
  async findByRestaurantId(restaurantId: string): Promise<BusinessHoursSlot[]> {
    const records = await this.prismaClient.businessHours.findMany({
      where: { restaurantId },
    });

    return records.map((r) => ({
      day: r.day,
      opensAt: r.opensAt,
      closesAt: r.closesAt,
      isClosed: r.isClosed,
    }));
  }
  //-aqui termina funcion findByRestaurantId y se va autilizar en GetAvailableSlots-//
}
