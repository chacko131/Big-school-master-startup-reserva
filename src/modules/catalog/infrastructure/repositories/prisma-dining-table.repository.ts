/**
 * Archivo: prisma-dining-table.repository.ts
 * Responsabilidad: Implementar el puerto DiningTableRepository usando Prisma.
 * Tipo: servicio
 */

import { type DiningTable as PrismaDiningTableRecord, PrismaClient } from "@/generated/prisma/client";
import { DiningTable, type DiningTablePrimitives } from "../../domain/entities/dining-table.entity";
import { type DiningTableRepository } from "../../application/ports/dining-table-repository.port";

export class PrismaDiningTableRepository implements DiningTableRepository {
  constructor(private readonly prismaClient: PrismaClient) {}

  //-aqui empieza funcion findByRestaurantId y es para listar las mesas persistidas de un restaurante-//
  /**
   * Lista las mesas activas e históricas de un restaurante ordenadas por su orden visual.
   * @sideEffect
   */
  async findByRestaurantId(restaurantId: string): Promise<DiningTable[]> {
    const diningTableRecords = await this.prismaClient.diningTable.findMany({
      where: { restaurantId },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });

    return diningTableRecords.map(mapDiningTableRecordToEntity);
  }
  //-aqui termina funcion findByRestaurantId y se va autilizar en onboarding y dashboard-//

  //-aqui empieza funcion findById y es para buscar una mesa persistida por id-//
  /**
   * Busca una mesa persistida por su identificador.
   * @sideEffect
   */
  async findById(id: string): Promise<DiningTable | null> {
    const diningTableRecord = await this.prismaClient.diningTable.findUnique({
      where: { id },
    });

    if (diningTableRecord === null) {
      return null;
    }

    return mapDiningTableRecordToEntity(diningTableRecord);
  }
  //-aqui termina funcion findById y se va autilizar en casos de uso de catalogo-//

  //-aqui empieza funcion deleteMissingByRestaurantId y es para sincronizar eliminaciones del onboarding de mesas-//
  /**
   * Elimina las mesas de un restaurante que ya no aparecen en el conjunto actual del formulario.
   * @sideEffect
   */
  async deleteMissingByRestaurantId(restaurantId: string, idsToKeep: string[]): Promise<void> {
    await this.prismaClient.diningTable.deleteMany({
      where: {
        restaurantId,
        ...(idsToKeep.length > 0 ? { id: { notIn: idsToKeep } } : {}),
      },
    });
  }
  //-aqui termina funcion deleteMissingByRestaurantId y se va autilizar en el onboarding-//

  //-aqui empieza funcion save y es para persistir una mesa usando Prisma-//
  /**
   * Guarda una mesa en la base de datos mediante upsert.
   * @sideEffect
   */
  async save(diningTable: DiningTable): Promise<DiningTable> {
    const diningTablePrimitives = diningTable.toPrimitives();

    const persistedDiningTable = await this.prismaClient.diningTable.upsert({
      where: { id: diningTablePrimitives.id },
      create: diningTablePrimitives,
      update: {
        restaurantId: diningTablePrimitives.restaurantId,
        zoneId: diningTablePrimitives.zoneId,
        name: diningTablePrimitives.name,
        capacity: diningTablePrimitives.capacity,
        isActive: diningTablePrimitives.isActive,
        isCombinable: diningTablePrimitives.isCombinable,
        sortOrder: diningTablePrimitives.sortOrder,
        shape: diningTablePrimitives.shape,
        x: diningTablePrimitives.x,
        y: diningTablePrimitives.y,
        width: diningTablePrimitives.width,
        height: diningTablePrimitives.height,
        version: diningTablePrimitives.version,
        createdAt: diningTablePrimitives.createdAt,
        updatedAt: diningTablePrimitives.updatedAt,
      },
    });

    return mapDiningTableRecordToEntity(persistedDiningTable);
  }
  //-aqui termina funcion save y se va autilizar en application-//

  //-aqui empieza funcion assignZoneToOrphanTables y es para migrar mesas sin zona a una zona destino-//
  /**
   * Actualiza en batch todas las mesas sin zona asignada de un restaurante.
   * @sideEffect
   */
  async assignZoneToOrphanTables(restaurantId: string, zoneId: string): Promise<void> {
    await this.prismaClient.diningTable.updateMany({
      where: {
        restaurantId,
        zoneId: null,
      },
      data: {
        zoneId,
        updatedAt: new Date(),
      },
    });
  }
  //-aqui termina funcion assignZoneToOrphanTables-//
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
    zoneId: diningTableRecord.zoneId,
    name: diningTableRecord.name,
    capacity: diningTableRecord.capacity,
    isActive: diningTableRecord.isActive,
    isCombinable: diningTableRecord.isCombinable,
    sortOrder: diningTableRecord.sortOrder,
    shape: diningTableRecord.shape,
    x: diningTableRecord.x,
    y: diningTableRecord.y,
    width: diningTableRecord.width,
    height: diningTableRecord.height,
    version: diningTableRecord.version,
    createdAt: diningTableRecord.createdAt,
    updatedAt: diningTableRecord.updatedAt,
  };

  return DiningTable.fromPrimitives(diningTablePrimitives);
}
//-aqui termina funcion mapDiningTableRecordToEntity y se va autilizar en infrastructure-//
