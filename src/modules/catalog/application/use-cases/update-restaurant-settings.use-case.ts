/**
 * Archivo: update-restaurant-settings.use-case.ts
 * Responsabilidad: Orquestar la actualización de la configuración operativa de un restaurante.
 * Tipo: lógica
 */

import { RestaurantSettings } from "../../domain/entities/restaurant-settings.entity";
import { RestaurantSettingsNotFoundError } from "../errors/restaurant-settings-not-found.error";
import { UpdateRestaurantSettingsDto } from "../dtos/update-restaurant-settings.dto";
import { RestaurantSettingsRepository } from "../ports/restaurant-settings-repository.port";

export class UpdateRestaurantSettings {
  constructor(private readonly restaurantSettingsRepository: RestaurantSettingsRepository) {}

  //-aqui empieza funcion execute y es para actualizar y guardar la configuracion operativa-//
  /**
   * Ejecuta el caso de uso de actualización de configuración operativa.
   * @pure
   */
  async execute(input: UpdateRestaurantSettingsDto): Promise<RestaurantSettings> {
    const restaurantSettings = await this.restaurantSettingsRepository.findByRestaurantId(input.restaurantId);

    if (restaurantSettings === null) {
      throw new RestaurantSettingsNotFoundError(input.restaurantId);
    }

    const updatedRestaurantSettings = restaurantSettings.update({
      reservationApprovalMode: input.reservationApprovalMode,
      waitlistMode: input.waitlistMode,
      defaultReservationDurationMinutes: input.defaultReservationDurationMinutes,
      reservationBufferMinutes: input.reservationBufferMinutes,
      cancellationWindowHours: input.cancellationWindowHours,
      allowTableCombination: input.allowTableCombination,
      enableAutoTableAssignment: input.enableAutoTableAssignment,
    });

    return this.restaurantSettingsRepository.save(updatedRestaurantSettings);
  }
  //-aqui termina funcion execute y se va autilizar en application y controllers-//
}
