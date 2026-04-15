/**
 * Archivo: dining-table-repository.port.ts
 * Responsabilidad: Definir el puerto de consulta de mesas para reservas.
 * Tipo: lógica
 */

import { DiningTable } from "@/modules/catalog/domain/entities/dining-table.entity";

export interface DiningTableRepository {
  findActiveByRestaurantId(restaurantId: string): Promise<DiningTable[]>;
}
