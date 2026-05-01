/**
 * Archivo: floorPlanStyles.ts
 * Responsabilidad: Compartir funciones de estilo puras para las vistas del editor de mesas.
 *   Se han eliminado getDiningTableStatusClassName (solo usada por FloorPlanInsights.tsx,
 *   ahora eliminado) y getDiningTableShapeClassName (sin consumidor activo).
 * Tipo: lógica (estilos/UI)
 */

import { type DiningTableLayoutDefinition, type FloorPlanToolKind } from "./floorPlanMocks";

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

//-aqui empieza funcion getPropertyIndicatorClassName y es para mostrar el estado del interruptor visual-//
/**
 * Devuelve el color del indicador de propiedad (toggle activo/inactivo).
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
