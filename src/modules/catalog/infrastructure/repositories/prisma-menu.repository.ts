/**
 * Archivo: prisma-menu.repository.ts
 * Responsabilidad: Implementar MenuRepository usando Prisma.
 * Tipo: servicio
 */

import {
  type MenuCategory as PrismaMenuCategoryRecord,
  type MenuItem as PrismaMenuItemRecord,
  PrismaClient,
} from "@/generated/prisma/client";
import { MenuCategory, type MenuCategoryPrimitives } from "../../domain/entities/menu-category.entity";
import { MenuItem, type MenuItemPrimitives } from "../../domain/entities/menu-item.entity";
import { type MenuRepository } from "../../application/ports/menu-repository.port";

export class PrismaMenuRepository implements MenuRepository {
  constructor(private readonly prismaClient: PrismaClient) {}

  //-aqui empieza funcion findCategoriesByRestaurantId y es para obtener categorías de la carta de un restaurante-//
  /**
   * @sideEffect
   */
  async findCategoriesByRestaurantId(restaurantId: string): Promise<MenuCategory[]> {
    const records = await this.prismaClient.menuCategory.findMany({
      where: { restaurantId, isActive: true },
      orderBy: { sortOrder: "asc" },
    });

    return records.map(mapCategoryRecordToEntity);
  }
  //-aqui termina funcion findCategoriesByRestaurantId-//

  //-aqui empieza funcion findItemsByCategoryId y es para obtener los platos de una categoría-//
  /**
   * @sideEffect
   */
  async findItemsByCategoryId(categoryId: string): Promise<MenuItem[]> {
    const records = await this.prismaClient.menuItem.findMany({
      where: { categoryId, isAvailable: true },
      orderBy: { sortOrder: "asc" },
    });

    return records.map(mapItemRecordToEntity);
  }
  //-aqui termina funcion findItemsByCategoryId-//

  //-aqui empieza funcion saveCategory y es para persistir una categoría de carta-//
  /**
   * @sideEffect
   */
  async saveCategory(category: MenuCategory): Promise<MenuCategory> {
    const p = category.toPrimitives();

    const record = await this.prismaClient.menuCategory.upsert({
      where: { id: p.id },
      create: {
        id: p.id,
        restaurantId: p.restaurantId,
        name: p.name,
        description: p.description,
        sortOrder: p.sortOrder,
        isActive: p.isActive,
      },
      update: {
        name: p.name,
        description: p.description,
        sortOrder: p.sortOrder,
        isActive: p.isActive,
      },
    });

    return mapCategoryRecordToEntity(record);
  }
  //-aqui termina funcion saveCategory-//

  //-aqui empieza funcion saveItem y es para persistir un plato de la carta-//
  /**
   * @sideEffect
   */
  async saveItem(item: MenuItem): Promise<MenuItem> {
    const p = item.toPrimitives();

    const record = await this.prismaClient.menuItem.upsert({
      where: { id: p.id },
      create: {
        id: p.id,
        categoryId: p.categoryId,
        name: p.name,
        description: p.description,
        price: p.price !== null ? p.price : null,
        imageUrl: p.imageUrl,
        allergens: p.allergens,
        isAvailable: p.isAvailable,
        sortOrder: p.sortOrder,
      },
      update: {
        name: p.name,
        description: p.description,
        price: p.price !== null ? p.price : null,
        imageUrl: p.imageUrl,
        allergens: p.allergens,
        isAvailable: p.isAvailable,
        sortOrder: p.sortOrder,
      },
    });

    return mapItemRecordToEntity(record);
  }
  //-aqui termina funcion saveItem-//

  //-aqui empieza funcion deleteCategoryById y es para eliminar una categoría-//
  /** @sideEffect */
  async deleteCategoryById(categoryId: string): Promise<void> {
    await this.prismaClient.menuCategory.delete({ where: { id: categoryId } });
  }
  //-aqui termina funcion deleteCategoryById-//

  //-aqui empieza funcion deleteItemById y es para eliminar un plato-//
  /** @sideEffect */
  async deleteItemById(itemId: string): Promise<void> {
    await this.prismaClient.menuItem.delete({ where: { id: itemId } });
  }
  //-aqui termina funcion deleteItemById-//
}

//-aqui empieza funcion mapCategoryRecordToEntity y es para rehidratar MenuCategory desde Prisma-//
/**
 * @pure
 */
function mapCategoryRecordToEntity(record: PrismaMenuCategoryRecord): MenuCategory {
  const primitives: MenuCategoryPrimitives = {
    id: record.id,
    restaurantId: record.restaurantId,
    name: record.name,
    description: record.description,
    sortOrder: record.sortOrder,
    isActive: record.isActive,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };

  return MenuCategory.fromPrimitives(primitives);
}
//-aqui termina funcion mapCategoryRecordToEntity-//

//-aqui empieza funcion mapItemRecordToEntity y es para rehidratar MenuItem desde Prisma-//
/**
 * @pure
 */
function mapItemRecordToEntity(record: PrismaMenuItemRecord): MenuItem {
  const primitives: MenuItemPrimitives = {
    id: record.id,
    categoryId: record.categoryId,
    name: record.name,
    description: record.description,
    price: record.price !== null ? Number(record.price) : null,
    imageUrl: record.imageUrl,
    allergens: record.allergens,
    isAvailable: record.isAvailable,
    sortOrder: record.sortOrder,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };

  return MenuItem.fromPrimitives(primitives);
}
//-aqui termina funcion mapItemRecordToEntity-//
