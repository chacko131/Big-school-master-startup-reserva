/**
 * Archivo: create-restaurant.use-case.ts
 * Responsabilidad: Orquestar la creación de un restaurante usando el dominio y el puerto de persistencia.
 * Tipo: lógica
 */

import { Restaurant } from "../../domain/entities/restaurant.entity";
import { CreateRestaurantDto } from "../dtos/create-restaurant.dto";
import { RestaurantRepository } from "../ports/restaurant-repository.port";

export class CreateRestaurant {
  constructor(private readonly restaurantRepository: RestaurantRepository) {}

  //-aqui empieza funcion execute y es para crear y guardar un restaurante-//
  /**
   * Ejecuta el caso de uso de creación de restaurante.
   * @pure
   */
  async execute(input: CreateRestaurantDto): Promise<Restaurant> {
    const restaurant = Restaurant.create({
      id: input.id,
      name: input.name,
      slug: input.slug,
      timezone: input.timezone,
      phone: input.phone ?? null,
      email: input.email ?? null,
      isActive: input.isActive,
    });

    return this.restaurantRepository.save(restaurant);
  }
  //-aqui termina funcion execute y se va autilizar en application y controllers-//
}
