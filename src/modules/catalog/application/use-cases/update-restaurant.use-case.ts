/**
 * Archivo: update-restaurant.use-case.ts
 * Responsabilidad: Orquestar la actualización de un restaurante usando el dominio y el puerto de persistencia.
 * Tipo: lógica
 */

import { Restaurant } from "../../domain/entities/restaurant.entity";
import { RestaurantNotFoundError } from "../errors/restaurant-not-found.error";
import { type UpdateRestaurantDto } from "../dtos/update-restaurant.dto";
import { type RestaurantRepository } from "../ports/restaurant-repository.port";

export class UpdateRestaurant {
  constructor(private readonly restaurantRepository: RestaurantRepository) {}

  //-aqui empieza funcion execute y es para actualizar y guardar un restaurante-//
  /**
   * Ejecuta el caso de uso de actualización de restaurante.
   * @sideEffect
   */
  async execute(input: UpdateRestaurantDto): Promise<Restaurant> {
    const restaurant = await this.restaurantRepository.findById(input.id);

    if (restaurant === null) {
      throw new RestaurantNotFoundError(input.id);
    }

    const restaurantPrimitives = restaurant.toPrimitives();
    const updatedRestaurant = Restaurant.create({
      ...restaurantPrimitives,
      name: input.name,
      slug: input.slug,
      timezone: input.timezone,
      phone: input.phone ?? null,
      email: input.email ?? null,
      isActive: input.isActive ?? restaurantPrimitives.isActive,
      version: restaurantPrimitives.version + 1,
      updatedAt: new Date(),
    });

    return this.restaurantRepository.save(updatedRestaurant);
  }
  //-aqui termina funcion execute y se va autilizar en application y controllers-//
}
