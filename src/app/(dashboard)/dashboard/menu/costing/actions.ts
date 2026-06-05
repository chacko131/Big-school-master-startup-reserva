/**
 * Archivo: actions.ts
 * Responsabilidad: Server Actions para el backoffice de costeo de platos (Plan Pro).
 * Tipo: servicio
 */

"use server";

import { revalidatePath } from "next/cache";
import { requireCurrentUser } from "@/modules/auth/get-current-user";
import { getUsersInfrastructure } from "@/modules/users/infrastructure/users-infrastructure";
import { assertCanWrite } from "@/modules/billing/infrastructure/write-access-guard";
import { getBillingInfrastructure } from "@/modules/billing/infrastructure/billing-infrastructure";
import { GetRestaurantAccessLevel } from "@/modules/billing/application/use-cases/GetRestaurantAccessLevel/get-restaurant-access-level.use-case";
import { getServiceInfrastructure } from "@/modules/service/infrastructure/service-infrastructure";
import { UpsertMenuItemCosting } from "@/modules/service/application/use-cases/UpsertMenuItemCosting/upsert-menu-item-costing.use-case";
import { captureUnexpectedError } from "@/lib/sentry";
import type { PreparationArea } from "@/modules/service/domain/types/service.types";
import type { MenuItemCostingWithMenuItemName } from "@/modules/service/domain/ports/menu-item-costing.repository.port";

// ---------------------------------------------------------------------------
// Tipos de respuesta
// ---------------------------------------------------------------------------

export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string };

// ---------------------------------------------------------------------------
// Guard Pro — solo Owner/Manager con Plan Pro activo
// ---------------------------------------------------------------------------

//-aqui empieza funcion assertProOwnerOrManager y es para verificar que el usuario es dueño o manager con Plan Pro-//
/**
 * Lanza error si el usuario no es RESTAURANT_OWNER o MANAGER,
 * o si el restaurante no tiene Plan Pro activo.
 * @sideEffect lee sesión y suscripción
 */
async function assertProOwnerOrManager(): Promise<string> {
  const user = await requireCurrentUser();
  const { membershipRepository } = getUsersInfrastructure();
  const memberships = await membershipRepository.findActiveByUserId(user.id);

  if (memberships.length === 0) {
    throw new Error("Sin restaurante activo.");
  }

  const membership = memberships[0]!.toPrimitives();
  const allowedRoles = ["RESTAURANT_OWNER", "MANAGER"] as const;

  if (!allowedRoles.includes(membership.role as (typeof allowedRoles)[number])) {
    throw new Error("Solo el dueño o el manager pueden gestionar el costeo.");
  }

  const restaurantId = membership.restaurantId;

  const { subscriptionRepository } = getBillingInfrastructure();
  const accessLevel = await new GetRestaurantAccessLevel(subscriptionRepository).execute({
    restaurantId,
  });

  const hasPro =
    accessLevel.planId === "pro" || accessLevel.isTrialActive;

  if (!hasPro) {
    throw new Error(
      "El módulo de costeo está disponible solo en el Plan Pro."
    );
  }

  return restaurantId;
}
//-aqui termina funcion assertProOwnerOrManager-//

// ---------------------------------------------------------------------------
// Action: leer costeo completo del restaurante
// ---------------------------------------------------------------------------

//-aqui empieza funcion fetchCostingForRestaurant y es para obtener todos los platos con su costeo-//
/**
 * Devuelve todos los platos de la carta con su costeo (o sin él si aún no configurado).
 * @sideEffect lee BD
 */
export async function fetchCostingForRestaurant(): Promise<
  ActionResult<MenuItemCostingWithMenuItemName[]>
> {
  try {
    const restaurantId = await assertProOwnerOrManager();
    const { costingRepository } = getServiceInfrastructure();
    const rows = await costingRepository.findAllByRestaurantId(restaurantId);
    return { ok: true, data: rows };
  } catch (err) {
    if (err instanceof Error) return { ok: false, error: err.message };
    captureUnexpectedError(err);
    return { ok: false, error: "Error inesperado." };
  }
}
//-aqui termina funcion fetchCostingForRestaurant-//

// ---------------------------------------------------------------------------
// Action: upsert de un ítem de costeo
// ---------------------------------------------------------------------------

export interface UpsertCostingInput {
  menuItemId: string;
  costUnitPrice: number;
  area: PreparationArea;
  isActive: boolean;
}

//-aqui empieza funcion upsertMenuItemCostingAction y es para crear o actualizar el costeo de un plato-//
/**
 * Crea o actualiza el costeo privado de un plato.
 * Valida rol Owner/Manager + Plan Pro antes de persistir.
 * @sideEffect escribe en BD y revalida la página
 */
export async function upsertMenuItemCostingAction(
  input: UpsertCostingInput
): Promise<ActionResult> {
  try {
    await assertCanWrite(); // valida canWrite general
    await assertProOwnerOrManager(); // valida Pro + rol

    const { costingRepository } = getServiceInfrastructure();
    const useCase = new UpsertMenuItemCosting(costingRepository);

    await useCase.execute({
      menuItemId: input.menuItemId,
      costUnitPrice: input.costUnitPrice,
      area: input.area,
      isActive: input.isActive,
    });

    revalidatePath("/dashboard/menu/costing");
    return { ok: true, data: undefined };
  } catch (err) {
    if (err instanceof Error) return { ok: false, error: err.message };
    captureUnexpectedError(err);
    return { ok: false, error: "Error inesperado." };
  }
}
//-aqui termina funcion upsertMenuItemCostingAction-//
