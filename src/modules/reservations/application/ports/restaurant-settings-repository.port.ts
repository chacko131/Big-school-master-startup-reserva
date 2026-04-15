/**
 * Archivo: restaurant-settings-repository.port.ts
 * Responsabilidad: Definir el puerto de consulta de configuración operativa del restaurante.
 * Tipo: lógica
 */

import { RestaurantSettings } from "@/modules/catalog/domain/entities/restaurant-settings.entity";

export interface RestaurantSettingsRepository {
  findByRestaurantId(restaurantId: string): Promise<RestaurantSettings | null>;
}
