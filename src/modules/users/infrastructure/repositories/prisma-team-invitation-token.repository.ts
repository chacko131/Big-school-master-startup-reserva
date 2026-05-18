/**
 * Archivo: prisma-team-invitation-token.repository.ts
 * Responsabilidad: Implementar el puerto TeamInvitationTokenRepository usando Prisma.
 * Tipo: servicio
 */

import { PrismaClient } from "@/generated/prisma/client";
import {
  TeamInvitationToken,
  type TeamInvitationTokenPrimitives,
} from "../../domain/entities/team-invitation-token.entity";
import { type TeamInvitationTokenRepository } from "../../domain/ports/team-invitation-token.repository.port";
import { type MembershipRole } from "../../domain/entities/user-restaurant-membership.entity";

export class PrismaTeamInvitationTokenRepository implements TeamInvitationTokenRepository {
  constructor(private readonly prismaClient: PrismaClient) {}

  //-aqui empieza funcion findByToken y es para buscar un token de invitacion por su valor UUID-//
  /**
   * @sideEffect
   */
  async findByToken(token: string): Promise<TeamInvitationToken | null> {
    const record = await this.prismaClient.teamInvitationToken.findUnique({
      where: { token },
    });
    if (record === null) return null;
    return mapRecordToEntity(record);
  }
  //-aqui termina funcion findByToken-//

  //-aqui empieza funcion findPendingByRestaurantId y es para listar invitaciones pendientes de un restaurante-//
  /**
   * Devuelve los tokens activos y no expirados de un restaurante.
   * @sideEffect
   */
  async findPendingByRestaurantId(restaurantId: string): Promise<TeamInvitationToken[]> {
    const now = new Date();

    const records = await this.prismaClient.teamInvitationToken.findMany({
      where: {
        restaurantId,
        usedAt: null,
        expiresAt: { gt: now },
      },
      orderBy: { createdAt: "desc" },
    });

    return records.map(mapRecordToEntity);
  }
  //-aqui termina funcion findPendingByRestaurantId-//

  //-aqui empieza funcion save y es para persistir un token de invitacion-//
  /**
   * @sideEffect
   */
  async save(invitationToken: TeamInvitationToken): Promise<void> {
    const p = invitationToken.toPrimitives();

    await this.prismaClient.teamInvitationToken.upsert({
      where: { id: p.id },
      create: {
        id: p.id,
        token: p.token,
        email: p.email,
        restaurantId: p.restaurantId,
        role: p.role,
        invitedById: p.invitedById,
        expiresAt: p.expiresAt,
        usedAt: p.usedAt,
        createdAt: p.createdAt,
      },
      update: {
        usedAt: p.usedAt,
      },
    });
  }
  //-aqui termina funcion save-//

  //-aqui empieza funcion invalidatePendingForEmailAndRestaurant y es para marcar como usados todos los tokens activos de un email+restaurante-//
  /**
   * Marca como usados todos los tokens pendientes para ese email+restaurante.
   * Se llama antes de emitir uno nuevo para evitar tokens duplicados activos.
   * @sideEffect
   */
  async invalidatePendingForEmailAndRestaurant(email: string, restaurantId: string): Promise<void> {
    const normalizedEmail = email.trim().toLowerCase();
    await this.prismaClient.teamInvitationToken.updateMany({
      where: {
        email: normalizedEmail,
        restaurantId,
        usedAt: null,
      },
      data: {
        usedAt: new Date(),
      },
    });
  }
  //-aqui termina funcion invalidatePendingForEmailAndRestaurant-//
}

//-aqui empieza funcion mapRecordToEntity y es para convertir un registro Prisma en entidad TeamInvitationToken-//
/**
 * @pure
 */
function mapRecordToEntity(record: {
  id: string;
  token: string;
  email: string;
  restaurantId: string;
  role: string;
  invitedById: string;
  expiresAt: Date;
  usedAt: Date | null;
  createdAt: Date;
}): TeamInvitationToken {
  const primitives: TeamInvitationTokenPrimitives = {
    id: record.id,
    token: record.token,
    email: record.email,
    restaurantId: record.restaurantId,
    role: record.role as MembershipRole,
    invitedById: record.invitedById,
    expiresAt: record.expiresAt,
    usedAt: record.usedAt,
    createdAt: record.createdAt,
  };
  return TeamInvitationToken.fromPrimitives(primitives);
}
//-aqui termina funcion mapRecordToEntity-//
