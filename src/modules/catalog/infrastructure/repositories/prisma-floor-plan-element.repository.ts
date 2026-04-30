import { FloorPlanElement } from "../../domain/entities/floor-plan-element.entity";
import { FloorPlanElementRepository } from "../../application/ports/floor-plan-element-repository.port";
import { PrismaClient } from "@prisma/client/extension";

/**
 * Archivo: prisma-floor-plan-element.repository.ts
 * Responsabilidad: Implementar la persistencia de FloorPlanElement usando Prisma.
 * Tipo: servicio
 */

export class PrismaFloorPlanElementRepository implements FloorPlanElementRepository {
  constructor(private readonly prismaClient: PrismaClient) {}

  //-aqui empieza funcion findByRestaurantId y es para buscar decoraciones de un restaurante-//
  /**
   * Obtiene todos los elementos decorativos de un restaurante.
   * @pure
   */
  async findByRestaurantId(restaurantId: string): Promise<FloorPlanElement[]> {
    const records = await this.prismaClient.floorPlanElement.findMany({
      where: { restaurantId },
    });

    return records.map(
      (record: {
        id: any;
        restaurantId: any;
        zoneId: any;
        type: any;
        x: any;
        y: any;
        width: any;
        height: any;
        rotation: any;
      }) =>
        FloorPlanElement.create({
          id: record.id,
          restaurantId: record.restaurantId,
          zoneId: record.zoneId,
          type: record.type,
          x: record.x,
          y: record.y,
          width: record.width,
          height: record.height,
          rotation: record.rotation,
        }),
    );
  }
  //-aqui termina funcion findByRestaurantId-//

  //-aqui empieza funcion save y es para guardar un elemento decorativo-//
  /**
   * Guarda o actualiza un elemento en la base de datos.
   * @sideEffect
   */
  async save(element: FloorPlanElement): Promise<FloorPlanElement> {
    const primitives = element.toPrimitives();

    const record = await this.prismaClient.floorPlanElement.upsert({
      where: { id: primitives.id },
      create: {
        id: primitives.id,
        restaurantId: primitives.restaurantId,
        zoneId: primitives.zoneId,
        type: primitives.type,
        x: primitives.x,
        y: primitives.y,
        width: primitives.width,
        height: primitives.height,
        rotation: primitives.rotation,
      },
      update: {
        zoneId: primitives.zoneId,
        type: primitives.type,
        x: primitives.x,
        y: primitives.y,
        width: primitives.width,
        height: primitives.height,
        rotation: primitives.rotation,
      },
    });

    return FloorPlanElement.create({
      id: record.id,
      restaurantId: record.restaurantId,
      zoneId: record.zoneId,
      type: record.type,
      x: record.x,
      y: record.y,
      width: record.width,
      height: record.height,
      rotation: record.rotation,
    });
  }
  //-aqui termina funcion save-//

  //-aqui empieza funcion deleteMissingByRestaurantId y es para borrar elementos que ya no existen-//
  /**
   * Elimina todos los elementos de un restaurante que no estén en el listado activo.
   * Útil para cuando se hace un guardado general del canvas.
   * @sideEffect
   */
  async deleteMissingByRestaurantId(
    restaurantId: string,
    activeElementIds: string[],
  ): Promise<void> {
    await this.prismaClient.floorPlanElement.deleteMany({
      where: {
        restaurantId,
        id: {
          notIn: activeElementIds,
        },
      },
    });
  }
  //-aqui termina funcion deleteMissingByRestaurantId-//
}
