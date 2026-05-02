/**
 * Archivo: update-restaurant-profile.dto.ts
 * Responsabilidad: Definir el contrato de entrada para el caso de uso UpdateRestaurantProfile.
 *                  Todos los campos son opcionales para permitir actualizaciones parciales (PATCH).
 * Tipo: lógica
 */

import { type PriceRange, type RestaurantImage } from "../../domain/entities/restaurant.entity";

export interface UpdateRestaurantProfileDto {
  /** ID del restaurante que se va a actualizar. Obligatorio. */
  restaurantId: string;
  description?: string | null;
  address?: string | null;
  city?: string | null;
  countryCode?: string | null;
  cuisine?: string | null;
  priceRange?: PriceRange | null;
  /**
   * Objeto con la URL y publicId devuelto por Cloudinary tras subir la foto hero.
   * Si se pasa null, se elimina la imagen hero del perfil.
   */
  heroImage?: RestaurantImage | null;
  /**
   * Lista completa de objetos devueltos por Cloudinary para la galería.
   * Sustituye la lista anterior — el caso de uso no hace merge, el llamador
   * es responsable de pasar la lista definitiva (por ej. tras borrar una foto).
   */
  galleryImages?: RestaurantImage[];
}
