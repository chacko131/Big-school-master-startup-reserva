/**
 * Archivo: get-guests-with-crm-metrics.use-case.test.ts
 * Responsabilidad: Validar el comportamiento del caso de uso GetGuestsWithCrmMetrics.
 * Tipo: lógica
 */

import { describe, expect, it } from "vitest";
import { Guest } from "../../domain/entities/guest.entity";
import { type GuestRepository } from "../ports/guest-repository.port";
import { GetGuestsWithCrmMetrics } from "./get-guests-with-crm-metrics.use-case";

class InMemoryGuestRepository implements GuestRepository {
  constructor(
    private readonly records: Array<{
      guest: Guest;
      reservations: Array<{ status: string; startAt: Date; specialRequests: string | null }>;
    }> = []
  ) {}

  async findById(_id: string): Promise<Guest | null> {
    return null;
  }

  async findByRestaurantAndPhone(_restaurantId: string, _phone: string): Promise<Guest | null> {
    return null;
  }

  async save(guest: Guest): Promise<Guest> {
    return guest;
  }

  async findGuestsWithReservations(
    _restaurantId: string,
    _query?: string
  ): Promise<Array<{ guest: Guest; reservations: Array<{ status: string; startAt: Date; specialRequests: string | null }> }>> {
    return this.records;
  }
}

describe("GetGuestsWithCrmMetrics", () => {
  it("calcula valores por defecto para un cliente nuevo sin reservas ni notas", async () => {
    const guest = Guest.create({
      id: "g_1",
      restaurantId: "rest_1",
      fullName: "Juan Perez",
      phone: "+34600000001",
      email: "juan@email.com",
      notes: null,
      noShowCount: 0,
    });

    const repository = new InMemoryGuestRepository([{ guest, reservations: [] }]);
    const useCase = new GetGuestsWithCrmMetrics(repository);

    const result = await useCase.execute({ restaurantId: "rest_1" });

    expect(result.guests).toHaveLength(1);
    const guestResult = result.guests[0]!;
    expect(guestResult.totalReservationsCount).toBe(0);
    expect(guestResult.noShowsCalculated).toBe(0);
    expect(guestResult.lastVisitAt).toBeNull();
    expect(guestResult.loyaltySegment).toBe("Nuevo");
  });

  it("asigna segmento VIP si el cliente tiene notas aunque no tenga reservas", async () => {
    const guest = Guest.create({
      id: "g_2",
      restaurantId: "rest_1",
      fullName: "Maria Gomez",
      phone: "+34600000002",
      email: "maria@email.com",
      notes: "Prefiere mesa junto a la ventana",
      noShowCount: 0,
    });

    const repository = new InMemoryGuestRepository([{ guest, reservations: [] }]);
    const useCase = new GetGuestsWithCrmMetrics(repository);

    const result = await useCase.execute({ restaurantId: "rest_1" });

    const guestResult = result.guests[0]!;
    expect(guestResult.loyaltySegment).toBe("VIP");
  });

  it("asigna segmento VIP si el cliente tiene 10 o mas reservas", async () => {
    const guest = Guest.create({
      id: "g_3",
      restaurantId: "rest_1",
      fullName: "Pedro Ruiz",
      phone: "+34600000003",
      email: "pedro@email.com",
      notes: null,
      noShowCount: 0,
    });

    // 10 reservas en estado CONFIRMED
    const reservations = Array.from({ length: 10 }, (_, i) => ({
      status: "CONFIRMED",
      startAt: new Date(`2026-05-${i + 1}T20:00:00.000Z`),
      specialRequests: null,
    }));

    const repository = new InMemoryGuestRepository([{ guest, reservations }]);
    const useCase = new GetGuestsWithCrmMetrics(repository);

    const result = await useCase.execute({ restaurantId: "rest_1" });

    const guestResult = result.guests[0]!;
    expect(guestResult.loyaltySegment).toBe("VIP");
  });

  it("asigna segmento Frecuente si tiene entre 3 y 9 reservas", async () => {
    const guest = Guest.create({
      id: "g_4",
      restaurantId: "rest_1",
      fullName: "Laura Lopez",
      phone: "+34600000004",
      email: "laura@email.com",
      notes: null,
      noShowCount: 0,
    });

    const reservations = [
      { status: "COMPLETED", startAt: new Date("2026-05-10T20:00:00.000Z"), specialRequests: null },
      { status: "COMPLETED", startAt: new Date("2026-05-15T20:00:00.000Z"), specialRequests: null },
      { status: "COMPLETED", startAt: new Date("2026-05-20T20:00:00.000Z"), specialRequests: null },
    ];

    const repository = new InMemoryGuestRepository([{ guest, reservations }]);
    const useCase = new GetGuestsWithCrmMetrics(repository);

    const result = await useCase.execute({ restaurantId: "rest_1" });

    const guestResult = result.guests[0]!;
    expect(guestResult.loyaltySegment).toBe("Frecuente");
  });

  it("asigna segmento Atencion si tiene ausencias en el historial o acumuladas", async () => {
    const guest = Guest.create({
      id: "g_5",
      restaurantId: "rest_1",
      fullName: "Luis Garcia",
      phone: "+34600000005",
      email: "luis@email.com",
      notes: null,
      noShowCount: 1, // noShowCount en la entidad es 1
    });

    const repository = new InMemoryGuestRepository([{ guest, reservations: [] }]);
    const useCase = new GetGuestsWithCrmMetrics(repository);

    const result = await useCase.execute({ restaurantId: "rest_1" });

    const guestResult = result.guests[0]!;
    expect(guestResult.loyaltySegment).toBe("Atención");
  });

  it("determina correctamente la ultima visita como la reserva completada mas reciente", async () => {
    const guest = Guest.create({
      id: "g_6",
      restaurantId: "rest_1",
      fullName: "Ana Fernandez",
      phone: "+34600000006",
      email: "ana@email.com",
      notes: null,
      noShowCount: 0,
    });

    const reservations = [
      { status: "PENDING", startAt: new Date("2026-05-25T20:00:00.000Z"), specialRequests: null }, // Reserva mas reciente pero pendiente
      { status: "COMPLETED", startAt: new Date("2026-05-20T20:00:00.000Z"), specialRequests: null }, // Ultima visita real completada
      { status: "COMPLETED", startAt: new Date("2026-05-10T20:00:00.000Z"), specialRequests: null },
    ];

    const repository = new InMemoryGuestRepository([{ guest, reservations }]);
    const useCase = new GetGuestsWithCrmMetrics(repository);

    const result = await useCase.execute({ restaurantId: "rest_1" });

    const guestResult = result.guests[0]!;
    expect(guestResult.lastVisitAt).toEqual(new Date("2026-05-20T20:00:00.000Z"));
  });

  it("deja notes intacta pero extrae las peticiones especiales de reservas en el array historicalNotes", async () => {
    const guest = Guest.create({
      id: "g_7",
      restaurantId: "rest_1",
      fullName: "Carlos Perez",
      phone: "+34600000007",
      email: "carlos@email.com",
      notes: null,
      noShowCount: 0,
    });

    const reservations = [
      { status: "PENDING", startAt: new Date("2026-05-25T20:00:00.000Z"), specialRequests: "Prefiere terraza si es posible" },
      { status: "COMPLETED", startAt: new Date("2026-05-20T20:00:00.000Z"), specialRequests: null },
    ];

    const repository = new InMemoryGuestRepository([{ guest, reservations }]);
    const useCase = new GetGuestsWithCrmMetrics(repository);

    const result = await useCase.execute({ restaurantId: "rest_1" });

    const guestResult = result.guests[0]!;
    expect(guestResult.notes).toBeNull();
    expect(guestResult.historicalNotes).toHaveLength(1);
    expect(guestResult.historicalNotes[0]!.specialRequests).toBe("Prefiere terraza si es posible");
    expect(guestResult.loyaltySegment).toBe("VIP");
  });
});
