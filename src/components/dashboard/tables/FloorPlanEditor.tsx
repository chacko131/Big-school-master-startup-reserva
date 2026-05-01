"use client";

/**
 * Archivo: FloorPlanEditor.tsx
 * Responsabilidad: Orquestar el estado local del editor de mesas, zonas y conectar sus subcomponentes.
 * Tipo: UI
 */

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import type Konva from "konva";
import { type FloorPlanTable } from "./floorPlanMocks";
import { FloorPlanCanvas, type GuideLine } from "./FloorPlanCanvas";
import { FloorPlanPropertiesPanel } from "./FloorPlanPropertiesPanel";
import { FloorPlanTabs } from "./FloorPlanTabs";
import { FloorPlanToolRail } from "./FloorPlanToolRail";
import { FloorPlanHero } from "./FloorPlanHero";
import { NotificationBanner, type NotificationBannerTone } from "@/components/ui/NotificationBanner";
import {
  saveFloorPlanAction,
  createZoneAction,
  deleteZoneAction,
} from "@/app/(dashboard)/dashboard/tables/actions";
import type { RestaurantZonePrimitives } from "@/modules/catalog/domain/entities/restaurant-zone.entity";
import type { FloorPlanElementPrimitives } from "@/modules/catalog/domain/entities/floor-plan-element.entity";

interface LineGuideStops {
  vertical: number[];
  horizontal: number[];
}

interface SnappingEdge {
  guide: number;
  offset: number;
}

interface SnappingEdges {
  vertical: SnappingEdge[];
  horizontal: SnappingEdge[];
}

interface SnappingCandidate {
  lineGuide: number;
  diff: number;
  offset: number;
}

const GUIDELINE_OFFSET = 5;
const CANVAS_HEIGHT = 760;

//-aqui empieza funcion getLineGuideStops y es para calcular los ejes de snapping del canvas-//
/**
 * Calcula las guías a las que puede snapear el objeto arrastrado.
 * @pure
 */
function getLineGuideStops(
  stage: Konva.Stage,
  skipShape: Konva.Node,
): LineGuideStops {
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

  return { vertical, horizontal };
}
//-aqui termina funcion getLineGuideStops-//

//-aqui empieza funcion getObjectSnappingEdges y es para definir los puntos de snap del objeto-//
/**
 * Obtiene los bordes de snapping del nodo arrastrado.
 * @pure
 */
function getObjectSnappingEdges(node: Konva.Node): SnappingEdges {
  const box = node.getClientRect();
  const absPos = node.absolutePosition();

  return {
    vertical: [
      { guide: Math.round(box.x), offset: Math.round(absPos.x - box.x) },
      {
        guide: Math.round(box.x + box.width / 2),
        offset: Math.round(absPos.x - box.x - box.width / 2),
      },
      {
        guide: Math.round(box.x + box.width),
        offset: Math.round(absPos.x - box.x - box.width),
      },
    ],
    horizontal: [
      { guide: Math.round(box.y), offset: Math.round(absPos.y - box.y) },
      {
        guide: Math.round(box.y + box.height / 2),
        offset: Math.round(absPos.y - box.y - box.height / 2),
      },
      {
        guide: Math.round(box.y + box.height),
        offset: Math.round(absPos.y - box.y - box.height),
      },
    ],
  };
}
//-aqui termina funcion getObjectSnappingEdges-//

//-aqui empieza funcion getGuides y es para elegir la guía más cercana-//
/**
 * Calcula las guías más cercanas para aplicar snapping.
 * @pure
 */
function getGuides(
  lineGuideStops: LineGuideStops,
  itemBounds: SnappingEdges,
): GuideLine[] {
  const resultV: SnappingCandidate[] = [];
  const resultH: SnappingCandidate[] = [];

  lineGuideStops.vertical.forEach((lineGuide) => {
    itemBounds.vertical.forEach((itemBound) => {
      const diff = Math.abs(lineGuide - itemBound.guide);
      if (diff < GUIDELINE_OFFSET) {
        resultV.push({ lineGuide, diff, offset: itemBound.offset });
      }
    });
  });

  lineGuideStops.horizontal.forEach((lineGuide) => {
    itemBounds.horizontal.forEach((itemBound) => {
      const diff = Math.abs(lineGuide - itemBound.guide);
      if (diff < GUIDELINE_OFFSET) {
        resultH.push({ lineGuide, diff, offset: itemBound.offset });
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
    });
  }
  if (minH) {
    guides.push({
      lineGuide: minH.lineGuide,
      offset: minH.offset,
      orientation: "H",
    });
  }

  return guides;
}
//-aqui termina funcion getGuides-//

/** Paleta de colores para las zonas nuevas (se cicla si hay más de 8 zonas). */
const ZONE_COLOR_PALETTE = [
  "#6366f1", // indigo
  "#f59e0b", // amber
  "#10b981", // emerald
  "#ef4444", // red
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#f97316", // orange
  "#14b8a6", // teal
];

interface FloorPlanEditorProps {
  initialTables: FloorPlanTable[];
  initialZones: RestaurantZonePrimitives[];
  initialElements?: FloorPlanElementPrimitives[];
}

//-aqui empieza componente FloorPlanEditor y es para mostrar el editor interactivo de mesas con zonas-//
/**
 * Renderiza el editor visual de mesas con snapping, panel de propiedades y paginación por zonas.
 * @sideEffect
 */
export function FloorPlanEditor({
  initialTables,
  initialZones,
  initialElements = [],
}: FloorPlanEditorProps) {
  const workspaceRef = useRef<HTMLDivElement | null>(null);
  const [isPending, startTransition] = useTransition();
  const [canvasWidth, setCanvasWidth] = useState(1200);
  const [tables, setTables] = useState<FloorPlanTable[]>(initialTables);
  // Estado de selección — ninguna mesa seleccionada por defecto
  const [selectedTableId, setSelectedTableId] = useState("");
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [guides, setGuides] = useState<GuideLine[]>([]);

  // Estado de zonas
  const [zones, setZones] = useState<RestaurantZonePrimitives[]>(initialZones);
  // null significa "Sin zona" (mesas sin zona asignada)
  const [activeZoneId, setActiveZoneId] = useState<string | null>(
    initialZones.length > 0 ? initialZones[0].id : null,
  );

  // Estado de elementos decorativos
  const [elements, setElements] = useState<FloorPlanElementPrimitives[]>(
    initialElements ?? [],
  );

  // Estado de notificación (banner de feedback al usuario)
  const [notification, setNotification] = useState<{
    tone: NotificationBannerTone;
    title: string;
    description?: string;
    key: number;
  } | null>(null);

  //-aqui empieza efecto de resize y es para adaptar el ancho del canvas al contenedor-//
  useEffect(() => {
    const updateSize = () => {
      if (workspaceRef.current === null) {
        return;
      }
      setCanvasWidth(Math.max(320, workspaceRef.current.clientWidth));
    };

    updateSize();

    if (
      typeof ResizeObserver === "undefined" ||
      workspaceRef.current === null
    ) {
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
  //-aqui termina efecto de resize-//

  // Filtrar mesas por zona activa para mostrar solo las de la zona seleccionada
  const tablesInActiveZone = useMemo(() => {
    if (activeZoneId === null) {
      return tables.filter((t) => t.zoneId === null);
    }
    return tables.filter((t) => t.zoneId === activeZoneId);
  }, [tables, activeZoneId]);

  const elementsInActiveZone = useMemo(() => {
    if (activeZoneId === null) {
      return elements.filter((e) => e.zoneId === null);
    }
    return elements.filter((e) => e.zoneId === activeZoneId);
  }, [elements, activeZoneId]);

  const selectedElement = useMemo(() => {
    if (!selectedElementId) return undefined;
    return elements.find(e => e.id === selectedElementId);
  }, [elements, selectedElementId]);

  const selectedTable = useMemo(() => {
    return (
      tables.find((table) => table.id === selectedTableId) ??
      tablesInActiveZone[0]
    );
  }, [selectedTableId, tables, tablesInActiveZone]);

  const updateSelectedTable = (patch: Partial<FloorPlanTable>) => {
    if (selectedTable === undefined) {
      return;
    }

    setTables((currentTables) =>
      currentTables.map((table) =>
        table.id === selectedTable.id ? { ...table, ...patch } : table,
      ),
    );
  };

  //-aqui empieza funcion handleSelectedTableNameChange y es para editar el nombre local de la mesa-//
  /**
   * Actualiza el nombre local de la mesa seleccionada.
   * @sideEffect
   */
  const handleSelectedTableNameChange = (nextName: string) => {
    updateSelectedTable({ name: nextName });
  };
  //-aqui termina funcion handleSelectedTableNameChange-//

  //-aqui empieza funcion handleDragMove y es para aplicar snapping mientras se arrastra una mesa-//
  /**
   * Ajusta la posición de la mesa arrastrada y muestra las guías visuales.
   * @sideEffect
   */
  const handleDragMove = (
    event: Konva.KonvaEventObject<unknown>,
    tableId: string,
  ) => {
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
    setSelectedElementId(null);
  };
  //-aqui termina funcion handleDragMove-//

  //-aqui empieza funcion handleDragEnd y es para guardar la posición local de la mesa-//
  /**
   * Sincroniza la posición final de la mesa arrastrada con el estado local.
   * @sideEffect
   */
  const handleDragEnd = (
    event: Konva.KonvaEventObject<unknown>,
    tableId: string,
  ) => {
    const node = event.target;
    const newX = node.x();
    const newY = node.y();

    const nativeEvent = event.evt as MouseEvent | TouchEvent;
    let isDroppedOnSidebar = false;

    if (nativeEvent) {
      let clientX = 0;
      let clientY = 0;

      if ("clientX" in nativeEvent) {
        clientX = nativeEvent.clientX;
        clientY = nativeEvent.clientY;
      } else if (
        "changedTouches" in nativeEvent &&
        nativeEvent.changedTouches.length > 0
      ) {
        clientX = nativeEvent.changedTouches[0].clientX;
        clientY = nativeEvent.changedTouches[0].clientY;
      }

      if (clientX > 0 || clientY > 0) {
        const elements = document.elementsFromPoint(clientX, clientY);
        isDroppedOnSidebar = elements.some(
          (el) => el.getAttribute("data-drop-zone") === "sidebar",
        );
      }
    }

    if (isDroppedOnSidebar) {
      setTables((currentTables) =>
        currentTables.map((table) =>
          table.id === tableId ? { ...table, x: null, y: null } : table,
        ),
      );
    } else {
      setTables((currentTables) =>
        currentTables.map((table) =>
          table.id === tableId
            ? { ...table, x: Math.round(newX), y: Math.round(newY) }
            : table,
        ),
      );
    }

    setGuides([]);
    setSelectedTableId(tableId);
    setSelectedElementId(null);
  };
  //-aqui termina funcion handleDragEnd-//

  //-aqui empieza funcion handleTableDrop y es para colocar una mesa nueva en el canvas-//
  /**
   * Actualiza las coordenadas de la mesa seleccionada tras un drop en el canvas.
   * @sideEffect
   */
  const handleTableDrop = (tableId: string, x: number, y: number) => {
    setTables((currentTables) =>
      currentTables.map((table) =>
        table.id === tableId
          ? { ...table, x: Math.round(x), y: Math.round(y) }
          : table,
      ),
    );
    setSelectedTableId(tableId);
    setSelectedElementId(null);
  };
  //-aqui termina funcion handleTableDrop-//

  //-aqui empieza funcion handleAddTable y es para añadir una nueva mesa a la zona activa-//
  /**
   * Crea una nueva mesa localmente y la asocia a la zona activa seleccionada.
   * @sideEffect
   */
  const handleAddTable = () => {
    const newId = crypto.randomUUID();
    const defaultWidth = 100;
    const defaultHeight = 100;
    const defaultX = Math.round((canvasWidth - defaultWidth) / 2);
    const defaultY = Math.round((CANVAS_HEIGHT - defaultHeight) / 2);

    const activeZone = zones.find((z) => z.id === activeZoneId);

    const newTable: FloorPlanTable = {
      id: newId,
      name: `Mesa ${tables.length + 1}`,
      capacity: 4,
      isActive: true,
      isCombinable: false,
      status: "active",
      zoneId: activeZoneId,
      zone: activeZone?.name ?? "",
      shape: "square",
      x: defaultX,
      y: defaultY,
      width: defaultWidth,
      height: defaultHeight,
      sortOrder: tables.length,
      statusLabel: "",
      statusTone: "active",
      restaurantId: "",
    };

    setTables((currentTables) => [...currentTables, newTable]);
    setSelectedTableId(newId);
  };
  //-aqui termina funcion handleAddTable-//

  //-aqui empieza funcion handleAddElement y es para añadir elementos decorativos-//
  /**
   * Crea un nuevo elemento decorativo localmente y lo asocia a la zona activa.
   * WALL_V es un alias de UI para muro vertical: se guarda como WALL con width/height invertidos.
   * @sideEffect
   */
  const handleAddElement = (type: "WALL" | "WALL_V" | "PLANT") => {
    const newId = crypto.randomUUID();
    // WALL_V = muro vertical → dominio lo almacena como WALL con dimensiones transpuestas
    const domainType: "WALL" | "PLANT" = type === "PLANT" ? "PLANT" : "WALL";
    const defaultWidth = type === "WALL" ? 200 : type === "WALL_V" ? 20 : 80;
    const defaultHeight = type === "WALL" ? 20 : type === "WALL_V" ? 200 : 80;
    const defaultX = Math.round((canvasWidth - defaultWidth) / 2);
    const defaultY = Math.round((CANVAS_HEIGHT - defaultHeight) / 2);

    const newElement: FloorPlanElementPrimitives = {
      id: newId,
      restaurantId: tables.length > 0 ? (tables[0].restaurantId ?? "") : "",
      zoneId: activeZoneId,
      type: domainType,
      x: defaultX,
      y: defaultY,
      width: defaultWidth,
      height: defaultHeight,
      rotation: 0,
    };

    setElements((current) => [...current, newElement]);
    setSelectedElementId(newId);
    setSelectedTableId("");
  };
  //-aqui termina funcion handleAddElement-//

  //-aqui empieza funcion handleElementDragMove y es para aplicar snapping a elementos decorativos-//
  /**
   * Ajusta la posición del elemento arrastrado y muestra guías visuales.
   * @sideEffect
   */
  const handleElementDragMove = (event: Konva.KonvaEventObject<unknown>, elementId: string) => {
    const stage = event.target.getStage();
    if (stage === null) return;

    const draggedNode = event.target;
    const lineGuideStops = getLineGuideStops(stage, draggedNode);
    const itemBounds = getObjectSnappingEdges(draggedNode);
    const nextGuides = getGuides(lineGuideStops, itemBounds);

    setGuides(nextGuides);

    if (nextGuides.length > 0) {
      const absPos = draggedNode.absolutePosition();
      nextGuides.forEach((guide) => {
        if (guide.orientation === "V") absPos.x = guide.lineGuide + guide.offset;
        if (guide.orientation === "H") absPos.y = guide.lineGuide + guide.offset;
      });
      draggedNode.absolutePosition(absPos);
    }
    
    setSelectedElementId(elementId);
    setSelectedTableId(""); // Deseleccionar mesa
  };
  //-aqui termina funcion handleElementDragMove-//

  //-aqui empieza funcion handleElementDragEnd y es para guardar la posición local del elemento-//
  /**
   * Sincroniza la posición final del elemento arrastrado.
   * @sideEffect
   */
  const handleElementDragEnd = (event: Konva.KonvaEventObject<unknown>, elementId: string) => {
    const node = event.target;
    const newX = Math.round(node.x());
    const newY = Math.round(node.y());

    const nativeEvent = event.evt as MouseEvent | TouchEvent;
    let isDroppedOnSidebar = false;

    if (nativeEvent) {
      let clientX = 0;
      let clientY = 0;

      if ("clientX" in nativeEvent) {
        clientX = nativeEvent.clientX;
        clientY = nativeEvent.clientY;
      } else if (
        "changedTouches" in nativeEvent &&
        nativeEvent.changedTouches.length > 0
      ) {
        clientX = nativeEvent.changedTouches[0].clientX;
        clientY = nativeEvent.changedTouches[0].clientY;
      }

      if (clientX > 0 || clientY > 0) {
        const elementsAtPoint = document.elementsFromPoint(clientX, clientY);
        isDroppedOnSidebar = elementsAtPoint.some(
          (el) => el.getAttribute("data-drop-zone") === "sidebar",
        );
      }
    }

    if (isDroppedOnSidebar) {
      setElements((current) => current.filter((el) => el.id !== elementId));
      setSelectedElementId(null);
    } else {
      setElements((current) =>
        current.map((el) => (el.id === elementId ? { ...el, x: newX, y: newY } : el))
      );
      setSelectedElementId(elementId);
    }

    setGuides([]);
    setSelectedTableId("");
  };
  //-aqui termina funcion handleElementDragEnd-//

  //-aqui empieza funcion handleNewElementDrop y es para colocar un nuevo elemento-//
  /**
   * Actualiza las coordenadas de un elemento recién arrastrado desde el panel lateral.
   * WALL_V = muro vertical → se guarda como WALL con width/height transpuestos.
   * @sideEffect
   */
  const handleNewElementDrop = (type: "WALL" | "WALL_V" | "PLANT", x: number, y: number) => {
    const newId = crypto.randomUUID();
    const domainType: "WALL" | "PLANT" = type === "PLANT" ? "PLANT" : "WALL";
    const defaultWidth = type === "WALL" ? 200 : type === "WALL_V" ? 20 : 80;
    const defaultHeight = type === "WALL" ? 20 : type === "WALL_V" ? 200 : 80;

    const newElement: FloorPlanElementPrimitives = {
      id: newId,
      restaurantId: tables.length > 0 ? tables[0].restaurantId ?? "" : "",
      zoneId: activeZoneId,
      type: domainType,
      x: Math.round(x),
      y: Math.round(y),
      width: defaultWidth,
      height: defaultHeight,
      rotation: 0,
    };

    setElements((current) => [...current, newElement]);
    setSelectedElementId(newId);
    setSelectedTableId("");
  };
  //-aqui termina funcion handleNewElementDrop-//

  //-aqui empieza funcion handleCreateZone y es para crear una nueva zona en BD y actualizar estado local-//
  /**
   * Crea una zona nueva en BD y la activa inmediatamente.
   * @sideEffect
   */
  const handleCreateZone = (name: string) => {
    startTransition(async () => {
      try {
        const colorIndex = zones.length % ZONE_COLOR_PALETTE.length;
        const color = ZONE_COLOR_PALETTE[colorIndex];
        const newZone = await createZoneAction(name, color);

        setZones((prev) => [...prev, newZone]);
        setActiveZoneId(newZone.id);
      } catch (error) {
        console.error("Error al crear la zona:", error);
      }
    });
  };
  //-aqui termina funcion handleCreateZone-//

  //-aqui empieza funcion handleDeleteZone y es para eliminar una zona y liberar sus mesas-//
  /**
   * Elimina una zona por ID. Las mesas de esa zona quedan con zoneId=null localmente.
   * @sideEffect
   */
  const handleDeleteZone = (zoneId: string) => {
    startTransition(async () => {
      try {
        await deleteZoneAction(zoneId);

        // Liberar las mesas de la zona eliminada (quedan sin zona)
        setTables((prev) =>
          prev.map((t) =>
            t.zoneId === zoneId ? { ...t, zoneId: null, zone: "" } : t,
          ),
        );

        const remaining = zones.filter((z) => z.id !== zoneId);
        setZones(remaining);

        // Activar otra zona o null si no quedan
        setActiveZoneId(remaining.length > 0 ? remaining[0].id : null);
      } catch (error) {
        console.error("Error al eliminar la zona:", error);
      }
    });
  };
  //-aqui termina funcion handleDeleteZone-//

  //-aqui empieza funcion handleSave y es para persistir el plano y mostrar notificación-//
  /**
   * Guarda el estado actual del canvas y muestra feedback al usuario.
   * @sideEffect
   */
  const handleSave = () => {
    startTransition(async () => {
      try {
        await saveFloorPlanAction(tables, elements);
        setNotification({
          tone: "success",
          title: "Plano guardado",
          description: "Mesas y decoración guardadas correctamente.",
          key: Date.now(),
        });
      } catch {
        setNotification({
          tone: "error",
          title: "Error al guardar",
          description: "No se pudo guardar el plano. Inténtalo de nuevo.",
          key: Date.now(),
        });
      }
    });
  };
  //-aqui termina funcion handleSave-//

  return (
    <section className="space-y-4">
      {/* Banner de feedback — aparece tras guardar o eliminar */}
      {notification !== null && (
        <NotificationBanner
          key={notification.key}
          tone={notification.tone}
          title={notification.title}
          description={notification.description}
          autoDismissMs={4000}
        />
      )}

      {/* Hero del editor con botón guardar conectado */}
      <FloorPlanHero onSave={handleSave} isSaving={isPending} />
      <FloorPlanTabs
        zones={zones}
        activeZoneId={activeZoneId}
        onZoneChange={setActiveZoneId}
        onCreateZone={handleCreateZone}
        onDeleteZone={handleDeleteZone}
        isPending={isPending}
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[210px_minmax(0,1fr)_320px]">
        <FloorPlanToolRail
          unplacedTables={tablesInActiveZone.filter(
            (t) => t.x === null || t.y === null,
          )}
          onAddTable={handleAddTable}
          onAddElement={handleAddElement}
        />

        <FloorPlanCanvas
          canvasWidth={canvasWidth}
          canvasHeight={CANVAS_HEIGHT}
          workspaceRef={workspaceRef}
          tables={tablesInActiveZone}
          elements={elementsInActiveZone}
          selectedTableId={selectedTableId}
          selectedElementId={selectedElementId}
          guides={guides}
          setSelectedTableId={(id) => {
            setSelectedTableId(id);
            setSelectedElementId(null);
          }}
          setSelectedElementId={(id) => {
            setSelectedElementId(id);
            setSelectedTableId("");
          }}
          onTableDragMove={handleDragMove}
          onTableDragEnd={handleDragEnd}
          onTableDrop={handleTableDrop}
          onElementDragMove={handleElementDragMove}
          onElementDragEnd={handleElementDragEnd}
          onNewElementDrop={handleNewElementDrop}
        />

        <FloorPlanPropertiesPanel
          selectedTable={selectedTable}
          selectedElement={selectedElement}
          activeZone={zones.find((z) => z.id === activeZoneId)}
          onNameChange={handleSelectedTableNameChange}
          onCapacityDecrease={() =>
            updateSelectedTable({
              capacity: Math.max(1, (selectedTable?.capacity ?? 1) - 1),
            })
          }
          onCapacityIncrease={() =>
            updateSelectedTable({
              capacity: (selectedTable?.capacity ?? 1) + 1,
            })
          }
          onToggleCombinable={() =>
            updateSelectedTable({ isCombinable: !selectedTable?.isCombinable })
          }
          onSetActive={() =>
            updateSelectedTable({
              isActive: true,
              status:
                selectedTable?.status === "inactive"
                  ? "active"
                  : selectedTable?.status,
            })
          }
          onSetInactive={() =>
            updateSelectedTable({ isActive: false, status: "inactive" })
          }
          onDeleteTable={() => {
            if (selectedTable === undefined) {
              return;
            }

            const remaining = tables.filter((t) => t.id !== selectedTable.id);
            setTables(remaining);

            const remainingInZone = remaining.filter(
              (t) => t.zoneId === activeZoneId,
            );
            setSelectedTableId(
              remainingInZone.length > 0 ? remainingInZone[0].id : "",
            );

            startTransition(async () => {
              try {
                await saveFloorPlanAction(remaining);
                setNotification({
                  tone: "success",
                  title: "Mesa eliminada",
                  description: `"${selectedTable.name}" ha sido eliminada del plano.`,
                  key: Date.now(),
                });
              } catch (error) {
                console.error("Error al eliminar la mesa:", error);
                setNotification({
                  tone: "error",
                  title: "Error al eliminar",
                  description: "No se pudo eliminar la mesa. Inténtalo de nuevo.",
                  key: Date.now(),
                });
              }
            });
          }}
          onRemoveFromCanvas={() => updateSelectedTable({ x: null, y: null })}
          onWidthChange={(width) => updateSelectedTable({ width })}
          onHeightChange={(height) => updateSelectedTable({ height })}
          onShapeChange={(shape) => updateSelectedTable({ shape })}
          onDeleteElement={() => {
            if (selectedElement) {
              setElements(elements.filter((e) => e.id !== selectedElement.id));
              setSelectedElementId(null);
              setNotification({
                tone: "success",
                title: "Elemento eliminado",
                description: "El elemento decorativo ha sido eliminado del plano.",
                key: Date.now(),
              });
            }
          }}
          onElementWidthChange={(width) => {
            if (selectedElement) {
              setElements(elements.map((e) => e.id === selectedElement.id ? { ...e, width } : e));
            }
          }}
          onElementHeightChange={(height) => {
            if (selectedElement) {
              setElements(elements.map((e) => e.id === selectedElement.id ? { ...e, height } : e));
            }
          }}
          isSaving={isPending}
          onSave={handleSave}
        />
      </div>
    </section>
  );
}
//-aqui termina componente FloorPlanEditor-//
