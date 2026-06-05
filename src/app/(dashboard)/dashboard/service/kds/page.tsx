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
    <>
      {/* Cabecera */}
      <section className="flex flex-col gap-6 rounded-[28px] bg-surface-container-lowest p-8 shadow-sm md:p-10">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
            <T>Cocina y barra</T>
          </p>
          <h2 className="mt-4 text-5xl font-black tracking-tighter text-primary md:text-6xl">
            <T>Cola de preparación.</T>
          </h2>
          <p className="mt-4 max-w-xl text-on-surface-variant md:text-lg md:leading-8">
            <T>
              Toma un ítem para marcarlo como "Preparando" y confírmalo como "Listo" cuando esté
              acabado.
            </T>
          </p>
        </div>
      </section>

      {/* Boards por estación */}
      <section className="grid gap-6 lg:grid-cols-2">
        <KdsBoard area="KITCHEN" items={kitchenItems} />
        <KdsBoard area="BAR" items={barItems} />
      </section>
    </>
  );
}
//-aqui termina pagina KdsPage-//
