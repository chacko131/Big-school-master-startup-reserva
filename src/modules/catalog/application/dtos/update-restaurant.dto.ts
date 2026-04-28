/**
 * Archivo: update-restaurant.dto.ts
 * Responsabilidad: Definir el contrato de entrada para el caso de uso UpdateRestaurant.
 * Tipo: lógica
 */

export interface UpdateRestaurantDto {
  id: string;
  name: string;
  slug: string;
  timezone: string;
  phone?: string | null;
  email?: string | null;
  isActive?: boolean;
}
