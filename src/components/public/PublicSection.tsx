/**
 * Archivo: PublicSection.tsx
 * Responsabilidad: Renderizar secciones públicas con jerarquía editorial consistente.
 * Tipo: UI
 */

import type { ReactNode } from "react";
import { T } from "@/components/T";

interface PublicSectionProps {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

//-aqui empieza componente PublicSection y es para estructurar bloques de contenido-//
/**
 * Muestra una sección con encabezado, descripción y contenido opcional.
 */
export function PublicSection({
  eyebrow,
  title,
  description,
  children,
  actions,
  className = "",
}: PublicSectionProps) {
  return (
    <section className={`rounded-[32px] bg-surface-container-low p-6 shadow-[0_20px_40px_rgba(26,28,28,0.06)] sm:p-8 lg:p-10 ${className}`}>
      <div className="flex flex-col gap-6">
        <div className="max-w-3xl space-y-3">
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-secondary">
              <T>{eyebrow}</T>
            </p>
          ) : null}
          <h2 className="text-2xl font-semibold leading-tight text-foreground sm:text-3xl lg:text-4xl">
            <T>{title}</T>
          </h2>
          {description ? (
            <p className="max-w-2xl text-sm leading-7 text-foreground/72 sm:text-base">
              <T>{description}</T>
            </p>
          ) : null}
        </div>

        {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
        {children ? <div className="mt-2">{children}</div> : null}
      </div>
    </section>
  );
}
//-aqui termina componente PublicSection-//
