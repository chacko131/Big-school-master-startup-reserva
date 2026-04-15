/**
 * Archivo: reservations-infrastructure.ts
 * Responsabilidad: Componer las implementaciones concretas de infraestructura del módulo reservations.
 * Tipo: servicio
 */

import { type PrismaClient } from "@/generated/prisma/client";
import { getPrismaClient } from "@/services/prisma.service";
import { type DiningTableRepository } from "../application/ports/dining-table-repository.port";
import { type GuestRepository } from "../application/ports/guest-repository.port";
import { type ReservationRepository } from "../application/ports/reservation-repository.port";
import { type RestaurantSettingsRepository } from "../application/ports/restaurant-settings-repository.port";
import { PrismaDiningTableRepository } from "./repositories/prisma-dining-table.repository";
import { PrismaGuestRepository } from "./repositories/prisma-guest.repository";
import { PrismaReservationRepository } from "./repositories/prisma-reservation.repository";
import { PrismaRestaurantSettingsRepository } from "./repositories/prisma-restaurant-settings.repository";

export interface ReservationsInfrastructure {
  reservationRepository: ReservationRepository;
  guestRepository: GuestRepository;
  diningTableRepository: DiningTableRepository;
  restaurantSettingsRepository: RestaurantSettingsRepository;
}

//-aqui empieza funcion createReservationsInfrastructure y es para ensamblar la infraestructura concreta de reservas-//
/**
 * Construye las implementaciones concretas de infraestructura del módulo reservations.
 * @pure
 */
export function createReservationsInfrastructure(prismaClient: PrismaClient): ReservationsInfrastructure {
  return {
    reservationRepository: new PrismaReservationRepository(prismaClient),
    guestRepository: new PrismaGuestRepository(prismaClient),
    diningTableRepository: new PrismaDiningTableRepository(prismaClient),
    restaurantSettingsRepository: new PrismaRestaurantSettingsRepository(prismaClient),
  };
}
//-aqui termina funcion createReservationsInfrastructure y se va autilizar en composition root del servidor-//

//-aqui empieza funcion getReservationsInfrastructure y es para ensamblar reservations usando el cliente Prisma compartido-//
/**
 * Construye la infraestructura de reservas utilizando el cliente Prisma compartido del proyecto.
 * @sideEffect
 */
export function getReservationsInfrastructure(): ReservationsInfrastructure {
  return createReservationsInfrastructure(getPrismaClient());
}
//-aqui termina funcion getReservationsInfrastructure y se va autilizar en runtime del servidor-//
