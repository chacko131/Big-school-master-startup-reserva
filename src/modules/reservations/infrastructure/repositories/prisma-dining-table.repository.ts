/**
 * Archivo: prisma-dining-table.repository.ts
 * Responsabilidad: Implementar el puerto de consulta de mesas activas para reservas usando Prisma.
 * Tipo: servicio
 */

import { type DiningTable as PrismaDiningTableRecord, type PrismaClient } from "@/generated/prisma/client";
import {
  DiningTable,
  type DiningTablePrimitives,
} from "@/modules/catalog/domain/entities/dining-table.entity";
import { type DiningTableRepository } from "../../application/ports/dining-table-repository.port";

export class PrismaDiningTableRepository implements DiningTableRepository {
  constructor(private readonly prismaClient: PrismaClient) {}

  //-aqui empieza funcion findActiveByRestaurantId y es para consultar las mesas activas de un restaurante-//
  /**
   * Devuelve las mesas activas de un restaurante ordenadas por sortOrder.
   * @sideEffect
   */
  async findActiveByRestaurantId(restaurantId: string): Promise<DiningTable[]> {
    const diningTableRecords = await this.prismaClient.diningTable.findMany({
      where: {
        restaurantId,
        isActive: true,
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });

    return diningTableRecords.map(mapDiningTableRecordToEntity);
  }
  //-aqui termina funcion findActiveByRestaurantId y se va autilizar en casos de uso de reservas-//
}

//-aqui empieza funcion mapDiningTableRecordToEntity y es para rehidratar la entidad DiningTable-//
/**
 * Convierte un registro Prisma en una entidad de dominio DiningTable.
 * @pure
 */
function mapDiningTableRecordToEntity(diningTableRecord: PrismaDiningTableRecord): DiningTable {
  const diningTablePrimitives: DiningTablePrimitives = {
    id: diningTableRecord.id,
    restaurantId: diningTableRecord.restaurantId,
    name: diningTableRecord.name,
    capacity: diningTableRecord.capacity,
    isActive: diningTableRecord.isActive,
    isCombinable: diningTableRecord.isCombinable,
    sortOrder: diningTableRecord.sortOrder,
    version: diningTableRecord.version,
    createdAt: diningTableRecord.createdAt,
    updatedAt: diningTableRecord.updatedAt,
  };

  return DiningTable.fromPrimitives(diningTablePrimitives);
}
//-aqui termina funcion mapDiningTableRecordToEntity y se va autilizar en infrastructure-//
