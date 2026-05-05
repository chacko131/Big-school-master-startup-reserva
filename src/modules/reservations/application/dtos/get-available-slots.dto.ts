/**
 * Archivo: get-available-slots.dto.ts
 * Responsabilidad: Definir el contrato de entrada/salida para el caso de uso GetAvailableSlots.
 * Tipo: lógica
 */

export interface GetAvailableSlotsInput {
  restaurantId: string;
  date: Date;
  partySize: number;
}

export interface AvailableSlot {
  startAt: Date;
  endAt: Date;
  availableTables: number;
}

export interface GetAvailableSlotsOutput {
  date: Date;
  slots: AvailableSlot[];
}
