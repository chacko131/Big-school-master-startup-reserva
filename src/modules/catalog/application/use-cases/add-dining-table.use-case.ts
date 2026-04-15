/**
 * Archivo: add-dining-table.use-case.ts
 * Responsabilidad: Orquestar el alta de una mesa validando que el restaurante exista.
 * Tipo: lógica
 */

import { DiningTable } from "../../domain/entities/dining-table.entity";
import { RestaurantNotFoundError } from "../errors/restaurant-not-found.error";
import { AddDiningTableDto } from "../dtos/add-dining-table.dto";
import { DiningTableRepository } from "../ports/dining-table-repository.port";
import { RestaurantRepository } from "../ports/restaurant-repository.port";

export class AddDiningTable {
  constructor(
    private readonly restaurantRepository: RestaurantRepository,
    private readonly diningTableRepository: DiningTableRepository,
  ) {}

  //-aqui empieza funcion execute y es para crear y guardar una mesa del catalogo-//
  /**
   * Ejecuta el caso de uso de alta de mesa para un restaurante existente.
   * @pure
   */
  async execute(input: AddDiningTableDto): Promise<DiningTable> {
    const restaurantExists = await this.restaurantRepository.findById(input.restaurantId);

    if (restaurantExists === null) {
      throw new RestaurantNotFoundError(input.restaurantId);
    }

    const diningTable = DiningTable.create({
      id: input.id,
      restaurantId: input.restaurantId,
      name: input.name,
      capacity: input.capacity,
      isActive: input.isActive,
      isCombinable: input.isCombinable,
      sortOrder: input.sortOrder,
    });

    return this.diningTableRepository.save(diningTable);
  }
  //-aqui termina funcion execute y se va autilizar en application y controllers-//
}
