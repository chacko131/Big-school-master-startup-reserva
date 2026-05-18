/**
 * Archivo: get-current-user.ts
 * Responsabilidad: Obtener el User de negocio autenticado a partir de la sesión activa de Clerk.
 * Aplica lazy sync: si el usuario no existe en DB todavía, lo crea en el momento.
 * Tipo: servicio
 */

import { auth, currentUser } from "@clerk/nextjs/server";
import { getUsersInfrastructure } from "@/modules/users/infrastructure/users-infrastructure";
import { SyncUserFromClerk } from "@/modules/users/application/use-cases/SyncUserFromClerk/sync-user-from-clerk.use-case";
import { type User } from "@/modules/users/domain/entities/user.entity";

//-aqui empieza funcion getCurrentUser y es para resolver el User de negocio desde la sesion de Clerk-//
/**
 * Devuelve el User de negocio del usuario autenticado.
 * Si existe en DB → lo devuelve directamente.
 * Si no existe todavía → lazy sync: lo crea en DB y lo devuelve.
 * Devuelve null si no hay sesión activa en Clerk.
 * Usar en Server Components y Server Actions.
 * @sideEffect
 */
export async function getCurrentUser(): Promise<User | null> {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return null;
  }

  const { userRepository } = getUsersInfrastructure();

  const existingUser = await userRepository.findByClerkId(clerkId);
  if (existingUser !== null) {
    return existingUser;
  }

  // Lazy sync: primera vez que este usuario autenticado toca la app
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return null;
  }

  const primaryEmail = clerkUser.emailAddresses.find(
    (e) => e.id === clerkUser.primaryEmailAddressId
  );

  if (!primaryEmail) {
    return null;
  }

  const fullName = [clerkUser.firstName, clerkUser.lastName]
    .filter(Boolean)
    .join(" ")
    .trim() || null;

  const useCase = new SyncUserFromClerk(userRepository);
  const { userId } = await useCase.execute({
    clerkId,
    email: primaryEmail.emailAddress,
    fullName,
  });

  return userRepository.findById(userId);
}
//-aqui termina funcion getCurrentUser-//

//-aqui empieza funcion requireCurrentUser y es para lanzar error si no hay sesion activa-//
/**
 * Igual que getCurrentUser pero lanza un error si no hay sesión.
 * Usar en rutas que requieren autenticación obligatoria.
 * @sideEffect
 */
export async function requireCurrentUser(): Promise<User> {
  const user = await getCurrentUser();

  if (user === null) {
    throw new Error("UNAUTHENTICATED");
  }

  return user;
}
//-aqui termina funcion requireCurrentUser-//
