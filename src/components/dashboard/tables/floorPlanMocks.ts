/**
 * Archivo: floorPlanMocks.ts
 * Responsabilidad: Exponer tipos del dominio de UI del editor de mesas.
 *   Los datos mock estáticos (floorPlanInsightDefinitions, floorPlanChangeDefinitions,
 *   diningTableLayoutDefinitions) han sido eliminados ya que el módulo opera
 *   únicamente con datos reales de base de datos.
 * Tipo: lógica (tipos/UI)
 */

export type FloorPlanToolKind = "square" | "round" | "bar";

export interface FloorPlanToolDefinition {
  label: string;
  hint: string;
  kind: FloorPlanToolKind;
}

export interface DiningTableLayoutDefinition {
  id: string;
  name: string;
  capacity: number;
  isActive: boolean;
  isCombinable: boolean;
  sortOrder: number;
  shape: "square" | "round" | "bar";
  x: number | null;
  y: number | null;
  width: number;
  height: number;
  zoneId: string | null;
  zone: string;
  statusLabel: string;
  statusTone: "active" | "inactive" | "occupied";
}

export interface FloorPlanTable extends DiningTableLayoutDefinition {
  restaurantId: string;
  status: DiningTableLayoutDefinition["statusTone"];
}

export const floorPlanToolDefinitions: ReadonlyArray<FloorPlanToolDefinition> =
  [
    {
      label: "Cuadrada",
      hint: "4 asientos",
      kind: "square",
    },
    {
      label: "Redonda",
      hint: "6 asientos",
      kind: "round",
    },
    {
      label: "Barra",
      hint: "2 asientos",
      kind: "bar",
    },
  ] as const;
