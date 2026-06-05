/**
 * Archivo: page.tsx
 * Responsabilidad: Landing del panel de servicio — visión general de mesas y órdenes activas.
 * Tipo: UI
 */

import { T } from "@/components/T";
import { fetchServiceOverview } from "./actions";
import { ServiceTableGrid } from "@/components/dashboard/service/ServiceTableGrid";

//-aqui empieza pagina ServicePage y es para mostrar el panel de servicio operativo-//
/**
 * Server Component que obtiene el estado de las mesas y lo pasa al grid interactivo.
 */
export default async function ServicePage() {
  const result = await fetchServiceOverview();

  if (!result.ok) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
        <p className="text-2xl">⚠️</p>
        <p className="text-lg font-semibold text-foreground">
          <T>No se pudo cargar el panel de servicio</T>
        </p>
        <p className="max-w-sm text-sm text-muted-foreground">{result.error}</p>
      </div>
    );
  }

  const { tables, menuItems } = result.data;

  const openCount = tables.filter((t) => t.order?.status === "OPEN").length;
  const submittedCount = tables.filter((t) => t.order?.status === "SUBMITTED").length;
  const freeCount = tables.filter((t) => t.order === null).length;

  return (
    <>
      {/* Cabecera */}
      <section className="flex flex-col gap-6 rounded-[28px] bg-surface-container-lowest p-8 shadow-sm md:flex-row md:items-end md:justify-between md:p-10">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
            <T>Panel de servicio</T>
          </p>
          <h2 className="mt-4 text-5xl font-black tracking-tighter text-primary md:text-6xl">
            <T>Servicio en tiempo real.</T>
          </h2>
          <p className="mt-4 max-w-xl text-on-surface-variant md:text-lg md:leading-8">
            <T>
              Abre órdenes, añade platos y envíalos a cocina o barra. El estado de cada mesa se actualiza al guardar.
            </T>
          </p>
        </div>
      </section>

      {/* Métricas rápidas */}
      <section className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-background p-5 text-center shadow-sm">
          <p className="text-3xl font-black text-emerald-600">{freeCount}</p>
          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <T>Libres</T>
          </p>
        </div>
        <div className="rounded-xl border border-border bg-background p-5 text-center shadow-sm">
          <p className="text-3xl font-black text-amber-500">{openCount}</p>
          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <T>Orden abierta</T>
          </p>
        </div>
        <div className="rounded-xl border border-border bg-background p-5 text-center shadow-sm">
          <p className="text-3xl font-black text-primary">{submittedCount}</p>
          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <T>En cocina</T>
          </p>
        </div>
      </section>

      {/* Grid de mesas */}
      <section className="flex flex-col gap-4">
        <ServiceTableGrid tables={tables} menuItems={menuItems} />
      </section>
    </>
  );
}
//-aqui termina pagina ServicePage-//
