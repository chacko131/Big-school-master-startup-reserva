/**
 * Archivo: business-hours.entity.test.ts
 * Responsabilidad: Verificar las reglas de dominio de la entidad BusinessHours.
 * Tipo: test
 */

import { describe, it, expect } from "vitest";
import { BusinessHours } from "./business-hours.entity";

describe("BusinessHours.create", () => {
  it("crea una entidad válida con horarios correctos", () => {
    const bh = BusinessHours.create({
      id: "bh-1",
      restaurantId: "rest-1",
      day: "FRIDAY",
      opensAt: "09:00",
      closesAt: "22:30",
    });

    expect(bh.day).toBe("FRIDAY");
    expect(bh.opensAt).toBe("09:00");
    expect(bh.closesAt).toBe("22:30");
    expect(bh.isClosed).toBe(false);
  });

  it("permite crear un día cerrado sin validar horarios", () => {
    const bh = BusinessHours.create({
      id: "bh-2",
      restaurantId: "rest-1",
      day: "SUNDAY",
      opensAt: "00:00",
      closesAt: "00:00",
      isClosed: true,
    });

    expect(bh.isClosed).toBe(true);
  });

  it("lanza error si opensAt no tiene formato HH:mm", () => {
    expect(() =>
      BusinessHours.create({
        id: "bh-3",
        restaurantId: "rest-1",
        day: "MONDAY",
        opensAt: "9:0",
        closesAt: "22:00",
      })
    ).toThrow();
  });

  it("lanza error si el restaurantId está vacío", () => {
    expect(() =>
      BusinessHours.create({
        id: "bh-4",
        restaurantId: "   ",
        day: "TUESDAY",
        opensAt: "10:00",
        closesAt: "21:00",
      })
    ).toThrow("restaurantId");
  });
});

describe("BusinessHours.toPrimitives", () => {
  it("serializa correctamente la entidad", () => {
    const bh = BusinessHours.create({
      id: "bh-5",
      restaurantId: "rest-2",
      day: "WEDNESDAY",
      opensAt: "12:00",
      closesAt: "23:59",
    });

    const primitives = bh.toPrimitives();

    expect(primitives.id).toBe("bh-5");
    expect(primitives.restaurantId).toBe("rest-2");
    expect(primitives.day).toBe("WEDNESDAY");
    expect(primitives.isClosed).toBe(false);
  });
});
