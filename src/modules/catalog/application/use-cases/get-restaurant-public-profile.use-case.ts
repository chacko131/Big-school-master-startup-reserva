/**
 * Archivo: get-restaurant-public-profile.use-case.ts
 * Responsabilidad: Obtener el perfil público completo de un restaurante para mostrarlo a un cliente final.
 * Tipo: lógica
 */

import { RestaurantNotFoundError } from "../errors/restaurant-not-found.error";
import { type RestaurantRepository } from "../ports/restaurant-repository.port";
import { type BusinessHoursRepository } from "../ports/business-hours-repository.port";
import { type MenuRepository } from "../ports/menu-repository.port";
import { type PriceRange } from "../../domain/entities/restaurant.entity";
import { type DayOfWeek } from "../../domain/entities/business-hours.entity";

// --- DTOs de respuesta ---

export interface BusinessHoursResponse {
  day: DayOfWeek;
  opensAt: string;
  closesAt: string;
  isClosed: boolean;
}

export interface MenuItemResponse {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  imageUrl: string | null;
  allergens: string[];
}

export interface MenuCategoryResponse {
  id: string;
  name: string;
  description: string | null;
  items: MenuItemResponse[];
}

export interface RestaurantPublicProfileResponse {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  address: string | null;
  city: string | null;
  countryCode: string | null;
  cuisine: string | null;
  priceRange: PriceRange | null;
  phone: string | null;
  email: string | null;
  heroImageUrl: string | null;
  galleryImageUrls: string[];
  businessHours: BusinessHoursResponse[];
  menu: MenuCategoryResponse[];
}

//-aqui empieza funcion GetRestaurantPublicProfileUseCase y es para traer el perfil público completo del restaurante-//
/**
 * Recupera toda la información pública de un restaurante por su slug.
 * Agrega restaurante, horarios y carta en una sola respuesta.
 * @sideEffect
 */
export class GetRestaurantPublicProfileUseCase {
  constructor(
    private readonly restaurantRepository: RestaurantRepository,
    private readonly businessHoursRepository: BusinessHoursRepository,
    private readonly menuRepository: MenuRepository
  ) {}

  async execute(slug: string): Promise<RestaurantPublicProfileResponse> {
    // Buscar el restaurante por slug
    const restaurant = await this.restaurantRepository.findBySlug(slug);

    if (restaurant === null) {
      throw new RestaurantNotFoundError(slug);
    }

    // Cargar horarios y categorías de carta en paralelo
    const [businessHours, categories] = await Promise.all([
      this.businessHoursRepository.findByRestaurantId(restaurant.id),
      this.menuRepository.findCategoriesByRestaurantId(restaurant.id),
    ]);

    // Cargar los ítems de cada categoría en paralelo
    const categoriesWithItems = await Promise.all(
      categories.map(async (category) => {
        const items = await this.menuRepository.findItemsByCategoryId(category.id);

        return {
          id: category.id,
          name: category.name,
          description: category.description,
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            description: item.description,
            price: item.price,
            imageUrl: item.imageUrl,
            allergens: item.allergens,
          })),
        };
      })
    );

    return {
      id: restaurant.id,
      name: restaurant.name,
      slug: restaurant.slug,
      description: restaurant.description,
      address: restaurant.address,
      city: restaurant.city,
      countryCode: restaurant.countryCode,
      cuisine: restaurant.cuisine,
      priceRange: restaurant.priceRange,
      phone: restaurant.phone,
      email: restaurant.email,
      heroImageUrl: restaurant.heroImageUrl,
      galleryImageUrls: restaurant.galleryImageUrls,
      businessHours: businessHours.map((h) => ({
        day: h.day,
        opensAt: h.opensAt,
        closesAt: h.closesAt,
        isClosed: h.isClosed,
      })),
      menu: categoriesWithItems,
    };
  }
}
//-aqui termina funcion GetRestaurantPublicProfileUseCase-//
