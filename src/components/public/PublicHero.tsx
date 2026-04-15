/**
 * Archivo: PublicHero.tsx
 * Responsabilidad: Renderizar la cabecera principal de las páginas públicas.
 * Tipo: UI
 */

import Link from "next/link";
import type { ReactNode } from "react";
import { T } from "@/components/T";
import type { PublicActionLink, PublicMetric } from "@/lib/public/siteContent";
import { PublicStatGrid } from "@/components/public/PublicStatGrid";

interface PublicHeroProps {
  eyebrow?: string;
  title: string;
  description: string;
  primaryAction: PublicActionLink;
  secondaryAction?: PublicActionLink;
  metrics?: PublicMetric[];
  aside?: ReactNode;
  className?: string;
}

const actionStyles: Record<PublicActionLink["variant"], string> = {
  primary: "bg-primary text-background hover:bg-primary/90",
  secondary: "bg-surface-container-lowest text-foreground hover:bg-surface-container-low",
  ghost: "bg-transparent text-foreground hover:bg-surface-container-lowest",
};

//-aqui empieza componente PublicHero y es para la cabecera principal-//
/**
 * Hero público para la landing, perfiles de restaurante y pantallas de entrada.
 */
export function PublicHero({
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
  metrics,
  aside,
  className = "",
}: PublicHeroProps) {
  return (
    <section className={`grid gap-8 rounded-[36px] bg-surface-container-low p-6 shadow-[0_20px_40px_rgba(26,28,28,0.06)] lg:grid-cols-[1.4fr_0.9fr] lg:p-10 ${className}`}>
      <div className="flex flex-col gap-8">
        <div className="max-w-3xl space-y-4">
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-secondary">
              <T>{eyebrow}</T>
            </p>
          ) : null}
          <h1 className="max-w-4xl text-4xl font-semibold leading-tight text-foreground sm:text-5xl lg:text-6xl">
            <T>{title}</T>
          </h1>
          <p className="max-w-2xl text-base leading-8 text-foreground/72 sm:text-lg">
            <T>{description}</T>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={primaryAction.href}
            className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-colors ${actionStyles[primaryAction.variant]}`}
          >
            <T>{primaryAction.label}</T>
          </Link>
          {secondaryAction ? (
            <Link
              href={secondaryAction.href}
              className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-colors ${actionStyles[secondaryAction.variant]}`}
            >
              <T>{secondaryAction.label}</T>
            </Link>
          ) : null}
        </div>

        {metrics ? <PublicStatGrid items={metrics} /> : null}
      </div>

      <div className="flex flex-col justify-between gap-6 rounded-[30px] bg-surface-container-lowest p-6 shadow-[0_20px_40px_rgba(26,28,28,0.06)]">
        {aside}
      </div>
    </section>
  );
}
//-aqui termina componente PublicHero-//
