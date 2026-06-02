/**
 * Archivo: get-users-platform-stats.use-case.ts
 * Responsabilidad: Obtener métricas agregadas de usuarios para el panel de administración.
 * Tipo: lógica
 */

import { type UserRepository } from "../../../domain/ports/user.repository.port";
import { type MembershipRepository } from "../../../domain/ports/membership.repository.port";

//-aqui empieza tipo UsersPlatformStatsResponse-//
export interface UsersPlatformStatsResponse {
  /** Total de usuarios registrados en la plataforma. */
  totalUsers: number;
  /** Total de memberships activas con rol RESTAURANT_OWNER. */
  totalOwners: number;
  /** Total de memberships activas con rol distinto de RESTAURANT_OWNER (staff operativo). */
  totalActiveStaff: number;
  /** Total de memberships en estado PENDING (invitaciones sin aceptar). */
  totalPendingInvitations: number;
}
//-aqui termina tipo UsersPlatformStatsResponse-//

//-aqui empieza clase GetUsersPlatformStats y es para agregar métricas globales de usuarios-//
/**
 * Caso de uso para obtener estadísticas globales de usuarios.
 * Consume UserRepository para el conteo total y MembershipRepository para conteos por rol/status.
 *
 * @sideEffect — lectura de base de datos.
 */
export class GetUsersPlatformStats {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly membershipRepository: MembershipRepository
  ) {}

  async execute(): Promise<UsersPlatformStatsResponse> {
    const [
      allUsers,
      ownersCount,
      managersCount,
      waitersCount,
      kitchenCount,
      barCount,
      pendingCount,
    ] = await Promise.all([
      this.userRepository.findAll(),
      this.membershipRepository.countByRoleAndStatus("RESTAURANT_OWNER", "ACTIVE"),
      this.membershipRepository.countByRoleAndStatus("MANAGER", "ACTIVE"),
      this.membershipRepository.countByRoleAndStatus("STAFF_WAITER", "ACTIVE"),
      this.membershipRepository.countByRoleAndStatus("STAFF_KITCHEN", "ACTIVE"),
      this.membershipRepository.countByRoleAndStatus("STAFF_BAR", "ACTIVE"),
      this.membershipRepository.countByStatus("PENDING"),
    ]);

    const totalActiveStaff = managersCount + waitersCount + kitchenCount + barCount;

    return {
      totalUsers: allUsers.length,
      totalOwners: ownersCount,
      totalActiveStaff,
      totalPendingInvitations: pendingCount,
    };
  }
}
//-aqui termina clase GetUsersPlatformStats-//
