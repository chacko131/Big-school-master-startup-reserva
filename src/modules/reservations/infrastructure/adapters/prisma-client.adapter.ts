/**
 * Archivo: prisma-client.adapter.ts
 * Responsabilidad: Exponer el acceso del módulo reservations al cliente Prisma compartido del proyecto.
 * Tipo: servicio
 */

import { type PrismaClient } from "@/generated/prisma/client";
import { getPrismaClient } from "@/services/prisma.service";

//-aqui empieza funcion getReservationsPrismaClient y es para obtener el cliente Prisma compartido desde reservations-//
/**
 * Devuelve el cliente Prisma compartido del proyecto para el módulo reservations.
 * @sideEffect
 */
export function getReservationsPrismaClient(): PrismaClient {
  return getPrismaClient();
}
//-aqui termina funcion getReservationsPrismaClient y se va autilizar en infrastructure de reservas-//
