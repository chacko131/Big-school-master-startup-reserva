/**
 * Archivo: prisma-guest.repository.ts
 * Responsabilidad: Implementar el puerto GuestRepository usando Prisma.
 * Tipo: servicio
 */

import { type Guest as PrismaGuestRecord, type PrismaClient } from "@/generated/prisma/client";
import { Guest, type GuestPrimitives } from "../../domain/entities/guest.entity";
import { type GuestRepository } from "../../application/ports/guest-repository.port";

export class PrismaGuestRepository implements GuestRepository {
  constructor(private readonly prismaClient: PrismaClient) {}

  //-aqui empieza funcion findById y es para buscar un huesped persistido por id-//
  /**
   * Busca un huésped persistido por su identificador.
   * @sideEffect
   */
  async findById(id: string): Promise<Guest | null> {
    const guestRecord = await this.prismaClient.guest.findUnique({
      where: { id },
    });

    if (guestRecord === null) {
      return null;
    }

    return mapGuestRecordToEntity(guestRecord);
  }
  //-aqui termina funcion findById y se va autilizar en casos de uso de reservas-//

  //-aqui empieza funcion findByRestaurantAndPhone y es para buscar un huesped por restaurante+telefono-//
  /**
   * Busca un huésped por su restaurante y teléfono (constraint unique en Prisma).
   * @sideEffect
   */
  async findByRestaurantAndPhone(restaurantId: string, phone: string): Promise<Guest | null> {
    const guestRecord = await this.prismaClient.guest.findUnique({
      where: {
        restaurantId_phone: { restaurantId, phone },
      },
    });

    if (guestRecord === null) {
      return null;
    }

    return mapGuestRecordToEntity(guestRecord);
  }
  //-aqui termina funcion findByRestaurantAndPhone y se va autilizar en CreateReservationFull-//

  //-aqui empieza funcion save y es para persistir un huesped usando Prisma-//
  /**
   * Guarda un huésped en la base de datos mediante upsert.
   * @sideEffect
   */
  async save(guest: Guest): Promise<Guest> {
    const guestPrimitives = guest.toPrimitives();

    const persistedGuest = await this.prismaClient.guest.upsert({
      where: { id: guestPrimitives.id },
      create: guestPrimitives,
      update: {
        restaurantId: guestPrimitives.restaurantId,
        fullName: guestPrimitives.fullName,
        phone: guestPrimitives.phone,
        email: guestPrimitives.email,
        notes: guestPrimitives.notes,
        noShowCount: guestPrimitives.noShowCount,
        version: guestPrimitives.version,
        createdAt: guestPrimitives.createdAt,
        updatedAt: guestPrimitives.updatedAt,
      },
    });

    return mapGuestRecordToEntity(persistedGuest);
  }
  //-aqui termina funcion save y se va autilizar en application-//

  //-aqui empieza funcion findGuestsWithReservations y es para buscar huespedes con su historial de reservas-//
  /**
   * Obtiene todos los huéspedes de un restaurante (opcionalmente filtrados por búsqueda parcial)
   * junto con el estado y fecha de inicio de todas sus reservas.
   * @sideEffect
   */
  async findGuestsWithReservations(
    restaurantId: string,
    query?: string
  ): Promise<Array<{ guest: Guest; reservations: Array<{ status: string; startAt: Date; specialRequests: string | null }> }>> {
    const cleanQuery = query?.trim();

    const guestRecords = await this.prismaClient.guest.findMany({
      where: {
        restaurantId,
        ...(cleanQuery ? {
          OR: [
            { fullName: { contains: cleanQuery, mode: "insensitive" } },
            { phone: { contains: cleanQuery, mode: "insensitive" } },
            { email: { contains: cleanQuery, mode: "insensitive" } },
          ],
        } : {}),
      },
      include: {
        reservations: {
          select: {
            status: true,
            startAt: true,
            specialRequests: true,
          },
          orderBy: {
            startAt: "desc",
          },
        },
      },
      orderBy: {
        fullName: "asc",
      },
    });

    return guestRecords.map((record) => ({
      guest: mapGuestRecordToEntity(record),
      reservations: record.reservations,
    }));
  }
  //-aqui termina funcion findGuestsWithReservations y se va autilizar en casos de uso de CRM-//
}

//-aqui empieza funcion mapGuestRecordToEntity y es para rehidratar la entidad Guest-//
/**
 * Convierte un registro Prisma en una entidad de dominio Guest.
 * @pure
 */
function mapGuestRecordToEntity(guestRecord: PrismaGuestRecord): Guest {
  const guestPrimitives: GuestPrimitives = {
    id: guestRecord.id,
    restaurantId: guestRecord.restaurantId,
    fullName: guestRecord.fullName,
    phone: guestRecord.phone,
    email: guestRecord.email,
    notes: guestRecord.notes,
    noShowCount: guestRecord.noShowCount,
    version: guestRecord.version,
    createdAt: guestRecord.createdAt,
    updatedAt: guestRecord.updatedAt,
  };

  return Guest.fromPrimitives(guestPrimitives);
}
//-aqui termina funcion mapGuestRecordToEntity y se va autilizar en infrastructure-//
