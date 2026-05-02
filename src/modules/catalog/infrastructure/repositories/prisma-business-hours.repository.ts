/**
 * Archivo: prisma-business-hours.repository.ts
 * Responsabilidad: Implementar BusinessHoursRepository usando Prisma.
 * Tipo: servicio
 */

import { type BusinessHours as PrismaBusinessHoursRecord, PrismaClient } from "@/generated/prisma/client";
import { BusinessHours, type BusinessHoursPrimitives, type DayOfWeek } from "../../domain/entities/business-hours.entity";
import { type BusinessHoursRepository } from "../../application/ports/business-hours-repository.port";

export class PrismaBusinessHoursRepository implements BusinessHoursRepository {
  constructor(private readonly prismaClient: PrismaClient) {}

  //-aqui empieza funcion findByRestaurantId y es para obtener todos los horarios de un restaurante-//
  /**
   * @sideEffect
   */
  async findByRestaurantId(restaurantId: string): Promise<BusinessHours[]> {
    const records = await this.prismaClient.businessHours.findMany({
      where: { restaurantId },
      orderBy: { day: "asc" },
    });

    return records.map(mapRecordToEntity);
  }
  //-aqui termina funcion findByRestaurantId-//

  //-aqui empieza funcion saveAll y es para guardar (reemplazar) todos los horarios de un restaurante-//
  /**
   * Reemplaza todos los horarios del restaurante en una transacción atómica.
   * @sideEffect
   */
  async saveAll(hours: BusinessHours[]): Promise<void> {
    if (hours.length === 0) return;

    const restaurantId = hours[0].restaurantId;
    const primitives = hours.map((h) => h.toPrimitives());

    await this.prismaClient.$transaction([
      this.prismaClient.businessHours.deleteMany({ where: { restaurantId } }),
      this.prismaClient.businessHours.createMany({
        data: primitives.map((p) => ({
          id: p.id,
          restaurantId: p.restaurantId,
          day: p.day,
          opensAt: p.opensAt,
          closesAt: p.closesAt,
          isClosed: p.isClosed,
        })),
      }),
    ]);
  }
  //-aqui termina funcion saveAll-//

  //-aqui empieza funcion deleteByRestaurantId y es para eliminar todos los horarios de un restaurante-//
  /**
   * @sideEffect
   */
  async deleteByRestaurantId(restaurantId: string): Promise<void> {
    await this.prismaClient.businessHours.deleteMany({ where: { restaurantId } });
  }
  //-aqui termina funcion deleteByRestaurantId-//
}

//-aqui empieza funcion mapRecordToEntity y es para rehidratar BusinessHours desde Prisma-//
/**
 * @pure
 */
function mapRecordToEntity(record: PrismaBusinessHoursRecord): BusinessHours {
  const primitives: BusinessHoursPrimitives = {
    id: record.id,
    restaurantId: record.restaurantId,
    day: record.day as DayOfWeek,
    opensAt: record.opensAt,
    closesAt: record.closesAt,
    isClosed: record.isClosed,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };

  return BusinessHours.fromPrimitives(primitives);
}
//-aqui termina funcion mapRecordToEntity-//
