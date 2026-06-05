/**
 * Archivo: page.tsx
 * Responsabilidad: Landing de Gestión (Plan Pro) con accesos a submódulos.
 * Tipo: UI
 */

import Link from "next/link";
import { T } from "@/components/T";

export default function MenuManagementLanding() {
  return (
    <div className="space-y-8 p-6">
      {/* Cabecera */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight"><T>Gestión</T></h1>
        <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
          <T>Centraliza la operación: configura costes de la carta, monitoriza el servicio y revisa métricas clave.</T>
        </p>
      </div>

      {/* Atajos principales */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/dashboard/menu/costing"
          className="group rounded-lg border border-border bg-background p-5 shadow-sm transition-colors hover:bg-muted/40"
        >
          <div className="mb-2 text-sm font-semibold text-muted-foreground">
            <T>Backoffice</T>
          </div>
          <h2 className="text-lg font-bold"><T>Costeo de carta</T></h2>
          <p className="mt-1 text-sm text-muted-foreground">
            <T>Define el costo, la estación y el estado de cada plato. El precio de venta se toma de la carta.</T>
          </p>
          <div className="mt-4 inline-flex items-center text-emerald-700">
            <span className="text-sm font-medium"><T>Ir al detalle</T></span>
            <span className="ml-1">→</span>
          </div>
        </Link>

        {/* Placeholder de futuras secciones */}
        <div className="rounded-lg border border-border bg-background p-5 opacity-60">
          <div className="mb-2 text-sm font-semibold text-muted-foreground">
            <T>Operación</T>
          </div>
          <h2 className="text-lg font-bold"><T>Panel de servicio</T></h2>
          <p className="mt-1 text-sm text-muted-foreground">
            <T>Próximamente: flujo POS, KDS cocina/bar y estado de mesas en tiempo real.</T>
          </p>
        </div>

        <div className="rounded-lg border border-border bg-background p-5 opacity-60">
          <div className="mb-2 text-sm font-semibold text-muted-foreground">
            <T>Analítica</T>
          </div>
          <h2 className="text-lg font-bold"><T>Resumen de ventas</T></h2>
          <p className="mt-1 text-sm text-muted-foreground">
            <T>Próximamente: métricas de ingresos, margen y top productos por periodo.</T>
          </p>
        </div>
      </div>
    </div>
  );
}
