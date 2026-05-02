/**
 * Archivo: menu-repository.port.ts
 * Responsabilidad: Definir el puerto de persistencia para categorías y platos de la carta.
 * Tipo: lógica
 */

import { MenuCategory } from "../../domain/entities/menu-category.entity";
import { MenuItem } from "../../domain/entities/menu-item.entity";

export interface MenuRepository {
  findCategoriesByRestaurantId(restaurantId: string): Promise<MenuCategory[]>;
  findItemsByCategoryId(categoryId: string): Promise<MenuItem[]>;
  saveCategory(category: MenuCategory): Promise<MenuCategory>;
  saveItem(item: MenuItem): Promise<MenuItem>;
  deleteCategoryById(categoryId: string): Promise<void>;
  deleteItemById(itemId: string): Promise<void>;
}
