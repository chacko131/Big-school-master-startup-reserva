/**
 * Archivo: update-menu-item.use-case.ts
 * Responsabilidad: Orquestar la actualización de un plato de carta existente.
 * Tipo: lógica
 */

import { MenuItem } from "../../domain/entities/menu-item.entity";
import { RestaurantNotFoundError } from "../errors/restaurant-not-found.error";
import { MenuFeatureNotAllowedError } from "../errors/menu-feature-not-allowed.error";
import { type UpdateMenuItemDto } from "../dtos/update-menu-item.dto";
import { type MenuRepository } from "../ports/menu-repository.port";
import { type RestaurantRepository } from "../ports/restaurant-repository.port";
import { type FeatureGatePort } from "../ports/feature-gate.port";

export class UpdateMenuItem {
  constructor(
    private readonly restaurantRepository: RestaurantRepository,
    private readonly menuRepository: MenuRepository,
    private readonly featureGate: FeatureGatePort,
  ) {}

  //-aqui empieza funcion execute y es para actualizar un plato de carta existente-//
  /**
   * Actualiza los campos proporcionados de un plato existente.
   * @sideEffect — persiste en base de datos.
   */
  async execute(input: UpdateMenuItemDto): Promise<MenuItem> {
    const restaurant = await this.restaurantRepository.findById(input.restaurantId);

    if (restaurant === null) {
      throw new RestaurantNotFoundError(input.restaurantId);
    }

    const allowed = await this.featureGate.isFeatureAllowed(input.restaurantId, "menu_management");

    if (!allowed) {
      throw new MenuFeatureNotAllowedError(input.restaurantId);
    }

    const existing = await this.menuRepository.findItemById(input.itemId);

    if (existing === null) {
      throw new Error(`MenuItem ${input.itemId} not found.`);
    }

    const current = existing.toPrimitives();

    const updated = MenuItem.create({
      id: current.id,
      categoryId: current.categoryId,
      name: input.name ?? current.name,
      description: input.description !== undefined ? input.description : current.description,
      price: input.price !== undefined ? input.price : current.price,
      imageUrl: input.imageUrl !== undefined ? input.imageUrl : current.imageUrl,
      imagePublicId: input.imagePublicId !== undefined ? input.imagePublicId : current.imagePublicId,
      allergens: input.allergens ?? current.allergens,
      isAvailable: input.isAvailable ?? current.isAvailable,
      sortOrder: input.sortOrder ?? current.sortOrder,
      createdAt: current.createdAt,
    });

    return this.menuRepository.saveItem(updated);
  }
  //-aqui termina funcion execute y se va autilizar en controllers del dashboard-//
}
