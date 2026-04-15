/**
 * Archivo: prisma-restaurant-settings.repository.ts
 * Responsabilidad: Implementar el puerto RestaurantSettingsRepository usando Prisma.
 * Tipo: servicio
 */

import { type RestaurantSettings as PrismaRestaurantSettingsRecord, PrismaClient } from "@/generated/prisma/client";
import {
  RestaurantSettings,
  type RestaurantSettingsPrimitives,
} from "../../domain/entities/restaurant-settings.entity";
import { type RestaurantSettingsRepository } from "../../application/ports/restaurant-settings-repository.port";

export class PrismaRestaurantSettingsRepository implements RestaurantSettingsRepository {
  constructor(private readonly prismaClient: PrismaClient) {}

  //-aqui empieza funcion findByRestaurantId y es para buscar la configuracion operativa por restaurante-//
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
  //-aqui termina funcion findByRestaurantId y se va autilizar en casos de uso de catalogo-//

  //-aqui empieza funcion save y es para persistir la configuracion operativa usando Prisma-//
  /**
   * Guarda la configuración operativa en la base de datos mediante upsert.
   * @sideEffect
   */
  async save(restaurantSettings: RestaurantSettings): Promise<RestaurantSettings> {
    const restaurantSettingsPrimitives = restaurantSettings.toPrimitives();

    const persistedRestaurantSettings = await this.prismaClient.restaurantSettings.upsert({
      where: { id: restaurantSettingsPrimitives.id },
      create: restaurantSettingsPrimitives,
      update: {
        restaurantId: restaurantSettingsPrimitives.restaurantId,
        reservationApprovalMode: restaurantSettingsPrimitives.reservationApprovalMode,
        waitlistMode: restaurantSettingsPrimitives.waitlistMode,
        defaultReservationDurationMinutes: restaurantSettingsPrimitives.defaultReservationDurationMinutes,
        reservationBufferMinutes: restaurantSettingsPrimitives.reservationBufferMinutes,
        cancellationWindowHours: restaurantSettingsPrimitives.cancellationWindowHours,
        allowTableCombination: restaurantSettingsPrimitives.allowTableCombination,
        enableAutoTableAssignment: restaurantSettingsPrimitives.enableAutoTableAssignment,
        version: restaurantSettingsPrimitives.version,
        createdAt: restaurantSettingsPrimitives.createdAt,
        updatedAt: restaurantSettingsPrimitives.updatedAt,
      },
    });

    return mapRestaurantSettingsRecordToEntity(persistedRestaurantSettings);
  }
  //-aqui termina funcion save y se va autilizar en application-//
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
