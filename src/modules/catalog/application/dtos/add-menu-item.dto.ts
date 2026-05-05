/**
 * Archivo: add-menu-item.dto.ts
 * Responsabilidad: Definir el contrato de entrada para el caso de uso AddMenuItem.
 * Tipo: lógica
 */

export interface AddMenuItemDto {
  id: string;
  categoryId: string;
  restaurantId: string;
  name: string;
  description?: string | null;
  price?: number | null;
  imageUrl?: string | null;
  imagePublicId?: string | null;
  allergens?: string[];
  sortOrder?: number;
}
