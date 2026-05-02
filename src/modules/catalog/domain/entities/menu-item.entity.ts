/**
 * Archivo: menu-item.entity.ts
 * Responsabilidad: Representar un plato individual de la carta del restaurante.
 * Tipo: lógica
 */

export interface MenuItemPrimitives {
  id: string;
  categoryId: string;
  name: string;
  description: string | null;
  price: number | null; // null = "precio a consultar" (ej: precio de mercado)
  imageUrl: string | null;
  allergens: string[];
  isAvailable: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMenuItemProps {
  id: string;
  categoryId: string;
  name: string;
  description?: string | null;
  price?: number | null;
  imageUrl?: string | null;
  allergens?: string[];
  isAvailable?: boolean;
  sortOrder?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class MenuItem {
  private constructor(private readonly props: MenuItemPrimitives) {}

  //-aqui empieza funcion create y es para construir un MenuItem válido-//
  /**
   * Crea un plato de menú validando campos mínimos.
   * @pure
   */
  static create(props: CreateMenuItemProps): MenuItem {
    if (!props.categoryId.trim()) {
      throw new Error("MenuItem: categoryId es obligatorio.");
    }
    if (!props.name.trim()) {
      throw new Error("MenuItem: name es obligatorio.");
    }
    if (props.price !== undefined && props.price !== null && props.price < 0) {
      throw new Error("MenuItem: el precio no puede ser negativo.");
    }

    const now = new Date();

    return new MenuItem({
      id: props.id,
      categoryId: props.categoryId.trim(),
      name: props.name.trim(),
      description: props.description?.trim() || null,
      price: props.price ?? null,
      imageUrl: props.imageUrl?.trim() || null,
      allergens: props.allergens ?? [],
      isAvailable: props.isAvailable ?? true,
      sortOrder: props.sortOrder ?? 0,
      createdAt: props.createdAt ?? now,
      updatedAt: props.updatedAt ?? now,
    });
  }
  //-aqui termina funcion create y se va autilizar en application e infrastructure-//

  //-aqui empieza funcion fromPrimitives y es para rehidratar la entidad desde datos persistidos-//
  /** @pure */
  static fromPrimitives(props: MenuItemPrimitives): MenuItem {
    return MenuItem.create(props);
  }
  //-aqui termina funcion fromPrimitives y se va autilizar en repositories-//

  get id(): string { return this.props.id; }
  get categoryId(): string { return this.props.categoryId; }
  get name(): string { return this.props.name; }
  get description(): string | null { return this.props.description; }
  get price(): number | null { return this.props.price; }
  get imageUrl(): string | null { return this.props.imageUrl; }
  get allergens(): string[] { return this.props.allergens; }
  get isAvailable(): boolean { return this.props.isAvailable; }
  get sortOrder(): number { return this.props.sortOrder; }

  //-aqui empieza funcion toPrimitives y es para exponer la entidad en formato serializable-//
  /** @pure */
  toPrimitives(): MenuItemPrimitives {
    return { ...this.props };
  }
  //-aqui termina funcion toPrimitives y se va autilizar en infrastructure y testing-//
}
