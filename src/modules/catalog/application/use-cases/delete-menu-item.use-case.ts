/**
 * Archivo: delete-menu-item.use-case.ts
 * Responsabilidad: Orquestar la eliminación de un plato de carta.
 * Tipo: lógica
 */

import { RestaurantNotFoundError } from "../errors/restaurant-not-found.error";
import { MenuFeatureNotAllowedError } from "../errors/menu-feature-not-allowed.error";
import { type MenuRepository } from "../ports/menu-repository.port";
import { type RestaurantRepository } from "../ports/restaurant-repository.port";
import { type FeatureGatePort } from "../ports/feature-gate.port";

interface DeleteMenuItemInput {
  itemId: string;
  restaurantId: string;
}

export class DeleteMenuItem {
  constructor(
    private readonly restaurantRepository: RestaurantRepository,
    private readonly menuRepository: MenuRepository,
    private readonly featureGate: FeatureGatePort,
  ) {}

  //-aqui empieza funcion execute y es para eliminar un plato de carta-//
  /**
   * Elimina un plato del menú si el restaurante tiene acceso.
   * @sideEffect — elimina de base de datos.
   */
  async execute(input: DeleteMenuItemInput): Promise<void> {
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

    return this.menuRepository.deleteItemById(input.itemId);
  }
  //-aqui termina funcion execute y se va autilizar en controllers del dashboard-//
}
