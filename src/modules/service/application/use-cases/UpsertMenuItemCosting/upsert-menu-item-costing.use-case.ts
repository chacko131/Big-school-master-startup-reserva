/**
 * Archivo: upsert-menu-item-costing.use-case.ts
 * Responsabilidad: Caso de uso para crear o actualizar el costeo privado de un plato.
 *   Solo accesible para Owner/Manager con Plan Pro.
 * Tipo: lógica
 */

import { MenuItemCosting } from "../../../domain/entities/menu-item-costing.entity";
import type { MenuItemCostingRepository } from "../../../domain/ports/menu-item-costing.repository.port";
import type {
  MenuItemCostingPrimitives,
  UpsertMenuItemCostingProps,
} from "../../../domain/types/service.types";

// ---------------------------------------------------------------------------
// Input / Output del caso de uso
// ---------------------------------------------------------------------------

export type UpsertMenuItemCostingInput = UpsertMenuItemCostingProps;

export interface UpsertMenuItemCostingOutput {
  costing: MenuItemCostingPrimitives;
}

// ---------------------------------------------------------------------------
// Caso de uso
// ---------------------------------------------------------------------------

//-aqui empieza clase UpsertMenuItemCosting y es para crear o actualizar el costeo de un plato-//
export class UpsertMenuItemCosting {
  constructor(
    private readonly costingRepository: MenuItemCostingRepository
  ) {}

  //-aqui empieza funcion execute y es para ejecutar el upsert del costing-//
  /**
   * Valida las reglas de negocio a través de la entidad MenuItemCosting
   * y persiste el resultado.
   * @sideEffect persiste en base de datos
   */
  async execute(
    input: UpsertMenuItemCostingInput
  ): Promise<UpsertMenuItemCostingOutput> {
    // La validación de negocio ocurre dentro de la entidad
    // (precio público > 0, precio público >= costo, área válida, etc.)
    MenuItemCosting.create("_validation_only_", input);

    const costing = await this.costingRepository.upsert(input);

    return { costing };
  }
  //-aqui termina funcion execute-//
}
//-aqui termina clase UpsertMenuItemCosting-//
