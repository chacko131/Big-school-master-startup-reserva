/**
 * Archivo: service.types.ts
 * Responsabilidad: Tipos y enums de dominio del módulo service (órdenes, ítems, costeo).
 * Tipo: lógica
 */

// ---------------------------------------------------------------------------
// Enums — reflejan exactamente los valores del schema Prisma
// ---------------------------------------------------------------------------

export type OrderStatus = "OPEN" | "SUBMITTED" | "CLOSED" | "CANCELLED";

export type OrderItemStatus =
  | "QUEUED"
  | "PREPARING"
  | "READY"
  | "SERVED"
  | "CANCELLED";

export type PreparationArea = "KITCHEN" | "BAR" | "NONE";

// ---------------------------------------------------------------------------
// Primitives — forma plana de las entidades (usada en repos y casos de uso)
// ---------------------------------------------------------------------------

export interface OrderPrimitives {
  id: string;
  restaurantId: string;
  tableId: string;
  openedByUserId: string;
  status: OrderStatus;
  totalPublic: number;
  totalCost: number;
  openedAt: Date;
  closedAt: Date | null;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItemPrimitives {
  id: string;
  orderId: string;
  menuItemId: string;
  menuItemName: string;
  qty: number;
  publicUnitPrice: number;
  costUnitPrice: number;
  area: PreparationArea;
  status: OrderItemStatus;
  queuedAt: Date;
  preparingAt: Date | null;
  readyAt: Date | null;
  servedAt: Date | null;
  cancelledAt: Date | null;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MenuItemCostingPrimitives {
  id: string;
  menuItemId: string;
  costUnitPrice: number;
  area: PreparationArea;
  gramsMeta: Record<string, unknown> | null;
  isActive: boolean;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

// ---------------------------------------------------------------------------
// Props para creación de entidades
// ---------------------------------------------------------------------------

export interface CreateOrderProps {
  id: string;
  restaurantId: string;
  tableId: string;
  openedByUserId: string;
  createdAt?: Date;
}

export interface CreateOrderItemProps {
  id: string;
  orderId: string;
  menuItemId: string;
  menuItemName: string;
  qty: number;
  publicUnitPrice: number;
  costUnitPrice: number;
  area: PreparationArea;
  createdAt?: Date;
}

export interface UpsertMenuItemCostingProps {
  menuItemId: string;
  costUnitPrice: number;
  area: PreparationArea;
  gramsMeta?: Record<string, unknown> | null;
  isActive?: boolean;
}

// ---------------------------------------------------------------------------
// Proyecciones para analytics (read-only, sin entidades pesadas)
// ---------------------------------------------------------------------------

export interface DailySalesSummary {
  restaurantId: string;
  date: string;           // "YYYY-MM-DD"
  totalRevenue: number;
  totalCost: number;
  totalMargin: number;
  orderCount: number;
  avgTicket: number;
}

export interface MenuItemSalesStat {
  menuItemId: string;
  menuItemName: string;
  qtySold: number;
  revenue: number;
  cost: number;
  margin: number;
}

export interface HourlySalesStat {
  hour: number;           // 0–23
  orderCount: number;
  revenue: number;
}
