/**
 * Archivo: FloorPlanInsights.tsx
 * Responsabilidad: Mostrar insights y cards de mesas del plano en la vista de dashboard.
 * Tipo: UI
 */

import { T } from "@/components/T";
import { getDiningTableStatusClassName } from "./floorPlanStyles";
import {
  diningTableLayoutDefinitions,
  floorPlanChangeDefinitions,
  floorPlanInsightDefinitions,
} from "./floorPlanMocks";

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

//-aqui empieza componente FloorPlanTableCards y es para listar las mesas en tarjetas-//
/**
 * Renderiza la grilla de tarjetas de mesas mock.
 *
 * @pure
 */
function FloorPlanTableCards() {
  return (
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
  );
}
//-aqui termina componente FloorPlanTableCards-//

//-aqui empieza componente FloorPlanInsights y es para agrupar los paneles inferiores-//
/**
 * Agrupa insights y tarjetas de mesas.
 *
 * @pure
 */
export function FloorPlanInsights() {
  return (
    <>
      <FloorPlanInsightsRail />
      <FloorPlanTableCards />
    </>
  );
}
//-aqui termina componente FloorPlanInsights-//
