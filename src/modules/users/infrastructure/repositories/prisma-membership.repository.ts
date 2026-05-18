/**
 * Archivo: prisma-membership.repository.ts
 * Responsabilidad: Implementar el puerto MembershipRepository usando Prisma y Neon.
 * Tipo: servicio
 */

import {
  type UserRestaurantMembership as PrismaMembershipRecord,
  PrismaClient,
} from "@/generated/prisma/client";
import {
  UserRestaurantMembership,
  type UserRestaurantMembershipPrimitives,
  type MembershipRole,
  type MembershipStatus,
} from "../../domain/entities/user-restaurant-membership.entity";
import { type MembershipRepository } from "../../domain/ports/membership.repository.port";

export class PrismaMembershipRepository implements MembershipRepository {
  constructor(private readonly prismaClient: PrismaClient) {}

  //-aqui empieza funcion findById y es para buscar una membership por su id interno-//
  /**
   * Busca una membership por su ID interno.
   * @sideEffect
   */
  async findById(id: string): Promise<UserRestaurantMembership | null> {
    const record = await this.prismaClient.userRestaurantMembership.findUnique({ where: { id } });
    if (record === null) return null;
    return mapRecordToEntity(record);
  }
  //-aqui termina funcion findById-//

  //-aqui empieza funcion findActiveByUserAndRestaurant y es para buscar la membership activa de un user en un restaurante-//
  /**
   * Busca la membership activa de un usuario en un restaurante concreto.
   * @sideEffect
   */
  async findActiveByUserAndRestaurant(
    userId: string,
    restaurantId: string
  ): Promise<UserRestaurantMembership | null> {
    const record = await this.prismaClient.userRestaurantMembership.findFirst({
      where: { userId, restaurantId, status: "ACTIVE" },
    });
    if (record === null) return null;
    return mapRecordToEntity(record);
  }
  //-aqui termina funcion findActiveByUserAndRestaurant-//

  //-aqui empieza funcion findActiveByUserId y es para obtener todas las memberships activas de un user-//
  /**
   * Devuelve todas las memberships activas de un usuario.
   * Permite saber a qué restaurantes tiene acceso.
   * @sideEffect
   */
  async findActiveByUserId(userId: string): Promise<UserRestaurantMembership[]> {
    const records = await this.prismaClient.userRestaurantMembership.findMany({
      where: { userId, status: "ACTIVE" },
      orderBy: { createdAt: "asc" },
    });
    return records.map(mapRecordToEntity);
  }
  //-aqui termina funcion findActiveByUserId-//

  //-aqui empieza funcion findByRestaurantId y es para obtener todos los miembros de un restaurante-//
  /**
   * Devuelve todas las memberships de un restaurante (cualquier estado).
   * Útil para que el owner gestione su equipo.
   * @sideEffect
   */
  async findByRestaurantId(restaurantId: string): Promise<UserRestaurantMembership[]> {
    const records = await this.prismaClient.userRestaurantMembership.findMany({
      where: { restaurantId },
      orderBy: { createdAt: "asc" },
    });
    return records.map(mapRecordToEntity);
  }
  //-aqui termina funcion findByRestaurantId-//

  //-aqui empieza funcion save y es para persistir una membership con upsert-//
  /**
   * Guarda una membership en la base de datos mediante upsert.
   * La unicidad está en [userId, restaurantId].
   * @sideEffect
   */
  async save(membership: UserRestaurantMembership): Promise<void> {
    const p = membership.toPrimitives();

    await this.prismaClient.userRestaurantMembership.upsert({
      where: { id: p.id },
      create: {
        id: p.id,
        userId: p.userId,
        restaurantId: p.restaurantId,
        role: p.role,
        status: p.status,
        invitedById: p.invitedById,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      },
      update: {
        role: p.role,
        status: p.status,
        invitedById: p.invitedById,
        updatedAt: p.updatedAt,
      },
    });

  }
  //-aqui termina funcion save-//

  //-aqui empieza funcion deleteById y es para borrar permanentemente una membership-//
  /**
   * Elimina permanentemente una membership por su ID.
   * @sideEffect
   */
  async deleteById(id: string): Promise<void> {
    await this.prismaClient.userRestaurantMembership.delete({
      where: { id },
    });

  }
  //-aqui termina funcion deleteById-//
}

//-aqui empieza funcion mapRecordToEntity y es para convertir un registro Prisma en entidad Membership-//
/**
 * Convierte un registro Prisma en una entidad de dominio UserRestaurantMembership.
 * @pure
 */
function mapRecordToEntity(record: PrismaMembershipRecord): UserRestaurantMembership {
  const primitives: UserRestaurantMembershipPrimitives = {
    id: record.id,
    userId: record.userId,
    restaurantId: record.restaurantId,
    role: record.role as MembershipRole,
    status: record.status as MembershipStatus,
    invitedById: record.invitedById,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
  return UserRestaurantMembership.fromPrimitives(primitives);
}
//-aqui termina funcion mapRecordToEntity-//
