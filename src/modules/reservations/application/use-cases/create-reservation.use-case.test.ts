/**
 * Archivo: create-reservation.use-case.test.ts
 * Responsabilidad: Validar el comportamiento del caso de uso CreateReservation.
 * Tipo: lógica
 */

import { describe, expect, it } from "vitest";
import { Reservation } from "../../domain/entities/reservation.entity";
import { CreateReservation } from "./create-reservation.use-case";
import { ReservationRepository } from "../ports/reservation-repository.port";

class InMemoryReservationRepository implements ReservationRepository {
  public savedReservation: Reservation | null = null;

  //-aqui empieza funcion findById y es para cumplir el contrato del puerto en pruebas-//
  /**
   * Devuelve null porque este test solo valida el flujo de creación.
   * @pure
   */
  async findById(): Promise<Reservation | null> {
    return null;
  }
  //-aqui termina funcion findById y se va autilizar solo en tests-//

  //-aqui empieza funcion save y es para persistir en memoria durante la prueba-//
  /**
   * Guarda en memoria la reserva creada durante la prueba.
   * @pure
   */
  async save(reservation: Reservation): Promise<Reservation> {
    this.savedReservation = reservation;

    return reservation;
  }
  //-aqui termina funcion save y se va autilizar solo en tests-//
}

describe("CreateReservation", () => {
  it("creates and persists a reservation", async () => {
    const repository = new InMemoryReservationRepository();
    const useCase = new CreateReservation(repository);

    const reservation = await useCase.execute({
      id: "res_1",
      restaurantId: "rest_1",
      guestId: "guest_1",
      partySize: 2,
      startAt: new Date("2026-04-11T18:00:00.000Z"),
      endAt: new Date("2026-04-11T19:30:00.000Z"),
    });

    expect(reservation.status).toBe("PENDING");
    expect(repository.savedReservation).toBe(reservation);
  });

  it("propagates domain validation errors", async () => {
    const repository = new InMemoryReservationRepository();
    const useCase = new CreateReservation(repository);

    await expect(
      useCase.execute({
        id: "res_1",
        restaurantId: "rest_1",
        guestId: "guest_1",
        partySize: 2,
        startAt: new Date("2026-04-11T20:00:00.000Z"),
        endAt: new Date("2026-04-11T19:30:00.000Z"),
      }),
    ).rejects.toThrow();
  });
});
