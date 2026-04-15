/**
 * Archivo: prisma.service.ts
 * Responsabilidad: Construir y reutilizar el cliente Prisma compartido conectado a Neon.
 * Tipo: servicio
 */

import { PrismaClient } from "@/generated/prisma/client";
import { environmentSchema } from "@/schemas/environment.schema";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import WebSocket from "ws";

type GlobalPrismaRegistry = typeof globalThis & {
  prismaClient?: PrismaClient;
};

neonConfig.webSocketConstructor = WebSocket;

//-aqui empieza funcion getDatabaseUrlFromEnvironment y es para obtener una cadena de conexion valida desde el entorno-//
/**
 * Valida el entorno y devuelve la cadena de conexión de base de datos.
 * @pure
 */
function getDatabaseUrlFromEnvironment(): string {
  const environment = environmentSchema.parse(process.env);

  return environment.DATABASE_URL;
}
//-aqui termina funcion getDatabaseUrlFromEnvironment y se va autilizar en getPrismaClient-//

//-aqui empieza funcion getPrismaClient y es para reutilizar un cliente Prisma compartido conectado a Neon-//
/**
 * Devuelve una instancia compartida de PrismaClient conectada a Neon.
 * @sideEffect
 */
export function getPrismaClient(): PrismaClient {
  const globalPrismaRegistry = globalThis as GlobalPrismaRegistry;

  if (globalPrismaRegistry.prismaClient !== undefined) {
    return globalPrismaRegistry.prismaClient;
  }

  const databaseUrl = getDatabaseUrlFromEnvironment();
  const prismaAdapter = new PrismaNeon({ connectionString: databaseUrl });
  const prismaClient = new PrismaClient({ adapter: prismaAdapter });

  if (process.env.NODE_ENV !== "production") {
    globalPrismaRegistry.prismaClient = prismaClient;
  }

  return prismaClient;
}
//-aqui termina funcion getPrismaClient y se va autilizar en infrastructure y composition root-//
