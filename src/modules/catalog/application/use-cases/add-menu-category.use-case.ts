/**
 * Archivo: add-menu-category.use-case.ts
 * Responsabilidad: Orquestar el alta de una categoría de carta validando acceso por feature gate.
 * Tipo: lógica
 */

import { MenuCategory } from "../../domain/entities/menu-category.entity";
import { RestaurantNotFoundError } from "../errors/restaurant-not-found.error";
import { MenuFeatureNotAllowedError } from "../errors/menu-feature-not-allowed.error";
import { type AddMenuCategoryDto } from "../dtos/add-menu-category.dto";
import { type MenuRepository } from "../ports/menu-repository.port";
import { type RestaurantRepository } from "../ports/restaurant-repository.port";
import { type FeatureGatePort } from "../ports/feature-gate.port";

export class AddMenuCategory {
  constructor(
    private readonly restaurantRepository: RestaurantRepository,
    private readonly menuRepository: MenuRepository,
    private readonly featureGate: FeatureGatePort,
  ) {}

  //-aqui empieza funcion execute y es para crear y guardar una categoría de carta-//
  /**
   * Crea una categoría de menú para un restaurante existente si tiene acceso a la feature.
   * @sideEffect — persiste en base de datos.
   */
  async execute(input: AddMenuCategoryDto): Promise<MenuCategory> {
    const restaurant = await this.restaurantRepository.findById(input.restaurantId);

    if (restaurant === null) {
      throw new RestaurantNotFoundError(input.restaurantId);
    }

    const allowed = await this.featureGate.isFeatureAllowed(input.restaurantId, "menu_management");

    if (!allowed) {
      throw new MenuFeatureNotAllowedError(input.restaurantId);
    }

    const category = MenuCategory.create({
      id: input.id,
      restaurantId: input.restaurantId,
      name: input.name,
      description: input.description,
      sortOrder: input.sortOrder,
    });

    return this.menuRepository.saveCategory(category);
  }
  //-aqui termina funcion execute y se va autilizar en controllers del dashboard-//
}
