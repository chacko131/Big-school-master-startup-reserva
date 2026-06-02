/**
 * Archivo: prisma-user.repository.ts
 * Responsabilidad: Implementar el puerto UserRepository usando Prisma y Neon.
 * Tipo: servicio
 */

import { type User as PrismaUserRecord, PrismaClient } from "@/generated/prisma/client";
import { User, type UserPrimitives, type GlobalRole } from "../../domain/entities/user.entity";
import { type UserRepository } from "../../domain/ports/user.repository.port";

export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prismaClient: PrismaClient) {}

  //-aqui empieza funcion findById y es para buscar un user por su id interno-//
  /**
   * Busca un usuario por su ID interno de la plataforma.
   * @sideEffect
   */
  async findById(id: string): Promise<User | null> {
    const record = await this.prismaClient.user.findUnique({ where: { id } });
    if (record === null) return null;
    return mapRecordToEntity(record);
  }
  //-aqui termina funcion findById-//

  //-aqui empieza funcion findByClerkId y es para buscar un user por su clerkId-//
  /**
   * Busca un usuario por su clerkId (sub del JWT de Clerk).
   * Es la búsqueda principal durante la autenticación.
   * @sideEffect
   */
  async findByClerkId(clerkId: string): Promise<User | null> {
    const record = await this.prismaClient.user.findUnique({ where: { clerkId } });
    if (record === null) return null;
    return mapRecordToEntity(record);
  }
  //-aqui termina funcion findByClerkId-//

  //-aqui empieza funcion findByEmail y es para buscar un user por email-//
  /**
   * Busca un usuario por su email.
   * @sideEffect
   */
  async findByEmail(email: string): Promise<User | null> {
    const record = await this.prismaClient.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (record === null) return null;
    return mapRecordToEntity(record);
  }
  //-aqui termina funcion findByEmail-//

  //-aqui empieza funcion findManyByIds y es para recuperar varios usuarios en una sola query-//
  /**
   * Devuelve todos los usuarios cuyos IDs están en el array.
   * Una sola query Prisma — evita N llamadas a findById.
   * @sideEffect
   */
  async findManyByIds(ids: string[]): Promise<User[]> {
    if (ids.length === 0) return [];
    const records = await this.prismaClient.user.findMany({
      where: { id: { in: ids } },
    });
    return records.map(mapRecordToEntity);
  }
  //-aqui termina funcion findManyByIds-//

  //-aqui empieza funcion findAll y es para obtener todos los usuarios de la plataforma-//
  /**
   * Devuelve todos los usuarios de la plataforma ordenados por fecha de creación descendente.
   * @sideEffect
   */
  async findAll(): Promise<User[]> {
    const records = await this.prismaClient.user.findMany({
      orderBy: { createdAt: "desc" },
    });
    return records.map(mapRecordToEntity);
  }
  //-aqui termina funcion findAll-//

  //-aqui empieza funcion save y es para persistir un user con upsert-//
  /**
   * Guarda un User en la base de datos mediante upsert.
   * Si el clerkId ya existe, actualiza. Si no, inserta.
   * @sideEffect
   */
  async save(user: User): Promise<void> {
    const p = user.toPrimitives();

    await this.prismaClient.user.upsert({
      where: { clerkId: p.clerkId },
      create: {
        id: p.id,
        clerkId: p.clerkId,
        email: p.email,
        fullName: p.fullName,
        globalRole: p.globalRole,
        novuSyncedAt: p.novuSyncedAt,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      },
      update: {
        email: p.email,
        fullName: p.fullName,
        globalRole: p.globalRole,
        novuSyncedAt: p.novuSyncedAt,
        updatedAt: p.updatedAt,
      },
    });
  }
  //-aqui termina funcion save-//
}

//-aqui empieza funcion mapRecordToEntity y es para convertir un registro Prisma en entidad User-//
/**
 * Convierte un registro Prisma en una entidad de dominio User.
 * @pure
 */
function mapRecordToEntity(record: PrismaUserRecord): User {
  const primitives: UserPrimitives = {
    id: record.id,
    clerkId: record.clerkId,
    email: record.email,
    fullName: record.fullName,
    globalRole: record.globalRole as GlobalRole,
    novuSyncedAt: record.novuSyncedAt,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
  return User.fromPrimitives(primitives);
}
//-aqui termina funcion mapRecordToEntity-//
