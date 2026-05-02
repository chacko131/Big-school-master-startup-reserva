/**
 * Archivo: restaurant.entity.ts
 * Responsabilidad: Representar la entidad de dominio Restaurant sin dependencias de framework.
 * Tipo: lógica
 */

import { RestaurantValidationError } from "../errors/restaurant-validation.error";

/// Rangos de precio que se muestran al cliente en el perfil público.
export type PriceRange = "BUDGET" | "MODERATE" | "UPSCALE" | "FINE_DINING";

export interface RestaurantImage {
  url: string;
  publicId: string;
}

export interface RestaurantPrimitives {
  id: string;
  name: string;
  slug: string;
  timezone: string;
  phone: string | null;
  email: string | null;
  isActive: boolean;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  // --- Campos del catálogo público (opcionales para no romper registros existentes) ---
  description: string | null;
  address: string | null;
  city: string | null;
  countryCode: string | null;
  cuisine: string | null;
  priceRange: PriceRange | null;
  heroImage: RestaurantImage | null;
  galleryImages: RestaurantImage[];
}

export interface CreateRestaurantProps {
  id: string;
  name: string;
  slug: string;
  timezone?: string;
  phone?: string | null;
  email?: string | null;
  isActive?: boolean;
  version?: number;
  createdAt?: Date;
  updatedAt?: Date;
  // --- Campos del catálogo público ---
  description?: string | null;
  address?: string | null;
  city?: string | null;
  countryCode?: string | null;
  cuisine?: string | null;
  priceRange?: PriceRange | null;
  heroImage?: RestaurantImage | null;
  galleryImages?: RestaurantImage[];
}

export interface UpdateCatalogProfileProps {
  description?: string | null;
  address?: string | null;
  city?: string | null;
  countryCode?: string | null;
  cuisine?: string | null;
  priceRange?: PriceRange | null;
  heroImage?: RestaurantImage | null;
  galleryImages?: RestaurantImage[];
}

const DEFAULT_TIMEZONE = "Europe/Madrid";

export class Restaurant {
  private constructor(private readonly props: RestaurantPrimitives) {}

  //-aqui empieza funcion create y es para construir una entidad Restaurant valida-//
  /**
   * Crea una entidad Restaurant aplicando reglas mínimas del dominio.
   * @pure
   */
  static create(props: CreateRestaurantProps): Restaurant {
    validateRequiredText(props.id, "id");
    validateRequiredText(props.name, "name");
    validateRequiredText(props.slug, "slug");

    const now = new Date();

    return new Restaurant({
      id: props.id.trim(),
      name: props.name.trim(),
      slug: props.slug.trim().toLowerCase(),
      timezone: normalizeOptionalText(props.timezone) ?? DEFAULT_TIMEZONE,
      phone: normalizeOptionalText(props.phone),
      email: normalizeOptionalText(props.email),
      isActive: props.isActive ?? true,
      version: props.version ?? 1,
      createdAt: props.createdAt ?? now,
      updatedAt: props.updatedAt ?? now,
      // --- Catálogo público ---
      description: normalizeOptionalText(props.description),
      address: normalizeOptionalText(props.address),
      city: normalizeOptionalText(props.city),
      countryCode: normalizeOptionalText(props.countryCode),
      cuisine: normalizeOptionalText(props.cuisine),
      priceRange: props.priceRange ?? null,
      heroImage: props.heroImage ?? null,
      galleryImages: props.galleryImages ?? [],
    });
  }
  //-aqui termina funcion create y se va autilizar en application e infrastructure-//

  //-aqui empieza funcion fromPrimitives y es para rehidratar la entidad desde datos persistidos-//
  /**
   * Rehidrata la entidad desde datos primitivos ya persistidos.
   * @pure
   */
  static fromPrimitives(props: RestaurantPrimitives): Restaurant {
    return Restaurant.create(props);
  }
  //-aqui termina funcion fromPrimitives y se va autilizar en repositories-//

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get slug(): string {
    return this.props.slug;
  }

  get timezone(): string {
    return this.props.timezone;
  }

  get email(): string | null {
    return this.props.email;
  }

  get phone(): string | null {
    return this.props.phone;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get description(): string | null {
    return this.props.description;
  }

  get address(): string | null {
    return this.props.address;
  }

  get city(): string | null {
    return this.props.city;
  }

  get countryCode(): string | null {
    return this.props.countryCode;
  }

  get cuisine(): string | null {
    return this.props.cuisine;
  }

  get priceRange(): PriceRange | null {
    return this.props.priceRange;
  }

  get heroImage(): RestaurantImage | null {
    return this.props.heroImage;
  }

  get galleryImages(): RestaurantImage[] {
    return this.props.galleryImages;
  }

  //-aqui empieza funcion activate y es para activar el restaurante dentro del dominio-//
  /**
   * Devuelve una nueva entidad con el restaurante activo.
   * @pure
   */
  activate(): Restaurant {
    return new Restaurant({
      ...this.props,
      isActive: true,
      version: this.props.version + 1,
      updatedAt: new Date(),
    });
  }
  //-aqui termina funcion activate y se va autilizar en casos de uso de catalogo-//

  //-aqui empieza funcion deactivate y es para desactivar el restaurante dentro del dominio-//
  /**
   * Devuelve una nueva entidad con el restaurante inactivo.
   * @pure
   */
  deactivate(): Restaurant {
    return new Restaurant({
      ...this.props,
      isActive: false,
      version: this.props.version + 1,
      updatedAt: new Date(),
    });
  }
  //-aqui termina funcion deactivate y se va autilizar en casos de uso de catalogo-//

  //-aqui empieza funcion updateCatalogProfile y es para actualizar los datos del perfil publico del restaurante-//
  /**
   * Devuelve una nueva entidad con los datos del catálogo actualizados.
   * @pure
   */
  updateCatalogProfile(props: UpdateCatalogProfileProps): Restaurant {
    return new Restaurant({
      ...this.props,
      description: "description" in props ? normalizeOptionalText(props.description) : this.props.description,
      address: "address" in props ? normalizeOptionalText(props.address) : this.props.address,
      city: "city" in props ? normalizeOptionalText(props.city) : this.props.city,
      countryCode: "countryCode" in props ? normalizeOptionalText(props.countryCode) : this.props.countryCode,
      cuisine: "cuisine" in props ? normalizeOptionalText(props.cuisine) : this.props.cuisine,
      priceRange: "priceRange" in props ? (props.priceRange ?? null) : this.props.priceRange,
      heroImage: "heroImage" in props ? (props.heroImage ?? null) : this.props.heroImage,
      galleryImages: props.galleryImages ?? this.props.galleryImages,
      version: this.props.version + 1,
      updatedAt: new Date(),
    });
  }
  //-aqui termina funcion updateCatalogProfile y se va autilizar en casos de uso de catalogo-//

  //-aqui empieza funcion toPrimitives y es para exponer la entidad en formato serializable-//
  /**
   * Expone la entidad en formato primitivo.
   * @pure
   */
  toPrimitives(): RestaurantPrimitives {
    return { ...this.props };
  }
  //-aqui termina funcion toPrimitives y se va autilizar en infrastructure y testing-//
}

//-aqui empieza funcion validateRequiredText y es para validar strings obligatorios del dominio-//
/**
 * Valida que un texto obligatorio no esté vacío.
 * @pure
 */
function validateRequiredText(value: string, fieldName: string): void {
  if (value.trim().length === 0) {
    throw new RestaurantValidationError(fieldName);
  }
}
//-aqui termina funcion validateRequiredText y se va autilizar en create-//

//-aqui empieza funcion normalizeOptionalText y es para normalizar textos opcionales del dominio-//
/**
 * Normaliza strings opcionales convirtiendo vacíos en null.
 * @pure
 */
function normalizeOptionalText(value?: string | null): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  const normalizedValue = value.trim();

  if (normalizedValue.length === 0) {
    return null;
  }

  return normalizedValue;
}
//-aqui termina funcion normalizeOptionalText y se va autilizar en create-//
