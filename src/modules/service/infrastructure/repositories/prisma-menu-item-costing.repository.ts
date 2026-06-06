/**
 * Archivo: prisma-menu-item-costing.repository.ts
 * Responsabilidad: Adaptador Prisma del puerto MenuItemCostingRepository.
 * Tipo: servicio / infraestructura
 */

import { Prisma, type PrismaClient } from "@/generated/prisma/client";
import type {
  MenuItemCostingRepository,
  MenuItemCostingWithMenuItemName,
} from "../../domain/ports/menu-item-costing.repository.port";
import type {
  MenuItemCostingPrimitives,
  UpsertMenuItemCostingProps,
} from "../../domain/types/service.types";

//-aqui empieza clase PrismaMenuItemCostingRepository y es para persistir costeos con Prisma-//
export class PrismaMenuItemCostingRepository
  implements MenuItemCostingRepository
{
  constructor(private readonly prisma: PrismaClient) {}

  //-aqui empieza funcion upsert y es para crear o actualizar el costing de un plato-//
  /**
   * @sideEffect crea o actualiza en la BD
   */
  async upsert(
    props: UpsertMenuItemCostingProps
  ): Promise<MenuItemCostingPrimitives> {
    const record = await this.prisma.menuItemCosting.upsert({
      where: { menuItemId: props.menuItemId },
      create: {
        menuItemId: props.menuItemId,
        costUnitPrice: props.costUnitPrice,
        area: props.area,
        gramsMeta: props.gramsMeta
          ? (props.gramsMeta as Prisma.InputJsonValue)
          : Prisma.JsonNull,
        isActive: props.isActive ?? true,
      },
      update: {
        costUnitPrice: props.costUnitPrice,
        area: props.area,
        gramsMeta: props.gramsMeta
          ? (props.gramsMeta as Prisma.InputJsonValue)
          : Prisma.JsonNull,
        isActive: props.isActive ?? true,
        version: { increment: 1 },
      },
    });

    return this.toPrimitives(record);
  }
  //-aqui termina funcion upsert-//

  //-aqui empieza funcion findByMenuItemId y es para buscar el costing de un plato-//
  /** @pure */
  async findByMenuItemId(
    menuItemId: string
  ): Promise<MenuItemCostingPrimitives | null> {
    const record = await this.prisma.menuItemCosting.findUnique({
      where: { menuItemId },
    });
    return record ? this.toPrimitives(record) : null;
  }
  //-aqui termina funcion findByMenuItemId-//

  //-aqui empieza funcion findAllByRestaurantId y es para el panel de backoffice del dueño-//
  /** @pure */
  async findAllByRestaurantId(
    restaurantId: string
  ): Promise<MenuItemCostingWithMenuItemName[]> {
    const categories = await this.prisma.menuCategory.findMany({
      where: { restaurantId, isActive: true },
      include: {
        items: {
          include: { costing: true },
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: { sortOrder: "asc" },
    });

    const result: MenuItemCostingWithMenuItemName[] = [];

    for (const cat of categories) {
      for (const item of cat.items) {
        const costing = item.costing;
        const costUnitPrice = costing ? Number(costing.costUnitPrice) : 0;
        const publicUnitPrice = item.price ? Number(item.price) : 0;

        result.push({
          id: costing?.id ?? "",
          menuItemId: item.id,
          menuItemName: item.name,
          categoryName: cat.name,
          costUnitPrice,
          publicUnitPrice,
          area: (costing?.area ?? "NONE") as MenuItemCostingPrimitives["area"],
          gramsMeta: costing?.gramsMeta
            ? (costing.gramsMeta as Record<string, unknown>)
            : null,
          isActive: costing?.isActive ?? false,
          margin: publicUnitPrice - costUnitPrice,
          version: costing?.version ?? 0,
          createdAt: costing?.createdAt ?? new Date(),
          updatedAt: costing?.updatedAt ?? new Date(),
        });
      }
    }

    return result;
  }
  //-aqui termina funcion findAllByRestaurantId-//

  //-aqui empieza funcion findAllActiveForService y es para la carta del panel de servicio, incluye todos los platos disponibles-//
  /**
   * Devuelve TODOS los ítems disponibles del restaurante con su categoryName,
   * sin filtrar por isActive en la categoría ni requerir costing configurado.
   * Usado en el panel de servicio (tomar pedidos).
   * @pure
   */
  async findAllActiveForService(
    restaurantId: string
  ): Promise<MenuItemCostingWithMenuItemName[]> {
    const categories = await this.prisma.menuCategory.findMany({
      where: { restaurantId },
      include: {
        items: {
          include: { costing: true },
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: { sortOrder: "asc" },
    });

    const result: MenuItemCostingWithMenuItemName[] = [];

    for (const cat of categories) {
      for (const item of cat.items) {
        const costing = item.costing;
        const costUnitPrice = costing ? Number(costing.costUnitPrice) : 0;
        const publicUnitPrice = item.price ? Number(item.price) : 0;

        result.push({
          id: costing?.id ?? "",
          menuItemId: item.id,
          menuItemName: item.name,
          categoryName: cat.name,
          costUnitPrice,
          publicUnitPrice,
          area: (costing?.area ?? "NONE") as MenuItemCostingPrimitives["area"],
          gramsMeta: costing?.gramsMeta
            ? (costing.gramsMeta as Record<string, unknown>)
            : null,
          isActive: costing?.isActive ?? true,
          margin: publicUnitPrice - costUnitPrice,
          version: costing?.version ?? 0,
          createdAt: costing?.createdAt ?? new Date(),
          updatedAt: costing?.updatedAt ?? new Date(),
        });
      }
    }

    return result;
  }
  //-aqui termina funcion findAllActiveForService-//

  //-aqui empieza funcion findIncompleteByRestaurantId y es para detectar ítems sin costeo completo-//
  /**
   * Devuelve los menuItemIds activos que NO tienen costeo configurado.
   * @pure
   */
  async findIncompleteByRestaurantId(restaurantId: string): Promise<string[]> {
    const categories = await this.prisma.menuCategory.findMany({
      where: { restaurantId, isActive: true },
      include: {
        items: {
          where: { isAvailable: true },
          include: { costing: true },
        },
      },
    });

    const incomplete: string[] = [];

    for (const cat of categories) {
      for (const item of cat.items) {
        const c = item.costing;
        const isComplete =
          c &&
          c.isActive &&
          Number(c.costUnitPrice) >= 0 &&
          item.price !== null &&
          c.area !== "NONE";

        if (!isComplete) {
          incomplete.push(item.id);
        }
      }
    }

    return incomplete;
  }
  //-aqui termina funcion findIncompleteByRestaurantId-//

  //-aqui empieza funcion toPrimitives y es para convertir el registro de Prisma a primitivos-//
  /** @pure */
  private toPrimitives(
    record: Awaited<
      ReturnType<PrismaClient["menuItemCosting"]["findUniqueOrThrow"]>
    >
  ): MenuItemCostingPrimitives {
    return {
      id: record.id,
      menuItemId: record.menuItemId,
      costUnitPrice: Number(record.costUnitPrice),
      area: record.area as MenuItemCostingPrimitives["area"],
      gramsMeta: record.gramsMeta
        ? (record.gramsMeta as Record<string, unknown>)
        : null,
      isActive: record.isActive,
      version: record.version,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }
  //-aqui termina funcion toPrimitives-//
}
//-aqui termina clase PrismaMenuItemCostingRepository-//
