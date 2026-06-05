/**
 * Archivo: service-infrastructure.ts
 * Responsabilidad: Componer las implementaciones concretas de infraestructura del módulo service.
 * Tipo: servicio
 */

import { getPrismaClient } from "@/services/prisma.service";
import type { MenuItemCostingRepository } from "../domain/ports/menu-item-costing.repository.port";
import type {
  OrderRepository,
  OrderItemRepository,
} from "../domain/ports/order.repository.port";
import { PrismaMenuItemCostingRepository } from "./repositories/prisma-menu-item-costing.repository";
import {
  PrismaOrderRepository,
  PrismaOrderItemRepository,
} from "./repositories/prisma-order.repository";

// ---------------------------------------------------------------------------
// Interfaz pública de la infraestructura del módulo
// ---------------------------------------------------------------------------

export interface ServiceInfrastructure {
  costingRepository: MenuItemCostingRepository;
  orderRepository: OrderRepository;
  orderItemRepository: OrderItemRepository;
}

//-aqui empieza funcion getServiceInfrastructure y es para ensamblar la infraestructura del módulo service-//
/**
 * Singleton de infraestructura del módulo service.
 * Reutiliza el PrismaClient global de la app.
 * @pure (referencial — misma instancia de Prisma siempre)
 */
export function getServiceInfrastructure(): ServiceInfrastructure {
  const prisma = getPrismaClient();

  return {
    costingRepository: new PrismaMenuItemCostingRepository(prisma),
    orderRepository: new PrismaOrderRepository(prisma),
    orderItemRepository: new PrismaOrderItemRepository(prisma),
  };
}
//-aqui termina funcion getServiceInfrastructure-//
