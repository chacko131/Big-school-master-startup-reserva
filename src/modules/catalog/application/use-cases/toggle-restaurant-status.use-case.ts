/**
 * Archivo: toggle-restaurant-status.use-case.ts
 * Responsabilidad: Cambiar el estado de activación de un restaurante.
 * Tipo: lógica
 */

import { RestaurantNotFoundError } from "../errors/restaurant-not-found.error";
import { type RestaurantRepository } from "../ports/restaurant-repository.port";

//-aqui empieza funcion ToggleRestaurantStatus y es para alternar el estado isActive del restaurante-//
/**
 * Caso de uso para activar o desactivar un restaurante tenant.
 *
 * @sideEffect (interactúa con el repositorio)
 */
export class ToggleRestaurantStatus {
  constructor(private readonly restaurantRepository: RestaurantRepository) {}

  async execute(restaurantId: string): Promise<void> {
    const restaurant = await this.restaurantRepository.findById(restaurantId);

    if (restaurant === null) {
      throw new RestaurantNotFoundError(restaurantId);
    }

    const updatedRestaurant = restaurant.isActive 
      ? restaurant.deactivate() 
      : restaurant.activate();

    await this.restaurantRepository.save(updatedRestaurant);
  }
}
//-aqui termina funcion ToggleRestaurantStatus-//
