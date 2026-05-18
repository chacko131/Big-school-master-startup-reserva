/**
 * Archivo: team-invitation-token.repository.port.ts
 * Responsabilidad: Definir el contrato para la persistencia de TeamInvitationToken.
 * Tipo: lógica
 */

import { TeamInvitationToken } from "../entities/team-invitation-token.entity";

//-aqui empieza interfaz TeamInvitationTokenRepository y es para abstraer la persistencia de tokens de invitacion-//
/**
 * Puerto de repositorio para TeamInvitationToken.
 */
export interface TeamInvitationTokenRepository {
  /**
   * Busca un token por su valor UUID.
   * @sideEffect
   */
  findByToken(token: string): Promise<TeamInvitationToken | null>;

  /**
   * Devuelve las invitaciones pendientes activas de un restaurante.
   * Solo incluye tokens no usados y no expirados.
   * @sideEffect
   */
  findPendingByRestaurantId(restaurantId: string): Promise<TeamInvitationToken[]>;

  /**
   * Persiste un token de invitación.
   * @sideEffect
   */
  save(token: TeamInvitationToken): Promise<void>;

  /**
   * Invalida todos los tokens pendientes para un email+restaurante concreto.
   * Se usa antes de emitir uno nuevo para evitar tokens duplicados activos.
   * @sideEffect
   */
  invalidatePendingForEmailAndRestaurant(email: string, restaurantId: string): Promise<void>;
}
//-aqui termina interfaz TeamInvitationTokenRepository-//
