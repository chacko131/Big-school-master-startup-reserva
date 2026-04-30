/**
 * Archivo: ensure-default-zone.use-case.ts
 * Responsabilidad: Garantizar que un restaurante tenga al menos una zona por defecto ("Salón principal").
 *                  Si ya existe alguna zona, no hace nada. Si no hay zonas, crea la zona por defecto
 *                  y asigna todas las mesas huérfanas (sin zona) a ella con una sola query.
 * Tipo: lógica
 */

import { type ZoneRepository } from "../ports/zone-repository.port";
import { type DiningTableRepository } from "../ports/dining-table-repository.port";
import { RestaurantZone } from "../../domain/entities/restaurant-zone.entity";

interface EnsureDefaultZoneInput {
  restaurantId: string;
}

interface EnsureDefaultZoneOutput {
  /** true si se creó la zona por defecto, false si ya existía al menos una zona */
  zoneCreated: boolean;
}

const DEFAULT_ZONE_NAME = "Salón principal";
const DEFAULT_ZONE_COLOR = "#6366f1";

//-aqui empieza caso de uso EnsureDefaultZone y es para garantizar que el restaurante tenga zona-//
/**
 * Crea la zona por defecto si el restaurante no tiene ninguna y migra mesas huérfanas.
 * Es idempotente: si ya existen zonas, no modifica nada.
 * @sideEffect
 */
export class EnsureDefaultZone {
  constructor(
    private readonly zoneRepository: ZoneRepository,
    private readonly diningTableRepository: DiningTableRepository,
  ) {}

  async execute(input: EnsureDefaultZoneInput): Promise<EnsureDefaultZoneOutput> {
    const { restaurantId } = input;

    // 1. Verificar si ya existe alguna zona — si sí, no hacer nada (idempotente)
    const existingZones = await this.zoneRepository.findByRestaurantId(restaurantId);

    if (existingZones.length > 0) {
      return { zoneCreated: false };
    }

    // 2. No hay zonas → crear la zona "Salón principal"
    const defaultZone = RestaurantZone.create({
      id: crypto.randomUUID(),
      restaurantId,
      name: DEFAULT_ZONE_NAME,
      color: DEFAULT_ZONE_COLOR,
      sortOrder: 0,
    });

    const savedZone = await this.zoneRepository.save(defaultZone);

    // 3. Migrar todas las mesas huérfanas (zoneId = null) a la nueva zona con una sola query
    await this.diningTableRepository.assignZoneToOrphanTables(restaurantId, savedZone.id);

    return { zoneCreated: true };
  }
}
//-aqui termina caso de uso EnsureDefaultZone-//
