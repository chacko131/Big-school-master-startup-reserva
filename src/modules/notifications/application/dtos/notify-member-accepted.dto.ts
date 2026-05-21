/**
 * Archivo: notify-member-accepted.dto.ts
 * Responsabilidad: Definir el input del caso de uso NotifyMemberAccepted.
 * Tipo: lógica
 */

export interface NotifyMemberAcceptedInput {
  ownerSubscriberId: string;
  newMemberName: string;
  newMemberRole: string;
  restaurantName: string;
}
