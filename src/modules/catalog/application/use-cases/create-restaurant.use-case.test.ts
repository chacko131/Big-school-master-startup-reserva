/**
 * Archivo: create-restaurant.use-case.test.ts
 * Responsabilidad: Validar el comportamiento del caso de uso CreateRestaurant.
 * Tipo: lógica
 */

import { describe, expect, it } from "vitest";
import { Restaurant } from "../../domain/entities/restaurant.entity";
import { RestaurantRepository } from "../ports/restaurant-repository.port";
import { CreateRestaurant } from "./create-restaurant.use-case";

class InMemoryRestaurantRepository implements RestaurantRepository {
  public savedRestaurant: Restaurant | null = null;

  //-aqui empieza funcion findById y es para cumplir el contrato del puerto en pruebas-//
  /**
   * Devuelve null porque este test solo valida el flujo de creación.
   * @pure
   */
  async findById(): Promise<Restaurant | null> {
    return null;
  }
  //-aqui termina funcion findById y se va autilizar solo en tests-//

  async findBySlug(): Promise<Restaurant | null> {
    return null;
  }

  async findAll(): Promise<Restaurant[]> {
    return [];
  }

  //-aqui empieza funcion save y es para persistir en memoria durante la prueba-//
  /**
   * Guarda en memoria el restaurante creado durante la prueba.
   * @pure
   */
  async save(restaurant: Restaurant): Promise<Restaurant> {
    this.savedRestaurant = restaurant;

    return restaurant;
  }
  //-aqui termina funcion save y se va autilizar solo en tests-//
}

describe("CreateRestaurant", () => {
  it("creates and persists a restaurant", async () => {
    const repository = new InMemoryRestaurantRepository();
    const useCase = new CreateRestaurant(repository);

    const restaurant = await useCase.execute({
      id: "rest_1",
      name: "Reserva Latina",
      slug: "Reserva Latina",
    });

    expect(restaurant.id).toBe("rest_1");
    expect(restaurant.slug).toBe("reserva latina");
    expect(repository.savedRestaurant).toBe(restaurant);
  });

  it("propagates domain validation errors", async () => {
    const repository = new InMemoryRestaurantRepository();
    const useCase = new CreateRestaurant(repository);

    await expect(
      useCase.execute({
        id: "rest_1",
        name: "   ",
        slug: "reserva-latina",
      }),
    ).rejects.toThrow();
  });
});
