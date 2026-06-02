/**
 * Archivo: list-platform-users.use-case.ts
 * Responsabilidad: Listar todos los usuarios de la plataforma con sus memberships para el panel admin.
 * Tipo: lógica
 */

import { type UserRepository } from "../../../domain/ports/user.repository.port";
import { type MembershipRepository } from "../../../domain/ports/membership.repository.port";
import { type GlobalRole } from "../../../domain/entities/user.entity";
import { type MembershipRole, type MembershipStatus } from "../../../domain/entities/user-restaurant-membership.entity";

//-aqui empieza tipo PlatformUserMembership-//
/** Membership asociada a un usuario en el listado de plataforma. */
export interface PlatformUserMembership {
  restaurantId: string;
  role: MembershipRole;
  status: MembershipStatus;
}
//-aqui termina tipo PlatformUserMembership-//

//-aqui empieza tipo PlatformUserRow-//
/** Fila de usuario para el listado global del panel admin. */
export interface PlatformUserRow {
  id: string;
  email: string;
  fullName: string | null;
  globalRole: GlobalRole;
  createdAt: string;
  /** Memberships del usuario (puede tener varias si pertenece a varios restaurantes). */
  memberships: PlatformUserMembership[];
}
//-aqui termina tipo PlatformUserRow-//

//-aqui empieza clase ListPlatformUsers y es para listar usuarios con memberships para admin-//
/**
 * Caso de uso para obtener la lista global de usuarios con sus memberships.
 *
 * No resuelve nombres de restaurante — eso es responsabilidad de la capa de
 * orquestación (server action) que combina este resultado con datos de catalog.
 *
 * @sideEffect — lectura de base de datos.
 */
export class ListPlatformUsers {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly membershipRepository: MembershipRepository
  ) {}

  async execute(): Promise<PlatformUserRow[]> {
    const [users, memberships] = await Promise.all([
      this.userRepository.findAll(),
      this.membershipRepository.findAll(),
    ]);

    //-aqui empieza agrupación de memberships por userId-//
    const membershipsByUserId = new Map<string, PlatformUserMembership[]>();

    for (const m of memberships) {
      const primitives = m.toPrimitives();
      const existing = membershipsByUserId.get(primitives.userId) ?? [];
      existing.push({
        restaurantId: primitives.restaurantId,
        role: primitives.role,
        status: primitives.status,
      });
      membershipsByUserId.set(primitives.userId, existing);
    }
    //-aqui termina agrupación de memberships por userId-//

    return users.map((user) => {
      const p = user.toPrimitives();
      return {
        id: p.id,
        email: p.email,
        fullName: p.fullName,
        globalRole: p.globalRole,
        createdAt: p.createdAt.toISOString(),
        memberships: membershipsByUserId.get(p.id) ?? [],
      };
    });
  }
}
//-aqui termina clase ListPlatformUsers-//
