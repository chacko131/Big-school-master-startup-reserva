/**
 * Archivo: update-restaurant-settings.dto.ts
 * Responsabilidad: Definir el contrato de entrada para el caso de uso UpdateRestaurantSettings.
 * Tipo: lógica
 */

import {
  type ReservationApprovalMode,
  type WaitlistMode,
} from "../../domain/entities/restaurant-settings.entity";

export interface UpdateRestaurantSettingsDto {
  restaurantId: string;
  reservationApprovalMode?: ReservationApprovalMode;
  waitlistMode?: WaitlistMode;
  defaultReservationDurationMinutes?: number;
  reservationBufferMinutes?: number;
  cancellationWindowHours?: number;
  allowTableCombination?: boolean;
  enableAutoTableAssignment?: boolean;
}
