/**
 * Archivo: catalog-infrastructure.ts
 * Responsabilidad: Componer las implementaciones concretas de infraestructura del módulo catalog.
 * Tipo: servicio
 */

import { PrismaClient } from "@/generated/prisma/client";
import { getPrismaClient } from "@/services/prisma.service";
import { type DiningTableRepository } from "../application/ports/dining-table-repository.port";
import { type RestaurantRepository } from "../application/ports/restaurant-repository.port";
import { type RestaurantSettingsRepository } from "../application/ports/restaurant-settings-repository.port";
import { type ZoneRepository } from "../application/ports/zone-repository.port";
import { type FloorPlanElementRepository } from "../application/ports/floor-plan-element-repository.port";
import { type BusinessHoursRepository } from "../application/ports/business-hours-repository.port";
import { type MenuRepository } from "../application/ports/menu-repository.port";
import { PrismaDiningTableRepository } from "./repositories/prisma-dining-table.repository";
import { PrismaRestaurantRepository } from "./repositories/prisma-restaurant.repository";
import { PrismaRestaurantSettingsRepository } from "./repositories/prisma-restaurant-settings.repository";
import { PrismaZoneRepository } from "./repositories/prisma-zone.repository";
import { PrismaFloorPlanElementRepository } from "./repositories/prisma-floor-plan-element.repository";
import { PrismaBusinessHoursRepository } from "./repositories/prisma-business-hours.repository";
import { PrismaMenuRepository } from "./repositories/prisma-menu.repository";

export interface CatalogInfrastructure {
  restaurantRepository: RestaurantRepository;
  diningTableRepository: DiningTableRepository;
  restaurantSettingsRepository: RestaurantSettingsRepository;
  zoneRepository: ZoneRepository;
  floorPlanElementRepository: FloorPlanElementRepository;
  businessHoursRepository: BusinessHoursRepository;
  menuRepository: MenuRepository;
}

//-aqui empieza funcion createCatalogInfrastructure y es para ensamblar la infraestructura concreta del catalogo-//
/**
 * Construye las implementaciones concretas de infraestructura del catálogo.
 * @pure
 */
export function createCatalogInfrastructure(prismaClient: PrismaClient): CatalogInfrastructure {
  return {
    restaurantRepository: new PrismaRestaurantRepository(prismaClient),
    diningTableRepository: new PrismaDiningTableRepository(prismaClient),
    restaurantSettingsRepository: new PrismaRestaurantSettingsRepository(prismaClient),
    zoneRepository: new PrismaZoneRepository(prismaClient),
    floorPlanElementRepository: new PrismaFloorPlanElementRepository(prismaClient),
    businessHoursRepository: new PrismaBusinessHoursRepository(prismaClient),
    menuRepository: new PrismaMenuRepository(prismaClient),
  };
}
//-aqui termina funcion createCatalogInfrastructure y se va autilizar en composition root del servidor-//

//-aqui empieza funcion getCatalogInfrastructure y es para ensamblar catalog usando el cliente Prisma compartido-//
/**
 * Construye la infraestructura del catálogo utilizando el cliente Prisma compartido del proyecto.
 * @sideEffect
 */
export function getCatalogInfrastructure(): CatalogInfrastructure {
  return createCatalogInfrastructure(getPrismaClient());
}
//-aqui termina funcion getCatalogInfrastructure y se va autilizar en runtime del servidor-//
