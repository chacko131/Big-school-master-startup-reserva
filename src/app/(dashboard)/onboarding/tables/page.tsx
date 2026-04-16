/**
 * Archivo: page.tsx
 * Responsabilidad: Renderizar el paso de configuración de mesas dentro del onboarding del restaurante.
 * Tipo: UI
 */

import Link from "next/link";
import { ONBOARDING_TOTAL_STEPS, getOnboardingStepNumber, getOnboardingSteps } from "@/constants/onboarding";
import { T } from "@/components/T";
import { OnboardingIcon } from "@/components/onbarding/OnboardingIcon";
import { OnboardingShell } from "@/components/onbarding/OnboardingShell";

interface TableMetricDefinition {
  label: string;
  value: string;
  accent?: "default" | "secondary";
}

interface TableRowDefinition {
  order: string;
  name: string;
  capacity: number;
  combinable: boolean;
  highlighted?: boolean;
  draft?: boolean;
}

const tablesPageLayoutClassName = "flex w-full max-w-6xl flex-col gap-12";
const tablesMetricDefinitions: ReadonlyArray<TableMetricDefinition> = [
  { label: "Total de mesas", value: "12" },
  { label: "Capacidad máxima", value: "48" },
  { label: "Zonas del comedor", value: "Sala principal y terraza", accent: "secondary" },
] as const;
const tableRowDefinitions: ReadonlyArray<TableRowDefinition> = [
  { order: "01", name: "Mesa 10", capacity: 4, combinable: true },
  { order: "02", name: "Mesa 11", capacity: 2, combinable: true },
  { order: "03", name: "Barra del chef", capacity: 6, combinable: false, highlighted: true },
  { order: "04", name: "", capacity: 0, combinable: false, draft: true },
] as const;
const tablesWorkspaceTabs = ["Mesas", "Distribución", "Zonas"] as const;

//-aqui empieza funcion getTableRowInputClassName y es para resolver el estilo visual de cada fila de la tabla-//
/**
 * Devuelve las clases base de un input dentro del ledger de mesas.
 *
 * @pure
 */
function getTableRowInputClassName(highlighted: boolean, draft: boolean): string {
  if (draft) {
    return "w-full max-w-xs rounded-none border-0 border-b border-outline-variant/50 bg-transparent px-0 py-2 text-sm font-medium italic text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:ring-0";
  }

  if (highlighted) {
    return "w-full max-w-xs rounded-lg border border-primary bg-surface-container-lowest px-4 py-2 text-sm font-bold text-on-surface focus:ring-0";
  }

  return "w-full max-w-xs rounded-lg border-0 bg-surface-container-highest px-4 py-2 text-sm font-medium text-on-surface focus:ring-1 focus:ring-primary";
}
//-aqui termina funcion getTableRowInputClassName-//

//-aqui empieza componente TablesWorkspaceTabs y es para presentar la navegacion visual del workspace de mesas-//
function TablesWorkspaceTabs() {
  return (
    <div className="hidden items-center gap-8 border-b border-outline-variant/20 pb-4 md:flex">
      {tablesWorkspaceTabs.map((workspaceTab, index) => {
        const tabClassName = index === 0 ? "border-b-2 border-primary pb-1 text-primary" : "text-on-surface-variant";

        return (
          <button key={workspaceTab} className={`text-sm font-bold tracking-tight transition-colors ${tabClassName}`} type="button">
            <T>{workspaceTab}</T>
          </button>
        );
      })}
    </div>
  );
}
//-aqui termina componente TablesWorkspaceTabs-//

//-aqui empieza componente TablesHero y es para presentar el contexto editorial y las acciones del paso de mesas-//
function TablesHero() {
  return (
    <section className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
      <div className="max-w-xl space-y-4">
        <h1 className="text-5xl font-extrabold leading-none tracking-tighter text-primary">
          <T>Define tu espacio de servicio.</T>
        </h1>
        <p className="text-lg leading-relaxed text-on-surface-variant">
          <T>
            Configura tus mesas para reflejar el plano real del restaurante. Esto te ayuda a administrar la capacidad y a optimizar los tiempos de rotación.
          </T>
        </p>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row">
        <button className="rounded-lg bg-surface-container-highest px-6 py-3 text-sm font-bold text-on-surface transition-colors hover:bg-surface-container-high" type="button">
          <T>Importar en lote</T>
        </button>
        <button className="rounded-lg bg-primary px-8 py-3 text-sm font-bold text-on-primary transition-all hover:opacity-90" type="button">
          <T>Agregar mesa</T>
        </button>
      </div>
    </section>
  );
}
//-aqui termina componente TablesHero-//

//-aqui empieza componente TablesMetricsGrid y es para resumir los indicadores principales del comedor-//
function TablesMetricsGrid() {
  return (
    <section className="flex flex-col gap-4 md:flex-row">
      {tablesMetricDefinitions.map((metricDefinition, index) => {
        const isSecondaryCard = metricDefinition.accent === "secondary";
        const columnClassName = isSecondaryCard ? "md:flex-[2]" : "md:flex-1";
        const cardClassName = isSecondaryCard
          ? "relative overflow-hidden rounded-2xl bg-secondary-container p-6"
          : "rounded-2xl bg-surface-container-low p-6";
        const valueClassName = isSecondaryCard ? "text-3xl font-black text-secondary md:text-4xl" : "text-4xl font-black text-primary";
        const labelClassName = isSecondaryCard ? "text-on-secondary-container" : "text-on-surface-variant";

        return (
          <article key={`${metricDefinition.label}-${index}`} className={`${columnClassName} ${cardClassName}`}>
            <div className="relative z-10">
              <p className={`mb-1 text-xs font-bold uppercase tracking-[0.2em] ${labelClassName}`}>
                <T>{metricDefinition.label}</T>
              </p>
              <p className={valueClassName}>
                <T>{metricDefinition.value}</T>
              </p>
            </div>
            {isSecondaryCard ? <div className="absolute -bottom-6 -right-6 h-28 w-28 rounded-full bg-secondary/10" /> : null}
          </article>
        );
      })}
    </section>
  );
}
//-aqui termina componente TablesMetricsGrid-//

//-aqui empieza componente TableLedgerRow y es para representar una fila editable del registro de mesas-//
interface TableLedgerRowProps {
  tableRowDefinition: TableRowDefinition;
}

/**
 * Renderiza una fila editable del ledger visual de mesas.
 *
 * @pure
 */
function TableLedgerRow({ tableRowDefinition }: TableLedgerRowProps) {
  const rowClassName = tableRowDefinition.draft
    ? "bg-surface opacity-60"
    : tableRowDefinition.highlighted
      ? "border-l-4 border-primary bg-surface-container-lowest"
      : "hover:bg-surface-container-lowest";
  const numberClassName = tableRowDefinition.highlighted ? "text-primary" : tableRowDefinition.draft ? "text-outline-variant" : "text-on-surface-variant";
  const toggleCopy = tableRowDefinition.combinable ? "Sí" : "No";

  return (
    <div className={`flex flex-col gap-5 px-6 py-6 transition-colors md:flex-row md:items-center md:gap-6 md:px-8 ${rowClassName}`}>
      <div className={`w-12 shrink-0 text-sm font-black ${numberClassName}`}>{tableRowDefinition.order}</div>

      <div className="min-w-0 flex-[2.2]">
        <input
          className={getTableRowInputClassName(Boolean(tableRowDefinition.highlighted), Boolean(tableRowDefinition.draft)).replace("max-w-xs", "max-w-none")}
          defaultValue={tableRowDefinition.draft ? undefined : tableRowDefinition.name}
          placeholder="Añade el nombre de la mesa..."
          type="text"
        />
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <input
            className={getTableRowInputClassName(Boolean(tableRowDefinition.highlighted), Boolean(tableRowDefinition.draft)).replace("max-w-xs", "w-20 max-w-none text-center")}
            defaultValue={tableRowDefinition.draft ? undefined : String(tableRowDefinition.capacity)}
            placeholder="0"
            type="number"
          />
          <span className="text-xs font-medium text-on-surface-variant">
            <T>comensales</T>
          </span>
        </div>
      </div>

      <div className="flex-[1.1]">
        {tableRowDefinition.draft ? (
          <span className="text-xs font-medium italic text-on-surface-variant">
            <T>Autodetectando configuración...</T>
          </span>
        ) : (
          <label className="relative inline-flex items-center gap-3">
            <input className="peer sr-only" defaultChecked={tableRowDefinition.combinable} type="checkbox" />
            <span className="h-6 w-11 rounded-full bg-surface-container-highest transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-white after:bg-white after:transition-transform after:content-[''] peer-checked:bg-secondary peer-checked:after:translate-x-full" />
            <span className="text-xs font-semibold text-on-surface-variant">
              <T>{toggleCopy}</T>
            </span>
          </label>
        )}
      </div>

      <div className="flex justify-end md:w-28 md:shrink-0">
        <button className="rounded-full px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary" type="button">
          <T>{tableRowDefinition.draft ? "Añadir" : "Eliminar"}</T>
        </button>
      </div>
    </div>
  );
}
//-aqui termina componente TableLedgerRow-//

//-aqui empieza componente TablesLedger y es para agrupar el ledger principal del setup de mesas-//
function TablesLedger() {
  return (
    <section className="overflow-hidden rounded-[28px] bg-surface-container-low shadow-[0_20px_40px_rgba(26,28,28,0.04)]">
      <div className="hidden items-center gap-6 bg-surface-container-high px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant md:flex">
        <div className="w-12 shrink-0">
          <T>Orden</T>
        </div>
        <div className="flex-[2.2]">
          <T>Nombre / ID</T>
        </div>
        <div className="flex-1">
          <T>Capacidad</T>
        </div>
        <div className="flex-[1.1]">
          <T>Combinable</T>
        </div>
        <div className="w-28 shrink-0 text-right">
          <T>Acciones</T>
        </div>
      </div>

      <div className="divide-y divide-outline-variant/20">
        {tableRowDefinitions.map((tableRowDefinition) => (
          <TableLedgerRow key={tableRowDefinition.order} tableRowDefinition={tableRowDefinition} />
        ))}
      </div>

      <div className="flex flex-col justify-between gap-6 border-t border-outline-variant/20 bg-surface-container-low px-6 py-6 md:flex-row md:items-center md:px-8">
        <button className="self-start text-sm font-bold text-primary transition-transform hover:translate-x-1" type="button">
          <T>Agregar varias filas</T>
        </button>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <div className="text-left sm:text-right">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">
              <T>Capacidad estimada</T>
            </p>
            <p className="text-sm font-bold text-primary">
              <T>54 comensales en total</T>
            </p>
          </div>
          <Link className="rounded-lg bg-primary px-8 py-4 text-center text-sm font-bold uppercase tracking-[0.18em] text-on-primary transition-all hover:opacity-90" href="/onboarding/plan">
            <T>Guardar y continuar</T>
          </Link>
        </div>
      </div>
    </section>
  );
}
//-aqui termina componente TablesLedger-//

//-aqui empieza componente TablesTipCard y es para aportar contexto operativo sobre la combinacion de mesas-//
function TablesTipCard() {
  return (
    <section className="glass-container flex flex-col items-start gap-6 rounded-[28px] border border-outline-variant/20 p-8 md:flex-row">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-tertiary-fixed text-on-tertiary-fixed-variant">
        <OnboardingIcon name="help" className="h-6 w-6" />
      </div>
      <div className="space-y-2">
        <h4 className="text-xl font-bold tracking-tight text-primary">
          <T>Tip pro: mesas combinables</T>
        </h4>
        <p className="max-w-3xl text-sm leading-7 text-on-surface-variant">
          <T>
            Marcar mesas como combinables permite que Reserva Latina sugiera acomodos para grupos grandes agrupando mesas adyacentes según tu layout.
          </T>
        </p>
      </div>
    </section>
  );
}
//-aqui termina componente TablesTipCard-//

//-aqui empieza pagina TablesOnboardingPage y es para montar el paso de configuracion de mesas del onboarding-//
/**
 * Presenta la pantalla de configuración inicial de mesas del restaurante.
 */
export default function TablesOnboardingPage() {
  const currentStepKey = "tables" as const;
  const currentStepNumber = getOnboardingStepNumber(currentStepKey);
  const onboardingSteps = getOnboardingSteps(currentStepKey);

  return (
    <OnboardingShell
      currentStepNumber={currentStepNumber}
      mobilePrimaryAction={{ label: "Continuar", href: "/onboarding/plan", icon: "arrowForward" }}
      mobileSecondaryAction={{ label: "Guardar borrador", icon: "save" }}
      steps={onboardingSteps}
      title="Configuración de mesas"
      totalSteps={ONBOARDING_TOTAL_STEPS}
    >
      <div className={tablesPageLayoutClassName}>
        <TablesWorkspaceTabs />
        <TablesHero />
        <TablesMetricsGrid />
        <TablesLedger />
        <TablesTipCard />
      </div>
    </OnboardingShell>
  );
}
//-aqui termina pagina TablesOnboardingPage-//
