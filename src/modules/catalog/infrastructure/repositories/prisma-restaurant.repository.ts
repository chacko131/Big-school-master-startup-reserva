/**
 * Archivo: prisma-restaurant.repository.ts
 * Responsabilidad: Implementar el puerto RestaurantRepository usando Prisma.
 * Tipo: servicio
 */

import { type Restaurant as PrismaRestaurantRecord, PrismaClient } from "@/generated/prisma/client";
import { Restaurant, type RestaurantPrimitives } from "../../domain/entities/restaurant.entity";
import { type RestaurantRepository } from "../../application/ports/restaurant-repository.port";

export class PrismaRestaurantRepository implements RestaurantRepository {
  constructor(private readonly prismaClient: PrismaClient) {}

  //-aqui empieza funcion findById y es para buscar un restaurante persistido por id-//
  /**
   * Busca un restaurante persistido por su identificador.
   * @sideEffect
   */
  async findById(id: string): Promise<Restaurant | null> {
    const restaurantRecord = await this.prismaClient.restaurant.findUnique({
      where: { id },
    });

    if (restaurantRecord === null) {
      return null;
    }

    return mapRestaurantRecordToEntity(restaurantRecord);
  }
  //-aqui termina funcion findById y se va autilizar en casos de uso de catalogo-//

  //-aqui empieza funcion findAll y es para listar todos los restaurantes-//
  /**
   * Obtiene todos los restaurantes.
   * @sideEffect
   */
  async findAll(): Promise<Restaurant[]> {
    const records = await this.prismaClient.restaurant.findMany({
      orderBy: { createdAt: "desc" },
    });

    return records.map(mapRestaurantRecordToEntity);
  }
  //-aqui termina funcion findAll y se va autilizar en el admin-//

  //-aqui empieza funcion save y es para persistir un restaurante usando Prisma-//
  /**
   * Guarda un restaurante en la base de datos mediante upsert.
   * @sideEffect
   */
  async save(restaurant: Restaurant): Promise<Restaurant> {
    const restaurantPrimitives = restaurant.toPrimitives();

    const persistedRestaurant = await this.prismaClient.restaurant.upsert({
      where: { id: restaurantPrimitives.id },
      create: restaurantPrimitives,
      update: {
        name: restaurantPrimitives.name,
        slug: restaurantPrimitives.slug,
        timezone: restaurantPrimitives.timezone,
        phone: restaurantPrimitives.phone,
        email: restaurantPrimitives.email,
        isActive: restaurantPrimitives.isActive,
        version: restaurantPrimitives.version,
        createdAt: restaurantPrimitives.createdAt,
        updatedAt: restaurantPrimitives.updatedAt,
      },
    });

    return mapRestaurantRecordToEntity(persistedRestaurant);
  }
  //-aqui termina funcion save y se va autilizar en application-//
}

//-aqui empieza funcion mapRestaurantRecordToEntity y es para rehidratar la entidad Restaurant-//
/**
 * Convierte un registro Prisma en una entidad de dominio Restaurant.
 * @pure
 */
function mapRestaurantRecordToEntity(restaurantRecord: PrismaRestaurantRecord): Restaurant {
  const restaurantPrimitives: RestaurantPrimitives = {
    id: restaurantRecord.id,
    name: restaurantRecord.name,
    slug: restaurantRecord.slug,
    timezone: restaurantRecord.timezone,
    phone: restaurantRecord.phone,
    email: restaurantRecord.email,
    isActive: restaurantRecord.isActive,
    version: restaurantRecord.version,
    createdAt: restaurantRecord.createdAt,
    updatedAt: restaurantRecord.updatedAt,
  };

  return Restaurant.fromPrimitives(restaurantPrimitives);
}
//-aqui termina funcion mapRestaurantRecordToEntity y se va autilizar en infrastructure-//
