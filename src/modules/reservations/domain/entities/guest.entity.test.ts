import { describe, expect, it } from "vitest";
import { Guest } from "./guest.entity";
import { GuestValidationError } from "../errors/guest-validation.error";

describe("Guest", () => {
  it("creates a valid guest", () => {
    const guest = Guest.create({
      id: "guest_1",
      restaurantId: "rest_1",
      fullName: "Juan Perez",
      phone: "+34111111111",
    });

    expect(guest.fullName).toBe("Juan Perez");
    expect(guest.phone).toBe("+34111111111");
    expect(guest.noShowCount).toBe(0);
  });

  it("throws a domain error when phone is empty", () => {
    expect(() => {
      Guest.create({
        id: "guest_1",
        restaurantId: "rest_1",
        fullName: "Juan Perez",
        phone: "   ",
      });
    }).toThrow(GuestValidationError);
  });
});
