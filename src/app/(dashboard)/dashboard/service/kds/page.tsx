/**
 * Archivo: page.tsx
 * Responsabilidad: KDS (Kitchen Display System) — cola de ítems por estación en tiempo real.
 * Tipo: UI
 */

import { T } from "@/components/T";
import { fetchKdsQueue } from "./actions";
import { KdsBoard } from "@/components/dashboard/service/KdsBoard";


//-aqui empieza pagina KdsPage y es para mostrar la cola de cocina y barra-//
/**
 * Server Component que carga la cola de ambas estaciones en paralelo y las pasa al board.
 */
export default async function KdsPage() {
  const [kitchenResult, barResult] = await Promise.all([
    fetchKdsQueue("KITCHEN"),
    fetchKdsQueue("BAR"),
  ]);

  const kitchenItems = kitchenResult.ok ? kitchenResult.data : [];
  const barItems = barResult.ok ? barResult.data : [];

  return (
    <div className="flex flex-col gap-6">
      {/* Header compacto operativo */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight"><T>Cocina</T></h2>
          <p className="text-xs text-muted-foreground">
            {kitchenItems.length + barItems.length} <T>plato(s) pendientes</T>
          </p>
        </div>
        <span className="rounded-xl bg-muted px-3 py-1.5 text-xs font-semibold text-muted-foreground">
          <T>Vista en tiempo real · recarga para actualizar</T>
        </span>
      </div>

      {/* Cocina — ocupa todo el ancho */}
      <KdsBoard area="KITCHEN" items={kitchenItems} />

      {/* Divider */}
      {barItems.length > 0 && (
        <>
          <hr className="border-border" />
          <KdsBoard area="BAR" items={barItems} />
        </>
      )}
    </div>
  );
}
//-aqui termina pagina KdsPage-//
