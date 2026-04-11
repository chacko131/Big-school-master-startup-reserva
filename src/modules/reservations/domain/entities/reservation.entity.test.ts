import { describe, expect, it } from "vitest";
import { Reservation } from "./reservation.entity";
import { ReservationValidationError } from "../errors/reservation-validation.error";

describe("Reservation", () => {
  it("creates a valid reservation", () => {
    const reservation = Reservation.create({
      id: "res_1",
      restaurantId: "rest_1",
      guestId: "guest_1",
      partySize: 2,
      startAt: new Date("2026-04-11T18:00:00.000Z"),
      endAt: new Date("2026-04-11T19:30:00.000Z"),
    });

    expect(reservation.status).toBe("PENDING");
    expect(reservation.partySize).toBe(2);
  });

  it("throws a domain error when dates are invalid", () => {
    expect(() => {
      Reservation.create({
        id: "res_1",
        restaurantId: "rest_1",
        guestId: "guest_1",
        partySize: 2,
        startAt: new Date("2026-04-11T20:00:00.000Z"),
        endAt: new Date("2026-04-11T19:30:00.000Z"),
      });
    }).toThrow(ReservationValidationError);
  });
});
