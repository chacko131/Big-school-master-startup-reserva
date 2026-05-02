/**
 * Archivo: create-restaurant.dto.ts
 * Responsabilidad: Definir el contrato de entrada para el caso de uso CreateRestaurant.
 * Tipo: lógica
 */

import { RestaurantImage } from "../../domain/entities/restaurant.entity";

export interface CreateRestaurantDto {
  id: string;
  name: string;
  slug: string;
  timezone?: string;
  phone?: string | null;
  email?: string | null;
  isActive?: boolean;
  heroImage?: RestaurantImage | null;
}
