/**
 * Archivo: FloorPlanWorkspace.tsx
 * Responsabilidad: Mantener una API estable para el workspace del editor de mesas.
 * Tipo: UI
 */

import { FloorPlanEditor } from "./FloorPlanEditor";
import type { FloorPlanTable } from "./floorPlanMocks";
import type { RestaurantZonePrimitives } from "@/modules/catalog/domain/entities/restaurant-zone.entity";

interface FloorPlanWorkspaceProps {
  initialTables: FloorPlanTable[];
  initialZones: RestaurantZonePrimitives[];
}

//-aqui empieza componente FloorPlanWorkspace y es para mantener el punto de entrada del editor-//
/**
 * Renderiza el editor interactivo de mesas usando el nuevo sandbox Konva.
 * @pure
 */
export function FloorPlanWorkspace({ initialTables, initialZones }: FloorPlanWorkspaceProps) {
  return <FloorPlanEditor initialTables={initialTables} initialZones={initialZones} />;
}
//-aqui termina componente FloorPlanWorkspace-//
