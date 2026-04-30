/**
 * Archivo: floorPlanMocks.ts
 * Responsabilidad: Exponer tipos y datos mock del editor de mesas para la vista de dashboard.
 * Tipo: lógica (mock/UI)
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
  status: DiningTableLayoutDefinition["statusTone"];
}

export interface FloorPlanInsightDefinition {
  title: string;
  value: string;
  description: string;
}

export interface FloorPlanChangeDefinition {
  time: string;
  title: string;
  description: string;
}

export const floorPlanToolDefinitions: ReadonlyArray<FloorPlanToolDefinition> = [
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

export const diningTableLayoutDefinitions: ReadonlyArray<DiningTableLayoutDefinition> = [
  {
    id: "table-01",
    name: "Mesa 01",
    capacity: 4,
    isActive: true,
    isCombinable: false,
    sortOrder: 1,
    shape: "square",
    x: 120,
    y: 118,
    width: 96,
    height: 96,
    zoneId: null,
    zone: "Salón principal",
    statusLabel: "Seleccionada",
    statusTone: "active",
  },
  {
    id: "table-02",
    name: "Mesa 02",
    capacity: 4,
    isActive: true,
    isCombinable: true,
    sortOrder: 2,
    shape: "square",
    x: 350,
    y: 118,
    width: 96,
    height: 96,
    zoneId: null,
    zone: "Salón principal",
    statusLabel: "Disponible",
    statusTone: "active",
  },
  {
    id: "table-03",
    name: "Mesa 03",
    capacity: 6,
    isActive: true,
    isCombinable: true,
    sortOrder: 3,
    shape: "round",
    x: 120,
    y: 300,
    width: 128,
    height: 128,
    zoneId: null,
    zone: "Terraza",
    statusLabel: "Disponible",
    statusTone: "active",
  },
  {
    id: "table-04",
    name: "Mesa 04",
    capacity: 2,
    isActive: false,
    isCombinable: false,
    sortOrder: 4,
    shape: "bar",
    x: 370,
    y: 285,
    width: 132,
    height: 72,
    zoneId: null,
    zone: "Barra",
    statusLabel: "Inactiva",
    statusTone: "inactive",
  },
  {
    id: "table-05",
    name: "Mesa 05",
    capacity: 8,
    isActive: true,
    isCombinable: true,
    sortOrder: 5,
    shape: "square",
    x: 250,
    y: 460,
    width: 132,
    height: 92,
    zoneId: null,
    zone: "Lounge privado",
    statusLabel: "Ocupada",
    statusTone: "occupied",
  },
] as const;

export const floorPlanInsightDefinitions: ReadonlyArray<FloorPlanInsightDefinition> = [
  {
    title: "Mesas activas",
    value: "12",
    description: "8 libres, 3 ocupadas, 1 inactiva",
  },
  {
    title: "Capacidad media",
    value: "4.6",
    description: "Ponderada por el área activa del plano",
  },
  {
    title: "Combinables",
    value: "4",
    description: "Mesas preparadas para grupos",
  },
] as const;

export const floorPlanChangeDefinitions: ReadonlyArray<FloorPlanChangeDefinition> = [
  {
    time: "10:40",
    title: "Mesa 05 movida",
    description: "La mesa del lounge privado se desplazó 20px para alinearse con el nuevo separador.",
  },
  {
    time: "11:15",
    title: "Mesa 02 combinada",
    description: "La segunda mesa ahora puede combinarse con la Mesa 03 para grupos grandes.",
  },
  {
    time: "11:48",
    title: "Zona de servicio actualizada",
    description: "La cobertura de terraza cambió después de la revisión de montaje de la mañana.",
  },
] as const;

export const selectedTableIdMock = "table-01";
