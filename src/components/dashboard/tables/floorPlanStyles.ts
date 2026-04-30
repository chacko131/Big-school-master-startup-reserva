/**
 * Archivo: floorPlanStyles.ts
 * Responsabilidad: Compartir funciones de estilo para las vistas del editor de mesas.
 * Tipo: lógica (estilos/UI)
 */

import { type DiningTableLayoutDefinition, type FloorPlanToolKind } from "./floorPlanMocks";

//-aqui empieza funcion getDiningTableStatusClassName y es para colorear el estado de cada mesa-//
/**
 * Devuelve las clases de estado de una mesa.
 *
 * @pure
 */
export function getDiningTableStatusClassName(statusTone: DiningTableLayoutDefinition["statusTone"]): string {
  if (statusTone === "inactive") {
    return "bg-surface-container-highest text-on-surface-variant";
  }

  if (statusTone === "occupied") {
    return "bg-tertiary-fixed text-on-tertiary-fixed";
  }

  return "bg-secondary-container text-on-secondary-container";
}
//-aqui termina funcion getDiningTableStatusClassName-//

//-aqui empieza funcion getFloorPlanToolKindClassName y es para dar forma visual a cada herramienta del editor-//
/**
 * Devuelve las clases de forma para la herramienta del panel lateral.
 *
 * @pure
 */
export function getFloorPlanToolKindClassName(kind: FloorPlanToolKind): string {
  if (kind === "square") {
    return "rounded-sm bg-primary";
  }

  if (kind === "round") {
    return "rounded-full bg-secondary";
  }

  if (kind === "bar") {
    return "rounded-full bg-tertiary-container";
  }

  return "rounded-full bg-secondary-container";
}
//-aqui termina funcion getFloorPlanToolKindClassName-//

//-aqui empieza funcion getDiningTableShapeClassName y es para definir el contenedor de cada mesa del plano-//
/**
 * Devuelve las clases del bloque principal de cada mesa.
 *
 * @pure
 */
export function getDiningTableShapeClassName(shape: DiningTableLayoutDefinition["shape"], isSelected: boolean): string {
  const selectedClassName = isSelected ? "ring-4 ring-primary ring-offset-2 ring-offset-white shadow-xl" : "shadow-sm hover:shadow-md";

  if (shape === "round") {
    return `rounded-full ${selectedClassName}`;
  }

  if (shape === "bar") {
    return `rounded-xl ${selectedClassName}`;
  }

  return `rounded-xl ${selectedClassName}`;
}
//-aqui termina funcion getDiningTableShapeClassName-//

//-aqui empieza funcion getPropertyIndicatorClassName y es para mostrar el estado del interruptor visual-//
/**
 * Devuelve el color del indicador de propiedad.
 *
 * @pure
 */
export function getPropertyIndicatorClassName(value: boolean): string {
  return value ? "bg-secondary" : "bg-zinc-300";
}
//-aqui termina funcion getPropertyIndicatorClassName-//

//-aqui empieza funcion getTableSizeLabel y es para mostrar el tamaño humano de la mesa-//
/**
 * Devuelve una descripción humana del tipo de mesa.
 *
 * @pure
 */
export function getTableSizeLabel(shape: DiningTableLayoutDefinition["shape"]): string {
  if (shape === "round") {
    return "Unidad redonda";
  }

  if (shape === "bar") {
    return "Unidad de barra";
  }

  return "Unidad cuadrada";
}
//-aqui termina funcion getTableSizeLabel-//
