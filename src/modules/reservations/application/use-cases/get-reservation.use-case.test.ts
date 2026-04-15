/**
 * Archivo: get-reservation.use-case.test.ts
 * Responsabilidad: Validar el comportamiento del caso de uso GetReservation.
 * Tipo: lógica
 */

import { describe, expect, it } from "vitest";
import { Reservation } from "../../domain/entities/reservation.entity";
import { ReservationNotFoundError } from "../errors/reservation-not-found.error";
import { ReservationRepository } from "../ports/reservation-repository.port";
import { GetReservation } from "./get-reservation.use-case";

class InMemoryReservationRepository implements ReservationRepository {
  constructor(private readonly reservation: Reservation | null) {}

  async findById(): Promise<Reservation | null> {
    return this.reservation;
  }

  async save(reservation: Reservation): Promise<Reservation> {
    return reservation;
  }
}

describe("GetReservation", () => {
  it("returns an existing reservation", async () => {
    const existingReservation = Reservation.create({
      id: "res_1",
      restaurantId: "rest_1",
      guestId: "guest_1",
      partySize: 2,
      startAt: new Date("2026-04-11T18:00:00.000Z"),
      endAt: new Date("2026-04-11T19:30:00.000Z"),
    });
    const repository = new InMemoryReservationRepository(existingReservation);
    const useCase = new GetReservation(repository);

    const reservation = await useCase.execute({ reservationId: "res_1" });

    expect(reservation).toBe(existingReservation);
  });

  it("throws when reservation does not exist", async () => {
    const repository = new InMemoryReservationRepository(null);
    const useCase = new GetReservation(repository);

    await expect(useCase.execute({ reservationId: "missing_reservation" })).rejects.toThrow(
      ReservationNotFoundError,
    );
  });
});
