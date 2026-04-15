/**
 * Archivo: prisma-restaurant-settings.repository.ts
 * Responsabilidad: Implementar el puerto de consulta de configuración operativa para reservas usando Prisma.
 * Tipo: servicio
 */

import { type PrismaClient, type RestaurantSettings as PrismaRestaurantSettingsRecord } from "@/generated/prisma/client";
import {
  RestaurantSettings,
  type RestaurantSettingsPrimitives,
} from "@/modules/catalog/domain/entities/restaurant-settings.entity";
import { type RestaurantSettingsRepository } from "../../application/ports/restaurant-settings-repository.port";

export class PrismaRestaurantSettingsRepository implements RestaurantSettingsRepository {
  constructor(private readonly prismaClient: PrismaClient) {}

  //-aqui empieza funcion findByRestaurantId y es para consultar la configuracion operativa de un restaurante-//
  /**
   * Busca la configuración operativa persistida por identificador de restaurante.
   * @sideEffect
   */
  async findByRestaurantId(restaurantId: string): Promise<RestaurantSettings | null> {
    const restaurantSettingsRecord = await this.prismaClient.restaurantSettings.findUnique({
      where: { restaurantId },
    });

    if (restaurantSettingsRecord === null) {
      return null;
    }

    return mapRestaurantSettingsRecordToEntity(restaurantSettingsRecord);
  }
  //-aqui termina funcion findByRestaurantId y se va autilizar en casos de uso de reservas-//
}

//-aqui empieza funcion mapRestaurantSettingsRecordToEntity y es para rehidratar la entidad RestaurantSettings-//
/**
 * Convierte un registro Prisma en una entidad de dominio RestaurantSettings.
 * @pure
 */
function mapRestaurantSettingsRecordToEntity(
  restaurantSettingsRecord: PrismaRestaurantSettingsRecord,
): RestaurantSettings {
  const restaurantSettingsPrimitives: RestaurantSettingsPrimitives = {
    id: restaurantSettingsRecord.id,
    restaurantId: restaurantSettingsRecord.restaurantId,
    reservationApprovalMode: restaurantSettingsRecord.reservationApprovalMode,
    waitlistMode: restaurantSettingsRecord.waitlistMode,
    defaultReservationDurationMinutes: restaurantSettingsRecord.defaultReservationDurationMinutes,
    reservationBufferMinutes: restaurantSettingsRecord.reservationBufferMinutes,
    cancellationWindowHours: restaurantSettingsRecord.cancellationWindowHours,
    allowTableCombination: restaurantSettingsRecord.allowTableCombination,
    enableAutoTableAssignment: restaurantSettingsRecord.enableAutoTableAssignment,
    version: restaurantSettingsRecord.version,
    createdAt: restaurantSettingsRecord.createdAt,
    updatedAt: restaurantSettingsRecord.updatedAt,
  };

  return RestaurantSettings.fromPrimitives(restaurantSettingsPrimitives);
}
//-aqui termina funcion mapRestaurantSettingsRecordToEntity y se va autilizar en infrastructure-//
