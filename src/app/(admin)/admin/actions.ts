/**
 * Archivo: actions.ts
 * Responsabilidad: Server actions para métricas de plataforma en admin
 * Tipo: servidor
 */

"use server";

import { getPrismaClient } from "@/services/prisma.service";

//-aqui empieza tipo PlatformMetrics-//
export interface PlatformMetrics {
  totalActiveRestaurants: number;
  totalActiveUsers: number;
  pendingIncidents: number | null;
  estimatedMrrCents: number | null;
}
//-aqui termina tipo-//

//-aqui empieza funcion getPlatformMetrics-//
/**
 * Obtiene métricas agregadas de la plataforma SaaS.
 * @sideEffect
 */
export async function getPlatformMetrics(): Promise<PlatformMetrics> {
  const prisma = getPrismaClient();

  //-aqui empieza consultas en paralelo-//
  const [activeRestaurantsCount, activeMemberships, superAdminUsers] = await Promise.all([
    prisma.restaurant.count({ where: { isActive: true } }),
    prisma.userRestaurantMembership.findMany({
      where: { status: "ACTIVE" },
      select: { userId: true },
      distinct: ["userId"],
    }),
    prisma.user.findMany({
      where: { globalRole: "SUPER_ADMIN" },
      select: { id: true },
    }),
  ]);
  //-aqui terminan consultas-//

  const activeUsers = new Set<string>();

  for (const membership of activeMemberships) {
    activeUsers.add(membership.userId);
  }

  for (const user of superAdminUsers) {
    activeUsers.add(user.id);
  }

  return {
    totalActiveRestaurants: activeRestaurantsCount,
    totalActiveUsers: activeUsers.size,
    pendingIncidents: null, // TODO: No existe aún un sistema de incidencias
    estimatedMrrCents: null, // TODO: No hay una fuente estable de MRR todavía
  };
}
//-aqui termina funcion-//
