import { FloorPlanElement } from "../../domain/entities/floor-plan-element.entity";

/**
 * Archivo: floor-plan-element-repository.port.ts
 * Responsabilidad: Definir la interfaz de acceso a datos para FloorPlanElement.
 * Tipo: lógica
 */

//-aqui empieza interfaz FloorPlanElementRepository y es para la persistencia-//
export interface FloorPlanElementRepository {
  /**
   * Obtiene todos los elementos decorativos de un restaurante.
   */
  findByRestaurantId(restaurantId: string): Promise<FloorPlanElement[]>;

  /**
   * Guarda o actualiza un elemento decorativo.
   */
  save(element: FloorPlanElement): Promise<FloorPlanElement>;

  /**
   * Elimina elementos del restaurante que no estén en la lista provista.
   */
  deleteMissingByRestaurantId(restaurantId: string, activeElementIds: string[]): Promise<void>;
}
//-aqui termina interfaz FloorPlanElementRepository-//
