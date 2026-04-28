/**
 * Archivo: TablesOnboardingForm.tsx
 * Responsabilidad: Renderizar el formulario interactivo del onboarding de mesas con cliente mínimo.
 * Tipo: UI
 */

"use client";

import Link from "next/link";
import { useState } from "react";
import { T } from "@/components/T";
import { OnboardingIcon } from "@/components/onboarding/OnboardingIcon";

export const tablesOnboardingFormId = "tables-onboarding-form";

const tablesMetricGridClassName = "grid grid-cols-1 gap-4 md:grid-cols-3";
const tablesMetricCardClassName = "rounded-2xl bg-surface-container-low p-6";
const tableInputBaseClassName = "w-full rounded-lg border-0 bg-surface-container-highest px-4 py-3 text-sm font-medium text-on-surface focus:ring-1 focus:ring-primary";
const tableCheckboxClassName = "h-5 w-5 rounded border-outline-variant text-secondary focus:ring-secondary";

export interface TablesOnboardingInitialRow {
  rowKey: string;
  id: string;
  name: string;
  capacity: number;
  isCombinable: boolean;
}

interface TablesOnboardingFormProps {
  action: (formData: FormData) => void | Promise<void>;
  errorMessage?: string;
  initialRows: TablesOnboardingInitialRow[];
  restaurantId: string;
}

interface TablesOnboardingRowState {
  rowKey: string;
  id: string;
  name: string;
  capacity: number;
  isCombinable: boolean;
}

//-aqui empieza funcion createEmptyRow y es para crear una fila vacia del ledger de mesas-//
/**
 * Crea una fila vacía para el formulario interactivo de mesas.
 * @pure
 */
function createEmptyRow(): TablesOnboardingRowState {
  return {
    rowKey: `table-row-${crypto.randomUUID()}`,
    id: "",
    name: "",
    capacity: 0,
    isCombinable: false,
  };
}
//-aqui termina funcion createEmptyRow y se va autilizar al agregar nuevas filas-//

//-aqui empieza componente TablesOnboardingForm y es para manejar el formulario interactivo de mesas-//
/**
 * Presenta el formulario editable de mesas y prepara sus campos para un server action.
 */
export function TablesOnboardingForm({ action, errorMessage, initialRows, restaurantId }: TablesOnboardingFormProps) {
  const [rows, setRows] = useState<TablesOnboardingRowState[]>(initialRows);

  const namedRows = rows.filter((row) => row.name.trim().length > 0);
  const totalCapacity = namedRows.reduce((accumulator, row) => accumulator + row.capacity, 0);
  const combinableTables = namedRows.filter((row) => row.isCombinable).length;

  //-aqui empieza funcion handleAddRow y es para anexar una nueva fila editable-//
  /**
   * Agrega una fila nueva al formulario de mesas.
   * @pure
   */
  function handleAddRow() {
    setRows((currentRows) => [...currentRows, createEmptyRow()]);
  }
  //-aqui termina funcion handleAddRow y se va autilizar en la UI-//

  //-aqui empieza funcion handleRemoveRow y es para quitar una fila editable por clave local-//
  /**
   * Elimina una fila del formulario sin tocar la base de datos hasta guardar.
   * @pure
   */
  function handleRemoveRow(rowKey: string) {
    setRows((currentRows) => {
      const nextRows = currentRows.filter((row) => row.rowKey !== rowKey);

      return nextRows.length > 0 ? nextRows : [createEmptyRow()];
    });
  }
  //-aqui termina funcion handleRemoveRow y se va autilizar en la UI-//

  //-aqui empieza funcion updateRow y es para mutar una fila concreta dentro del estado local-//
  /**
   * Actualiza una fila del formulario preservando el resto del estado.
   * @pure
   */
  function updateRow(rowKey: string, updater: (row: TablesOnboardingRowState) => TablesOnboardingRowState) {
    setRows((currentRows) => currentRows.map((row) => (row.rowKey === rowKey ? updater(row) : row)));
  }
  //-aqui termina funcion updateRow y se va autilizar en los inputs-//

  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div className="max-w-xl space-y-4">
          <h1 className="text-5xl font-extrabold leading-none tracking-tighter text-primary">
            <T>Define tu espacio de servicio.</T>
          </h1>
          <p className="text-lg leading-relaxed text-on-surface-variant">
            <T>Configura tus mesas reales para reflejar la capacidad del restaurante y facilitar la asignación futura.</T>
          </p>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row">
          <button className="rounded-lg bg-surface-container-highest px-6 py-3 text-sm font-bold text-on-surface transition-colors hover:bg-surface-container-high" onClick={handleAddRow} type="button">
            <T>Agregar mesa</T>
          </button>
        </div>
      </section>

      <section className={tablesMetricGridClassName}>
        <article className={tablesMetricCardClassName}>
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">
            <T>Total de mesas</T>
          </p>
          <p className="text-4xl font-black text-primary">{namedRows.length}</p>
        </article>

        <article className={tablesMetricCardClassName}>
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">
            <T>Capacidad máxima</T>
          </p>
          <p className="text-4xl font-black text-primary">{totalCapacity}</p>
        </article>

        <article className="relative overflow-hidden rounded-2xl bg-secondary-container p-6">
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-on-secondary-container">
            <T>Mesas combinables</T>
          </p>
          <p className="text-3xl font-black text-secondary md:text-4xl">{combinableTables}</p>
          <div className="absolute -bottom-6 -right-6 h-28 w-28 rounded-full bg-secondary/10" />
        </article>
      </section>

      <form action={action} className="space-y-6" id={tablesOnboardingFormId}>
        <input name="restaurantId" type="hidden" value={restaurantId} />
        <input name="rowCount" type="hidden" value={String(rows.length)} />

        {errorMessage ? (
          <div className="rounded-2xl border border-error/20 bg-error/5 px-4 py-3 text-sm font-medium text-error">
            <T>{errorMessage}</T>
          </div>
        ) : null}

        <section className="overflow-hidden rounded-[28px] bg-surface-container-low shadow-[0_20px_40px_rgba(26,28,28,0.04)]">
          <div className="hidden items-center gap-6 bg-surface-container-high px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant md:flex">
            <div className="w-12 shrink-0">
              <T>Orden</T>
            </div>
            <div className="flex-[2.2]">
              <T>Nombre</T>
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
            {rows.map((row, index) => {
              const displayOrder = String(index + 1).padStart(2, "0");
              const tableNameInputId = `tableName-${index}`;
              const tableCapacityInputId = `tableCapacity-${index}`;

              return (
                <div key={row.rowKey} className="flex flex-col gap-5 px-6 py-6 transition-colors md:flex-row md:items-center md:gap-6 md:px-8">
                  <input name={`tableId-${index}`} type="hidden" value={row.id} />
                  <input name={`tableSortOrder-${index}`} type="hidden" value={String(index + 1)} />

                  <div className="w-12 shrink-0 text-sm font-black text-on-surface-variant">{displayOrder}</div>

                  <div className="min-w-0 flex-[2.2]">
                    <label className="sr-only" htmlFor={tableNameInputId}>
                      <T>{`Nombre de la mesa ${index + 1}`}</T>
                    </label>
                    <input
                      className={tableInputBaseClassName}
                      id={tableNameInputId}
                      name={`tableName-${index}`}
                      onChange={(event) => {
                        updateRow(row.rowKey, (currentRow) => ({
                          ...currentRow,
                          name: event.target.value,
                        }));
                      }}
                      aria-label={`Nombre de la mesa ${index + 1}`}
                      placeholder="Mesa 1, Terraza A, Barra..."
                      type="text"
                      value={row.name}
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <label className="sr-only" htmlFor={tableCapacityInputId}>
                        <T>{`Capacidad de la mesa ${index + 1}`}</T>
                      </label>
                      <input
                        className={`${tableInputBaseClassName} w-24 text-center`}
                        id={tableCapacityInputId}
                        min={1}
                        name={`tableCapacity-${index}`}
                        onChange={(event) => {
                          updateRow(row.rowKey, (currentRow) => ({
                            ...currentRow,
                            capacity: Number(event.target.value || "0"),
                          }));
                        }}
                        aria-label={`Capacidad de la mesa ${index + 1}`}
                        type="number"
                        value={row.capacity <= 0 ? "" : String(row.capacity)}
                      />
                      <span className="text-xs font-medium text-on-surface-variant">
                        <T>comensales</T>
                      </span>
                    </div>
                  </div>

                  <div className="flex-[1.1]">
                    <label className="inline-flex items-center gap-3">
                      <input
                        checked={row.isCombinable}
                        className={tableCheckboxClassName}
                        name={`tableCombinable-${index}`}
                        onChange={(event) => {
                          updateRow(row.rowKey, (currentRow) => ({
                            ...currentRow,
                            isCombinable: event.target.checked,
                          }));
                        }}
                        type="checkbox"
                      />
                      <span className="text-xs font-semibold text-on-surface-variant">
                        <T>{row.isCombinable ? "Sí" : "No"}</T>
                      </span>
                    </label>
                  </div>

                  <div className="flex justify-end md:w-28 md:shrink-0">
                    <button className="rounded-full px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary" onClick={() => {
                      handleRemoveRow(row.rowKey);
                    }} type="button">
                      <T>Quitar</T>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col justify-between gap-6 border-t border-outline-variant/20 bg-surface-container-low px-6 py-6 md:flex-row md:items-center md:px-8">
            <button className="self-start text-sm font-bold text-primary transition-transform hover:translate-x-1" onClick={handleAddRow} type="button">
              <T>Agregar otra fila</T>
            </button>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
              <div className="text-left sm:text-right">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">
                  <T>Capacidad estimada</T>
                </p>
                <p className="text-sm font-bold text-primary">{totalCapacity} <T>comensales en total</T></p>
              </div>
              <button className="rounded-lg bg-primary px-8 py-4 text-center text-sm font-bold uppercase tracking-[0.18em] text-on-primary transition-all hover:opacity-90" type="submit">
                <T>Guardar y continuar</T>
              </button>
            </div>
          </div>
        </section>
      </form>

      <div className="flex items-center justify-between gap-4 rounded-[28px] border border-outline-variant/20 bg-surface-container-lowest/90 px-6 py-5">
        <Link className="inline-flex items-center gap-3 text-sm font-bold uppercase tracking-[0.18em] text-on-surface transition-colors hover:text-primary" href={`/onboarding/settings?restaurantId=${restaurantId}`}>
          <OnboardingIcon className="h-4 w-4 rotate-180" name="arrowForward" />
          <T>Volver a configuración</T>
        </Link>
      </div>
    </div>
  );
}
//-aqui termina componente TablesOnboardingForm-//
