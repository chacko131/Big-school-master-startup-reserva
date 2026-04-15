/**
 * Archivo: add-dining-table.use-case.test.ts
 * Responsabilidad: Validar el comportamiento del caso de uso AddDiningTable.
 * Tipo: lógica
 */

import { describe, expect, it } from "vitest";
import { DiningTable } from "../../domain/entities/dining-table.entity";
import { Restaurant } from "../../domain/entities/restaurant.entity";
import { RestaurantNotFoundError } from "../errors/restaurant-not-found.error";
import { DiningTableRepository } from "../ports/dining-table-repository.port";
import { RestaurantRepository } from "../ports/restaurant-repository.port";
import { AddDiningTable } from "./add-dining-table.use-case";

class InMemoryRestaurantRepository implements RestaurantRepository {
  constructor(private readonly restaurant: Restaurant | null) {}

  //-aqui empieza funcion findById y es para resolver el restaurante durante la prueba-//
  /**
   * Busca un restaurante en memoria para la prueba actual.
   * @pure
   */
  async findById(): Promise<Restaurant | null> {
    return this.restaurant;
  }
  //-aqui termina funcion findById y se va autilizar solo en tests-//

  //-aqui empieza funcion save y es para cumplir el contrato del puerto en pruebas-//
  /**
   * Devuelve la entidad recibida porque este test no valida la persistencia del restaurante.
   * @pure
   */
  async save(restaurant: Restaurant): Promise<Restaurant> {
    return restaurant;
  }
  //-aqui termina funcion save y se va autilizar solo en tests-//
}

class InMemoryDiningTableRepository implements DiningTableRepository {
  public savedDiningTable: DiningTable | null = null;

  //-aqui empieza funcion findById y es para cumplir el contrato del puerto en pruebas-//
  /**
   * Devuelve null porque este test solo valida el alta de la mesa.
   * @pure
   */
  async findById(): Promise<DiningTable | null> {
    return null;
  }
  //-aqui termina funcion findById y se va autilizar solo en tests-//

  //-aqui empieza funcion save y es para persistir en memoria la mesa creada-//
  /**
   * Guarda en memoria la mesa creada durante la prueba.
   * @pure
   */
  async save(diningTable: DiningTable): Promise<DiningTable> {
    this.savedDiningTable = diningTable;

    return diningTable;
  }
  //-aqui termina funcion save y se va autilizar solo en tests-//
}

describe("AddDiningTable", () => {
  it("creates and persists a dining table for an existing restaurant", async () => {
    const restaurant = Restaurant.create({
      id: "rest_1",
      name: "Reserva Latina",
      slug: "reserva-latina",
    });
    const restaurantRepository = new InMemoryRestaurantRepository(restaurant);
    const diningTableRepository = new InMemoryDiningTableRepository();
    const useCase = new AddDiningTable(restaurantRepository, diningTableRepository);

    const diningTable = await useCase.execute({
      id: "table_1",
      restaurantId: "rest_1",
      name: "Mesa 1",
      capacity: 6,
      isCombinable: true,
    });

    expect(diningTable.restaurantId).toBe("rest_1");
    expect(diningTable.capacity).toBe(6);
    expect(diningTableRepository.savedDiningTable).toBe(diningTable);
  });

  it("throws when restaurant does not exist", async () => {
    const restaurantRepository = new InMemoryRestaurantRepository(null);
    const diningTableRepository = new InMemoryDiningTableRepository();
    const useCase = new AddDiningTable(restaurantRepository, diningTableRepository);

    await expect(
      useCase.execute({
        id: "table_1",
        restaurantId: "missing_restaurant",
        name: "Mesa 1",
      }),
    ).rejects.toThrow(RestaurantNotFoundError);
  });
});
