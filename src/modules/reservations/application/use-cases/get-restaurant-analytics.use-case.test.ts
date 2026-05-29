/**
 * Archivo: get-restaurant-analytics.use-case.test.ts
 * Responsabilidad: Validar la agregación y cálculo de analíticas operativas y de clientes del restaurante.
 * Tipo: lógica
 */

import { describe, expect, it } from "vitest";
import { Reservation } from "../../domain/entities/reservation.entity";
import { DiningTable } from "@/modules/catalog/domain/entities/dining-table.entity";
import { RestaurantZone } from "@/modules/catalog/domain/entities/restaurant-zone.entity";
import { type ReservationRepository } from "../ports/reservation-repository.port";
import { type ReservationTableRepository } from "../ports/reservation-table-repository.port";
import { type DiningTableRepository } from "../ports/dining-table-repository.port";
import { type ZoneRepository } from "@/modules/catalog/application/ports/zone-repository.port";
import { GetRestaurantAnalytics } from "./get-restaurant-analytics.use-case";

class InMemoryReservationRepository implements ReservationRepository {
  constructor(private readonly records: Reservation[] = []) {}

  async findById(_id: string): Promise<Reservation | null> {
    return null;
  }

  async findByRestaurantAndDateRange(
    _restaurantId: string,
    _from: Date,
    _to: Date,
    _includeAllStatuses?: boolean
  ): Promise<Reservation[]> {
    return this.records;
  }

  async findActiveByGuestAndDateRange(
    _guestId: string,
    _restaurantId: string,
    _from: Date,
    _to: Date
  ): Promise<Reservation[]> {
    return [];
  }

  async findByGuestId(_guestId: string): Promise<Reservation[]> {
    return [];
  }

  async save(reservation: Reservation): Promise<Reservation> {
    return reservation;
  }

  async delete(_id: string): Promise<void> {}
}

import { ReservationTable } from "../../domain/entities/reservation-table.entity";

class InMemoryReservationTableRepository implements ReservationTableRepository {
  constructor(private readonly records: Array<{ reservationId: string; tableId: string }> = []) {}

  async findOccupiedTableIds(_restaurantId: string, _from: Date, _to: Date): Promise<string[]> {
    return [];
  }

  async findByDateRange(
    _restaurantId: string,
    _from: Date,
    _to: Date
  ): Promise<Array<{ reservationId: string; tableId: string }>> {
    return this.records;
  }

  async save(reservationTable: ReservationTable): Promise<ReservationTable> {
    return reservationTable;
  }
}

class InMemoryDiningTableRepository implements DiningTableRepository {
  constructor(private readonly records: DiningTable[] = []) {}

  async findActiveByRestaurantId(_restaurantId: string): Promise<DiningTable[]> {
    return this.records;
  }
}

class InMemoryZoneRepository implements ZoneRepository {
  constructor(private readonly records: RestaurantZone[] = []) {}

  async findByRestaurantId(_restaurantId: string): Promise<RestaurantZone[]> {
    return this.records;
  }

  async findById(_id: string): Promise<RestaurantZone | null> {
    return null;
  }

  async save(zone: RestaurantZone): Promise<RestaurantZone> {
    return zone;
  }

  async delete(_id: string): Promise<void> {}
}

describe("GetRestaurantAnalytics", () => {
  it("calcula KPIs basicos y tasas con datos vacios correctamente", async () => {
    const resRepo = new InMemoryReservationRepository([]);
    const resTabRepo = new InMemoryReservationTableRepository([]);
    const tableRepo = new InMemoryDiningTableRepository([]);
    const zoneRepo = new InMemoryZoneRepository([]);

    const useCase = new GetRestaurantAnalytics(resRepo, resTabRepo, tableRepo, zoneRepo);
    const result = await useCase.execute({ restaurantId: "rest_1" });

    expect(result.summary.totalReservations).toBe(0);
    expect(result.summary.totalCovers).toBe(0);
    expect(result.summary.noShowRate).toBe(0);
    expect(result.summary.cancellationRate).toBe(0);
    expect(result.summary.averagePartySize).toBe(0);
    expect(result.summary.averageLeadTimeDays).toBe(0);
    expect(result.guestsRecurrence.repeatRate).toBe(0);
    expect(result.byZone).toHaveLength(0);
  });

  it("calcula KPIs y agrupaciones con datos reales de reservas", async () => {
    // Viernes 2026-05-29 (startAt) creada el Miércoles 2026-05-27 (leadTime: 2 días)
    const res1 = Reservation.create({
      id: "res_1",
      restaurantId: "rest_1",
      guestId: "guest_1",
      partySize: 4,
      startAt: new Date("2026-05-29T20:00:00Z"),
      endAt: new Date("2026-05-29T21:30:00Z"),
      status: "COMPLETED",
      createdAt: new Date("2026-05-27T20:00:00Z"),
    });

    // Viernes 2026-05-29 (startAt) creada el Miércoles 2026-05-27
    const res2 = Reservation.create({
      id: "res_2",
      restaurantId: "rest_1",
      guestId: "guest_1", // mismo guest para probar recurrencia
      partySize: 2,
      startAt: new Date("2026-05-29T21:00:00Z"),
      endAt: new Date("2026-05-29T22:30:00Z"),
      status: "CHECKED_IN",
      createdAt: new Date("2026-05-27T21:00:00Z"),
    });

    // Sábado 2026-05-30
    const resNoShow = Reservation.create({
      id: "res_3",
      restaurantId: "rest_1",
      guestId: "guest_2",
      partySize: 6,
      startAt: new Date("2026-05-30T13:00:00Z"),
      endAt: new Date("2026-05-30T14:30:00Z"),
      status: "NO_SHOW",
      createdAt: new Date("2026-05-30T10:00:00Z"), // leadTime corto
    });

    // Cancelada
    const resCancelled = Reservation.create({
      id: "res_4",
      restaurantId: "rest_1",
      guestId: "guest_3",
      partySize: 8,
      startAt: new Date("2026-05-30T14:00:00Z"),
      endAt: new Date("2026-05-30T15:30:00Z"),
      status: "CANCELLED",
      createdAt: new Date("2026-05-20T14:00:00Z"),
    });

    const zone1 = RestaurantZone.create({
      id: "zone_1",
      restaurantId: "rest_1",
      name: "Terraza",
    });

    const table1 = DiningTable.create({
      id: "table_1",
      restaurantId: "rest_1",
      zoneId: "zone_1",
      name: "Mesa 1",
    });

    const resRepo = new InMemoryReservationRepository([res1, res2, resNoShow, resCancelled]);
    const resTabRepo = new InMemoryReservationTableRepository([
      { reservationId: "res_1", tableId: "table_1" },
    ]);
    const tableRepo = new InMemoryDiningTableRepository([table1]);
    const zoneRepo = new InMemoryZoneRepository([zone1]);

    const useCase = new GetRestaurantAnalytics(resRepo, resTabRepo, tableRepo, zoneRepo);
    const result = await useCase.execute({
      restaurantId: "rest_1",
      startDate: new Date("2026-05-01"),
      endDate: new Date("2026-05-31"),
    });

    // Total = 4
    expect(result.summary.totalReservations).toBe(4);
    // Covers = 4 (res1) + 2 (res2) + 6 (resNoShow) = 12 (se excluye resCancelled)
    expect(result.summary.totalCovers).toBe(12);
    expect(result.summary.noShowCount).toBe(1);
    expect(result.summary.cancelledCount).toBe(1);
    expect(result.summary.completedCount).toBe(2); // COMPLETED + CHECKED_IN = 2

    // Tasas:
    // No-show rate: 1/4 = 25%
    expect(result.summary.noShowRate).toBe(25);
    // Cancellation rate: 1/4 = 25%
    expect(result.summary.cancellationRate).toBe(25);

    // Promedio de grupo: (4 + 2 + 6) / 3 = 4
    expect(result.summary.averagePartySize).toBe(4);

    // Recurrencia: guest_1 tiene 2 visitas (res1 y res2), guest_2 tiene 0 (no-show), guest_3 tiene 0.
    // repeatGuestsCount = 1, oneTimeGuestsCount = 0.
    // Tasa = 100%
    expect(result.guestsRecurrence.repeatGuestsCount).toBe(1);
    expect(result.guestsRecurrence.oneTimeGuestsCount).toBe(0);
    expect(result.guestsRecurrence.repeatRate).toBe(100);

    // Zonas: res1 (4 covers) asignada a table1 en zone1 ("Terraza").
    const terrazaMetric = result.byZone.find((z) => z.zoneName === "Terraza");
    expect(terrazaMetric).toBeDefined();
    expect(terrazaMetric!.reservationsCount).toBe(1);
    expect(terrazaMetric!.coversCount).toBe(4);
  });
});
