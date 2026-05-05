/**
 * Archivo: add-menu-category.dto.ts
 * Responsabilidad: Definir el contrato de entrada para el caso de uso AddMenuCategory.
 * Tipo: lógica
 */

export interface AddMenuCategoryDto {
  id: string;
  restaurantId: string;
  name: string;
  description?: string | null;
  sortOrder?: number;
}
