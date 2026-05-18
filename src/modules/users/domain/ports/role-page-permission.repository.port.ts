/**
 * Archivo: role-page-permission.repository.port.ts
 * Responsabilidad: Puerto de dominio para leer y escribir permisos de página por rol.
 * Tipo: lógica
 */

import { type MembershipRole } from "../entities/user-restaurant-membership.entity";

export interface RolePagePermissionPrimitives {
  id: string;
  restaurantId: string;
  role: MembershipRole;
  pageKey: string;
  canView: boolean;
  canEdit: boolean;
  updatedAt: Date;
}

export interface RolePagePermissionRepository {
  //-aqui empieza findByRestaurant y es para obtener todos los permisos de un restaurante-//
  /** Devuelve todos los permisos persistidos para un restaurante. */
  findByRestaurant(restaurantId: string): Promise<RolePagePermissionPrimitives[]>;
  //-aqui termina findByRestaurant-//

  //-aqui empieza upsert y es para crear o actualizar un permiso concreto-//
  /** Crea o actualiza el permiso de una sección para un rol. @sideEffect */
  upsert(data: Omit<RolePagePermissionPrimitives, "id" | "updatedAt">): Promise<void>;
  //-aqui termina upsert-//
}
