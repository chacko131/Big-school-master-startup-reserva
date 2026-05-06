"use client";

/**
 * Archivo: FloorPlanCanvas.tsx
 * Responsabilidad: Renderizar el lienzo Konva interactivo con mesas y guías visuales.
 * Tipo: UI
 */

import { Group, Layer, Line, Rect, Circle, Stage, Text } from "react-konva";
import type Konva from "konva";
import { type RefObject, useState } from "react";
import type {
  DiningTableLayoutDefinition,
  FloorPlanTable,
  TableOccupancyInfo,
} from "./floorPlanMocks";
import type { FloorPlanElementPrimitives } from "@/modules/catalog/domain/entities/floor-plan-element.entity";

type TableShape = DiningTableLayoutDefinition["shape"];
type GuideOrientation = "H" | "V";

export interface GuideLine {
  lineGuide: number;
  offset: number;
  orientation: GuideOrientation;
}


interface FloorPlanCanvasProps {
  canvasWidth: number;
  canvasHeight: number;
  workspaceRef: RefObject<HTMLDivElement | null>;
  tables: FloorPlanTable[];
  elements: FloorPlanElementPrimitives[];
  selectedTableId: string;
  selectedElementId: string | null;
  guides: GuideLine[];
  setSelectedTableId: (tableId: string) => void;
  setSelectedElementId: (elementId: string | null) => void;
  onTableDragMove: (
    event: Konva.KonvaEventObject<unknown>,
    tableId: string,
  ) => void;
  onTableDragEnd: (
    event: Konva.KonvaEventObject<unknown>,
    tableId: string,
  ) => void;
  onTableDrop: (tableId: string, x: number, y: number) => void;
  onElementDragMove: (
    event: Konva.KonvaEventObject<unknown>,
    elementId: string,
  ) => void;
  onElementDragEnd: (
    event: Konva.KonvaEventObject<unknown>,
    elementId: string,
  ) => void;
  onNewElementDrop: (type: "WALL" | "WALL_V" | "PLANT", x: number, y: number) => void;
}


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
 * Devuelve colores de fondo y texto para la etiqueta de estado de la mesa.
 * @pure
 */
function getStatusPalette(status: "active" | "inactive" | "occupied"): { fill: string; text: string; label: string } {
  switch (status) {
    case "occupied":
      return { fill: "#dc2626", text: "#ffffff", label: "OCUPADA" };
    case "inactive":
      return { fill: "#6b7280", text: "#ffffff", label: "INACTIVA" };
    case "active":
    default:
      return { fill: "#16a34a", text: "#ffffff", label: "LIBRE" };
  }
}
//-aqui termina funcion getStatusPalette-//

//-aqui empieza componente FloorPlanCanvas y es para dibujar la sala con las mesas-//
/**
 * Renderiza el lienzo central del plano con mesas posicionadas.
 *
 * @sideEffect
 */
interface TooltipState {
  x: number;
  y: number;
  occupancy: TableOccupancyInfo;
  tableName: string;
  tableCapacity: number;
}

const CANVAS_PADDING = 16;

//-aqui empieza funcion formatTime y es para formatear ISO a HH:MM legible-//
/**
 * Convierte una fecha ISO a hora local HH:MM.
 * @pure
 */
function formatTime(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
}
//-aqui termina funcion formatTime-//

//-aqui empieza funcion getStatusBadge y es para resolver etiqueta legible del estado de reserva-//
/**
 * Devuelve la etiqueta en español del estado de reserva.
 * @pure
 */
function getStatusBadge(status: string): { label: string; color: string } {
  switch (status) {
    case "CONFIRMED": return { label: "Confirmada", color: "#16a34a" };
    case "CHECKED_IN": return { label: "En sala", color: "#2563eb" };
    case "PENDING": return { label: "Pendiente", color: "#d97706" };
    default: return { label: status, color: "#6b7280" };
  }
}
//-aqui termina funcion getStatusBadge-//

export function FloorPlanCanvas({
  canvasWidth,
  canvasHeight,
  workspaceRef,
  tables,
  elements,
  selectedTableId,
  selectedElementId,
  guides,
  setSelectedTableId,
  setSelectedElementId,
  onTableDragMove,
  onTableDragEnd,
  onTableDrop,
  onElementDragMove,
  onElementDragEnd,
  onNewElementDrop,
}: FloorPlanCanvasProps) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  return (
    <section className="space-y-4">
      <div
        ref={workspaceRef}
        className="relative overflow-hidden rounded-[32px] bg-white p-4 shadow-sm ring-1 ring-black/5"
        style={{
          backgroundImage:
            "radial-gradient(circle, #e5e7eb 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
        onDragOver={(e) => {
          e.preventDefault(); // allow drop
          e.dataTransfer.dropEffect = "move";
        }}
        onDrop={(e) => {
          e.preventDefault();
          if (!workspaceRef.current) return;

          const tableId = e.dataTransfer.getData("tableId");
          const elementType = e.dataTransfer.getData("elementType");

          if (!tableId && !elementType) return;

          const rect = workspaceRef.current.getBoundingClientRect();
          // Calcula la posición relativa al div (stage)
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          if (tableId) {
            onTableDrop(tableId, Math.round(x), Math.round(y));
          } else if (elementType === "WALL" || elementType === "WALL_V" || elementType === "PLANT") {
            onNewElementDrop(elementType as "WALL" | "WALL_V" | "PLANT", Math.round(x), Math.round(y));
          }
        }}
      >
        {tooltip && (
          <div
            className="pointer-events-none absolute z-50 min-w-[180px] rounded-xl border border-white/10 bg-gray-900 p-3 shadow-2xl"
            style={{ left: tooltip.x + CANVAS_PADDING + 12, top: tooltip.y + CANVAS_PADDING - 8 }}
          >
            <p className="mb-1 text-sm font-bold text-white">{tooltip.tableName}</p>
            <div className="mb-2 flex items-center gap-1.5">
              <span
                className="inline-block rounded-full px-2 py-0.5 text-xs font-semibold"
                style={{ backgroundColor: getStatusBadge(tooltip.occupancy.status).color }}
              >
                {getStatusBadge(tooltip.occupancy.status).label}
              </span>
            </div>
            <p className="text-xs text-gray-300">
              <span className="text-gray-400">Huésped:</span> {tooltip.occupancy.guestName}
            </p>
            <p className="text-xs text-gray-300">
              <span className="text-gray-400">Personas:</span> {tooltip.occupancy.partySize} / {tooltip.tableCapacity}
            </p>
            <p className="text-xs text-gray-300">
              <span className="text-gray-400">Horario:</span> {formatTime(tooltip.occupancy.startAt)} – {formatTime(tooltip.occupancy.endAt)}
            </p>
          </div>
        )}
        <Stage width={canvasWidth} height={canvasHeight}>
          <Layer>
            {tables.map((table) => {
              if (table.x === null || table.y === null) return null;

              const isSelected = table.id === selectedTableId;
              // const statusStyle = getStatusPalette(table.status); // TODO: Conectar con la lógica de disponibilidad real

              return (
                <Group
                  key={table.id}
                  name="table-object"
                  x={table.x}
                  y={table.y}
                  draggable
                  onClick={() => setSelectedTableId(table.id)}
                  onDragMove={(event) => onTableDragMove(event, table.id)}
                  onDragEnd={(event) => { setTooltip(null); onTableDragEnd(event, table.id); }}
                  onMouseEnter={(e) => {
                    if (!table.occupancy) return;
                    const stage = e.target.getStage();
                    if (!stage) return;
                    const pos = stage.getPointerPosition();
                    if (!pos) return;
                    setTooltip({
                      x: pos.x,
                      y: pos.y,
                      occupancy: table.occupancy,
                      tableName: table.name,
                      tableCapacity: table.capacity,
                    });
                  }}
                  onMouseMove={(e) => {
                    if (!table.occupancy || !tooltip) return;
                    const stage = e.target.getStage();
                    if (!stage) return;
                    const pos = stage.getPointerPosition();
                    if (!pos) return;
                    setTooltip((prev) => prev ? { ...prev, x: pos.x, y: pos.y } : prev);
                  }}
                  onMouseLeave={() => setTooltip(null)}
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

                  {/* Propiedades de texto con visibilidad inteligente para evitar desbordamiento */}
                  {table.width > 35 && table.height > 25 && (
                    <Text
                      width={table.width}
                      height={table.width > 70 && table.height > 50 ? table.height / 2 : table.height}
                      y={table.width > 70 && table.height > 50 ? 8 : 0}
                      align="center"
                      verticalAlign="middle"
                      text={table.name}
                      fontSize={Math.min(13, table.width / 5)}
                      fontStyle="bold"
                      fill="white"
                    />
                  )}

                  {table.width > 70 && table.height > 50 && (
                    <Text
                      width={table.width}
                      y={table.height / 2 + 4}
                      align="center"
                      text={`${table.capacity} asientos`}
                      fontSize={10}
                      fontStyle="bold"
                      fill="#f5f5f5"
                      opacity={0.8}
                    />
                  )}

                  {table.width > 60 && table.height > 40 && (() => {
                    const statusStyle = getStatusPalette(table.status);
                    const displayLabel = table.status === "occupied" ? table.statusLabel : statusStyle.label;
                    return (
                      <>
                        <Rect
                          x={table.width / 2 - 42}
                          y={table.height - 28}
                          width={84}
                          height={18}
                          cornerRadius={9}
                          fill={statusStyle.fill}
                        />
                        <Text
                          x={0}
                          y={table.height - 24}
                          width={table.width}
                          align="center"
                          text={displayLabel.length > 12 ? displayLabel.slice(0, 11) + "…" : displayLabel}
                          fontSize={9}
                          fontStyle="bold"
                          fill={statusStyle.text}
                          letterSpacing={0.5}
                        />
                      </>
                    );
                  })()}

                  {isSelected && table.width > 30 && (
                    <Group x={table.width - 14} y={-8}>
                      <Rect
                        width={18}
                        height={18}
                        cornerRadius={9}
                        fill="#86b99a"
                      />
                      <Text
                        width={18}
                        height={18}
                        align="center"
                        verticalAlign="middle"
                        text="✓"
                        fontSize={10}
                        fontStyle="bold"
                        fill="white"
                      />
                    </Group>
                  )}

                  {table.shape === "round" ? (
                    <Rect
                      x={table.width / 2 - 10}
                      y={table.height / 2 - 10}
                      width={20}
                      height={20}
                      cornerRadius={10}
                      fill="#111111"
                      opacity={0.5}
                    />
                  ) : null}

                  <Rect
                    x={0}
                    y={0}
                    width={table.width}
                    height={table.height}
                    cornerRadius={getShapeCornerRadius(table.shape)}
                    opacity={0}
                  />
                </Group>
              );
            })}

            {elements.map((element) => {
              if (element.x === null || element.y === null) return null;
              const isSelected = element.id === selectedElementId;

              return (
                <Group
                  key={element.id}
                  name="decoration-object"
                  x={element.x}
                  y={element.y}
                  rotation={element.rotation}
                  draggable
                  onClick={() => setSelectedElementId(element.id)}
                  onDragMove={(event) => onElementDragMove(event, element.id)}
                  onDragEnd={(event) => onElementDragEnd(event, element.id)}
                >
                  {element.type === "WALL" && (
                    <Rect
                      width={element.width}
                      height={element.height}
                      fill="#334155"
                      cornerRadius={4}
                      stroke={isSelected ? "#3b82f6" : "transparent"}
                      strokeWidth={isSelected ? 4 : 0}
                      shadowBlur={10}
                      shadowOpacity={0.1}
                    />
                  )}
                  {element.type === "PLANT" && (
                    <Group>
                      {/* Base de la maceta si quisieramos, pero usaremos algo simple */}
                      <Circle
                        x={element.width / 2}
                        y={element.height / 2}
                        radius={Math.min(element.width, element.height) / 2}
                        fill="#10b981"
                        stroke={isSelected ? "#3b82f6" : "#047857"}
                        strokeWidth={isSelected ? 4 : 2}
                        shadowBlur={10}
                        shadowOpacity={0.1}
                      />
                      <Circle
                        x={element.width / 2}
                        y={element.height / 2}
                        radius={Math.min(element.width, element.height) / 3}
                        fill="#059669"
                      />
                    </Group>
                  )}
                  {isSelected && (
                    <Rect
                      x={-4}
                      y={-4}
                      width={element.width + 8}
                      height={element.height + 8}
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dash={[4, 4]}
                    />
                  )}
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
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
            Mesas activas
          </p>
          <p className="mt-3 text-4xl font-black text-slate-950">
            {tables.filter((table) => table.isActive).length}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            de {tables.length} en esta zona
          </p>
        </article>

        <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
            Capacidad total
          </p>
          <p className="mt-3 text-4xl font-black text-slate-950">
            {tables.reduce((sum, table) => sum + table.capacity, 0)}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            {tables.length > 0
              ? `media de ${(tables.reduce((sum, table) => sum + table.capacity, 0) / tables.length).toFixed(1)} por mesa`
              : "sin mesas en la zona"}
          </p>
        </article>

        <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
            Combinables
          </p>
          <p className="mt-3 text-4xl font-black text-slate-950">
            {tables.filter((table) => table.isCombinable).length}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            mesas preparadas para grupos
          </p>
        </article>
      </section>

    </section>
  );
}
//-aqui termina componente FloorPlanCanvas-//
