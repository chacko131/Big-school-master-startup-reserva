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
        name: diningTablePrimitives.name,
        capacity: diningTablePrimitives.capacity,
        isActive: diningTablePrimitives.isActive,
        isCombinable: diningTablePrimitives.isCombinable,
        sortOrder: diningTablePrimitives.sortOrder,
        version: diningTablePrimitives.version,
        createdAt: diningTablePrimitives.createdAt,
        updatedAt: diningTablePrimitives.updatedAt,
      },
    });

    return mapDiningTableRecordToEntity(persistedDiningTable);
  }
  //-aqui termina funcion save y se va autilizar en application-//
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
