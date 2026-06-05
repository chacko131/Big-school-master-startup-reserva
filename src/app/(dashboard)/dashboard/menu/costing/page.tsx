/**
 * Archivo: page.tsx
 * Responsabilidad: Backoffice de costeo privado de platos (Plan Pro).
 *   Owner/Manager configuran costo, precio público y estación de preparación.
 * Tipo: UI
 */

import { fetchCostingForRestaurant } from "./actions";
import { CostingTable } from "@/components/dashboard/costing/CostingTable";
import { T } from "@/components/T";

//-aqui empieza la pagina CostingPage y es para mostrar el backoffice de costeo del dueño-//
export default async function CostingPage() {
  const result = await fetchCostingForRestaurant();

  if (!result.ok) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
        <p className="text-2xl">🔒</p>
        <p className="text-lg font-semibold text-foreground"><T>Acceso restringido</T></p>
        <p className="max-w-sm text-sm text-muted-foreground">{result.error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Cabecera */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight"><T>Costeo de carta</T></h1>
        <p className="mt-1 text-sm text-muted-foreground">
          <T>Configura el precio de costo, precio de venta y estación de preparación de cada plato. Esta información es</T> <strong><T>privada</T></strong> <T>y no se muestra a los clientes.</T>
        </p>
      </div>

      {/* Tabla de costeo */}
      <CostingTable rows={result.data} />
    </div>
  );
}
//-aqui termina la pagina CostingPage-//
