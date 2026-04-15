/**
 * Archivo: PublicStatGrid.tsx
 * Responsabilidad: Mostrar métricas públicas en una cuadrícula reutilizable.
 * Tipo: UI
 */

import { T } from "@/components/T";
import { PublicCard } from "@/components/public/PublicCard";
import type { PublicMetric } from "@/lib/public/siteContent";

interface PublicStatGridProps {
  items: PublicMetric[];
  className?: string;
}

//-aqui empieza componente PublicStatGrid y es para mostrar métricas-//
/**
 * Cuadrícula de métricas para hero, perfil público y pantallas de confirmación.
 */
export function PublicStatGrid({ items, className = "" }: PublicStatGridProps) {
  return (
    <div className={`grid gap-4 sm:grid-cols-2 xl:grid-cols-4 ${className}`}>
      {items.map((item) => (
        <PublicCard key={item.label} title={item.label} tone="secondary" className="min-h-full">
          <p className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            <T>{item.value}</T>
          </p>
          <p className="mt-2 text-sm leading-6 text-foreground/68">
            <T>{item.hint}</T>
          </p>
        </PublicCard>
      ))}
    </div>
  );
}
//-aqui termina componente PublicStatGrid-//
