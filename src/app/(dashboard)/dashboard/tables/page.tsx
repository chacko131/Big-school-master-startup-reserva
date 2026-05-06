/**
 * Archivo: page.tsx
 * Responsabilidad: Renderizar el editor operativo de mesas y plano de sala dentro del dashboard.
 * Tipo: UI
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { FloorPlanEditor } from "@/components/dashboard/tables/FloorPlanEditor";
import { getCatalogInfrastructure } from "@/modules/catalog/infrastructure/catalog-infrastructure";
import { GetZonesByRestaurant } from "@/modules/catalog/application/use-cases/get-zones-by-restaurant.use-case";
import { ensureDefaultZoneAction, getTableOccupancyAction } from "./actions";
import type { FloorPlanTable } from "@/components/dashboard/tables/floorPlanMocks";
import type { RestaurantZonePrimitives } from "@/modules/catalog/domain/entities/restaurant-zone.entity";
import type { FloorPlanElementPrimitives } from "@/modules/catalog/domain/entities/floor-plan-element.entity";
import { FloorPlanAuditLogPlaceholder } from "@/components/dashboard/tables/FloorPlanAuditLogPlaceholder";

const onboardingRestaurantIdCookieName = "onboarding_restaurant_id";

//-aqui empieza pagina TablesPage y es para mostrar el editor operativo de mesas con zonas-//
/**
 * Presenta el editor del plano de mesas del restaurante.
 * Carga mesas y zonas en servidor y las pasa al editor cliente.
 */
export default async function TablesPage() {
  const cookieStore = await cookies();
  const restaurantId =
    cookieStore.get(onboardingRestaurantIdCookieName)?.value?.trim() ?? "";

  if (restaurantId.length === 0) {
    redirect("/onboarding/restaurant");
  }

  // Garantizar que exista al menos una zona ("Salón principal") y migrar huérfanas
  await ensureDefaultZoneAction();

  const catalogInfrastructure = getCatalogInfrastructure();

  // Obtenemos mesas, zonas, elementos decorativos y ocupación en paralelo
  const [diningTables, zones, floorPlanElements, occupancy] = await Promise.all([
    catalogInfrastructure.diningTableRepository.findByRestaurantId(
      restaurantId,
    ),
    new GetZonesByRestaurant(catalogInfrastructure.zoneRepository).execute({
      restaurantId,
    }),
    catalogInfrastructure.floorPlanElementRepository.findByRestaurantId(
      restaurantId,
    ),
    getTableOccupancyAction(),
  ]);

  // Crear un mapa de ocupación por tableId para lookup rápido
  const occupancyByTable = new Map(occupancy.map((o) => [o.tableId, o]));

  // Mapeamos a FloorPlanTable (el formato que espera la UI) con estado de ocupación real
  const initialTables: FloorPlanTable[] = diningTables.map((table) => {
    const primitives = table.toPrimitives();

    // Buscamos el nombre de la zona para display (puede ser null si no tiene zona)
    const zoneName = zones.find((z) => z.id === primitives.zoneId)?.name ?? "";

    // Resolver estado: occupied si tiene reserva activa ahora, inactive si está deshabilitada, active si está libre
    const currentOccupancy = occupancyByTable.get(primitives.id);
    let statusLabel = "Disponible";
    let statusTone: "active" | "inactive" | "occupied" = "active";

    if (!primitives.isActive) {
      statusLabel = "Inactiva";
      statusTone = "inactive";
    } else if (currentOccupancy) {
      statusLabel = currentOccupancy.guestName.trim() || "Ocupada";
      statusTone = "occupied";
    }

    return {
      id: primitives.id,
      restaurantId,
      name: primitives.name,
      capacity: primitives.capacity,
      isActive: primitives.isActive,
      isCombinable: primitives.isCombinable,
      sortOrder: primitives.sortOrder,
      shape:
        (primitives.shape?.toLowerCase() as "square" | "round" | "bar") ??
        "square",
      x: primitives.x,
      y: primitives.y,
      width: primitives.width ?? (primitives.shape === "ROUND" ? 80 : 100),
      height: primitives.height ?? (primitives.shape === "ROUND" ? 80 : 100),
      zoneId: primitives.zoneId,
      zone: zoneName,
      statusLabel,
      statusTone,
      status: statusTone,
      occupancy: currentOccupancy
        ? {
            reservationId: currentOccupancy.reservationId,
            guestName: currentOccupancy.guestName,
            partySize: currentOccupancy.partySize,
            startAt: currentOccupancy.startAt,
            endAt: currentOccupancy.endAt,
            status: currentOccupancy.status,
          }
        : undefined,
    };
  });

  const initialZones: RestaurantZonePrimitives[] = zones;

  // Convertir entidades de dominio a primitivos para la UI
  const initialElements: FloorPlanElementPrimitives[] = floorPlanElements.map(
    (el) => el.toPrimitives(),
  );

  return (
    <>
      <FloorPlanEditor
        initialTables={initialTables}
        initialZones={initialZones}
        initialElements={initialElements}
      />
      <FloorPlanAuditLogPlaceholder />
    </>
  );
}
//-aqui termina pagina TablesPage-//
