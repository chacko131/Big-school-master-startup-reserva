"use client";

/**
 * Archivo: page.tsx
 * Responsabilidad: Servir como sandbox aislado para probar el editor de mesas con Konva.
 * Tipo: UI
 */

import { useEffect, useMemo, useRef, useState } from "react";
import Konva from "konva";
import { Group, Layer, Line, Rect, Stage, Text } from "react-konva";

type TableShape = "square" | "round" | "bar";
type TableStatus = "available" | "occupied" | "inactive";
type GuideOrientation = "H" | "V";
type GuideSnap = "start" | "center" | "end";

interface FloorTable {
  id: string;
  name: string;
  zone: string;
  capacity: number;
  isActive: boolean;
  isCombinable: boolean;
  status: TableStatus;
  shape: TableShape;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface LineGuideStops {
  vertical: number[];
  horizontal: number[];
}

interface SnappingEdge {
  guide: number;
  offset: number;
  snap: GuideSnap;
}

interface SnappingEdges {
  vertical: SnappingEdge[];
  horizontal: SnappingEdge[];
}

interface SnappingCandidate {
  lineGuide: number;
  diff: number;
  snap: GuideSnap;
  offset: number;
}

interface GuideLine {
  lineGuide: number;
  offset: number;
  orientation: GuideOrientation;
  snap: GuideSnap;
}

const GUIDELINE_OFFSET = 5;
const CANVAS_HEIGHT = 760;

const tableStatusStyles: Record<TableStatus, { pillFill: string; pillText: string; label: string }> = {
  available: {
    pillFill: "#c7ead3",
    pillText: "#173b27",
    label: "Disponible",
  },
  occupied: {
    pillFill: "#f7c9bf",
    pillText: "#54261d",
    label: "Ocupada",
  },
  inactive: {
    pillFill: "#e3e3e3",
    pillText: "#4b4b4b",
    label: "Inactiva",
  },
};

const initialTables: FloorTable[] = [
  {
    id: "table-01",
    name: "Mesa 01",
    zone: "Salón principal",
    capacity: 4,
    isActive: true,
    isCombinable: false,
    status: "available",
    shape: "square",
    x: 130,
    y: 120,
    width: 96,
    height: 96,
  },
  {
    id: "table-02",
    name: "Mesa 02",
    zone: "Salón principal",
    capacity: 4,
    isActive: true,
    isCombinable: true,
    status: "available",
    shape: "square",
    x: 340,
    y: 120,
    width: 96,
    height: 96,
  },
  {
    id: "table-03",
    name: "Mesa 03",
    zone: "Terraza",
    capacity: 6,
    isActive: true,
    isCombinable: true,
    status: "available",
    shape: "round",
    x: 120,
    y: 295,
    width: 128,
    height: 128,
  },
  {
    id: "table-04",
    name: "Mesa 04",
    zone: "Barra",
    capacity: 2,
    isActive: false,
    isCombinable: false,
    status: "inactive",
    shape: "bar",
    x: 365,
    y: 290,
    width: 136,
    height: 72,
  },
  {
    id: "table-05",
    name: "Mesa 05",
    zone: "Lounge privado",
    capacity: 8,
    isActive: true,
    isCombinable: true,
    status: "occupied",
    shape: "square",
    x: 250,
    y: 470,
    width: 136,
    height: 92,
  },
];

//-aqui empieza funcion getLineGuideStops y es para calcular los ejes de snapping del canvas-//
/**
 * Calcula las guías a las que puede snapear el objeto arrastrado.
 *
 * @pure
 */
function getLineGuideStops(stage: Konva.Stage, skipShape: Konva.Node): LineGuideStops {
  const vertical: number[] = [0, stage.width() / 2, stage.width()];
  const horizontal: number[] = [0, stage.height() / 2, stage.height()];

  stage.find(".table-object").forEach((guideItem) => {
    if (guideItem === skipShape) {
      return;
    }

    const box = guideItem.getClientRect();

    vertical.push(box.x, box.x + box.width, box.x + box.width / 2);
    horizontal.push(box.y, box.y + box.height, box.y + box.height / 2);
  });

  return {
    vertical,
    horizontal,
  };
}
//-aqui termina funcion getLineGuideStops-//

//-aqui empieza funcion getObjectSnappingEdges y es para definir los puntos de snap del objeto-//
/**
 * Obtiene los bordes de snapping del nodo arrastrado.
 *
 * @pure
 */
function getObjectSnappingEdges(node: Konva.Node): SnappingEdges {
  const box = node.getClientRect();
  const absPos = node.absolutePosition();

  return {
    vertical: [
      {
        guide: Math.round(box.x),
        offset: Math.round(absPos.x - box.x),
        snap: "start",
      },
      {
        guide: Math.round(box.x + box.width / 2),
        offset: Math.round(absPos.x - box.x - box.width / 2),
        snap: "center",
      },
      {
        guide: Math.round(box.x + box.width),
        offset: Math.round(absPos.x - box.x - box.width),
        snap: "end",
      },
    ],
    horizontal: [
      {
        guide: Math.round(box.y),
        offset: Math.round(absPos.y - box.y),
        snap: "start",
      },
      {
        guide: Math.round(box.y + box.height / 2),
        offset: Math.round(absPos.y - box.y - box.height / 2),
        snap: "center",
      },
      {
        guide: Math.round(box.y + box.height),
        offset: Math.round(absPos.y - box.y - box.height),
        snap: "end",
      },
    ],
  };
}
//-aqui termina funcion getObjectSnappingEdges-//

//-aqui empieza funcion getGuides y es para elegir la guía más cercana-//
/**
 * Calcula las guías más cercanas para aplicar snapping.
 *
 * @pure
 */
function getGuides(lineGuideStops: LineGuideStops, itemBounds: SnappingEdges): GuideLine[] {
  const resultV: SnappingCandidate[] = [];
  const resultH: SnappingCandidate[] = [];

  lineGuideStops.vertical.forEach((lineGuide) => {
    itemBounds.vertical.forEach((itemBound) => {
      const diff = Math.abs(lineGuide - itemBound.guide);

      if (diff < GUIDELINE_OFFSET) {
        resultV.push({
          lineGuide,
          diff,
          snap: itemBound.snap,
          offset: itemBound.offset,
        });
      }
    });
  });

  lineGuideStops.horizontal.forEach((lineGuide) => {
    itemBounds.horizontal.forEach((itemBound) => {
      const diff = Math.abs(lineGuide - itemBound.guide);

      if (diff < GUIDELINE_OFFSET) {
        resultH.push({
          lineGuide,
          diff,
          snap: itemBound.snap,
          offset: itemBound.offset,
        });
      }
    });
  });

  const guides: GuideLine[] = [];
  const minV = resultV.sort((a, b) => a.diff - b.diff)[0];
  const minH = resultH.sort((a, b) => a.diff - b.diff)[0];

  if (minV) {
    guides.push({
      lineGuide: minV.lineGuide,
      offset: minV.offset,
      orientation: "V",
      snap: minV.snap,
    });
  }

  if (minH) {
    guides.push({
      lineGuide: minH.lineGuide,
      offset: minH.offset,
      orientation: "H",
      snap: minH.snap,
    });
  }

  return guides;
}
//-aqui termina funcion getGuides-//

//-aqui empieza funcion getShapeCornerRadius y es para redondear las mesas según su forma-//
/**
 * Devuelve el radio de esquina según la forma de la mesa.
 *
 * @pure
 */
function getShapeCornerRadius(table: FloorTable): number {
  if (table.shape === "round") {
    return Math.min(table.width, table.height) / 2;
  }

  if (table.shape === "bar") {
    return 16;
  }

  return 18;
}
//-aqui termina funcion getShapeCornerRadius-//

//-aqui empieza funcion getTableSizeLabel y es para mostrar el tamaño en el panel-//
/**
 * Devuelve una descripción humana del tipo de mesa.
 *
 * @pure
 */
function getTableSizeLabel(shape: TableShape): string {
  if (shape === "round") {
    return "Unidad redonda";
  }

  if (shape === "bar") {
    return "Unidad de barra";
  }

  return "Unidad cuadrada";
}
//-aqui termina funcion getTableSizeLabel-//

//-aqui empieza componente TestPage y es para probar el editor de mesas con Konva-//
/**
 * Renderiza un sandbox aislado con snapping, selección y panel de propiedades.
 *
 * @sideEffect
 */
export default function TestPage() {
  const workspaceRef = useRef<HTMLDivElement | null>(null);
  const [canvasWidth, setCanvasWidth] = useState(1200);
  const [tables, setTables] = useState<FloorTable[]>(initialTables);
  const [selectedTableId, setSelectedTableId] = useState(initialTables[0]?.id ?? "table-01");
  const [guides, setGuides] = useState<GuideLine[]>([]);

  useEffect(() => {
    const updateSize = () => {
      if (workspaceRef.current === null) {
        return;
      }

      setCanvasWidth(Math.max(320, workspaceRef.current.clientWidth));
    };

    updateSize();

    if (typeof ResizeObserver === "undefined" || workspaceRef.current === null) {
      return;
    }

    const observer = new ResizeObserver(() => {
      updateSize();
    });

    observer.observe(workspaceRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  const selectedTable = useMemo(() => {
    return tables.find((table) => table.id === selectedTableId) ?? tables[0];
  }, [selectedTableId, tables]);

  const activeCount = tables.filter((table) => table.isActive).length;
  const combinableCount = tables.filter((table) => table.isCombinable).length;
  const averageCapacity = tables.length > 0 ? (tables.reduce((sum, table) => sum + table.capacity, 0) / tables.length).toFixed(1) : "0.0";

  const updateSelectedTable = (patch: Partial<FloorTable>) => {
    setTables((currentTables) =>
      currentTables.map((table) =>
        table.id === selectedTable.id
          ? {
              ...table,
              ...patch,
            }
          : table,
      ),
    );
  };

  //-aqui empieza funcion handleDragMove y es para aplicar snapping mientras se arrastra una mesa-//
  /**
   * Ajusta la posición de la mesa arrastrada y muestra las guías visuales.
   *
   * @sideEffect
   */
  const handleDragMove = (event: Konva.KonvaEventObject<unknown>, tableId: string) => {
    const stage = event.target.getStage();

    if (stage === null) {
      return;
    }

    const draggedNode = event.target;
    const lineGuideStops = getLineGuideStops(stage, draggedNode);
    const itemBounds = getObjectSnappingEdges(draggedNode);
    const nextGuides = getGuides(lineGuideStops, itemBounds);

    setGuides(nextGuides);

    if (nextGuides.length === 0) {
      return;
    }

    const absPos = draggedNode.absolutePosition();

    nextGuides.forEach((guide) => {
      if (guide.orientation === "V") {
        absPos.x = guide.lineGuide + guide.offset;
      }

      if (guide.orientation === "H") {
        absPos.y = guide.lineGuide + guide.offset;
      }
    });

    draggedNode.absolutePosition(absPos);
    setSelectedTableId(tableId);
  };
  //-aqui termina funcion handleDragMove-//

  //-aqui empieza funcion handleDragEnd y es para guardar la posición local de la mesa-//
  /**
   * Sincroniza la posición final de la mesa arrastrada con el estado local.
   *
   * @sideEffect
   */
  const handleDragEnd = (event: Konva.KonvaEventObject<unknown>, tableId: string) => {
    const node = event.target;

    setTables((currentTables) =>
      currentTables.map((table) =>
        table.id === tableId
          ? {
              ...table,
              x: node.x(),
              y: node.y(),
            }
          : table,
      ),
    );
    setGuides([]);
    setSelectedTableId(tableId);
  };
  //-aqui termina funcion handleDragEnd-//

  return (
    <div className="min-h-screen bg-[#f4efe7] p-6 text-slate-900">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
        <section className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-black/5 md:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Editor de mesas · sandbox Konva</p>
              <h1 className="mt-3 text-4xl font-black tracking-tighter text-slate-950 md:text-6xl">Organiza la sala y ajusta cada mesa.</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
                Prueba aislada con snapping, selección y edición local para validar el comportamiento visual antes de conectar la lógica real.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button className="inline-flex items-center justify-center rounded-lg bg-slate-200 px-6 py-3 text-sm font-bold text-slate-800 transition-colors hover:bg-slate-300" type="button">
                Ver reservas
              </button>
              <button className="inline-flex items-center justify-center rounded-lg bg-slate-950 px-6 py-3 text-sm font-bold text-white opacity-50" type="button" disabled>
                Guardar cambios
              </button>
            </div>
          </div>
        </section>

        <main className="grid grid-cols-1 gap-6 xl:grid-cols-[160px_minmax(0,1fr)_320px]">
          <aside className="flex flex-row flex-wrap gap-3 rounded-[28px] bg-white p-4 shadow-sm ring-1 ring-black/5 xl:flex-col xl:gap-6 xl:p-6">
            {[
              { label: "Cuadrada", hint: "4 asientos", badge: "□", fill: "bg-slate-900" },
              { label: "Redonda", hint: "6 asientos", badge: "◯", fill: "bg-emerald-700" },
              { label: "Barra", hint: "2 asientos", badge: "—", fill: "bg-amber-900" },
              { label: "Muro", hint: "Separador", badge: "|", fill: "bg-slate-600" },
              { label: "Planta", hint: "Decoración", badge: "P", fill: "bg-emerald-200" },
            ].map((tool) => (
              <div className="flex min-w-[92px] flex-1 flex-col items-center gap-1 rounded-xl p-2 text-center transition-colors hover:bg-slate-50 xl:min-w-0" key={tool.label}>
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tool.fill} text-sm font-black text-white`}>
                  {tool.badge}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">{tool.label}</span>
                <span className="text-[10px] text-slate-500">{tool.hint}</span>
              </div>
            ))}
          </aside>

          <section className="space-y-4">
            <div
              ref={workspaceRef}
              className="overflow-hidden rounded-[32px] bg-white p-4 shadow-sm ring-1 ring-black/5"
              style={{
                backgroundImage: "radial-gradient(circle, #e5e7eb 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            >
              <Stage width={canvasWidth} height={CANVAS_HEIGHT}>
                <Layer>
                  <Group x={40} y={24}>
                    <Rect width={96} height={34} cornerRadius={17} fill="white" shadowBlur={10} shadowOpacity={0.08} />
                    <Text width={96} height={34} align="center" verticalAlign="middle" text="ENTRADA" fontSize={11} fontStyle="bold" letterSpacing={3} fill="#6b7280" />
                  </Group>

                  <Rect x={0} y={170} width={58} height={260} fill="#efefef" />
                  <Text x={2} y={285} width={58} align="center" rotation={-90} text="BARRA" fontSize={11} fontStyle="bold" letterSpacing={4} fill="#6b7280" />

                  <Group x={canvasWidth - 90} y={470}>
                    <Rect width={54} height={54} cornerRadius={27} fill="#c7ead3" />
                    <Text width={54} height={54} align="center" verticalAlign="middle" text="Planta" fontSize={10} fontStyle="bold" fill="#33694a" />
                  </Group>

                  {tables.map((table) => {
                    const isSelected = table.id === selectedTableId;
                    const statusStyle = tableStatusStyles[table.status];

                    return (
                      <Group
                        key={table.id}
                        name="table-object"
                        x={table.x}
                        y={table.y}
                        draggable
                        onClick={() => setSelectedTableId(table.id)}
                        onDragMove={(event) => handleDragMove(event, table.id)}
                        onDragEnd={(event) => handleDragEnd(event, table.id)}
                      >
                        <Rect
                          width={table.width}
                          height={table.height}
                          fill="#060606"
                          stroke={isSelected ? "#ffffff" : "transparent"}
                          strokeWidth={isSelected ? 4 : 0}
                          cornerRadius={getShapeCornerRadius(table)}
                          shadowBlur={isSelected ? 20 : 12}
                          shadowOpacity={0.18}
                          opacity={table.isActive ? 1 : 0.82}
                        />

                        <Text
                          width={table.width}
                          y={12}
                          align="center"
                          text={table.name}
                          fontSize={13}
                          fontStyle="bold"
                          fill="white"
                        />

                        <Text
                          width={table.width}
                          y={30}
                          align="center"
                          text={`${table.capacity} asientos`}
                          fontSize={10}
                          fontStyle="bold"
                          fill="#f5f5f5"
                        />

                        <Rect x={table.width / 2 - 42} y={table.height - 28} width={84} height={18} cornerRadius={9} fill={statusStyle.pillFill} />
                        <Text
                          x={0}
                          y={table.height - 24}
                          width={table.width}
                          align="center"
                          text={statusStyle.label.toUpperCase()}
                          fontSize={9}
                          fontStyle="bold"
                          fill={statusStyle.pillText}
                          letterSpacing={1}
                        />

                        {isSelected ? (
                          <Group x={table.width - 18} y={-10}>
                            <Rect width={22} height={22} cornerRadius={11} fill="#86b99a" />
                            <Text width={22} height={22} align="center" verticalAlign="middle" text="✓" fontSize={12} fontStyle="bold" fill="white" />
                          </Group>
                        ) : null}
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
                <p className="mt-3 text-4xl font-black text-slate-950">{activeCount}</p>
                <p className="mt-2 text-sm text-slate-600">8 libres, 3 ocupadas, 1 inactiva</p>
              </article>

              <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Capacidad media</p>
                <p className="mt-3 text-4xl font-black text-slate-950">{averageCapacity}</p>
                <p className="mt-2 text-sm text-slate-600">Ponderada por el área activa del plano</p>
              </article>

              <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Combinables</p>
                <p className="mt-3 text-4xl font-black text-slate-950">{combinableCount}</p>
                <p className="mt-2 text-sm text-slate-600">Mesas preparadas para grupos</p>
              </article>
            </section>
          </section>

          <aside className="flex flex-col gap-8 rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-black/5">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-950">Propiedades</h2>
              <p className="mt-1 text-sm text-slate-500">
                {selectedTable.name} • {getTableSizeLabel(selectedTable.shape)}
              </p>
            </div>

            <div className="space-y-6">
              <label className="space-y-2 block" htmlFor="table-name">
                <span className="block text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Nombre de la mesa</span>
                <input
                  id="table-name"
                  className="w-full rounded-lg border-0 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-900 outline-none ring-1 ring-transparent transition-all focus:ring-slate-900"
                  value={selectedTable.name}
                  onChange={(event) => updateSelectedTable({ name: event.target.value })}
                />
              </label>

              <div className="space-y-2">
                <span className="block text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Capacidad</span>
                <div className="flex items-center gap-4 rounded-lg bg-slate-100 px-4 py-3">
                  <button
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-lg font-black text-slate-900 shadow-sm transition-colors hover:bg-slate-200"
                    type="button"
                    onClick={() => updateSelectedTable({ capacity: Math.max(1, selectedTable.capacity - 1) })}
                  >
                    −
                  </button>
                  <span className="flex-1 text-center text-lg font-black tracking-tight text-slate-950">{selectedTable.capacity}</span>
                  <button
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-lg font-black text-slate-900 shadow-sm transition-colors hover:bg-slate-200"
                    type="button"
                    onClick={() => updateSelectedTable({ capacity: selectedTable.capacity + 1 })}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <span className="block text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Combinable</span>
                  <span className="text-[10px] text-slate-500">Puede unirse con mesas adyacentes</span>
                </div>
                <button
                  className={`relative h-5 w-10 rounded-full transition-colors ${selectedTable.isCombinable ? "bg-emerald-500" : "bg-slate-300"}`}
                  type="button"
                  onClick={() => updateSelectedTable({ isCombinable: !selectedTable.isCombinable })}
                >
                  <div className={`absolute top-1 h-3 w-3 rounded-full bg-white transition-all ${selectedTable.isCombinable ? "right-1" : "left-1"}`} />
                </button>
              </div>

              <div className="space-y-3">
                <span className="block text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Estado</span>
                <div className="flex gap-2">
                  <button
                    className={`flex-1 rounded-lg px-4 py-2 text-xs font-bold shadow-sm transition-colors ${selectedTable.isActive ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-500"}`}
                    type="button"
                    onClick={() => updateSelectedTable({ isActive: true, status: selectedTable.status === "inactive" ? "available" : selectedTable.status })}
                  >
                    Activa
                  </button>
                  <button
                    className={`flex-1 rounded-lg px-4 py-2 text-xs font-bold transition-colors ${!selectedTable.isActive ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-500"}`}
                    type="button"
                    onClick={() => updateSelectedTable({ isActive: false, status: "inactive" })}
                  >
                    Inactiva
                  </button>
                </div>
              </div>

              <p className="text-sm leading-6 text-slate-500">
                Esta pantalla está aislada para validar el comportamiento visual. Más adelante aquí conectaremos el dominio, pero la base de interacción ya queda probada.
              </p>
            </div>

            <div className="mt-auto flex gap-3 border-t border-slate-100 pt-8">
              <button className="flex-1 rounded-lg bg-slate-100 px-4 py-3 text-xs font-bold text-slate-500 transition-colors hover:bg-rose-100 hover:text-rose-700" type="button">
                Eliminar mesa
              </button>
              <button className="rounded-lg bg-slate-100 px-4 py-3 text-xs font-bold text-slate-500 transition-colors hover:bg-slate-200" type="button">
                Duplicar
              </button>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}
//-aqui termina componente TestPage-//