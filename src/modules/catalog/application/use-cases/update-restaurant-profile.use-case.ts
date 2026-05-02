/**
 * Archivo: update-restaurant-profile.use-case.ts
 * Responsabilidad: Orquestar la actualización del perfil público del restaurante
 *                  (descripción, dirección, fotos, carta, precio). Desacoplado de Cloudinary:
 *                  recibe las URLs ya subidas y solo persiste los cambios en el dominio.
 * Tipo: lógica
 */

import { type Restaurant } from "../../domain/entities/restaurant.entity";
import { RestaurantNotFoundError } from "../errors/restaurant-not-found.error";
import { type UpdateRestaurantProfileDto } from "../dtos/update-restaurant-profile.dto";
import { type RestaurantRepository } from "../ports/restaurant-repository.port";

export class UpdateRestaurantProfile {
  constructor(private readonly restaurantRepository: RestaurantRepository) {}

  //-aqui empieza funcion execute y es para actualizar el perfil publico del restaurante-//
  /**
   * Carga el restaurante por ID, aplica los cambios del catálogo sobre la entidad
   * y lo persiste. Si el restaurante no existe lanza RestaurantNotFoundError.
   *
   * Importante: las URLs de Cloudinary deben resolverse ANTES de llamar a este
   * caso de uso. Aquí solo se guarda lo que llega.
   *
   * @sideEffect
   */
  async execute(input: UpdateRestaurantProfileDto): Promise<Restaurant> {
    const restaurant = await this.restaurantRepository.findById(input.restaurantId);

    if (restaurant === null) {
      throw new RestaurantNotFoundError(input.restaurantId);
    }

    // Construimos el patch solo con las claves que el llamador envió explícitamente.
    // Así evitamos sobreescribir con undefined campos que no se quisieron tocar.
    const patch: Parameters<typeof restaurant.updateCatalogProfile>[0] = {};

    if ("description" in input) patch.description = input.description;
    if ("address" in input) patch.address = input.address;
    if ("city" in input) patch.city = input.city;
    if ("countryCode" in input) patch.countryCode = input.countryCode;
    if ("cuisine" in input) patch.cuisine = input.cuisine;
    if ("priceRange" in input) patch.priceRange = input.priceRange;
    if ("heroImage" in input) patch.heroImage = input.heroImage;
    if ("galleryImages" in input) patch.galleryImages = input.galleryImages;

    const updatedRestaurant = restaurant.updateCatalogProfile(patch);

    return this.restaurantRepository.save(updatedRestaurant);
  }
  //-aqui termina funcion execute y se va autilizar en server actions del frontend-//
}
