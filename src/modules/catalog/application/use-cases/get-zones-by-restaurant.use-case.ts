/**
 * Archivo: get-zones-by-restaurant.use-case.ts
 * Responsabilidad: Obtener todas las zonas de un restaurante ordenadas por sortOrder.
 * Tipo: lógica
 */

import { type ZoneRepository } from "../ports/zone-repository.port";
import { type RestaurantZonePrimitives } from "../../domain/entities/restaurant-zone.entity";

interface GetZonesByRestaurantInput {
  restaurantId: string;
}

//-aqui empieza caso de uso GetZonesByRestaurant y es para listar las zonas del restaurante-//
/**
 * Obtiene las zonas de un restaurante, exponiéndolas como primitivas para la UI.
 * @sideEffect
 */
export class GetZonesByRestaurant {
  constructor(private readonly zoneRepository: ZoneRepository) {}

  async execute(input: GetZonesByRestaurantInput): Promise<RestaurantZonePrimitives[]> {
    const { restaurantId } = input;

    if (restaurantId.trim().length === 0) {
      return [];
    }

    const zones = await this.zoneRepository.findByRestaurantId(restaurantId);

    return zones.map((zone) => zone.toPrimitives());
  }
}
//-aqui termina caso de uso GetZonesByRestaurant-//
