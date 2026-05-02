/**
 * Archivo: menu-item.entity.test.ts
 * Responsabilidad: Verificar las reglas de dominio de la entidad MenuItem.
 * Tipo: test
 */

import { describe, it, expect } from "vitest";
import { MenuItem } from "./menu-item.entity";

describe("MenuItem.create", () => {
  it("crea un plato válido con precio", () => {
    const item = MenuItem.create({
      id: "item-1",
      categoryId: "cat-1",
      name: "Tacos al pastor",
      price: 14.5,
    });

    expect(item.name).toBe("Tacos al pastor");
    expect(item.price).toBe(14.5);
    expect(item.isAvailable).toBe(true);
    expect(item.allergens).toHaveLength(0);
  });

  it("permite precio null (precio a consultar)", () => {
    const item = MenuItem.create({
      id: "item-2",
      categoryId: "cat-1",
      name: "Langosta del día",
      price: null,
    });

    expect(item.price).toBeNull();
  });

  it("lanza error si el precio es negativo", () => {
    expect(() =>
      MenuItem.create({
        id: "item-3",
        categoryId: "cat-1",
        name: "Plato roto",
        price: -5,
      })
    ).toThrow("negativo");
  });

  it("lanza error si el nombre está vacío", () => {
    expect(() =>
      MenuItem.create({
        id: "item-4",
        categoryId: "cat-1",
        name: "   ",
      })
    ).toThrow("name");
  });

  it("lanza error si el categoryId está vacío", () => {
    expect(() =>
      MenuItem.create({
        id: "item-5",
        categoryId: "",
        name: "Sopa",
      })
    ).toThrow("categoryId");
  });

  it("registra alérgenos correctamente", () => {
    const item = MenuItem.create({
      id: "item-6",
      categoryId: "cat-2",
      name: "Tiramisú",
      allergens: ["gluten", "lactosa", "huevo"],
    });

    expect(item.allergens).toEqual(["gluten", "lactosa", "huevo"]);
  });
});
