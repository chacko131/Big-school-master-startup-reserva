/**
 * Archivo: page.tsx
 * Responsabilidad: Renderizar la vista CRM de clientes conectada al backend real del restaurante.
 * Tipo: UI (Server Component)
 */

import { getRestaurantIdFromSession } from "@/modules/auth/get-restaurant-id";
import { getReservationsInfrastructure } from "@/modules/reservations/infrastructure/reservations-infrastructure";
import { GetGuestsWithCrmMetrics } from "@/modules/reservations/application/use-cases/get-guests-with-crm-metrics.use-case";
import { GuestMetricCard } from "@/components/clients/GuestMetricCard";
import { GuestsSearchInput } from "@/components/clients/GuestsSearchInput";
import { GuestsTable } from "@/components/clients/GuestsTable";
import { T } from "@/components/T";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

//-aqui empieza pagina GuestsPage y es para montar el CRM operativo de clientes-//
/**
 * Presenta la vista CRM de clientes dentro del dashboard del restaurante.
 *
 * @sideEffect
 */
export default async function GuestsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q ?? "";

  const restaurantId = await getRestaurantIdFromSession();
  const { guestRepository } = getReservationsInfrastructure();
  const useCase = new GetGuestsWithCrmMetrics(guestRepository);

  const { guests } = await useCase.execute({
    restaurantId,
    query,
  });

  const activeGuestsCount = guests.filter((g) => g.totalReservationsCount > 0).length;
  const vipGuestsCount = guests.filter((g) => g.loyaltySegment === "VIP").length;
  const noShowGuestsCount = guests.filter(
    (g) => g.loyaltySegment === "Atención" || g.noShowsCalculated > 0
  ).length;

  return (
    <>
      <section className="flex flex-col gap-6 rounded-[28px] bg-surface-container-lowest p-8 shadow-sm lg:flex-row lg:items-end lg:justify-between lg:p-10">
        <div className="max-w-2xl space-y-4">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
            <T>CRM de clientes</T>
          </p>
          <h2 className="text-5xl font-black tracking-tighter text-primary lg:text-6xl">
            <T>Conoce a tus clientes y cuida la relación antes del próximo servicio.</T>
          </h2>
          <p className="max-w-xl text-on-surface-variant lg:text-lg lg:leading-8">
            <T>
              Esta vista agrupa historial, preferencias y alertas para que recepción y gerencia puedan actuar rápido sin perder contexto.
            </T>
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <GuestMetricCard
          label="Clientes activos"
          value={activeGuestsCount.toString()}
          caption="Con historial de reservas registrado"
          tone="primary"
        />
        <GuestMetricCard
          label="VIP identificados"
          value={vipGuestsCount.toString()}
          caption="Con notas de preferencias o visitas recurrentes"
          tone="secondary"
        />
        <GuestMetricCard
          label="No-shows"
          value={noShowGuestsCount.toString()}
          caption="Comensales con ausencias en su historial"
          tone="warning"
        />
      </section>

      <GuestsSearchInput />

      <section className="space-y-6">
        <GuestsTable guests={guests} />
      </section>
    </>
  );
}
//-aqui termina pagina GuestsPage-//
