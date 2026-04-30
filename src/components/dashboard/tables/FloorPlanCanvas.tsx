"use client";

/**
 * Archivo: FloorPlanCanvas.tsx
 * Responsabilidad: Renderizar el lienzo Konva interactivo con mesas y guías visuales.
 * Tipo: UI
 */

import { Group, Layer, Line, Rect, Stage, Text } from "react-konva";
import type Konva from "konva";
import type { RefObject } from "react";
import type { DiningTableLayoutDefinition, FloorPlanTable } from "./floorPlanMocks";

type TableShape = DiningTableLayoutDefinition["shape"];
type GuideOrientation = "H" | "V";

export interface GuideLine {
  lineGuide: number;
  offset: number;
  orientation: GuideOrientation;
}

interface StatusPalette {
  label: string;
  fill: string;
  text: string;
}

interface FloorPlanCanvasProps {
  canvasWidth: number;
  canvasHeight: number;
  workspaceRef: RefObject<HTMLDivElement | null>;
  tables: FloorPlanTable[];
  selectedTableId: string;
  guides: GuideLine[];
  setSelectedTableId: (tableId: string) => void;
  onTableDragMove: (event: Konva.KonvaEventObject<unknown>, tableId: string) => void;
  onTableDragEnd: (event: Konva.KonvaEventObject<unknown>, tableId: string) => void;
  onTableDrop: (tableId: string, x: number, y: number) => void;
}

const tableStatusPalette: Record<FloorPlanTable["status"], StatusPalette> = {
  active: {
    label: "Disponible",
    fill: "#c7ead3",
    text: "#173b27",
  },
  occupied: {
    label: "Ocupada",
    fill: "#f7c9bf",
    text: "#54261d",
  },
  inactive: {
    label: "Inactiva",
    fill: "#e3e3e3",
    text: "#4b4b4b",
  },
};

//-aqui empieza funcion getShapeCornerRadius y es para redondear las mesas según su forma-//
/**
 * Devuelve el radio de esquina según la forma de la mesa.
 *
 * @pure
 */
function getShapeCornerRadius(shape: TableShape): number {
  if (shape === "round") {
    return 999;
  }

  if (shape === "bar") {
    return 16;
  }

  return 18;
}
//-aqui termina funcion getShapeCornerRadius-//

//-aqui empieza funcion getStatusPalette y es para resolver el estilo del estado-//
/**
 * Devuelve la paleta visual de estado para una mesa.
 *
 * @pure
 */
function getStatusPalette(status: FloorPlanTable["status"]): StatusPalette {
  return tableStatusPalette[status];
}
//-aqui termina funcion getStatusPalette-//

//-aqui empieza componente FloorPlanCanvas y es para dibujar la sala con las mesas-//
/**
 * Renderiza el lienzo central del plano con mesas posicionadas.
 *
 * @sideEffect
 */
export function FloorPlanCanvas({
  canvasWidth,
  canvasHeight,
  workspaceRef,
  tables,
  selectedTableId,
  guides,
  setSelectedTableId,
  onTableDragMove,
  onTableDragEnd,
  onTableDrop,
}: FloorPlanCanvasProps) {
  return (
    <section className="space-y-4">
      <div
        ref={workspaceRef}
        className="overflow-hidden rounded-[32px] bg-white p-4 shadow-sm ring-1 ring-black/5"
        style={{
          backgroundImage: "radial-gradient(circle, #e5e7eb 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
        onDragOver={(e) => {
          e.preventDefault(); // allow drop
          e.dataTransfer.dropEffect = "move";
        }}
        onDrop={(e) => {
          e.preventDefault();
          const tableId = e.dataTransfer.getData("tableId");
          if (!tableId || !workspaceRef.current) return;
          
          const rect = workspaceRef.current.getBoundingClientRect();
          // Calcula la posición relativa al div (stage)
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          onTableDrop(tableId, Math.round(x), Math.round(y));
        }}
      >
        <Stage width={canvasWidth} height={canvasHeight}>
          <Layer>
            {tables.map((table) => {
              if (table.x === null || table.y === null) return null;

              const isSelected = table.id === selectedTableId;
              const statusStyle = getStatusPalette(table.status);

              return (
                <Group
                  key={table.id}
                  name="table-object"
                  x={table.x}
                  y={table.y}
                  draggable
                  onClick={() => setSelectedTableId(table.id)}
                  onDragMove={(event) => onTableDragMove(event, table.id)}
                  onDragEnd={(event) => onTableDragEnd(event, table.id)}
                >
                  <Rect
                    width={table.width}
                    height={table.height}
                    fill="#060606"
                    stroke={isSelected ? "#ffffff" : "transparent"}
                    strokeWidth={isSelected ? 4 : 0}
                    cornerRadius={getShapeCornerRadius(table.shape)}
                    shadowBlur={isSelected ? 20 : 12}
                    shadowOpacity={0.18}
                    opacity={table.isActive ? 1 : 0.82}
                  />

                  <Rect
                    x={6}
                    y={6}
                    width={table.width - 12}
                    height={table.height - 12}
                    cornerRadius={getShapeCornerRadius(table.shape) - 4}
                    stroke={isSelected ? "#ffffff" : "#1d1d1d"}
                    strokeWidth={table.shape === "square" ? 1.5 : 0}
                    dash={[6, 4]}
                    opacity={table.shape === "square" && !isSelected ? 0.4 : 0}
                  />

                  <Text width={table.width} y={12} align="center" text={table.name} fontSize={13} fontStyle="bold" fill="white" />
                  <Text width={table.width} y={30} align="center" text={`${table.capacity} asientos`} fontSize={10} fontStyle="bold" fill="#f5f5f5" />

                  <Rect x={table.width / 2 - 42} y={table.height - 28} width={84} height={18} cornerRadius={9} fill={statusStyle.fill} />
                  <Text
                    x={0}
                    y={table.height - 24}
                    width={table.width}
                    align="center"
                    text={statusStyle.label.toUpperCase()}
                    fontSize={9}
                    fontStyle="bold"
                    fill={statusStyle.text}
                    letterSpacing={1}
                  />

                  {isSelected ? (
                    <Group x={table.width - 18} y={-10}>
                      <Rect width={22} height={22} cornerRadius={11} fill="#86b99a" />
                      <Text width={22} height={22} align="center" verticalAlign="middle" text="✓" fontSize={12} fontStyle="bold" fill="white" />
                    </Group>
                  ) : null}

                  {table.shape === "round" ? (
                    <Rect x={table.width / 2 - 10} y={table.height / 2 - 10} width={20} height={20} cornerRadius={10} fill="#111111" opacity={0.5} />
                  ) : null}

                  <Rect x={0} y={0} width={table.width} height={table.height} cornerRadius={getShapeCornerRadius(table.shape)} opacity={0} />
                </Group>
              );
            })}

            {guides.map((guide) => {
              if (guide.orientation === "H") {
                return (
                  <Line
                    key={`guide-h-${guide.lineGuide}`}
                    points={[-6000, 0, 6000, 0]}
                    stroke="#0091ff"
                    strokeWidth={1}
                    dash={[4, 6]}
                    x={0}
                    y={guide.lineGuide}
                  />
                );
              }

              return (
                <Line
                  key={`guide-v-${guide.lineGuide}`}
                  points={[0, -6000, 0, 6000]}
                  stroke="#0091ff"
                  strokeWidth={1}
                  dash={[4, 6]}
                  x={guide.lineGuide}
                  y={0}
                />
              );
            })}
          </Layer>
        </Stage>
      </div>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Mesas activas</p>
          <p className="mt-3 text-4xl font-black text-slate-950">{tables.filter((table) => table.isActive).length}</p>
          <p className="mt-2 text-sm text-slate-600">8 libres, 3 ocupadas, 1 inactiva</p>
        </article>

        <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Capacidad media</p>
          <p className="mt-3 text-4xl font-black text-slate-950">
            {tables.length > 0 ? (tables.reduce((sum, table) => sum + table.capacity, 0) / tables.length).toFixed(1) : "0.0"}
          </p>
          <p className="mt-2 text-sm text-slate-600">Ponderada por el área activa del plano</p>
        </article>

        <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Combinables</p>
          <p className="mt-3 text-4xl font-black text-slate-950">{tables.filter((table) => table.isCombinable).length}</p>
          <p className="mt-2 text-sm text-slate-600">Mesas preparadas para grupos</p>
        </article>
      </section>
    </section>
  );
}
//-aqui termina componente FloorPlanCanvas-//
