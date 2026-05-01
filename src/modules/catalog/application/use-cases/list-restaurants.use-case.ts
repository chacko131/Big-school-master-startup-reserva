/**
 * Archivo: list-restaurants.use-case.ts
 * Responsabilidad: Definir el caso de uso para listar todos los restaurantes.
 * Tipo: lógica
 */

import { RestaurantRepository } from "../ports/restaurant-repository.port";

export interface ListRestaurantsResponse {
  id: string;
  name: string;
  slug: string;
  timezone: string;
  phone: string | null;
  email: string | null;
  isActive: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
}

//-aqui empieza funcion ListRestaurantsUseCase y es para listar los restaurantes en el admin-//
/**
 * Caso de uso para obtener todos los restaurantes de la plataforma.
 *
 * @pure (en cuanto a la lógica de la función, aunque interactúa con el repositorio)
 */
export class ListRestaurantsUseCase {
  constructor(private readonly restaurantRepository: RestaurantRepository) {}

  async execute(): Promise<ListRestaurantsResponse[]> {
    const restaurants = await this.restaurantRepository.findAll();

    return restaurants.map((restaurant) => {
      const primitives = restaurant.toPrimitives();
      return {
        id: primitives.id,
        name: primitives.name,
        slug: primitives.slug,
        timezone: primitives.timezone,
        phone: primitives.phone,
        email: primitives.email,
        isActive: primitives.isActive,
        version: primitives.version,
        createdAt: primitives.createdAt.toISOString(),
        updatedAt: primitives.updatedAt.toISOString(),
      };
    });
  }
}
//-aqui termina funcion ListRestaurantsUseCase-//
