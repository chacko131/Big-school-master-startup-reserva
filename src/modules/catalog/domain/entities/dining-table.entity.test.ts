import { describe, expect, it } from "vitest";
import { DiningTable } from "./dining-table.entity";
import { DiningTableValidationError } from "../errors/dining-table-validation.error";

describe("DiningTable", () => {
  it("creates a valid table with default capacity", () => {
    const table = DiningTable.create({
      id: "table_1",
      restaurantId: "rest_1",
      name: "Mesa 1",
    });

    expect(table.id).toBe("table_1");
    expect(table.restaurantId).toBe("rest_1");
    expect(table.capacity).toBe(4);
    expect(table.isActive).toBe(true);
  });

  it("throws a domain error when capacity is invalid", () => {
    expect(() => {
      DiningTable.create({
        id: "table_1",
        restaurantId: "rest_1",
        name: "Mesa 1",
        capacity: 0,
      });
    }).toThrow(DiningTableValidationError);
  });
});
