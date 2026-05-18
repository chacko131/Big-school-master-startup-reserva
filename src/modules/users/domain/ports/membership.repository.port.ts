/**
 * Archivo: membership.repository.port.ts
 * Responsabilidad: Definir el contrato para la persistencia de UserRestaurantMembership.
 * Tipo: lógica
 */

import { UserRestaurantMembership } from "../entities/user-restaurant-membership.entity";

//-aqui empieza interfaz MembershipRepository y es para abstraer la persistencia de memberships-//
/**
 * Puerto de repositorio para la entidad UserRestaurantMembership.
 * Permite consultar y persistir los vínculos usuario-restaurante.
 */
export interface MembershipRepository {
  /**
   * Busca la membership activa de un usuario en un restaurante concreto.
   * Devuelve null si no existe o si está revocada/pendiente.
   * @sideEffect
   */
  findActiveByUserAndRestaurant(
    userId: string,
    restaurantId: string
  ): Promise<UserRestaurantMembership | null>;

  /**
   * Devuelve todas las memberships activas de un usuario.
   * Un usuario puede ser owner/staff de varios restaurantes.
   * @sideEffect
   */
  findActiveByUserId(userId: string): Promise<UserRestaurantMembership[]>;

  /**
   * Devuelve todas las memberships (cualquier estado) de un restaurante.
   * Útil para que el owner gestione su equipo.
   * @sideEffect
   */
  findByRestaurantId(restaurantId: string): Promise<UserRestaurantMembership[]>;

  /**
   * Persiste una membership (insert si es nueva, update si ya existe).
   * @sideEffect
   */
  save(membership: UserRestaurantMembership): Promise<void>;
}
//-aqui termina interfaz MembershipRepository-//
