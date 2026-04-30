/**
 * Archivo: update-floor-plan.use-case.ts
 * Responsabilidad: Actualizar la disposición visual y estado de las mesas en el plano del restaurante.
 * Tipo: servicio (use case)
 */

import { DiningTable, type DiningTablePrimitives } from "../../domain/entities/dining-table.entity";
import { FloorPlanElement, type FloorPlanElementPrimitives } from "../../domain/entities/floor-plan-element.entity";
import { type DiningTableRepository } from "../ports/dining-table-repository.port";
import { type FloorPlanElementRepository } from "../ports/floor-plan-element-repository.port";

export interface UpdateFloorPlanCommand {
  restaurantId: string;
  tables: DiningTablePrimitives[];
  elements?: FloorPlanElementPrimitives[];
}

//-aqui empieza clase UpdateFloorPlanUseCase y es para guardar el plano de mesas y elementos decorativos-//
/**
 * Coordina la actualización de las posiciones y propiedades de las mesas y elementos en el plano,
 * eliminando aquellos que ya no forman parte de la configuración.
 */
export class UpdateFloorPlanUseCase {
  constructor(
    private readonly diningTableRepository: DiningTableRepository,
    private readonly floorPlanElementRepository: FloorPlanElementRepository,
  ) {}

  //-aqui empieza funcion execute y es para procesar el comando de actualización-//
  /**
   * Ejecuta el caso de uso guardando cada mesa y elemento con sus nuevos parámetros visuales y de estado,
   * y elimina del repositorio los que no están incluidos en el comando.
   * @sideEffect
   */
  async execute(command: UpdateFloorPlanCommand): Promise<void> {
    const { restaurantId, tables, elements = [] } = command;

    // Validación básica: asegurarse de que todas las mesas y elementos pertenezcan al restaurante correcto
    const validTables = tables.filter((table) => table.restaurantId === restaurantId);
    const validElements = elements.filter((element) => element.restaurantId === restaurantId);

    const tableEntities = validTables.map((tableProps) => DiningTable.fromPrimitives(tableProps));
    const tableIdsToKeep = validTables.map(t => t.id);

    const elementEntities = validElements.map((elementProps) => FloorPlanElement.create(elementProps));
    const elementIdsToKeep = validElements.map(e => e.id);

    // Eliminamos los que ya no están en el plano para este restaurante
    await Promise.all([
      this.diningTableRepository.deleteMissingByRestaurantId(restaurantId, tableIdsToKeep),
      this.floorPlanElementRepository.deleteMissingByRestaurantId(restaurantId, elementIdsToKeep),
    ]);

    // Persistimos en paralelo
    const savePromises: Promise<any>[] = [
      ...tableEntities.map((entity) => this.diningTableRepository.save(entity)),
      ...elementEntities.map((entity) => this.floorPlanElementRepository.save(entity)),
    ];

    await Promise.all(savePromises);
  }
  //-aqui termina funcion execute-//
}
//-aqui termina clase UpdateFloorPlanUseCase-//
