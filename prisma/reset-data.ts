/**
 * Archivo: reset-data.ts
 * Responsabilidad: Borrar todos los datos de la DB conservando la estructura de tablas.
 * SOLO USAR EN DESARROLLO. Nunca en producción.
 */

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import WebSocket from "ws";
import * as dotenv from "dotenv";

dotenv.config();
neonConfig.webSocketConstructor = WebSocket;

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🗑️  Borrando todos los datos...");

  // El orden importa por las foreign keys — se borran hijos antes que padres
  await prisma.userRestaurantMembership.deleteMany();
  await prisma.user.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.menuCategory.deleteMany();
  await prisma.businessHours.deleteMany();
  await prisma.floorPlanElement.deleteMany();
  await prisma.reservationTable.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.guest.deleteMany();
  await prisma.diningTable.deleteMany();
  await prisma.restaurantZone.deleteMany();
  await prisma.restaurantSettings.deleteMany();
  await prisma.restaurant.deleteMany();

  console.log("✅ Base de datos limpia. Todas las tablas vacías.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
