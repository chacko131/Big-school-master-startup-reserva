/**
 * Archivo: zone-repository.port.ts
 * Responsabilidad: Definir el puerto de persistencia para zonas de restaurante.
 * Tipo: lógica
 */

import { RestaurantZone } from "../../domain/entities/restaurant-zone.entity";

export interface ZoneRepository {
  findByRestaurantId(restaurantId: string): Promise<RestaurantZone[]>;
  findById(id: string): Promise<RestaurantZone | null>;
  save(zone: RestaurantZone): Promise<RestaurantZone>;
  delete(id: string): Promise<void>;
}
