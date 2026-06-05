/**
 * Archivo: service-table.types.ts
 * Responsabilidad: Tipos compartidos entre los componentes del panel de servicio.
 * Tipo: tipos
 */

import type { TableWithOrder } from "@/app/(dashboard)/dashboard/service/actions";
import type { MenuItemCostingWithMenuItemName } from "@/modules/service/domain/ports/menu-item-costing.repository.port";

export type { TableWithOrder, MenuItemCostingWithMenuItemName };

export interface MenuBookProps {
  menuItems: MenuItemCostingWithMenuItemName[];
  quantities: Record<string, number>;
  setQty: (id: string, delta: number) => void;
  search: string;
  setSearch: (s: string) => void;
  error: string | null;
  submitting: boolean;
  totalItems: number;
  onSend: () => void;
}

export interface TableModalProps {
  table: TableWithOrder;
  menuItems: MenuItemCostingWithMenuItemName[];
  onClose: () => void;
}
