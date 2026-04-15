/**
 * Archivo: PublicReservationForm.tsx
 * Responsabilidad: Mostrar un formulario público de reserva escalable y reutilizable.
 * Tipo: UI
 */

import type { ReactNode } from "react";
import { T } from "@/components/T";
import type { PublicReservationField, PublicReservationFieldGroup } from "@/lib/public/siteContent";

interface PublicReservationFormProps {
  title: string;
  description: string;
  groups: PublicReservationFieldGroup[];
  primaryActionLabel: string;
  secondaryNote: string;
  summaryTitle: string;
  summaryItems: string[];
  className?: string;
}

//-aqui empieza componente auxiliar para renderizar campos del formulario-//
/**
 * Renderiza un grupo de campos con una estructura limpia y consistente.
 */
function renderField(field: PublicReservationField): ReactNode {
  const inputClassName =
    "mt-2 w-full rounded-2xl bg-surface-container-lowest px-4 py-3 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-primary/15";

  return (
    <label key={field.name} className="block">
      <span className="text-sm font-medium text-foreground">
        <T>{field.label}</T>
        {field.required ? <span className="ml-1 text-tertiary">*</span> : null}
      </span>
      {field.type === "textarea" ? (
        <textarea className={`${inputClassName} min-h-32 resize-y`} placeholder={field.placeholder} />
      ) : (
        <input className={inputClassName} type={field.type} placeholder={field.placeholder} />
      )}
      {field.helperText ? <span className="mt-2 block text-xs leading-6 text-foreground/60"><T>{field.helperText}</T></span> : null}
    </label>
  );
}
//-aqui termina componente auxiliar-//

//-aqui empieza componente PublicReservationForm y es para estructurar la reserva pública-//
/**
 * Formulario de reserva con resumen lateral para mantener la intención del usuario visible.
 */
export function PublicReservationForm({
  title,
  description,
  groups,
  primaryActionLabel,
  secondaryNote,
  summaryTitle,
  summaryItems,
  className = "",
}: PublicReservationFormProps) {
  return (
    <section className={`grid gap-6 lg:grid-cols-[1.25fr_0.75fr] ${className}`}>
      <form className="rounded-[32px] bg-surface-container-lowest p-6 shadow-[0_20px_40px_rgba(26,28,28,0.06)] sm:p-8">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-secondary">
            <T>{title}</T>
          </p>
          <p className="max-w-2xl text-sm leading-7 text-foreground/72">
            <T>{description}</T>
          </p>
        </div>

        <div className="mt-8 space-y-8">
          {groups.map((group) => (
            <div key={group.title} className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  <T>{group.title}</T>
                </h2>
                <p className="mt-1 text-sm leading-6 text-foreground/66">
                  <T>{group.description}</T>
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {group.fields.map((field) => (
                  <div key={field.name} className={field.type === "textarea" ? "sm:col-span-2" : ""}>
                    {renderField(field)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-background transition-colors hover:bg-primary/90"
          >
            <T>{primaryActionLabel}</T>
          </button>
          <p className="text-sm leading-6 text-foreground/60">
            <T>{secondaryNote}</T>
          </p>
        </div>
      </form>

      <aside className="rounded-[32px] bg-surface-container-low p-6 shadow-[0_20px_40px_rgba(26,28,28,0.06)] sm:p-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            <T>{summaryTitle}</T>
          </h3>
          <ul className="space-y-3">
            {summaryItems.map((item) => (
              <li
                key={item}
                className="rounded-2xl bg-surface-container-lowest px-4 py-3 text-sm leading-6 text-foreground/72 shadow-[0_20px_40px_rgba(26,28,28,0.04)]"
              >
                <T>{item}</T>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </section>
  );
}
//-aqui termina componente PublicReservationForm-//
