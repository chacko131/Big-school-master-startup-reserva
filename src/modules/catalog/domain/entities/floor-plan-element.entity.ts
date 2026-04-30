import { z } from "zod";

/**
 * Archivo: floor-plan-element.entity.ts
 * Responsabilidad: Definir la entidad de dominio para los elementos decorativos del plano.
 * Tipo: lógica
 */

//-aqui empieza validacion FloorPlanElementSchema y es para garantizar integridad de datos-//
export const FloorPlanElementSchema = z.object({
  id: z.string().min(1, "El ID es requerido"),
  restaurantId: z.string().min(1, "El ID del restaurante es requerido"),
  zoneId: z.string().nullable(),
  type: z.enum(["WALL", "PLANT"]),
  x: z.number(),
  y: z.number(),
  width: z.number().positive("El ancho debe ser positivo"),
  height: z.number().positive("El alto debe ser positivo"),
  rotation: z.number().min(0).max(360).default(0),
});
//-aqui termina validacion FloorPlanElementSchema-//

export type FloorPlanElementPrimitives = z.infer<typeof FloorPlanElementSchema>;

export class FloorPlanElement {
  private constructor(private readonly props: FloorPlanElementPrimitives) {}

  //-aqui empieza funcion create y es para instanciar la entidad-//
  /**
   * Crea una nueva instancia validada de un elemento del plano.
   * @pure
   */
  public static create(props: FloorPlanElementPrimitives): FloorPlanElement {
    const validProps = FloorPlanElementSchema.parse(props);
    return new FloorPlanElement(validProps);
  }
  //-aqui termina funcion create-//

  //-aqui empieza funcion toPrimitives y es para extraer datos planos-//
  /**
   * Exporta las propiedades planas de la entidad.
   * @pure
   */
  public toPrimitives(): FloorPlanElementPrimitives {
    return { ...this.props };
  }
  //-aqui termina funcion toPrimitives-//

  // Getters
  get id(): string {
    return this.props.id;
  }

  get restaurantId(): string {
    return this.props.restaurantId;
  }

  get zoneId(): string | null {
    return this.props.zoneId;
  }

  get type(): "WALL" | "PLANT" {
    return this.props.type;
  }

  get x(): number {
    return this.props.x;
  }

  get y(): number {
    return this.props.y;
  }

  get width(): number {
    return this.props.width;
  }

  get height(): number {
    return this.props.height;
  }

  get rotation(): number {
    return this.props.rotation;
  }
}
