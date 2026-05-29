/**
 * Archivo: guest-crm.dto.ts
 * Responsabilidad: Definir los DTOs e interfaces de datos de Clientes para el CRM en el backend.
 * Tipo: lógica
 */

export interface GuestHistoricalNote {
  startAt: Date;
  specialRequests: string;
}

export interface GuestCrmPrimitives {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  notes: string | null;
  noShowCount: number;
  totalReservationsCount: number;
  noShowsCalculated: number;
  lastVisitAt: Date | null;
  loyaltySegment: "VIP" | "Frecuente" | "Ocasional" | "Nuevo" | "Atención";
  historicalNotes: GuestHistoricalNote[];
  createdAt: Date;
}

export interface GetGuestsWithCrmMetricsInput {
  restaurantId: string;
  query?: string;
}

export interface GetGuestsWithCrmMetricsOutput {
  guests: GuestCrmPrimitives[];
}
