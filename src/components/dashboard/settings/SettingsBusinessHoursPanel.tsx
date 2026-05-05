/**
 * Archivo: SettingsBusinessHoursPanel.tsx
 * Responsabilidad: Formulario para gestionar los horarios de apertura del restaurante.
 * Tipo: UI
 */

"use client";

import { T } from "@/components/T";
import { OnboardingIcon } from "@/components/onboarding/OnboardingIcon";
import { NotificationBanner } from "@/components/ui/NotificationBanner";

const DAYS = [
  { value: "MONDAY", label: "Lunes" },
  { value: "TUESDAY", label: "Martes" },
  { value: "WEDNESDAY", label: "Miércoles" },
  { value: "THURSDAY", label: "Jueves" },
  { value: "FRIDAY", label: "Viernes" },
  { value: "SATURDAY", label: "Sábado" },
  { value: "SUNDAY", label: "Domingo" },
] as const;

export interface BusinessHourRow {
  day: string;
  opensAt: string;
  closesAt: string;
  isClosed: boolean;
}

interface SettingsBusinessHoursPanelProps {
  initialValues: BusinessHourRow[];
  errorMessage?: string;
  successMessage?: string;
  saveAction: (formData: FormData) => Promise<void>;
}

const inputClassName =
  "w-full rounded-lg border-0 bg-surface-container-low px-3 py-2 text-sm font-semibold text-on-surface outline-none ring-1 ring-transparent transition-all focus:ring-primary";

//-aqui empieza funcion buildInitialMap y es para indexar horarios iniciales por día-//
/**
 * @pure
 */
function buildInitialMap(rows: BusinessHourRow[]): Record<string, BusinessHourRow> {
  const map: Record<string, BusinessHourRow> = {};
  for (const row of rows) {
    map[row.day] = row;
  }
  return map;
}
//-aqui termina funcion buildInitialMap-//

//-aqui empieza componente SettingsBusinessHoursPanel y es para editar horarios de apertura del restaurante-//
/**
 * @pure
 */
export function SettingsBusinessHoursPanel({
  initialValues,
  errorMessage,
  successMessage,
  saveAction,
}: SettingsBusinessHoursPanelProps) {
  const initialMap = buildInitialMap(initialValues);

  return (
    <section className="overflow-hidden rounded-[28px] bg-surface-container-lowest shadow-sm">
      <div className="border-b border-outline-variant/10 p-8">
        <h3 className="text-xl font-black tracking-tight text-primary md:text-2xl">
          <T>Horarios de apertura</T>
        </h3>
        <p className="mt-1 text-sm text-on-surface-variant">
          <T>Define los horarios de servicio para cada día de la semana.</T>
        </p>
      </div>

      <form action={saveAction} className="space-y-6 p-8">
        {errorMessage ? (
          <NotificationBanner
            key={`hours-error-${errorMessage}`}
            description={errorMessage}
            tone="error"
            title="No pudimos guardar los horarios"
          />
        ) : null}

        {successMessage ? (
          <NotificationBanner
            key={`hours-success-${successMessage}`}
            description={successMessage}
            tone="success"
            title="Horarios actualizados"
          />
        ) : null}

        <div className="space-y-3">
          {DAYS.map(({ value: dayValue, label }) => {
            const existing = initialMap[dayValue];
            const defaultClosed = existing?.isClosed ?? false;
            const defaultOpens = existing?.opensAt ?? "12:00";
            const defaultCloses = existing?.closesAt ?? "23:00";

            return (
              <div
                className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-3 rounded-2xl bg-surface-container-low p-4"
                key={dayValue}
              >
                <input type="hidden" name={`day-${dayValue}`} value={dayValue} />

                <p className="text-sm font-bold text-on-surface">{label}</p>

                <label className="flex items-center gap-2 text-xs text-on-surface-variant">
                  <input
                    type="checkbox"
                    name={`closed-${dayValue}`}
                    defaultChecked={defaultClosed}
                    className="h-4 w-4 rounded border-outline-variant text-error focus:ring-error"
                  />
                  <T>Cerrado</T>
                </label>

                <input
                  type="time"
                  name={`opens-${dayValue}`}
                  defaultValue={defaultOpens}
                  className={inputClassName}
                />

                <input
                  type="time"
                  name={`closes-${dayValue}`}
                  defaultValue={defaultCloses}
                  className={inputClassName}
                />
              </div>
            );
          })}
        </div>

        <div className="flex justify-end pt-2">
          <button
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-on-primary transition-colors hover:opacity-90"
            type="submit"
          >
            <OnboardingIcon name="save" className="h-4 w-4" />
            <T>Guardar horarios</T>
          </button>
        </div>
      </form>
    </section>
  );
}
//-aqui termina componente SettingsBusinessHoursPanel-//
