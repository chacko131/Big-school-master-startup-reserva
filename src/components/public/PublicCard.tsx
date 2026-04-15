/**
 * Archivo: PublicCard.tsx
 * Responsabilidad: Reutilizar la base visual de las tarjetas públicas.
 * Tipo: UI
 */

import type { ReactNode } from "react";
import { T } from "@/components/T";
import type { PublicTone } from "@/lib/public/siteContent";

interface PublicCardProps {
  title: string;
  description?: string;
  children?: ReactNode;
  tone?: PublicTone;
  className?: string;
}

const toneClasses: Record<PublicTone, string> = {
  primary: "bg-primary text-background",
  secondary: "bg-secondary text-white",
  tertiary: "bg-tertiary text-white",
};

//-aqui empieza componente PublicCard y es para encapsular bloques reutilizables-//
/**
 * Tarjeta genérica para métricas, features o contenido editorial.
 */
export function PublicCard({ title, description, children, tone = "primary", className = "" }: PublicCardProps) {
  return (
    <article className={`rounded-[28px] bg-surface-container-lowest p-6 shadow-[0_20px_40px_rgba(26,28,28,0.06)] ${className}`}>
      <div className={`mb-5 h-1.5 w-14 rounded-full ${toneClasses[tone]}`} />
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground sm:text-xl">
          <T>{title}</T>
        </h3>
        {description ? (
          <p className="text-sm leading-7 text-foreground/72">
            <T>{description}</T>
          </p>
        ) : null}
        {children ? <div className="pt-2">{children}</div> : null}
      </div>
    </article>
  );
}
//-aqui termina componente PublicCard-//
