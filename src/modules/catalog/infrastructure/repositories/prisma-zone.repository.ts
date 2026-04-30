/**
 * Archivo: prisma-zone.repository.ts
 * Responsabilidad: Implementar el puerto ZoneRepository usando Prisma.
 * Tipo: servicio
 */

import { type RestaurantZone as PrismaZoneRecord, PrismaClient } from "@/generated/prisma/client";
import { RestaurantZone, type RestaurantZonePrimitives } from "../../domain/entities/restaurant-zone.entity";
import { type ZoneRepository } from "../../application/ports/zone-repository.port";

export class PrismaZoneRepository implements ZoneRepository {
  constructor(private readonly prismaClient: PrismaClient) {}

  //-aqui empieza funcion findByRestaurantId y es para listar las zonas de un restaurante ordenadas-//
  /**
   * Lista las zonas de un restaurante ordenadas por sortOrder.
   * @sideEffect
   */
  async findByRestaurantId(restaurantId: string): Promise<RestaurantZone[]> {
    const records = await this.prismaClient.restaurantZone.findMany({
      where: { restaurantId },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });

    return records.map(mapZoneRecordToEntity);
  }
  //-aqui termina funcion findByRestaurantId-//

  //-aqui empieza funcion findById y es para buscar una zona por su identificador-//
  /**
   * Busca una zona por su identificador único.
   * @sideEffect
   */
  async findById(id: string): Promise<RestaurantZone | null> {
    const record = await this.prismaClient.restaurantZone.findUnique({
      where: { id },
    });

    if (record === null) {
      return null;
    }

    return mapZoneRecordToEntity(record);
  }
  //-aqui termina funcion findById-//

  //-aqui empieza funcion save y es para persistir una zona mediante upsert-//
  /**
   * Crea o actualiza una zona en la base de datos.
   * @sideEffect
   */
  async save(zone: RestaurantZone): Promise<RestaurantZone> {
    const primitives = zone.toPrimitives();

    const record = await this.prismaClient.restaurantZone.upsert({
      where: { id: primitives.id },
      create: primitives,
      update: {
        name: primitives.name,
        color: primitives.color,
        sortOrder: primitives.sortOrder,
        version: primitives.version,
        updatedAt: primitives.updatedAt,
      },
    });

    return mapZoneRecordToEntity(record);
  }
  //-aqui termina funcion save-//

  //-aqui empieza funcion delete y es para eliminar una zona por su ID-//
  /**
   * Elimina una zona. Las mesas relacionadas quedan con zoneId=null por la regla OnDelete: SetNull.
   * @sideEffect
   */
  async delete(id: string): Promise<void> {
    await this.prismaClient.restaurantZone.delete({
      where: { id },
    });
  }
  //-aqui termina funcion delete-//
}

//-aqui empieza funcion mapZoneRecordToEntity y es para rehidratar la entidad RestaurantZone-//
/**
 * Convierte un registro Prisma en una entidad de dominio RestaurantZone.
 * @pure
 */
function mapZoneRecordToEntity(record: PrismaZoneRecord): RestaurantZone {
  const primitives: RestaurantZonePrimitives = {
    id: record.id,
    restaurantId: record.restaurantId,
    name: record.name,
    color: record.color,
    sortOrder: record.sortOrder,
    version: record.version,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };

  return RestaurantZone.fromPrimitives(primitives);
}
//-aqui termina funcion mapZoneRecordToEntity-//
