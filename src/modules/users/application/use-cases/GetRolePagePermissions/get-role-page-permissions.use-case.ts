/**
 * Archivo: get-role-page-permissions.use-case.ts
 * Responsabilidad: Obtener los permisos de página por rol de un restaurante,
 *   completando con valores por defecto para las secciones sin registro.
 * Tipo: lógica
 */

import {
  type RolePagePermissionRepository,
  type RolePagePermissionPrimitives,
} from "../../../domain/ports/role-page-permission.repository.port";
import { type MembershipRole } from "../../../domain/entities/user-restaurant-membership.entity";
import { type DashboardSectionKey } from "@/constants/dashboard";

export interface PermissionRow {
  role: MembershipRole;
  pageKey: DashboardSectionKey;
  canView: boolean;
  canEdit: boolean;
}

/** Roles que el owner puede configurar (excluye RESTAURANT_OWNER, que siempre tiene acceso total). */
export const CONFIGURABLE_ROLES: ReadonlyArray<MembershipRole> = [
  "MANAGER",
  "STAFF_WAITER",
  "STAFF_KITCHEN",
  "STAFF_BAR",
] as const;

interface GetRolePagePermissionsInput {
  restaurantId: string;
  pageKeys: ReadonlyArray<DashboardSectionKey>;
}

//-aqui empieza clase GetRolePagePermissions y es para obtener la matriz de permisos por rol y pagina-//
/**
 * Devuelve la matriz completa de permisos: roles × páginas.
 * Las combinaciones sin registro en BD se rellenan con canView=false, canEdit=false.
 * @pure (sólo lectura)
 */
export class GetRolePagePermissions {
  constructor(private readonly repository: RolePagePermissionRepository) {}

  async execute({ restaurantId, pageKeys }: GetRolePagePermissionsInput): Promise<PermissionRow[]> {
    const stored: RolePagePermissionPrimitives[] = await this.repository.findByRestaurant(restaurantId);

    const index = new Map<string, RolePagePermissionPrimitives>();
    for (const p of stored) {
      index.set(`${p.role}::${p.pageKey}`, p);
    }

    const rows: PermissionRow[] = [];
    for (const role of CONFIGURABLE_ROLES) {
      for (const pageKey of pageKeys) {
        const key = `${role}::${pageKey}`;
        const stored = index.get(key);
        rows.push({
          role,
          pageKey,
          canView: stored?.canView ?? false,
          canEdit: stored?.canEdit ?? false,
        });
      }
    }

    return rows;
  }
}
//-aqui termina clase GetRolePagePermissions-//
