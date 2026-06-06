/**
 * Archivo: menu-item-costing.repository.port.ts
 * Responsabilidad: Puerto (interfaz) del repositorio de costeo privado de platos.
 * Tipo: lógica
 */

import type {
  MenuItemCostingPrimitives,
  UpsertMenuItemCostingProps,
} from "../types/service.types";

//-aqui empieza interfaz MenuItemCostingRepository y es para abstraer la persistencia del costing-//
export interface MenuItemCostingRepository {
  /**
   * Crea o actualiza el costing de un plato (upsert por menuItemId).
   * @sideEffect persiste en base de datos
   */
  upsert(props: UpsertMenuItemCostingProps): Promise<MenuItemCostingPrimitives>;

  /**
   * Devuelve el costing de un plato por su menuItemId.
   * Retorna null si el plato aún no tiene costeo configurado.
   * @pure
   */
  findByMenuItemId(menuItemId: string): Promise<MenuItemCostingPrimitives | null>;

  /**
   * Devuelve todos los costings de un restaurante, incluyendo los ítems de catalog.
   * Necesario para el panel de backoffice del dueño/manager.
   * @pure
   */
  findAllByRestaurantId(
    restaurantId: string
  ): Promise<MenuItemCostingWithMenuItemName[]>;

  /**
   * Verifica si todos los platos activos de un restaurante tienen costeo completo.
   * Retorna los menuItemIds que faltan (sin costing o con area NONE y precio 0).
   * @pure
   */
  findIncompleteByRestaurantId(restaurantId: string): Promise<string[]>;

  /**
   * Devuelve TODOS los platos disponibles del restaurante para el panel de servicio.
   * No filtra por isActive en categoría — muestra todo lo que el dueño haya creado.
   * @pure
   */
  findAllActiveForService(
    restaurantId: string
  ): Promise<MenuItemCostingWithMenuItemName[]>;
}
//-aqui termina interfaz MenuItemCostingRepository-//

// ---------------------------------------------------------------------------
// Proyección enriquecida para el panel de backoffice
// ---------------------------------------------------------------------------

export interface MenuItemCostingWithMenuItemName
  extends MenuItemCostingPrimitives {
  menuItemName: string;
  categoryName: string;
  publicUnitPrice: number; // leído de MenuItem.price, no almacenado en MenuItemCosting
  margin: number;         // publicUnitPrice - costUnitPrice
}
