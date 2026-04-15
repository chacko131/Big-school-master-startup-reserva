/**
 * Archivo: update-restaurant-settings.use-case.test.ts
 * Responsabilidad: Validar el comportamiento del caso de uso UpdateRestaurantSettings.
 * Tipo: lógica
 */

import { describe, expect, it } from "vitest";
import { RestaurantSettings } from "../../domain/entities/restaurant-settings.entity";
import { RestaurantSettingsNotFoundError } from "../errors/restaurant-settings-not-found.error";
import { RestaurantSettingsRepository } from "../ports/restaurant-settings-repository.port";
import { UpdateRestaurantSettings } from "./update-restaurant-settings.use-case";

class InMemoryRestaurantSettingsRepository implements RestaurantSettingsRepository {
  public savedRestaurantSettings: RestaurantSettings | null = null;

  constructor(private readonly restaurantSettings: RestaurantSettings | null) {}

  //-aqui empieza funcion findByRestaurantId y es para resolver la configuracion durante la prueba-//
  /**
   * Busca la configuración operativa del restaurante en memoria.
   * @pure
   */
  async findByRestaurantId(): Promise<RestaurantSettings | null> {
    return this.restaurantSettings;
  }
  //-aqui termina funcion findByRestaurantId y se va autilizar solo en tests-//

  //-aqui empieza funcion save y es para persistir en memoria la configuracion actualizada-//
  /**
   * Guarda en memoria la configuración operativa actualizada.
   * @pure
   */
  async save(restaurantSettings: RestaurantSettings): Promise<RestaurantSettings> {
    this.savedRestaurantSettings = restaurantSettings;

    return restaurantSettings;
  }
  //-aqui termina funcion save y se va autilizar solo en tests-//
}

describe("UpdateRestaurantSettings", () => {
  it("updates and persists restaurant settings", async () => {
    const restaurantSettings = RestaurantSettings.create({
      id: "settings_1",
      restaurantId: "rest_1",
    });
    const repository = new InMemoryRestaurantSettingsRepository(restaurantSettings);
    const useCase = new UpdateRestaurantSettings(repository);

    const updatedRestaurantSettings = await useCase.execute({
      restaurantId: "rest_1",
      reservationApprovalMode: "MANUAL",
      reservationBufferMinutes: 30,
      enableAutoTableAssignment: false,
    });

    expect(updatedRestaurantSettings.reservationApprovalMode).toBe("MANUAL");
    expect(updatedRestaurantSettings.toPrimitives().reservationBufferMinutes).toBe(30);
    expect(updatedRestaurantSettings.toPrimitives().enableAutoTableAssignment).toBe(false);
    expect(repository.savedRestaurantSettings).toBe(updatedRestaurantSettings);
  });

  it("throws when restaurant settings do not exist", async () => {
    const repository = new InMemoryRestaurantSettingsRepository(null);
    const useCase = new UpdateRestaurantSettings(repository);

    await expect(
      useCase.execute({
        restaurantId: "missing_restaurant",
        reservationApprovalMode: "MANUAL",
      }),
    ).rejects.toThrow(RestaurantSettingsNotFoundError);
  });
});
