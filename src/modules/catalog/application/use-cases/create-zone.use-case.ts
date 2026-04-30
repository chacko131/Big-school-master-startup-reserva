/**
 * Archivo: create-zone.use-case.ts
 * Responsabilidad: Crear una nueva zona de restaurante con validación de dominio.
 * Tipo: lógica
 */

import { type ZoneRepository } from "../ports/zone-repository.port";
import { RestaurantZone, type RestaurantZonePrimitives } from "../../domain/entities/restaurant-zone.entity";

interface CreateZoneInput {
  restaurantId: string;
  name: string;
  color?: string;
  sortOrder?: number;
}

//-aqui empieza caso de uso CreateZone y es para crear una zona nueva de restaurante-//
/**
 * Crea una nueva zona aplicando las reglas del dominio y la persiste.
 * @sideEffect
 */
export class CreateZone {
  constructor(private readonly zoneRepository: ZoneRepository) {}

  async execute(input: CreateZoneInput): Promise<RestaurantZonePrimitives> {
    const zone = RestaurantZone.create({
      id: crypto.randomUUID(),
      restaurantId: input.restaurantId,
      name: input.name,
      color: input.color,
      sortOrder: input.sortOrder ?? 0,
    });

    const saved = await this.zoneRepository.save(zone);

    return saved.toPrimitives();
  }
}
//-aqui termina caso de uso CreateZone-//
