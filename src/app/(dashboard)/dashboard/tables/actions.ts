"use server";

/**
 * Archivo: actions.ts
 * Responsabilidad: Exponer las server actions para la gestión de mesas y zonas del plano.
 * Tipo: servicio (server action)
 */

import { revalidatePath } from "next/cache";
import { getRestaurantIdFromSession } from "@/modules/auth/get-restaurant-id";
import { getCatalogInfrastructure } from "@/modules/catalog/infrastructure/catalog-infrastructure";
import { assertCanWrite } from "@/modules/billing/infrastructure/write-access-guard";
import { UpdateFloorPlanUseCase } from "@/modules/catalog/application/use-cases/update-floor-plan.use-case";
import { GetZonesByRestaurant } from "@/modules/catalog/application/use-cases/get-zones-by-restaurant.use-case";
import { CreateZone } from "@/modules/catalog/application/use-cases/create-zone.use-case";
import { DeleteZone } from "@/modules/catalog/application/use-cases/delete-zone.use-case";
import { EnsureDefaultZone } from "@/modules/catalog/application/use-cases/ensure-default-zone.use-case";
import { type FloorPlanTable } from "@/components/dashboard/tables/floorPlanMocks";
import { type RestaurantZonePrimitives } from "@/modules/catalog/domain/entities/restaurant-zone.entity";
import { type FloorPlanElementPrimitives } from "@/modules/catalog/domain/entities/floor-plan-element.entity";
import { type DiningTablePrimitives } from "@/modules/catalog/domain/entities/dining-table.entity";
import { captureUnexpectedError } from "@/lib/sentry";


//-aqui empieza funcion ensureDefaultZoneAction y es para garantizar que el restaurante tenga al menos la zona principal-//
/**
 * Crea la zona "Salón principal" si el restaurante no tiene ninguna zona.
 * Es idempotente: si ya existen zonas, no hace nada.
 * @sideEffect
 */
export async function ensureDefaultZoneAction(): Promise<void> {
  const restaurantId = await assertCanWrite();
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
  const restaurantId = await getRestaurantIdFromSession();
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
  const restaurantId = await assertCanWrite();
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
  await assertCanWrite();
  const { zoneRepository } = getCatalogInfrastructure();
  const useCase = new DeleteZone(zoneRepository);

  await useCase.execute({ zoneId });

  revalidatePath("/dashboard/tables");
}
//-aqui termina funcion deleteZoneAction-//

//-aqui empieza funcion saveFloorPlanAction y es para persistir las mesas y elementos del plano-//
/**
 * Guarda el estado actual del editor de mesas y elementos decorativos.
 * Incluye validación defensiva: si el zoneId de la UI no existe en BD, se guarda como null.
 * @sideEffect
 */
export async function saveFloorPlanAction(
  tables: FloorPlanTable[],
  elements: FloorPlanElementPrimitives[] = [],
) {
  const restaurantId = await assertCanWrite();
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

  // Mapear elementos decorativos asegurando restaurantId correcto
  const elementsPrimitives: FloorPlanElementPrimitives[] = elements.map((el) => ({
    ...el,
    restaurantId,
  }));

  await updateUseCase.execute({
    restaurantId,
    tables: tablesPrimitives as DiningTablePrimitives[],
    elements: elementsPrimitives,
  });

  revalidatePath("/dashboard/tables");
}
//-aqui termina funcion saveFloorPlanAction-//

//-aqui empieza funcion assignTableToReservationAction y es para asignar una mesa a una reserva-//
/**
 * Asigna una mesa física a una reserva existente creando un registro en ReservationTable.
 * @sideEffect
 */
export async function assignTableToReservationAction(
  reservationId: string,
  tableId: string
): Promise<{ success: boolean; error?: string }> {
  const restaurantId = await assertCanWrite();
  const prisma = (await import("@/services/prisma.service")).getPrismaClient();

  // Verificar que la reserva pertenece al restaurante
  const reservation = await prisma.reservation.findFirst({
    where: { id: reservationId, restaurantId },
  });

  if (!reservation) {
    return { success: false, error: "Reserva no encontrada o no pertenece a este restaurante." };
  }

  // Verificar que la mesa pertenece al restaurante
  const table = await prisma.diningTable.findFirst({
    where: { id: tableId, restaurantId },
  });

  if (!table) {
    return { success: false, error: "Mesa no encontrada o no pertenece a este restaurante." };
  }

  // Verificar que no exista ya la asignación
  const existing = await prisma.reservationTable.findUnique({
    where: { reservationId_tableId: { reservationId, tableId } },
  });

  if (existing) {
    return { success: false, error: "La mesa ya está asignada a esta reserva." };
  }

  await prisma.reservationTable.create({
    data: {
      reservationId,
      tableId,
      assignedSeats: reservation.partySize,
    },
  });

  revalidatePath("/dashboard/tables");
  return { success: true };
}
//-aqui termina funcion assignTableToReservationAction-//

//-aqui empieza funcion unassignTableFromReservationAction y es para desasignar una mesa de una reserva-//
/**
 * Elimina la asignación de una mesa a una reserva.
 * @sideEffect
 */
export async function unassignTableFromReservationAction(
  reservationId: string,
  tableId: string
): Promise<{ success: boolean; error?: string }> {
  const restaurantId = await assertCanWrite();
  const prisma = (await import("@/services/prisma.service")).getPrismaClient();

  const existing = await prisma.reservationTable.findUnique({
    where: { reservationId_tableId: { reservationId, tableId } },
    include: { reservation: { select: { restaurantId: true } } },
  });

  if (!existing) {
    return { success: false, error: "No existe esa asignación." };
  }

  if (existing.reservation.restaurantId !== restaurantId) {
    return { success: false, error: "No autorizado." };
  }

  await prisma.reservationTable.delete({
    where: { id: existing.id },
  });

  revalidatePath("/dashboard/tables");
  return { success: true };
}
//-aqui termina funcion unassignTableFromReservationAction-//

export interface TableOccupancy {
  tableId: string;
  reservationId: string;
  guestName: string;
  partySize: number;
  startAt: string;
  endAt: string;
  status: string;
}

//-aqui empieza funcion getTableOccupancyAction y es para obtener la ocupación actual de mesas-//
/**
 * Devuelve las mesas que tienen reservas activas en la hora actual (o próxima hora).
 * @sideEffect
 */
export async function getTableOccupancyAction(): Promise<TableOccupancy[]> {
  const restaurantId = await getRestaurantIdFromSession();
  const prisma = (await import("@/services/prisma.service")).getPrismaClient();

  const now = new Date();
  // Mostramos reservas desde hace 1h (por si están en servicio) hasta fin del día operativo (+8h)
  const windowStart = new Date(now.getTime() - 60 * 60 * 1000);
  const windowEnd = new Date(now.getTime() + 8 * 60 * 60 * 1000);

  const assignments = await prisma.reservationTable.findMany({
    where: {
      reservation: {
        restaurantId,
        startAt: { lt: windowEnd },
        endAt: { gt: windowStart },
        status: { in: ["PENDING", "CONFIRMED", "CHECKED_IN"] },
      },
    },
    include: {
      reservation: {
        include: { guest: { select: { fullName: true } } },
      },
    },
  });

  return assignments.map((a) => ({
    tableId: a.tableId,
    reservationId: a.reservationId,
    guestName: a.reservation.guest?.fullName ?? "Huésped",
    partySize: a.reservation.partySize,
    startAt: a.reservation.startAt.toISOString(),
    endAt: a.reservation.endAt.toISOString(),
    status: a.reservation.status,
  }));
}
//-aqui termina funcion getTableOccupancyAction-//
