/**
 * Archivo: update-menu-category.dto.ts
 * Responsabilidad: Definir el contrato de entrada para el caso de uso UpdateMenuCategory.
 * Tipo: lógica
 */

export interface UpdateMenuCategoryDto {
  categoryId: string;
  restaurantId: string;
  name?: string;
  description?: string | null;
  sortOrder?: number;
  isActive?: boolean;
}
