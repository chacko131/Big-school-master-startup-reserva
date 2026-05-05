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

  it("confirms a pending reservation", () => {
    const reservation = Reservation.create({
      id: "res_1",
      restaurantId: "rest_1",
      guestId: "guest_1",
      partySize: 2,
      startAt: new Date("2026-04-11T18:00:00.000Z"),
      endAt: new Date("2026-04-11T19:30:00.000Z"),
    });

    const confirmed = reservation.confirm();

    expect(confirmed.status).toBe("CONFIRMED");
  });

  it("checks in a confirmed reservation", () => {
    const reservation = Reservation.create({
      id: "res_1",
      restaurantId: "rest_1",
      guestId: "guest_1",
      partySize: 2,
      startAt: new Date("2026-04-11T18:00:00.000Z"),
      endAt: new Date("2026-04-11T19:30:00.000Z"),
    });

    const checkedIn = reservation.confirm().checkIn();

    expect(checkedIn.status).toBe("CHECKED_IN");
  });

  it("throws when checking in a non-confirmed reservation", () => {
    const reservation = Reservation.create({
      id: "res_1",
      restaurantId: "rest_1",
      guestId: "guest_1",
      partySize: 2,
      startAt: new Date("2026-04-11T18:00:00.000Z"),
      endAt: new Date("2026-04-11T19:30:00.000Z"),
    });

    expect(() => reservation.checkIn()).toThrow(ReservationValidationError);
  });

  it("completes a checked-in reservation", () => {
    const reservation = Reservation.create({
      id: "res_1",
      restaurantId: "rest_1",
      guestId: "guest_1",
      partySize: 2,
      startAt: new Date("2026-04-11T18:00:00.000Z"),
      endAt: new Date("2026-04-11T19:30:00.000Z"),
    });

    const completed = reservation.confirm().checkIn().complete();

    expect(completed.status).toBe("COMPLETED");
  });

  it("throws when completing a non-checked-in reservation", () => {
    const reservation = Reservation.create({
      id: "res_1",
      restaurantId: "rest_1",
      guestId: "guest_1",
      partySize: 2,
      startAt: new Date("2026-04-11T18:00:00.000Z"),
      endAt: new Date("2026-04-11T19:30:00.000Z"),
    });

    expect(() => reservation.confirm().complete()).toThrow(ReservationValidationError);
  });

  it("marks no-show on a confirmed reservation", () => {
    const reservation = Reservation.create({
      id: "res_1",
      restaurantId: "rest_1",
      guestId: "guest_1",
      partySize: 2,
      startAt: new Date("2026-04-11T18:00:00.000Z"),
      endAt: new Date("2026-04-11T19:30:00.000Z"),
    });

    const noShow = reservation.confirm().markNoShow();

    expect(noShow.status).toBe("NO_SHOW");
  });

  it("throws when marking no-show on a non-confirmed reservation", () => {
    const reservation = Reservation.create({
      id: "res_1",
      restaurantId: "rest_1",
      guestId: "guest_1",
      partySize: 2,
      startAt: new Date("2026-04-11T18:00:00.000Z"),
      endAt: new Date("2026-04-11T19:30:00.000Z"),
    });

    expect(() => reservation.markNoShow()).toThrow(ReservationValidationError);
  });
});
