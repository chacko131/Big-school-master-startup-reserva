/**
 * Archivo: restaurant-settings-repository.port.ts
 * Responsabilidad: Definir el puerto de persistencia para configuraciones operativas.
 * Tipo: lógica
 */

import { RestaurantSettings } from "../../domain/entities/restaurant-settings.entity";

export interface RestaurantSettingsRepository {
  findByRestaurantId(restaurantId: string): Promise<RestaurantSettings | null>;
  save(restaurantSettings: RestaurantSettings): Promise<RestaurantSettings>;
}
