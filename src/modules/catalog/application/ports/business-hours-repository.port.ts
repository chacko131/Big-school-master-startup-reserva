/**
 * Archivo: business-hours-repository.port.ts
 * Responsabilidad: Definir el puerto de persistencia para los horarios del restaurante.
 * Tipo: lógica
 */

import { BusinessHours } from "../../domain/entities/business-hours.entity";

export interface BusinessHoursRepository {
  findByRestaurantId(restaurantId: string): Promise<BusinessHours[]>;
  saveAll(hours: BusinessHours[]): Promise<void>;
  deleteByRestaurantId(restaurantId: string): Promise<void>;
}
