"use server";

/**
 * Archivo: actions.ts
 * Responsabilidad: Exponer las server actions para la gestión de mesas y zonas del plano.
 * Tipo: servicio (server action)
 */

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getCatalogInfrastructure } from "@/modules/catalog/infrastructure/catalog-infrastructure";
import { UpdateFloorPlanUseCase } from "@/modules/catalog/application/use-cases/update-floor-plan.use-case";
import { GetZonesByRestaurant } from "@/modules/catalog/application/use-cases/get-zones-by-restaurant.use-case";
import { CreateZone } from "@/modules/catalog/application/use-cases/create-zone.use-case";
import { DeleteZone } from "@/modules/catalog/application/use-cases/delete-zone.use-case";
import { EnsureDefaultZone } from "@/modules/catalog/application/use-cases/ensure-default-zone.use-case";
import { type FloorPlanTable } from "@/components/dashboard/tables/floorPlanMocks";
import { type RestaurantZonePrimitives } from "@/modules/catalog/domain/entities/restaurant-zone.entity";

const onboardingRestaurantIdCookieName = "onboarding_restaurant_id";

//-aqui empieza funcion getRestaurantIdFromCookie y es para extraer el restaurantId de forma segura-//
/**
 * Extrae el restaurantId de la cookie de sesión y lanza error si no existe.
 * @pure
 */
async function getRestaurantIdFromCookie(): Promise<string> {
  const cookieStore = await cookies();
  const restaurantId =
    cookieStore.get(onboardingRestaurantIdCookieName)?.value?.trim() ?? "";

  if (restaurantId.length === 0) {
    throw new Error("No hay un restaurante seleccionado.");
  }

  return restaurantId;
}
//-aqui termina funcion getRestaurantIdFromCookie-//

//-aqui empieza funcion ensureDefaultZoneAction y es para garantizar que el restaurante tenga al menos la zona principal-//
/**
 * Crea la zona "Salón principal" si el restaurante no tiene ninguna zona.
 * Es idempotente: si ya existen zonas, no hace nada.
 * @sideEffect
 */
export async function ensureDefaultZoneAction(): Promise<void> {
  const restaurantId = await getRestaurantIdFromCookie();
  const { zoneRepository, diningTableRepository } = getCatalogInfrastructure();
  const useCase = new EnsureDefaultZone(zoneRepository, diningTableRepository);

  await useCase.execute({ restaurantId });
}
//-aqui termina funcion ensureDefaultZoneAction-//

//-aqui empieza funcion getZonesAction y es para obtener las zonas del restaurante activo-//
/**
 * Obtiene las zonas del restaurante actual para el editor de planos.
 * @sideEffect
 */
export async function getZonesAction(): Promise<RestaurantZonePrimitives[]> {
  const restaurantId = await getRestaurantIdFromCookie();
  const { zoneRepository } = getCatalogInfrastructure();
  const useCase = new GetZonesByRestaurant(zoneRepository);

  return useCase.execute({ restaurantId });
}
//-aqui termina funcion getZonesAction-//

//-aqui empieza funcion createZoneAction y es para crear una nueva zona en el restaurante activo-//
/**
 * Crea una nueva zona de restaurante y revalida el plano.
 * @sideEffect
 */
export async function createZoneAction(
  name: string,
  color?: string,
): Promise<RestaurantZonePrimitives> {
  const restaurantId = await getRestaurantIdFromCookie();
  const { zoneRepository } = getCatalogInfrastructure();
  const useCase = new CreateZone(zoneRepository);

  const zone = await useCase.execute({ restaurantId, name, color });

  revalidatePath("/dashboard/tables");

  return zone;
}
//-aqui termina funcion createZoneAction-//

//-aqui empieza funcion deleteZoneAction y es para eliminar una zona del restaurante-//
/**
 * Elimina una zona por su ID. Las mesas de esa zona quedan sin zona asignada (zoneId=null).
 * @sideEffect
 */
export async function deleteZoneAction(zoneId: string): Promise<void> {
  const { zoneRepository } = getCatalogInfrastructure();
  const useCase = new DeleteZone(zoneRepository);

  await useCase.execute({ zoneId });

  revalidatePath("/dashboard/tables");
}
//-aqui termina funcion deleteZoneAction-//

//-aqui empieza funcion saveFloorPlanAction y es para persistir las mesas del plano con su zona-//
/**
 * Guarda el estado actual del editor de mesas incluyendo la zona asignada.
 * Incluye validación defensiva: si el zoneId de la UI no existe en BD, se guarda como null
 * para evitar el error de Foreign Key constraint.
 * @sideEffect
 */
export async function saveFloorPlanAction(tables: FloorPlanTable[]) {
  const restaurantId = await getRestaurantIdFromCookie();
  const catalogInfrastructure = getCatalogInfrastructure();

  // Cargamos zonas y mesas existentes en paralelo para el merge
  const [existingTables, existingZones] = await Promise.all([
    catalogInfrastructure.diningTableRepository.findByRestaurantId(restaurantId),
    catalogInfrastructure.zoneRepository.findByRestaurantId(restaurantId),
  ]);

  // Set de IDs de zonas válidas en BD (parche FK defensivo)
  const validZoneIds = new Set(existingZones.map((z) => z.id));

  const updateUseCase = new UpdateFloorPlanUseCase(
    catalogInfrastructure.diningTableRepository,
    catalogInfrastructure.floorPlanElementRepository,
  );

  // Mapear de FloorPlanTable (UI) a DiningTablePrimitives (Domain)
  const tablesPrimitives = tables.map((uiTable) => {
    const existing = existingTables.find((t) => t.id === uiTable.id);
    const existingPrimitives = existing ? existing.toPrimitives() : null;

    // Parche defensivo: si el zoneId es un string vacío o no existe en BD → null para evitar FK error
    const rawZoneId = uiTable.zoneId && uiTable.zoneId.trim() !== "" ? uiTable.zoneId : null;
    const safeZoneId = rawZoneId !== null && validZoneIds.has(rawZoneId) ? rawZoneId : null;

    return {
      id: uiTable.id,
      restaurantId,
      zoneId: safeZoneId,
      name: uiTable.name,
      capacity: uiTable.capacity,
      isActive: uiTable.isActive,
      isCombinable: uiTable.isCombinable,
      sortOrder: uiTable.sortOrder,
      shape:
        uiTable.shape === "round"
          ? "ROUND"
          : uiTable.shape === "bar"
            ? "BAR"
            : "SQUARE",
      x: uiTable.x,
      y: uiTable.y,
      width: uiTable.width,
      height: uiTable.height,
      version: existingPrimitives?.version ?? 0,
      createdAt: existingPrimitives?.createdAt ?? new Date(),
      updatedAt: new Date(),
    };
  });

  await updateUseCase.execute({
    restaurantId,
    tables: tablesPrimitives as any,
    elements: [], // Próximamente se enviarán desde la UI
  });

  revalidatePath("/dashboard/tables");
}
//-aqui termina funcion saveFloorPlanAction-//
