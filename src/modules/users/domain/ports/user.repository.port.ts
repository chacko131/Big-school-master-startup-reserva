/**
 * Archivo: user.repository.port.ts
 * Responsabilidad: Definir el contrato que cualquier implementación de UserRepository debe cumplir.
 * Tipo: lógica
 */

import { User } from "../entities/user.entity";

//-aqui empieza interfaz UserRepository y es para abstraer la persistencia de usuarios-//
/**
 * Puerto de repositorio para la entidad User.
 * La capa de dominio depende de esta interfaz, nunca de Prisma directamente.
 */
export interface UserRepository {
  /**
   * Busca un usuario por su ID interno de la plataforma.
   * Devuelve null si no existe.
   * @sideEffect
   */
  findById(id: string): Promise<User | null>;

  /**
   * Busca un usuario por su clerkId (el "sub" del JWT de Clerk).
   * Devuelve null si no existe.
   * @sideEffect
   */
  findByClerkId(clerkId: string): Promise<User | null>;

  /**
   * Busca un usuario por su email.
   * Devuelve null si no existe.
   * @sideEffect
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Busca varios usuarios por sus IDs internos en una sola consulta.
   * Los IDs no encontrados se omiten silenciosamente.
   * @sideEffect
   */
  findManyByIds(ids: string[]): Promise<User[]>;

  /**
   * Persiste un User (insert si es nuevo, update si ya existe).
   * @sideEffect
   */
  save(user: User): Promise<void>;
}
//-aqui termina interfaz UserRepository-//
