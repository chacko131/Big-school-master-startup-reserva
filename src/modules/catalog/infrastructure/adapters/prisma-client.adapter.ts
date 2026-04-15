/**
 * Archivo: prisma-client.adapter.ts
 * Responsabilidad: Exponer el acceso del módulo catalog al cliente Prisma compartido del proyecto.
 * Tipo: servicio
 */

import { PrismaClient } from "@/generated/prisma/client";
import { getPrismaClient } from "@/services/prisma.service";

//-aqui empieza funcion getCatalogPrismaClient y es para obtener el cliente Prisma compartido desde catalog-//
/**
 * Devuelve el cliente Prisma compartido del proyecto para el módulo catalog.
 * @sideEffect
 */
export function getCatalogPrismaClient(): PrismaClient {
  return getPrismaClient();
}
//-aqui termina funcion getCatalogPrismaClient y se va autilizar en infrastructure de catalogo-//
