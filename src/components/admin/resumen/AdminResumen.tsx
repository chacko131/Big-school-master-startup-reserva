/**
 * Archivo: AdminResumen.tsx
 * Responsabilidad: Renderizar el bloque reutilizable del resumen principal de admin
 * Tipo: UI
 */

import { AdminMetricCard } from "./AdminMetricCard";

interface AdminResumenProps {
  totalActiveRestaurants: number;
  totalActiveUsers: number;
  pendingIncidents: number | null;
  estimatedMrrCents: number | null;
}

//-aqui empieza funcion formatCurrency-//
/**
 * Formatea importes en euros para el resumen.
 * @pure
 */
function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}
//-aqui termina funcion formatCurrency-//

//-aqui empieza componente AdminResumen-//
export function AdminResumen({
  totalActiveRestaurants,
  totalActiveUsers,
  pendingIncidents,
  estimatedMrrCents,
}: AdminResumenProps) {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <AdminMetricCard
        caption="tenants supervisados hoy"
        label="Restaurantes activos"
        tone="primary"
        value={String(totalActiveRestaurants)}
      />
      <AdminMetricCard
        caption="ingreso recurrente mensual estimado"
        label="MRR estimado"
        tone="secondary"
        value={estimatedMrrCents === null ? "TODO" : formatCurrency(estimatedMrrCents)}
      />
      <AdminMetricCard
        caption="eventos operativos que requieren seguimiento"
        label="Incidencias abiertas"
        tone="surface"
        value={pendingIncidents === null ? "TODO" : String(pendingIncidents)}
      />
      <AdminMetricCard
        caption="cuentas con actividad reciente"
        label="Usuarios activos"
        tone="warning"
        value={String(totalActiveUsers)}
      />
    </section>
  );
}
//-aqui termina componente AdminResumen-//
