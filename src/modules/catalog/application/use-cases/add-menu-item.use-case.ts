/**
 * Archivo: add-menu-item.use-case.ts
 * Responsabilidad: Orquestar el alta de un plato de carta validando acceso por feature gate.
 * Tipo: lógica
 */

import { MenuItem } from "../../domain/entities/menu-item.entity";
import { RestaurantNotFoundError } from "../errors/restaurant-not-found.error";
import { MenuFeatureNotAllowedError } from "../errors/menu-feature-not-allowed.error";
import { type AddMenuItemDto } from "../dtos/add-menu-item.dto";
import { type MenuRepository } from "../ports/menu-repository.port";
import { type RestaurantRepository } from "../ports/restaurant-repository.port";
import { type FeatureGatePort } from "../ports/feature-gate.port";

export class AddMenuItem {
  constructor(
    private readonly restaurantRepository: RestaurantRepository,
    private readonly menuRepository: MenuRepository,
    private readonly featureGate: FeatureGatePort,
  ) {}

  //-aqui empieza funcion execute y es para crear y guardar un plato de carta-//
  /**
   * Crea un plato de menú para una categoría existente si el restaurante tiene acceso.
   * @sideEffect — persiste en base de datos.
   */
  async execute(input: AddMenuItemDto): Promise<MenuItem> {
    const restaurant = await this.restaurantRepository.findById(input.restaurantId);

    if (restaurant === null) {
      throw new RestaurantNotFoundError(input.restaurantId);
    }

    const allowed = await this.featureGate.isFeatureAllowed(input.restaurantId, "menu_management");

    if (!allowed) {
      throw new MenuFeatureNotAllowedError(input.restaurantId);
    }

    const category = await this.menuRepository.findCategoryById(input.categoryId);

    if (category === null) {
      throw new Error(`MenuCategory ${input.categoryId} not found.`);
    }

    const item = MenuItem.create({
      id: input.id,
      categoryId: input.categoryId,
      name: input.name,
      description: input.description,
      price: input.price,
      imageUrl: input.imageUrl,
      imagePublicId: input.imagePublicId,
      allergens: input.allergens,
      sortOrder: input.sortOrder,
    });

    return this.menuRepository.saveItem(item);
  }
  //-aqui termina funcion execute y se va autilizar en controllers del dashboard-//
}
