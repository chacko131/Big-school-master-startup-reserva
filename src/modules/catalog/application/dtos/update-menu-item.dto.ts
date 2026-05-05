/**
 * Archivo: update-menu-item.dto.ts
 * Responsabilidad: Definir el contrato de entrada para el caso de uso UpdateMenuItem.
 * Tipo: lógica
 */

export interface UpdateMenuItemDto {
  itemId: string;
  restaurantId: string;
  name?: string;
  description?: string | null;
  price?: number | null;
  imageUrl?: string | null;
  imagePublicId?: string | null;
  allergens?: string[];
  isAvailable?: boolean;
  sortOrder?: number;
}
