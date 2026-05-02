/**
 * Archivo: get-restaurant-public-profile.use-case.test.ts
 * Responsabilidad: Verificar que el caso de uso GetRestaurantPublicProfileUseCase funciona correctamente.
 * Tipo: test
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { GetRestaurantPublicProfileUseCase } from "./get-restaurant-public-profile.use-case";
import { RestaurantNotFoundError } from "../errors/restaurant-not-found.error";
import { Restaurant } from "../../domain/entities/restaurant.entity";
import { BusinessHours } from "../../domain/entities/business-hours.entity";
import { MenuCategory } from "../../domain/entities/menu-category.entity";
import { MenuItem } from "../../domain/entities/menu-item.entity";
import { type RestaurantRepository } from "../ports/restaurant-repository.port";
import { type BusinessHoursRepository } from "../ports/business-hours-repository.port";
import { type MenuRepository } from "../ports/menu-repository.port";

// --- Factories de entidades para los tests ---

function buildRestaurant(overrides: Partial<Parameters<typeof Restaurant.create>[0]> = {}): Restaurant {
  return Restaurant.create({
    id: "rest-1",
    name: "La Hacienda",
    slug: "la-hacienda",
    timezone: "America/Mexico_City",
    description: "Cocina mexicana de autor",
    address: "Calle Aristóteles 124",
    city: "Ciudad de México",
    countryCode: "MX",
    cuisine: "Mexicana",
    priceRange: "UPSCALE",
    heroImageUrl: "https://cloudinary.com/hero.jpg",
    galleryImageUrls: ["https://cloudinary.com/img1.jpg"],
    phone: "+52 55 1234 5678",
    email: "hola@lahacienda.mx",
    ...overrides,
  });
}

function buildBusinessHours(): BusinessHours {
  return BusinessHours.create({
    id: "bh-1",
    restaurantId: "rest-1",
    day: "MONDAY",
    opensAt: "13:00",
    closesAt: "23:00",
  });
}

function buildMenuCategory(): MenuCategory {
  return MenuCategory.create({
    id: "cat-1",
    restaurantId: "rest-1",
    name: "Entrantes",
  });
}

function buildMenuItem(): MenuItem {
  return MenuItem.create({
    id: "item-1",
    categoryId: "cat-1",
    name: "Guacamole",
    description: "Aguacate, limón, cilantro",
    price: 12.5,
    allergens: [],
  });
}

// --- Mocks de repositorios ---

function buildMocks(restaurantOrNull: Restaurant | null = buildRestaurant()) {
  const restaurantRepository: RestaurantRepository = {
    findById: vi.fn(),
    findBySlug: vi.fn().mockResolvedValue(restaurantOrNull),
    findAll: vi.fn(),
    save: vi.fn(),
  };

  const businessHoursRepository: BusinessHoursRepository = {
    findByRestaurantId: vi.fn().mockResolvedValue([buildBusinessHours()]),
    saveAll: vi.fn(),
    deleteByRestaurantId: vi.fn(),
  };

  const menuRepository: MenuRepository = {
    findCategoriesByRestaurantId: vi.fn().mockResolvedValue([buildMenuCategory()]),
    findItemsByCategoryId: vi.fn().mockResolvedValue([buildMenuItem()]),
    saveCategory: vi.fn(),
    saveItem: vi.fn(),
    deleteCategoryById: vi.fn(),
    deleteItemById: vi.fn(),
  };

  return { restaurantRepository, businessHoursRepository, menuRepository };
}

// --- Tests ---

describe("GetRestaurantPublicProfileUseCase", () => {
  describe("execute", () => {
    it("devuelve el perfil completo del restaurante cuando el slug existe", async () => {
      const { restaurantRepository, businessHoursRepository, menuRepository } = buildMocks();
      const useCase = new GetRestaurantPublicProfileUseCase(
        restaurantRepository,
        businessHoursRepository,
        menuRepository
      );

      const result = await useCase.execute("la-hacienda");

      expect(result.slug).toBe("la-hacienda");
      expect(result.name).toBe("La Hacienda");
      expect(result.description).toBe("Cocina mexicana de autor");
      expect(result.address).toBe("Calle Aristóteles 124");
      expect(result.city).toBe("Ciudad de México");
      expect(result.countryCode).toBe("MX");
      expect(result.cuisine).toBe("Mexicana");
      expect(result.priceRange).toBe("UPSCALE");
      expect(result.heroImageUrl).toBe("https://cloudinary.com/hero.jpg");
      expect(result.galleryImageUrls).toHaveLength(1);
    });

    it("incluye los horarios de apertura del restaurante", async () => {
      const { restaurantRepository, businessHoursRepository, menuRepository } = buildMocks();
      const useCase = new GetRestaurantPublicProfileUseCase(
        restaurantRepository,
        businessHoursRepository,
        menuRepository
      );

      const result = await useCase.execute("la-hacienda");

      expect(result.businessHours).toHaveLength(1);
      expect(result.businessHours[0].day).toBe("MONDAY");
      expect(result.businessHours[0].opensAt).toBe("13:00");
      expect(result.businessHours[0].closesAt).toBe("23:00");
      expect(result.businessHours[0].isClosed).toBe(false);
    });

    it("incluye la carta con categorías y platos", async () => {
      const { restaurantRepository, businessHoursRepository, menuRepository } = buildMocks();
      const useCase = new GetRestaurantPublicProfileUseCase(
        restaurantRepository,
        businessHoursRepository,
        menuRepository
      );

      const result = await useCase.execute("la-hacienda");

      expect(result.menu).toHaveLength(1);
      expect(result.menu[0].name).toBe("Entrantes");
      expect(result.menu[0].items).toHaveLength(1);
      expect(result.menu[0].items[0].name).toBe("Guacamole");
      expect(result.menu[0].items[0].price).toBe(12.5);
    });

    it("lanza RestaurantNotFoundError cuando el slug no existe", async () => {
      const { restaurantRepository, businessHoursRepository, menuRepository } = buildMocks(null);
      const useCase = new GetRestaurantPublicProfileUseCase(
        restaurantRepository,
        businessHoursRepository,
        menuRepository
      );

      await expect(useCase.execute("no-existe")).rejects.toThrow(RestaurantNotFoundError);
    });

    it("devuelve carta vacía cuando el restaurante no tiene categorías", async () => {
      const { restaurantRepository, businessHoursRepository, menuRepository } = buildMocks();
      vi.mocked(menuRepository.findCategoriesByRestaurantId).mockResolvedValue([]);

      const useCase = new GetRestaurantPublicProfileUseCase(
        restaurantRepository,
        businessHoursRepository,
        menuRepository
      );

      const result = await useCase.execute("la-hacienda");

      expect(result.menu).toHaveLength(0);
    });

    it("devuelve campos nulos cuando el restaurante no tiene datos de catálogo", async () => {
      const restaurantMinimo = buildRestaurant({
        description: undefined,
        address: undefined,
        city: undefined,
        heroImageUrl: undefined,
        galleryImageUrls: [],
        priceRange: undefined,
      });

      const { restaurantRepository, businessHoursRepository, menuRepository } = buildMocks(restaurantMinimo);
      const useCase = new GetRestaurantPublicProfileUseCase(
        restaurantRepository,
        businessHoursRepository,
        menuRepository
      );

      const result = await useCase.execute("la-hacienda");

      expect(result.description).toBeNull();
      expect(result.address).toBeNull();
      expect(result.city).toBeNull();
      expect(result.heroImageUrl).toBeNull();
      expect(result.galleryImageUrls).toHaveLength(0);
      expect(result.priceRange).toBeNull();
    });
  });
});
