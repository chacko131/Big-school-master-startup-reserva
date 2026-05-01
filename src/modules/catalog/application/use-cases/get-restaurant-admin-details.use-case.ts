/**
 * Archivo: get-restaurant-admin-details.use-case.ts
 * Responsabilidad: Obtener la ficha completa de un restaurante para el panel de administración (agregando varias entidades).
 * Tipo: lógica
 */

import { RestaurantNotFoundError } from "../errors/restaurant-not-found.error";
import { type RestaurantRepository } from "../ports/restaurant-repository.port";
import { type RestaurantSettingsRepository } from "../ports/restaurant-settings-repository.port";
import { type DiningTableRepository } from "../ports/dining-table-repository.port";

export interface RestaurantAdminDetailsResponse {
  id: string;
  name: string;
  slug: string;
  timezone: string;
  email: string | null;
  phone: string | null;
  isActive: boolean;
  cancellationWindowHours: number | null;
  services: string[];
  reservationApprovalMode: string | null;
  waitlistMode: string | null;
  activeTablesCount: number;
}

//-aqui empieza funcion GetRestaurantAdminDetailsUseCase y es para traer todos los datos operativos de un restaurante-//
/**
 * Recupera el contexto operativo completo de un tenant usando su slug.
 * @sideEffect
 */
export class GetRestaurantAdminDetailsUseCase {
  constructor(
    private readonly restaurantRepository: RestaurantRepository,
    private readonly settingsRepository: RestaurantSettingsRepository,
    private readonly diningTableRepository: DiningTableRepository
  ) {}

  async execute(slug: string): Promise<RestaurantAdminDetailsResponse> {
    const restaurant = await this.restaurantRepository.findBySlug(slug);

    if (restaurant === null) {
      throw new RestaurantNotFoundError(slug);
    }

    const settings = await this.settingsRepository.findByRestaurantId(restaurant.id);
    const tables = await this.diningTableRepository.findByRestaurantId(restaurant.id);

    return {
      id: restaurant.id,
      name: restaurant.name,
      slug: restaurant.slug,
      timezone: restaurant.timezone,
      email: restaurant.email,
      phone: restaurant.phone,
      isActive: restaurant.isActive,
      cancellationWindowHours: settings?.cancellationWindowHours ?? null,
      services: [], // TODO: Agregar a RestaurantSettings cuando el dominio evolucione
      reservationApprovalMode: settings?.reservationApprovalMode ?? null,
      waitlistMode: settings?.waitlistMode ?? null,
      activeTablesCount: tables.length,
    };
  }
}
//-aqui termina funcion GetRestaurantAdminDetailsUseCase-//
