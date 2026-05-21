/**
 * Archivo: sync-user-from-clerk.use-case.ts
 * Responsabilidad: Crear o actualizar un User en la DB a partir de los datos que envía Clerk.
 * Tipo: lógica
 */

import { User } from "../../../domain/entities/user.entity";
import { type UserRepository } from "../../../domain/ports/user.repository.port";
import { type NotificationProvider } from "@/modules/notifications/domain/ports/notification-provider.port";

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
 * Si se inyecta notificationProvider, registra o actualiza el subscriber en Novu.
 * Se ejecuta desde el webhook de Clerk (user.created, user.updated).
 * @sideEffect
 */
export class SyncUserFromClerk {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly notificationProvider?: NotificationProvider
  ) {}

  async execute(input: SyncUserFromClerkInput): Promise<SyncUserFromClerkOutput> {
    const existingUser = await this.userRepository.findByClerkId(input.clerkId);

    let userId: string;
    let isNew: boolean;

    if (existingUser !== null) {
      const updated = existingUser.updateProfile({
        email: input.email,
        fullName: input.fullName,
      });
      await this.userRepository.save(updated);
      userId = updated.id;
      isNew = false;
    } else {
      const newUser = User.create({
        id: crypto.randomUUID(),
        clerkId: input.clerkId,
        email: input.email,
        fullName: input.fullName,
      });
      await this.userRepository.save(newUser);
      userId = newUser.id;
      isNew = true;
    }

    //-aqui empieza identificacion del subscriber en Novu solo si no se ha hecho antes-//
    if (this.notificationProvider !== undefined) {
      const userToCheck = await this.userRepository.findById(userId);
      if (userToCheck !== null && userToCheck.novuSyncedAt === null) {
        await this.notificationProvider.identifySubscriber({
          subscriberId: input.clerkId,
          email: input.email,
          fullName: input.fullName,
        });
        await this.userRepository.save(userToCheck.markNovuSynced());
      }
    }
    //-aqui termina identificacion del subscriber en Novu-//

    return { userId, isNew };
  }
}
//-aqui termina clase SyncUserFromClerk-//
