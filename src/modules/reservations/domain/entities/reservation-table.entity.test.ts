import { describe, expect, it } from "vitest";
import { ReservationTable } from "./reservation-table.entity";
import { ReservationTableValidationError } from "../errors/reservation-table-validation.error";

describe("ReservationTable", () => {
  it("creates a valid reservation table link", () => {
    const reservationTable = ReservationTable.create({
      id: "rt_1",
      reservationId: "res_1",
      tableId: "table_1",
      assignedSeats: 4,
    });

    expect(reservationTable.reservationId).toBe("res_1");
    expect(reservationTable.tableId).toBe("table_1");
    expect(reservationTable.assignedSeats).toBe(4);
  });

  it("throws a domain error when assigned seats are invalid", () => {
    expect(() => {
      ReservationTable.create({
        id: "rt_1",
        reservationId: "res_1",
        tableId: "table_1",
        assignedSeats: 0,
      });
    }).toThrow(ReservationTableValidationError);
  });
});
