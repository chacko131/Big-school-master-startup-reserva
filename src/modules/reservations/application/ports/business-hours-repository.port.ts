/**
 * Archivo: business-hours-repository.port.ts
 * Responsabilidad: Definir el puerto de consulta de horarios de apertura para reservas.
 * Tipo: lógica
 */

export interface BusinessHoursSlot {
  day: string;
  opensAt: string;
  closesAt: string;
  isClosed: boolean;
}

export interface BusinessHoursRepository {
  findByRestaurantId(restaurantId: string): Promise<BusinessHoursSlot[]>;
}
