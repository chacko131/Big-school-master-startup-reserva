/**
 * Archivo: add-dining-table.dto.ts
 * Responsabilidad: Definir el contrato de entrada para el caso de uso AddDiningTable.
 * Tipo: lógica
 */

export interface AddDiningTableDto {
  id: string;
  restaurantId: string;
  name: string;
  capacity?: number;
  isActive?: boolean;
  isCombinable?: boolean;
  sortOrder?: number;
}
