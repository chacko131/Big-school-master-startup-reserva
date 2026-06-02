/**
 * Archivo: actions.ts
 * Responsabilidad: Server actions para la vista de usuarios globales del panel admin.
 * Tipo: servidor
 */

"use server";

import { requireCurrentUser } from "@/modules/auth/get-current-user";
import { getUsersInfrastructure } from "@/modules/users/infrastructure/users-infrastructure";
import { getCatalogInfrastructure } from "@/modules/catalog/infrastructure/catalog-infrastructure";
import { GetUsersPlatformStats } from "@/modules/users/application/use-cases/GetUsersPlatformStats/get-users-platform-stats.use-case";
import { ListPlatformUsers } from "@/modules/users/application/use-cases/ListPlatformUsers/list-platform-users.use-case";
import { ListRestaurantsUseCase } from "@/modules/catalog/application/use-cases/list-restaurants.use-case";

//-aqui empieza tipo AdminUserRow-//
/** Fila enriquecida de usuario para la tabla del panel admin. */
export interface AdminUserRow {
  id: string;
  fullName: string | null;
  email: string;
  globalRole: string;
  /** Rol principal (primera membership activa). Null si no tiene memberships. */
  primaryRole: string | null;
  /** Nombre del restaurante de la primera membership activa. Null si no tiene. */
  primaryTenantName: string | null;
  /** Estado derivado de memberships: "Activo", "Pendiente" o "Sin acceso". */
  derivedStatus: string;
}
//-aqui termina tipo AdminUserRow-//

//-aqui empieza tipo AdminUsersPageData-//
/** Datos completos para renderizar la página de usuarios admin. */
export interface AdminUsersPageData {
  stats: {
    totalUsers: number;
    totalOwners: number;
    totalActiveStaff: number;
    totalPendingInvitations: number;
  };
  users: AdminUserRow[];
}
//-aqui termina tipo AdminUsersPageData-//

//-aqui empieza funcion getAdminUsersData y es para obtener stats y listado de usuarios para el admin-//
/**
 * Obtiene las métricas agregadas y el listado enriquecido de usuarios.
 * Orquesta módulos users + catalog sin acoplarlos entre sí.
 * @sideEffect — lectura de base de datos.
 */
export async function getAdminUsersData(): Promise<AdminUsersPageData> {
  const currentUser = await requireCurrentUser();

  if (!currentUser.isSuperAdmin()) {
    throw new Error("FORBIDDEN: se requiere rol SUPER_ADMIN para acceder a datos de usuarios globales.");
  }

  const usersInfra = getUsersInfrastructure();
  const catalogInfra = getCatalogInfrastructure();

  const getStats = new GetUsersPlatformStats(usersInfra.userRepository, usersInfra.membershipRepository);
  const listUsers = new ListPlatformUsers(usersInfra.userRepository, usersInfra.membershipRepository);
  const listRestaurants = new ListRestaurantsUseCase(catalogInfra.restaurantRepository);

  const [stats, platformUsers, restaurants] = await Promise.all([
    getStats.execute(),
    listUsers.execute(),
    listRestaurants.execute(),
  ]);

  //-aqui empieza mapa de restaurantId → nombre para enriquecer filas-//
  const restaurantNameMap = new Map<string, string>();
  for (const r of restaurants) {
    restaurantNameMap.set(r.id, r.name);
  }
  //-aqui termina mapa-//

  //-aqui empieza mapeo de usuarios a filas enriquecidas-//
  const users: AdminUserRow[] = platformUsers.map((u) => {
    const activeMembership = u.memberships.find((m) => m.status === "ACTIVE") ?? null;
    const pendingMembership = u.memberships.find((m) => m.status === "PENDING") ?? null;

    let derivedStatus = "Sin acceso";
    if (activeMembership) {
      derivedStatus = "Activo";
    } else if (pendingMembership) {
      derivedStatus = "Pendiente";
    }

    const primaryMembership = activeMembership ?? pendingMembership;

    return {
      id: u.id,
      fullName: u.fullName,
      email: u.email,
      globalRole: u.globalRole,
      primaryRole: primaryMembership?.role ?? null,
      primaryTenantName: primaryMembership
        ? (restaurantNameMap.get(primaryMembership.restaurantId) ?? null)
        : null,
      derivedStatus,
    };
  });
  //-aqui termina mapeo-//

  return { stats, users };
}
//-aqui termina funcion getAdminUsersData-//
