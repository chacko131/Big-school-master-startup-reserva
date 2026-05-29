/**
 * Archivo: menu-actions.ts
 * Responsabilidad: Server actions para CRUD de la carta del restaurante (categorías y platos).
 * Tipo: servicio
 */

"use server";

import { getRestaurantIdFromSession } from "@/modules/auth/get-restaurant-id";
import { revalidatePath } from "next/cache";
import { getCatalogInfrastructure } from "@/modules/catalog/infrastructure/catalog-infrastructure";
import { assertCanWrite } from "@/modules/billing/infrastructure/write-access-guard";
import { AddMenuCategory } from "@/modules/catalog/application/use-cases/add-menu-category.use-case";
import { UpdateMenuCategory } from "@/modules/catalog/application/use-cases/update-menu-category.use-case";
import { DeleteMenuCategory } from "@/modules/catalog/application/use-cases/delete-menu-category.use-case";
import { AddMenuItem } from "@/modules/catalog/application/use-cases/add-menu-item.use-case";
import { UpdateMenuItem } from "@/modules/catalog/application/use-cases/update-menu-item.use-case";
import { DeleteMenuItem } from "@/modules/catalog/application/use-cases/delete-menu-item.use-case";
import { type MenuCategoryPrimitives } from "@/modules/catalog/domain/entities/menu-category.entity";
import { type MenuItemPrimitives } from "@/modules/catalog/domain/entities/menu-item.entity";
import { cloudinaryService } from "@/services/cloudinary.service";

// ─── Helpers ──────────────────────────────────────────────────────────────────

//-aqui empieza funcion generateId y es para crear IDs únicos simples para entidades nuevas-//
/** @pure */
function generateId(): string {
  return crypto.randomUUID();
}
//-aqui termina funcion generateId-//

// ─── Tipos de respuesta ───────────────────────────────────────────────────────

export interface MenuActionResult<T = undefined> {
  success: boolean;
  error?: string;
  data?: T;
}

// ─── Categorías ───────────────────────────────────────────────────────────────

//-aqui empieza funcion fetchMenuCategoriesAction y es para obtener las categorías con sus platos-//
/**
 * Obtiene todas las categorías activas del restaurante con sus platos.
 * @sideEffect — lee de base de datos
 */
export async function fetchMenuCategoriesAction(): Promise<
  MenuActionResult<Array<MenuCategoryPrimitives & { items: MenuItemPrimitives[] }>>
> {
  try {
    const restaurantId = await getRestaurantIdFromSession();
    const infra = getCatalogInfrastructure();


    const categories = await infra.menuRepository.findCategoriesByRestaurantId(restaurantId);

    const categoriesWithItems = await Promise.all(
      categories.map(async (cat) => {
        const items = await infra.menuRepository.findItemsByCategoryId(cat.id);
        return {
          ...cat.toPrimitives(),
          items: items.map((item) => item.toPrimitives()),
        };
      }),
    );


    return { success: true, data: categoriesWithItems };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}
//-aqui termina funcion fetchMenuCategoriesAction-//

//-aqui empieza funcion addMenuCategoryAction y es para crear una nueva categoría de carta-//
/**
 * @sideEffect — persiste en base de datos
 */
export async function addMenuCategoryAction(
  name: string,
  description?: string,
): Promise<MenuActionResult<MenuCategoryPrimitives>> {
  try {
    const restaurantId = await assertCanWrite();
    const infra = getCatalogInfrastructure();


    const useCase = new AddMenuCategory(
      infra.restaurantRepository,
      infra.menuRepository,
      infra.featureGate,
    );

    const category = await useCase.execute({
      id: generateId(),
      restaurantId,
      name,
      description: description || null,
    });


    revalidatePath("/dashboard/settings");

    return { success: true, data: category.toPrimitives() };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}
//-aqui termina funcion addMenuCategoryAction-//

//-aqui empieza funcion updateMenuCategoryAction y es para actualizar una categoría existente-//
/**
 * @sideEffect — persiste en base de datos
 */
export async function updateMenuCategoryAction(
  categoryId: string,
  fields: { name?: string; description?: string | null; sortOrder?: number; isActive?: boolean },
): Promise<MenuActionResult<MenuCategoryPrimitives>> {
  try {
    const restaurantId = await assertCanWrite();
    const infra = getCatalogInfrastructure();


    const useCase = new UpdateMenuCategory(
      infra.restaurantRepository,
      infra.menuRepository,
      infra.featureGate,
    );

    const updated = await useCase.execute({
      categoryId,
      restaurantId,
      ...fields,
    });


    revalidatePath("/dashboard/settings");

    return { success: true, data: updated.toPrimitives() };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}
//-aqui termina funcion updateMenuCategoryAction-//

//-aqui empieza funcion deleteMenuCategoryAction y es para eliminar una categoría y sus platos-//
/**
 * @sideEffect — elimina de base de datos (cascada sobre platos)
 */
export async function deleteMenuCategoryAction(categoryId: string): Promise<MenuActionResult> {
  try {
    const restaurantId = await assertCanWrite();
    const infra = getCatalogInfrastructure();


    // Eliminar de Cloudinary todas las imágenes de platos de esta categoría
    const items = await infra.menuRepository.findItemsByCategoryId(categoryId);

    for (const item of items) {
      if (item.imagePublicId) {
        await cloudinaryService.deleteImage(item.imagePublicId);
      }
    }


    const useCase = new DeleteMenuCategory(
      infra.restaurantRepository,
      infra.menuRepository,
      infra.featureGate,
    );

    await useCase.execute({ categoryId, restaurantId });


    revalidatePath("/dashboard/settings");

    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}
//-aqui termina funcion deleteMenuCategoryAction-//

// ─── Platos ───────────────────────────────────────────────────────────────────

//-aqui empieza funcion addMenuItemAction y es para crear un nuevo plato-//
/**
 * @sideEffect — persiste en base de datos
 */
export async function addMenuItemAction(
  categoryId: string,
  name: string,
  fields?: { description?: string; price?: number | null; imageUrl?: string; imagePublicId?: string; allergens?: string[] },
): Promise<MenuActionResult<MenuItemPrimitives>> {
  try {
    const restaurantId = await assertCanWrite();
    const infra = getCatalogInfrastructure();


    const useCase = new AddMenuItem(
      infra.restaurantRepository,
      infra.menuRepository,
      infra.featureGate,
    );

    const item = await useCase.execute({
      id: generateId(),
      restaurantId,
      categoryId,
      name,
      description: fields?.description || null,
      price: fields?.price ?? null,
      imageUrl: fields?.imageUrl || null,
      imagePublicId: fields?.imagePublicId || null,
      allergens: fields?.allergens,
    });


    revalidatePath("/dashboard/settings");

    return { success: true, data: item.toPrimitives() };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}
//-aqui termina funcion addMenuItemAction-//

//-aqui empieza funcion updateMenuItemAction y es para actualizar un plato existente-//
/**
 * @sideEffect — persiste en base de datos
 */
export async function updateMenuItemAction(
  itemId: string,
  fields: {
    name?: string;
    description?: string | null;
    price?: number | null;
    imageUrl?: string | null;
    imagePublicId?: string | null;
    allergens?: string[];
    isAvailable?: boolean;
    sortOrder?: number;
  },
): Promise<MenuActionResult<MenuItemPrimitives>> {
  try {
    const restaurantId = await assertCanWrite();
    const infra = getCatalogInfrastructure();


    // Si se está cambiando o quitando la imagen, eliminar la anterior de Cloudinary
    if (fields.imageUrl !== undefined) {
      const existing = await infra.menuRepository.findItemById(itemId);
      const oldPublicId = existing?.imagePublicId ?? null;

      if (oldPublicId && oldPublicId !== (fields.imagePublicId ?? null)) {
        await cloudinaryService.deleteImage(oldPublicId);
      }
    }

    const useCase = new UpdateMenuItem(
      infra.restaurantRepository,
      infra.menuRepository,
      infra.featureGate,
    );

    const updated = await useCase.execute({
      itemId,
      restaurantId,
      ...fields,
    });


    revalidatePath("/dashboard/settings");

    return { success: true, data: updated.toPrimitives() };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}
//-aqui termina funcion updateMenuItemAction-//

//-aqui empieza funcion deleteMenuItemAction y es para eliminar un plato-//
/**
 * @sideEffect — elimina de base de datos
 */
export async function deleteMenuItemAction(itemId: string): Promise<MenuActionResult> {
  try {
    const restaurantId = await assertCanWrite();
    const infra = getCatalogInfrastructure();


    // Eliminar imagen del plato de Cloudinary si existe
    const existing = await infra.menuRepository.findItemById(itemId);

    if (existing?.imagePublicId) {
      await cloudinaryService.deleteImage(existing.imagePublicId);
    }

    const useCase = new DeleteMenuItem(
      infra.restaurantRepository,
      infra.menuRepository,
      infra.featureGate,
    );

    await useCase.execute({ itemId, restaurantId });


    revalidatePath("/dashboard/settings");

    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}
//-aqui termina funcion deleteMenuItemAction-//
