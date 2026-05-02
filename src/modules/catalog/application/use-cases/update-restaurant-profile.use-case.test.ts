/**
 * Archivo: update-restaurant-profile.use-case.test.ts
 * Responsabilidad: Verificar el comportamiento del caso de uso UpdateRestaurantProfile.
 * Tipo: test
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { UpdateRestaurantProfile } from "./update-restaurant-profile.use-case";
import { Restaurant } from "../../domain/entities/restaurant.entity";
import { RestaurantNotFoundError } from "../errors/restaurant-not-found.error";
import { type RestaurantRepository } from "../ports/restaurant-repository.port";

// ─── Helpers ────────────────────────────────────────────────────────────────

function buildRestaurant(overrides: Partial<Parameters<typeof Restaurant.create>[0]> = {}): Restaurant {
  return Restaurant.create({
    id: "rest-001",
    name: "La Hacienda",
    slug: "la-hacienda",
    timezone: "Europe/Madrid",
    description: null,
    address: null,
    city: null,
    countryCode: null,
    cuisine: null,
    priceRange: null,
    heroImage: null,
    galleryImages: [],
    ...overrides,
  });
}

function buildMockRepository(restaurant: Restaurant | null): RestaurantRepository {
  return {
    findById: vi.fn().mockResolvedValue(restaurant),
    findBySlug: vi.fn(),
    findAll: vi.fn(),
    save: vi.fn().mockImplementation(async (r: Restaurant) => r),
  };
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("UpdateRestaurantProfile", () => {
  let useCase: UpdateRestaurantProfile;
  let mockRepository: ReturnType<typeof buildMockRepository>;
  let existingRestaurant: Restaurant;

  beforeEach(() => {
    existingRestaurant = buildRestaurant();
    mockRepository = buildMockRepository(existingRestaurant);
    useCase = new UpdateRestaurantProfile(mockRepository);
  });

  // ── Camino feliz ────────────────────────────────────────────────────────

  it("debe actualizar la descripción del restaurante", async () => {
    const result = await useCase.execute({
      restaurantId: "rest-001",
      description: "Cocina mexicana de autor en el corazón de Polanco.",
    });

    expect(result.description).toBe("Cocina mexicana de autor en el corazón de Polanco.");
    expect(mockRepository.save).toHaveBeenCalledOnce();
  });

  it("debe actualizar la dirección completa del restaurante", async () => {
    const result = await useCase.execute({
      restaurantId: "rest-001",
      address: "Calle Aristóteles 124",
      city: "Ciudad de México",
      countryCode: "MX",
    });

    expect(result.address).toBe("Calle Aristóteles 124");
    expect(result.city).toBe("Ciudad de México");
    expect(result.countryCode).toBe("MX");
  });

  it("debe guardar la foto hero como objeto Json (devuelta por Cloudinary)", async () => {
    const heroImage = { url: "https://res.cloudinary.com/df8u5wrwe/image/upload/v1/restaurants/rest-001/hero.jpg", publicId: "restaurants/rest-001/hero" };

    const result = await useCase.execute({
      restaurantId: "rest-001",
      heroImage: heroImage,
    });

    expect(result.heroImage).toEqual(heroImage);
    expect(mockRepository.save).toHaveBeenCalledOnce();
  });

  it("debe reemplazar la galería completa con las nuevos objetos de Cloudinary", async () => {
    const gallery = [
      { url: "https://res.cloudinary.com/df8u5wrwe/image/upload/v1/restaurants/rest-001/gallery-1.jpg", publicId: "restaurants/rest-001/gallery-1" },
      { url: "https://res.cloudinary.com/df8u5wrwe/image/upload/v1/restaurants/rest-001/gallery-2.jpg", publicId: "restaurants/rest-001/gallery-2" },
    ];

    const result = await useCase.execute({
      restaurantId: "rest-001",
      galleryImages: gallery,
    });

    expect(result.galleryImages).toHaveLength(2);
    expect(result.galleryImages).toEqual(gallery);
  });

  it("debe poner heroImage a null cuando se elimina la foto hero de Cloudinary", async () => {
    const restaurantWithHero = buildRestaurant({
      heroImage: { url: "https://res.cloudinary.com/df8u5wrwe/image/upload/v1/restaurants/hero.jpg", publicId: "restaurants/hero" },
    });
    mockRepository.findById = vi.fn().mockResolvedValue(restaurantWithHero);

    const result = await useCase.execute({
      restaurantId: "rest-001",
      heroImage: null,
    });

    expect(result.heroImage).toBeNull();
  });

  it("debe actualizar el priceRange del restaurante", async () => {
    const result = await useCase.execute({
      restaurantId: "rest-001",
      priceRange: "UPSCALE",
    });

    expect(result.priceRange).toBe("UPSCALE");
  });

  it("debe incrementar la versión del restaurante al actualizar", async () => {
    const versionInicial = existingRestaurant.toPrimitives().version;

    const result = await useCase.execute({
      restaurantId: "rest-001",
      description: "Nueva descripción",
    });

    expect(result.toPrimitives().version).toBe(versionInicial + 1);
  });

  it("debe poder actualizar múltiples campos en una sola llamada", async () => {
    const heroImage = { url: "https://res.cloudinary.com/df8u5wrwe/image/upload/v1/restaurants/hero.jpg", publicId: "restaurants/hero" };

    const result = await useCase.execute({
      restaurantId: "rest-001",
      description: "Cocina de autor",
      address: "Calle Aristóteles 124",
      city: "Ciudad de México",
      countryCode: "MX",
      cuisine: "Mexicana",
      priceRange: "FINE_DINING",
      heroImage: heroImage,
      galleryImages: [heroImage],
    });

    expect(result.description).toBe("Cocina de autor");
    expect(result.address).toBe("Calle Aristóteles 124");
    expect(result.city).toBe("Ciudad de México");
    expect(result.countryCode).toBe("MX");
    expect(result.cuisine).toBe("Mexicana");
    expect(result.priceRange).toBe("FINE_DINING");
    expect(result.heroImage).toEqual(heroImage);
    expect(result.galleryImages).toHaveLength(1);
  });

  it("no debe modificar campos no incluidos en el input (actualización parcial)", async () => {
    const restaurantConDatos = buildRestaurant({
      description: "Descripción original",
      city: "Guadalajara",
    });
    mockRepository.findById = vi.fn().mockResolvedValue(restaurantConDatos);

    const result = await useCase.execute({
      restaurantId: "rest-001",
      // Solo actualizamos la cuisine, nada más
      cuisine: "Italiana",
    });

    // Los campos no tocados deben permanecer intactos
    expect(result.description).toBe("Descripción original");
    expect(result.city).toBe("Guadalajara");
    expect(result.cuisine).toBe("Italiana");
  });

  // ── Camino de error ─────────────────────────────────────────────────────

  it("debe lanzar RestaurantNotFoundError si el restaurante no existe", async () => {
    mockRepository.findById = vi.fn().mockResolvedValue(null);

    await expect(
      useCase.execute({
        restaurantId: "no-existe-id",
        description: "Algo",
      })
    ).rejects.toThrow(RestaurantNotFoundError);
  });

  it("debe llamar a findById con el restaurantId correcto", async () => {
    await useCase.execute({ restaurantId: "rest-001" });

    expect(mockRepository.findById).toHaveBeenCalledWith("rest-001");
  });

  it("debe llamar a save exactamente una vez si el restaurante existe", async () => {
    await useCase.execute({ restaurantId: "rest-001", description: "Test" });

    expect(mockRepository.save).toHaveBeenCalledOnce();
  });
});
