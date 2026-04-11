import { describe, expect, it } from "vitest";
import { Restaurant } from "./restaurant.entity";
import { RestaurantValidationError } from "../errors/restaurant-validation.error";

describe("Restaurant", () => {
  it("creates a valid restaurant", () => {
    const restaurant = Restaurant.create({
      id: "rest_1",
      name: "Reserva Latina",
      slug: "Reserva Latina",
    });

    expect(restaurant.id).toBe("rest_1");
    expect(restaurant.name).toBe("Reserva Latina");
    expect(restaurant.slug).toBe("reserva latina");
    expect(restaurant.isActive).toBe(true);
  });

  it("throws a domain error when name is empty", () => {
    expect(() => {
      Restaurant.create({
        id: "rest_1",
        name: "   ",
        slug: "reserva-latina",
      });
    }).toThrow(RestaurantValidationError);
  });
});
