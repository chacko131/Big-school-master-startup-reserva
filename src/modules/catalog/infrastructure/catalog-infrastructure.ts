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
import { PrismaDiningTableRepository } from "./repositories/prisma-dining-table.repository";
import { PrismaRestaurantRepository } from "./repositories/prisma-restaurant.repository";
import { PrismaRestaurantSettingsRepository } from "./repositories/prisma-restaurant-settings.repository";

export interface CatalogInfrastructure {
  restaurantRepository: RestaurantRepository;
  diningTableRepository: DiningTableRepository;
  restaurantSettingsRepository: RestaurantSettingsRepository;
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
