/**
 * Archivo: restaurant-repository.port.ts
 * Responsabilidad: Definir el puerto de persistencia para restaurantes.
 * Tipo: lógica
 */

import { Restaurant } from "../../domain/entities/restaurant.entity";

export interface RestaurantRepository {
  findById(id: string): Promise<Restaurant | null>;
  save(restaurant: Restaurant): Promise<Restaurant>;
}
