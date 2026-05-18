/**
 * Archivo: users-infrastructure.ts
 * Responsabilidad: Componer las implementaciones concretas de infraestructura del módulo users.
 * Tipo: servicio
 */

import { PrismaClient } from "@/generated/prisma/client";
import { getPrismaClient } from "@/services/prisma.service";
import { type UserRepository } from "../domain/ports/user.repository.port";
import { type MembershipRepository } from "../domain/ports/membership.repository.port";
import { type TeamInvitationTokenRepository } from "../domain/ports/team-invitation-token.repository.port";
import { type RolePagePermissionRepository } from "../domain/ports/role-page-permission.repository.port";
import { PrismaUserRepository } from "./repositories/prisma-user.repository";
import { PrismaMembershipRepository } from "./repositories/prisma-membership.repository";
import { PrismaTeamInvitationTokenRepository } from "./repositories/prisma-team-invitation-token.repository";
import { PrismaRolePagePermissionRepository } from "./repositories/prisma-role-page-permission.repository";

export interface UsersInfrastructure {
  userRepository: UserRepository;
  membershipRepository: MembershipRepository;
  invitationTokenRepository: TeamInvitationTokenRepository;
  rolePagePermissionRepository: RolePagePermissionRepository;
}

//-aqui empieza funcion createUsersInfrastructure y es para ensamblar la infraestructura del modulo users-//
/**
 * Construye las implementaciones concretas de infraestructura del módulo users.
 * Recibe el cliente Prisma como parámetro para facilitar testing.
 * @pure
 */
export function createUsersInfrastructure(prismaClient: PrismaClient): UsersInfrastructure {
  return {
    userRepository: new PrismaUserRepository(prismaClient),
    membershipRepository: new PrismaMembershipRepository(prismaClient),
    invitationTokenRepository: new PrismaTeamInvitationTokenRepository(prismaClient),
    rolePagePermissionRepository: new PrismaRolePagePermissionRepository(prismaClient),
  };
}
//-aqui termina funcion createUsersInfrastructure-//

//-aqui empieza funcion getUsersInfrastructure y es para obtener la infraestructura con el cliente Prisma compartido-//
/**
 * Construye la infraestructura del módulo users usando el cliente Prisma compartido del proyecto.
 * Es la función que usan los server actions y server components en runtime.
 * @sideEffect
 */
export function getUsersInfrastructure(): UsersInfrastructure {
  return createUsersInfrastructure(getPrismaClient());
}
//-aqui termina funcion getUsersInfrastructure-//
