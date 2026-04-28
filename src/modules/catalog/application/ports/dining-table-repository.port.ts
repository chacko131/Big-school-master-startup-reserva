/**
 * Archivo: dining-table-repository.port.ts
 * Responsabilidad: Definir el puerto de persistencia para mesas.
 * Tipo: lógica
 */

import { DiningTable } from "../../domain/entities/dining-table.entity";

export interface DiningTableRepository {
  findByRestaurantId(restaurantId: string): Promise<DiningTable[]>;
  findById(id: string): Promise<DiningTable | null>;
  deleteMissingByRestaurantId(restaurantId: string, idsToKeep: string[]): Promise<void>;
  save(diningTable: DiningTable): Promise<DiningTable>;
}
