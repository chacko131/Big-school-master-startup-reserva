/**
 * Archivo: sync-user-from-clerk.use-case.ts
 * Responsabilidad: Crear o actualizar un User en la DB a partir de los datos que envía Clerk.
 * Tipo: lógica
 */

import { User } from "../../../domain/entities/user.entity";
import { type UserRepository } from "../../../domain/ports/user.repository.port";

export interface SyncUserFromClerkInput {
  clerkId: string;
  email: string;
  fullName: string | null;
}

export interface SyncUserFromClerkOutput {
  userId: string;
  isNew: boolean;
}

//-aqui empieza clase SyncUserFromClerk y es para sincronizar un usuario de Clerk con la DB-//
/**
 * Crea el User en la DB si no existe, o actualiza email y fullName si ya existe.
 * Se ejecuta desde el webhook de Clerk (user.created, user.updated).
 * @sideEffect
 */
export class SyncUserFromClerk {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: SyncUserFromClerkInput): Promise<SyncUserFromClerkOutput> {
    const existingUser = await this.userRepository.findByClerkId(input.clerkId);

    if (existingUser !== null) {
      const updated = existingUser.updateProfile({
        email: input.email,
        fullName: input.fullName,
      });
      await this.userRepository.save(updated);
      return { userId: updated.id, isNew: false };
    }

    const newUser = User.create({
      id: crypto.randomUUID(),
      clerkId: input.clerkId,
      email: input.email,
      fullName: input.fullName,
    });

    await this.userRepository.save(newUser);
    return { userId: newUser.id, isNew: true };
  }
}
//-aqui termina clase SyncUserFromClerk-//
