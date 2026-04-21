/**
 * Archivo: page.tsx
 * Responsabilidad: Renderizar el editor operativo de mesas y plano de sala dentro del dashboard.
 * Tipo: UI
 */

import Link from "next/link";
import { T } from "@/components/T";
import { OnboardingIcon } from "@/components/onboarding/OnboardingIcon";


interface FloorPlanToolDefinition {
  label: string;
  hint: string;
  kind: "square" | "round" | "bar" | "wall" | "plant";
}

interface DiningTableLayoutDefinition {
  id: string;
  name: string;
  capacity: number;
  isActive: boolean;
  isCombinable: boolean;
  sortOrder: number;
  shape: "square" | "round" | "bar";
  x: number;
  y: number;
  width: number;
  height: number;
  zone: string;
  statusLabel: string;
  statusTone: "active" | "inactive" | "occupied";
}

interface FloorPlanInsightDefinition {
  title: string;
  value: string;
  description: string;
}

interface FloorPlanChangeDefinition {
  time: string;
  title: string;
  description: string;
}

const floorPlanToolDefinitions: ReadonlyArray<FloorPlanToolDefinition> = [
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
  {
    label: "Muro",
    hint: "Separador",
    kind: "wall",
  },
  {
    label: "Planta",
    hint: "Decoración",
    kind: "plant",
  },
] as const;

const diningTableLayoutDefinitions: ReadonlyArray<DiningTableLayoutDefinition> = [
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
    zone: "Lounge privado",
    statusLabel: "Ocupada",
    statusTone: "occupied",
  },
] as const;

const floorPlanInsightDefinitions: ReadonlyArray<FloorPlanInsightDefinition> = [
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

const floorPlanChangeDefinitions: ReadonlyArray<FloorPlanChangeDefinition> = [
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

//-aqui empieza funcion getFloorPlanToolKindClassName y es para dar forma visual a cada herramienta del editor-//
/**
 * Devuelve las clases de forma para la herramienta del panel lateral.
 *
 * @pure
 */
function getFloorPlanToolKindClassName(kind: FloorPlanToolDefinition["kind"]): string {
  if (kind === "square") {
    return "rounded-sm bg-primary";
  }

  if (kind === "round") {
    return "rounded-full bg-secondary";
  }

  if (kind === "bar") {
    return "rounded-full bg-tertiary-container";
  }

  if (kind === "wall") {
    return "rounded-full bg-zinc-600";
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
function getDiningTableShapeClassName(shape: DiningTableLayoutDefinition["shape"], isSelected: boolean): string {
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

//-aqui empieza funcion getDiningTableStatusClassName y es para colorear el estado de cada mesa-//
/**
 * Devuelve las clases de estado de una mesa.
 *
 * @pure
 */
function getDiningTableStatusClassName(statusTone: DiningTableLayoutDefinition["statusTone"]): string {
  if (statusTone === "inactive") {
    return "bg-surface-container-highest text-on-surface-variant";
  }

  if (statusTone === "occupied") {
    return "bg-tertiary-fixed text-on-tertiary-fixed";
  }

  return "bg-secondary-container text-on-secondary-container";
}
//-aqui termina funcion getDiningTableStatusClassName-//

//-aqui empieza funcion getPropertyIndicatorClassName y es para mostrar el estado del interruptor visual-//
/**
 * Devuelve el color del indicador de propiedad.
 *
 * @pure
 */
function getPropertyIndicatorClassName(value: boolean): string {
  return value ? "bg-secondary" : "bg-zinc-300";
}
//-aqui termina funcion getPropertyIndicatorClassName-//

//-aqui empieza componente FloorPlanEditorToolbar y es para mostrar la cabecera editorial de mesas-//
/**
 * Renderiza la barra superior de edición del plano.
 *
 * @pure
 */
function FloorPlanEditorToolbar() {
  return (
    <section className="flex flex-col gap-6 rounded-[28px] bg-surface-container-lowest p-8 shadow-sm md:flex-row md:items-end md:justify-between md:p-10">
      <div className="max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
          <T>Editor de mesas</T>
        </p>
        <h2 className="mt-4 text-5xl font-black tracking-tighter text-primary md:text-6xl">
          <T>Organiza la sala y ajusta cada mesa.</T>
        </h2>
        <p className="mt-4 max-w-xl text-on-surface-variant md:text-lg md:leading-8">
          <T>
            Reordena el plano, define la capacidad y controla qué mesas están activas para la operación de hoy.
          </T>
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link className="inline-flex items-center justify-center gap-2 rounded-lg bg-surface-container-highest px-6 py-2.5 text-sm font-bold text-on-surface transition-colors hover:bg-surface-container-high" href="/dashboard/reservations">
          <OnboardingIcon name="schedule" className="h-4 w-4" />
          <T>Ver reservas</T>
        </Link>
        <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-on-primary transition-colors hover:opacity-90" type="button">
          <OnboardingIcon name="save" className="h-4 w-4" />
          <T>Guardar cambios</T>
        </button>
      </div>
    </section>
  );
}
//-aqui termina componente FloorPlanEditorToolbar-//

//-aqui empieza componente FloorPlanTabs y es para señalar el modo activo del editor-//
/**
 * Renderiza las pestañas contextuales del editor de mesas.
 *
 * @pure
 */
function FloorPlanTabs() {
  const tabDefinitions = [
    { label: "Plano", active: true },
    { label: "Zonas", active: false },
    { label: "Equipo", active: false },
    { label: "Vista previa", active: false },
  ] as const;

  return (
    <nav className="flex flex-wrap items-center gap-3 rounded-2xl bg-surface-container-low p-3 shadow-sm">
      {tabDefinitions.map((tabDefinition) => (
        <button
          key={tabDefinition.label}
          type="button"
          className={`rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
            tabDefinition.active
              ? "bg-surface-container-lowest text-on-surface shadow-sm"
              : "text-on-surface-variant hover:bg-surface-container-lowest hover:text-on-surface"
          }`}
        >
          <T>{tabDefinition.label}</T>
        </button>
      ))}

      <div className="ml-auto hidden items-center gap-2 rounded-full bg-surface-container-lowest px-4 py-2 text-xs font-semibold text-on-surface-variant md:flex">
        <OnboardingIcon name="checkCircle" className="h-4 w-4 text-secondary" />
        <T>Último guardado hace 3 min</T>
      </div>
    </nav>
  );
}
//-aqui termina componente FloorPlanTabs-//

//-aqui empieza componente FloorPlanToolRail y es para mostrar la paleta de herramientas-//
/**
 * Renderiza el rail lateral con herramientas del editor.
 *
 * @pure
 */
function FloorPlanToolRail() {
  return (
    <aside className="flex w-full flex-row flex-wrap gap-3 rounded-[28px] bg-surface-container-lowest p-4 shadow-sm xl:w-24 xl:flex-col xl:flex-nowrap xl:items-center xl:gap-6 xl:p-6">
      {floorPlanToolDefinitions.map((toolDefinition) => (
        <div className="group flex min-w-[92px] flex-1 flex-col items-center gap-1 rounded-xl p-2 transition-colors hover:bg-surface-container-low xl:min-w-0" key={toolDefinition.label}>
          <div className={`flex h-12 w-12 items-center justify-center ${getFloorPlanToolKindClassName(toolDefinition.kind)}`}>
            <span className="text-xs font-black text-white">
              {toolDefinition.kind === "wall" ? "|" : toolDefinition.kind === "plant" ? "P" : toolDefinition.kind === "bar" ? "—" : toolDefinition.kind === "round" ? "O" : "□"}
            </span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
            <T>{toolDefinition.label}</T>
          </span>
          <span className="text-[10px] text-on-surface-variant">
            <T>{toolDefinition.hint}</T>
          </span>
        </div>
      ))}
    </aside>
  );
}
//-aqui termina componente FloorPlanToolRail-//

//-aqui empieza componente FloorPlanCanvas y es para dibujar la sala con las mesas-//
/**
 * Renderiza el lienzo central del plano con mesas posicionadas.
 *
 * @pure
 */
function FloorPlanCanvas() {
  return (
    <section
      className="relative min-h-[760px] flex-1 overflow-hidden rounded-[28px] bg-surface-container-lowest shadow-sm"
      style={{
        backgroundImage: "radial-gradient(circle, #e2e2e2 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      <div className="absolute left-10 top-10 rounded-2xl border border-outline-variant/20 bg-white px-6 py-3 text-xs font-black uppercase tracking-[0.3em] text-on-surface-variant shadow-sm">
        <T>Entrada</T>
      </div>

      <div className="absolute left-0 top-1/2 -translate-y-1/2">
        <div className="flex h-80 w-16 items-center justify-center bg-surface-container-high text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant shadow-sm">
          <span className="-rotate-90">
            <T>Barra</T>
          </span>
        </div>
      </div>

      <div className="absolute left-[56%] top-[34%] h-48 w-2 rounded-full bg-surface-container-high shadow-sm" />

      <div className="absolute right-14 top-[62%] text-secondary">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary-container text-xs font-black text-on-secondary-container shadow-sm">
          <T>Planta</T>
        </div>
      </div>

      {diningTableLayoutDefinitions.map((tableDefinition) => {
        const isSelected = tableDefinition.id === "table-01";
        const containerClassName = getDiningTableShapeClassName(tableDefinition.shape, isSelected);
        const statusClassName = getDiningTableStatusClassName(tableDefinition.statusTone);

        return (
          <div
            key={tableDefinition.id}
            className={`absolute flex cursor-move flex-col items-center justify-center border border-white/30 bg-primary text-on-primary ${containerClassName}`}
            style={{
              left: `${tableDefinition.x}px`,
              top: `${tableDefinition.y}px`,
              width: `${tableDefinition.width}px`,
              height: `${tableDefinition.height}px`,
            }}
          >
            <span className="text-xs font-black tracking-tight">
              <T>{tableDefinition.name}</T>
            </span>
            <span className="mt-1 text-[10px] font-medium text-white/75">
              <T>{`${tableDefinition.capacity} asientos`}</T>
            </span>
            <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${statusClassName}`}>
              <T>{tableDefinition.statusLabel}</T>
            </span>
            {isSelected ? (
              <div className="absolute -right-2 -top-2 rounded-full bg-secondary p-1 text-on-secondary shadow-md">
                <OnboardingIcon name="checkCircle" className="h-4 w-4" />
              </div>
            ) : null}
          </div>
        );
      })}

      <div className="absolute bottom-8 right-8 flex flex-col gap-2 rounded-2xl border border-white/40 bg-white/70 p-2 shadow-lg backdrop-blur-md">
        <button className="flex h-10 w-10 items-center justify-center rounded-lg text-primary transition-colors hover:bg-surface-container-high" type="button" aria-label="Acercar">
          +
        </button>
        <div className="h-px bg-zinc-200" />
        <button className="flex h-10 w-10 items-center justify-center rounded-lg text-primary transition-colors hover:bg-surface-container-high" type="button" aria-label="Alejar">
          −
        </button>
        <div className="h-px bg-zinc-200" />
        <button className="flex h-10 w-10 items-center justify-center rounded-lg text-primary transition-colors hover:bg-surface-container-high" type="button" aria-label="Centrar plano">
          ◉
        </button>
      </div>
    </section>
  );
}
//-aqui termina componente FloorPlanCanvas-//

//-aqui empieza componente FloorPlanPropertiesPanel y es para mostrar la mesa seleccionada-//
/**
 * Renderiza el panel de propiedades del editor de mesas.
 *
 * @pure
 */
function FloorPlanPropertiesPanel() {
  const selectedTable = diningTableLayoutDefinitions[0];

  return (
    <aside className="flex w-full flex-col gap-8 rounded-[28px] bg-surface-container-lowest p-8 shadow-sm xl:w-80">
      <div>
        <h3 className="text-xl font-black tracking-tight text-primary">
          <T>Propiedades</T>
        </h3>
        <p className="mt-1 text-xs font-medium text-on-surface-variant">
          <T>{`${selectedTable.name} • ${selectedTable.shape === "round" ? "Unidad redonda" : selectedTable.shape === "bar" ? "Unidad de barra" : "Unidad cuadrada"}`}</T>
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
            <T>Nombre de la mesa</T>
          </label>
          <input className="w-full rounded-lg border-0 bg-surface-container-low px-4 py-3 text-sm font-semibold text-on-surface outline-none ring-1 ring-transparent transition-all focus:ring-primary" type="text" defaultValue={selectedTable.name} />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
            <T>Capacidad</T>
          </label>
          <div className="flex items-center gap-4 rounded-lg bg-surface-container-low px-4 py-3">
            <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container-lowest text-lg font-black text-on-surface transition-colors hover:bg-surface-container-high" type="button" aria-label="Disminuir capacidad">
              −
            </button>
            <span className="flex-1 text-center text-lg font-black tracking-tight text-on-surface">
              <T>{`${selectedTable.capacity}`}</T>
            </span>
            <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container-lowest text-lg font-black text-on-surface transition-colors hover:bg-surface-container-high" type="button" aria-label="Aumentar capacidad">
              +
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between py-2">
          <div className="space-y-0.5">
            <span className="block text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
              <T>Combinable</T>
            </span>
            <span className="text-[10px] text-on-surface-variant">
              <T>Puede unirse con mesas adyacentes</T>
            </span>
          </div>
          <button className={`relative h-5 w-10 rounded-full transition-colors ${getPropertyIndicatorClassName(selectedTable.isCombinable)}`} type="button" aria-label="Mesa combinable">
            <div className={`absolute top-1 h-3 w-3 rounded-full bg-white transition-all ${selectedTable.isCombinable ? "right-1" : "left-1"}`} />
          </button>
        </div>

        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
            <T>Estado</T>
          </label>
          <div className="flex gap-2">
            <button className="flex-1 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-on-primary shadow-sm" type="button">
              <T>Activa</T>
            </button>
            <button className="flex-1 rounded-lg bg-surface-container-low px-4 py-2 text-xs font-bold text-on-surface-variant transition-colors hover:bg-surface-container-high" type="button">
              <T>Inactiva</T>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-auto flex gap-3 border-t border-zinc-100 pt-8">
        <button className="flex-1 rounded-lg bg-surface-container-low px-4 py-3 text-xs font-bold text-on-surface-variant transition-colors hover:bg-error-container hover:text-on-error-container" type="button">
          <T>Eliminar mesa</T>
        </button>
        <button className="rounded-lg bg-surface-container-low p-3 text-on-surface-variant transition-colors hover:bg-surface-container-high" type="button" aria-label="Duplicar mesa">
          <OnboardingIcon name="contentCopy" className="h-5 w-5" />
        </button>
      </div>
    </aside>
  );
}
//-aqui termina componente FloorPlanPropertiesPanel-//

//-aqui empieza componente FloorPlanInsightsRail y es para resumir capacidad y actividad-//
/**
 * Renderiza el conjunto de insights laterales del editor.
 *
 * @pure
 */
function FloorPlanInsightsRail() {
  return (
    <section className="grid grid-cols-1 gap-8 xl:grid-cols-2">
      <div className="rounded-2xl bg-surface-container-lowest p-8 shadow-sm">
        <h3 className="text-lg font-bold text-on-surface">
          <T>Estado del plano</T>
        </h3>
        <div className="mt-6 space-y-4">
          {floorPlanInsightDefinitions.map((insightDefinition) => (
            <div className="flex items-start justify-between gap-4 border-b border-outline-variant/10 pb-4 last:border-b-0 last:pb-0" key={insightDefinition.title}>
              <div>
                <p className="text-sm font-bold text-primary">
                  <T>{insightDefinition.title}</T>
                </p>
                <p className="mt-1 text-sm leading-6 text-on-surface-variant">
                  <T>{insightDefinition.description}</T>
                </p>
              </div>
              <p className="text-2xl font-black tracking-tight text-on-surface">
                <T>{insightDefinition.value}</T>
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-surface-container-lowest p-8 shadow-sm">
        <h3 className="text-lg font-bold text-on-surface">
          <T>Cambios recientes</T>
        </h3>
        <div className="mt-6 space-y-4">
          {floorPlanChangeDefinitions.map((changeDefinition) => (
            <div className="flex gap-4" key={`${changeDefinition.time}-${changeDefinition.title}`}>
              <div className="w-16 shrink-0 rounded-full bg-surface-container-low px-3 py-2 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
                {changeDefinition.time}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-primary">
                  <T>{changeDefinition.title}</T>
                </p>
                <p className="mt-1 text-sm leading-6 text-on-surface-variant">
                  <T>{changeDefinition.description}</T>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
//-aqui termina componente FloorPlanInsightsRail-//

//-aqui empieza pagina TablesPage y es para mostrar el editor operativo de mesas-//
/**
 * Presenta el editor del plano de mesas del restaurante.
 */
export default function TablesPage() {
  return (
    <>
      <FloorPlanEditorToolbar />
      <FloorPlanTabs />

      <section className="flex flex-col gap-6 xl:flex-row">
        <FloorPlanToolRail />
        <FloorPlanCanvas />
        <FloorPlanPropertiesPanel />
      </section>

      <FloorPlanInsightsRail />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {diningTableLayoutDefinitions.map((tableDefinition) => (
          <article className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm" key={tableDefinition.id}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                  <T>{tableDefinition.zone}</T>
                </p>
                <h3 className="mt-2 text-xl font-black tracking-tight text-primary">
                  <T>{tableDefinition.name}</T>
                </h3>
              </div>
              <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${getDiningTableStatusClassName(tableDefinition.statusTone)}`}>
                <T>{tableDefinition.statusLabel}</T>
              </span>
            </div>

            <div className="mt-5 space-y-3 text-sm text-on-surface-variant">
              <p>
                <T>{`${tableDefinition.capacity} asientos · orden ${tableDefinition.sortOrder}`}</T>
              </p>
              <p>
                <T>{tableDefinition.isActive ? "Mesa activa" : "Mesa inactiva"}</T>
              </p>
              <p>
                <T>{tableDefinition.isCombinable ? "Se puede combinar con vecinas" : "Configuración independiente"}</T>
              </p>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
//-aqui termina pagina TablesPage-
