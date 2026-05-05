/**
 * Archivo: delete-menu-category.use-case.ts
 * Responsabilidad: Orquestar la eliminación de una categoría de carta (y sus platos en cascada por Prisma).
 * Tipo: lógica
 */

import { RestaurantNotFoundError } from "../errors/restaurant-not-found.error";
import { MenuFeatureNotAllowedError } from "../errors/menu-feature-not-allowed.error";
import { type MenuRepository } from "../ports/menu-repository.port";
import { type RestaurantRepository } from "../ports/restaurant-repository.port";
import { type FeatureGatePort } from "../ports/feature-gate.port";

interface DeleteMenuCategoryInput {
  categoryId: string;
  restaurantId: string;
}

export class DeleteMenuCategory {
  constructor(
    private readonly restaurantRepository: RestaurantRepository,
    private readonly menuRepository: MenuRepository,
    private readonly featureGate: FeatureGatePort,
  ) {}

  //-aqui empieza funcion execute y es para eliminar una categoría de carta-//
  /**
   * Elimina una categoría y sus platos asociados (cascada definida en schema).
   * @sideEffect — elimina de base de datos.
   */
  async execute(input: DeleteMenuCategoryInput): Promise<void> {
    const restaurant = await this.restaurantRepository.findById(input.restaurantId);

    if (restaurant === null) {
      throw new RestaurantNotFoundError(input.restaurantId);
    }

    const allowed = await this.featureGate.isFeatureAllowed(input.restaurantId, "menu_management");

    if (!allowed) {
      throw new MenuFeatureNotAllowedError(input.restaurantId);
    }

    const existing = await this.menuRepository.findCategoryById(input.categoryId);

    if (existing === null) {
      throw new Error(`MenuCategory ${input.categoryId} not found.`);
    }

    return this.menuRepository.deleteCategoryById(input.categoryId);
  }
  //-aqui termina funcion execute y se va autilizar en controllers del dashboard-//
}
