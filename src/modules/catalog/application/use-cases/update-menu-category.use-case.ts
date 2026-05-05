/**
 * Archivo: update-menu-category.use-case.ts
 * Responsabilidad: Orquestar la actualización de una categoría de carta existente.
 * Tipo: lógica
 */

import { MenuCategory } from "../../domain/entities/menu-category.entity";
import { RestaurantNotFoundError } from "../errors/restaurant-not-found.error";
import { MenuFeatureNotAllowedError } from "../errors/menu-feature-not-allowed.error";
import { type UpdateMenuCategoryDto } from "../dtos/update-menu-category.dto";
import { type MenuRepository } from "../ports/menu-repository.port";
import { type RestaurantRepository } from "../ports/restaurant-repository.port";
import { type FeatureGatePort } from "../ports/feature-gate.port";

export class UpdateMenuCategory {
  constructor(
    private readonly restaurantRepository: RestaurantRepository,
    private readonly menuRepository: MenuRepository,
    private readonly featureGate: FeatureGatePort,
  ) {}

  //-aqui empieza funcion execute y es para actualizar una categoría de carta existente-//
  /**
   * Actualiza los campos proporcionados de una categoría existente.
   * @sideEffect — persiste en base de datos.
   */
  async execute(input: UpdateMenuCategoryDto): Promise<MenuCategory> {
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

    const current = existing.toPrimitives();

    const updated = MenuCategory.create({
      id: current.id,
      restaurantId: current.restaurantId,
      name: input.name ?? current.name,
      description: input.description !== undefined ? input.description : current.description,
      sortOrder: input.sortOrder ?? current.sortOrder,
      isActive: input.isActive ?? current.isActive,
      createdAt: current.createdAt,
    });

    return this.menuRepository.saveCategory(updated);
  }
  //-aqui termina funcion execute y se va autilizar en controllers del dashboard-//
}
