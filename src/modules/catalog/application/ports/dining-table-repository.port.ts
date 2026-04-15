/**
 * Archivo: dining-table-repository.port.ts
 * Responsabilidad: Definir el puerto de persistencia para mesas.
 * Tipo: lógica
 */

import { DiningTable } from "../../domain/entities/dining-table.entity";

export interface DiningTableRepository {
  findById(id: string): Promise<DiningTable | null>;
  save(diningTable: DiningTable): Promise<DiningTable>;
}
