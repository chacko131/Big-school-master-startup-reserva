/**
 * Archivo: prisma-role-page-permission.repository.ts
 * Responsabilidad: Implementar RolePagePermissionRepository usando Prisma.
 * Tipo: servicio
 */

import { PrismaClient } from "@/generated/prisma/client";
import {
  type RolePagePermissionRepository,
  type RolePagePermissionPrimitives,
} from "../../domain/ports/role-page-permission.repository.port";
import { type MembershipRole } from "../../domain/entities/user-restaurant-membership.entity";

export class PrismaRolePagePermissionRepository implements RolePagePermissionRepository {
  constructor(private readonly prismaClient: PrismaClient) {}

  //-aqui empieza funcion findByRestaurant y es para obtener todos los permisos de un restaurante-//
  /**
   * Devuelve todos los permisos persistidos para un restaurante.
   * @sideEffect
   */
  async findByRestaurant(restaurantId: string): Promise<RolePagePermissionPrimitives[]> {
    const records = await this.prismaClient.rolePagePermission.findMany({
      where: { restaurantId },
      orderBy: [{ role: "asc" }, { pageKey: "asc" }],
    });

    return records.map((r) => ({
      id: r.id,
      restaurantId: r.restaurantId,
      role: r.role as MembershipRole,
      pageKey: r.pageKey,
      canView: r.canView,
      canEdit: r.canEdit,
      updatedAt: r.updatedAt,
    }));
  }
  //-aqui termina funcion findByRestaurant-//

  //-aqui empieza funcion upsert y es para crear o actualizar un permiso de página por rol-//
  /**
   * Crea o actualiza el permiso de una sección para un rol dentro de un restaurante.
   * @sideEffect
   */
  async upsert(data: Omit<RolePagePermissionPrimitives, "id" | "updatedAt">): Promise<void> {
    await this.prismaClient.rolePagePermission.upsert({
      where: {
        restaurantId_role_pageKey: {
          restaurantId: data.restaurantId,
          role: data.role,
          pageKey: data.pageKey,
        },
      },
      create: {
        restaurantId: data.restaurantId,
        role: data.role,
        pageKey: data.pageKey,
        canView: data.canView,
        canEdit: data.canEdit,
      },
      update: {
        canView: data.canView,
        canEdit: data.canEdit,
      },
    });
  }
  //-aqui termina funcion upsert-//
}
