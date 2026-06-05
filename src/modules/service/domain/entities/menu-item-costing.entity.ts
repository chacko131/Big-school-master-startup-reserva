/**
 * Archivo: menu-item-costing.entity.ts
 * Responsabilidad: Entidad de dominio MenuItemCosting — costeo privado de un plato de la carta.
 * Tipo: lógica
 */

import type {
  MenuItemCostingPrimitives,
  UpsertMenuItemCostingProps,
  PreparationArea,
} from "../types/service.types";

// ---------------------------------------------------------------------------
// Error de dominio
// ---------------------------------------------------------------------------

export class MenuItemCostingValidationError extends Error {
  constructor(message: string) {
    super(`MenuItemCosting: ${message}`);
    this.name = "MenuItemCostingValidationError";
  }
}

// ---------------------------------------------------------------------------
// Entidad MenuItemCosting
// ---------------------------------------------------------------------------

//-aqui empieza clase MenuItemCosting y es para encapsular el costeo privado de un plato-//
export class MenuItemCosting {
  private constructor(private readonly props: MenuItemCostingPrimitives) {}

  //-aqui empieza funcion create y es para construir un costing válido-//
  /**
   * Crea un nuevo costing para un plato validando los campos mínimos.
   * @pure
   */
  static create(id: string, props: UpsertMenuItemCostingProps): MenuItemCosting {
    MenuItemCosting.validate(props);

    const now = new Date();
    return new MenuItemCosting({
      id,
      menuItemId: props.menuItemId,
      costUnitPrice: props.costUnitPrice,
      publicUnitPrice: props.publicUnitPrice,
      area: props.area,
      gramsMeta: props.gramsMeta ?? null,
      isActive: props.isActive ?? true,
      version: 1,
      createdAt: now,
      updatedAt: now,
    });
  }
  //-aqui termina funcion create-//

  //-aqui empieza funcion fromPrimitives y es para rehidratar desde la BD-//
  /** @pure */
  static fromPrimitives(props: MenuItemCostingPrimitives): MenuItemCosting {
    return new MenuItemCosting({ ...props });
  }
  //-aqui termina funcion fromPrimitives-//

  //-aqui empieza funcion update y es para actualizar el costeo respetando validaciones-//
  /**
   * Aplica nuevos valores de costing. Retorna una nueva instancia inmutable.
   * @pure
   */
  update(props: UpsertMenuItemCostingProps): MenuItemCosting {
    MenuItemCosting.validate(props);

    return new MenuItemCosting({
      ...this.props,
      costUnitPrice: props.costUnitPrice,
      publicUnitPrice: props.publicUnitPrice,
      area: props.area,
      gramsMeta: props.gramsMeta ?? this.props.gramsMeta,
      isActive: props.isActive ?? this.props.isActive,
      version: this.props.version + 1,
      updatedAt: new Date(),
    });
  }
  //-aqui termina funcion update-//

  //-aqui empieza funcion validate y es para validar las reglas de negocio del costing-//
  /**
   * Valida que los campos obligatorios estén completos.
   * @pure
   */
  private static validate(props: UpsertMenuItemCostingProps): void {
    if (!props.menuItemId.trim()) {
      throw new MenuItemCostingValidationError("menuItemId es obligatorio.");
    }
    if (props.costUnitPrice < 0) {
      throw new MenuItemCostingValidationError("El costo no puede ser negativo.");
    }
    if (props.publicUnitPrice <= 0) {
      throw new MenuItemCostingValidationError(
        "El precio público debe ser mayor que 0."
      );
    }
    if (props.publicUnitPrice < props.costUnitPrice) {
      throw new MenuItemCostingValidationError(
        "El precio público no puede ser menor que el costo."
      );
    }
    const validAreas: PreparationArea[] = ["KITCHEN", "BAR", "NONE"];
    if (!validAreas.includes(props.area)) {
      throw new MenuItemCostingValidationError(
        `Área de preparación inválida: ${props.area}`
      );
    }
  }
  //-aqui termina funcion validate-//

  // Getters
  get id(): string { return this.props.id; }
  get menuItemId(): string { return this.props.menuItemId; }
  get costUnitPrice(): number { return this.props.costUnitPrice; }
  get publicUnitPrice(): number { return this.props.publicUnitPrice; }
  get margin(): number { return this.props.publicUnitPrice - this.props.costUnitPrice; }
  get marginPercent(): number {
    if (this.props.publicUnitPrice === 0) return 0;
    return Math.round((this.margin / this.props.publicUnitPrice) * 100);
  }
  get area(): PreparationArea { return this.props.area; }
  get gramsMeta(): Record<string, unknown> | null { return this.props.gramsMeta; }
  get isActive(): boolean { return this.props.isActive; }
  get version(): number { return this.props.version; }

  //-aqui empieza funcion toPrimitives y es para serializar la entidad-//
  /** @pure */
  toPrimitives(): MenuItemCostingPrimitives {
    return { ...this.props };
  }
  //-aqui termina funcion toPrimitives-//
}
//-aqui termina clase MenuItemCosting-//
