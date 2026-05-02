/**
 * Archivo: menu-category.entity.ts
 * Responsabilidad: Representar una categoría de la carta del restaurante.
 * Tipo: lógica
 */

export interface MenuCategoryPrimitives {
  id: string;
  restaurantId: string;
  name: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMenuCategoryProps {
  id: string;
  restaurantId: string;
  name: string;
  description?: string | null;
  sortOrder?: number;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class MenuCategory {
  private constructor(private readonly props: MenuCategoryPrimitives) {}

  //-aqui empieza funcion create y es para construir un MenuCategory válido-//
  /**
   * Crea una categoría de menú validando campos mínimos.
   * @pure
   */
  static create(props: CreateMenuCategoryProps): MenuCategory {
    if (!props.restaurantId.trim()) {
      throw new Error("MenuCategory: restaurantId es obligatorio.");
    }
    if (!props.name.trim()) {
      throw new Error("MenuCategory: name es obligatorio.");
    }

    const now = new Date();

    return new MenuCategory({
      id: props.id,
      restaurantId: props.restaurantId.trim(),
      name: props.name.trim(),
      description: props.description?.trim() || null,
      sortOrder: props.sortOrder ?? 0,
      isActive: props.isActive ?? true,
      createdAt: props.createdAt ?? now,
      updatedAt: props.updatedAt ?? now,
    });
  }
  //-aqui termina funcion create y se va autilizar en application e infrastructure-//

  //-aqui empieza funcion fromPrimitives y es para rehidratar la entidad desde datos persistidos-//
  /** @pure */
  static fromPrimitives(props: MenuCategoryPrimitives): MenuCategory {
    return MenuCategory.create(props);
  }
  //-aqui termina funcion fromPrimitives y se va autilizar en repositories-//

  get id(): string { return this.props.id; }
  get restaurantId(): string { return this.props.restaurantId; }
  get name(): string { return this.props.name; }
  get description(): string | null { return this.props.description; }
  get sortOrder(): number { return this.props.sortOrder; }
  get isActive(): boolean { return this.props.isActive; }

  //-aqui empieza funcion toPrimitives y es para exponer la entidad en formato serializable-//
  /** @pure */
  toPrimitives(): MenuCategoryPrimitives {
    return { ...this.props };
  }
  //-aqui termina funcion toPrimitives y se va autilizar en infrastructure y testing-//
}
