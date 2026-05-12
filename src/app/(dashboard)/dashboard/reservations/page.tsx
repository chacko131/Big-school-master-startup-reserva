/**
 * Archivo: page.tsx
 * Responsabilidad: Componer la vista operativa de reservas del dashboard conectada a datos reales.
 * Tipo: UI
 */

import { T } from "@/components/T";
import { ReservationMetricCard } from "@/components/reservation/ReservationMetricCard";
import { ReservationsFilterSection } from "@/components/reservation/ReservationsFilterSection";
import { NewReservationButton } from "@/components/reservation/NewReservationButton";
import { fetchTodayReservations } from "./actions";

//-aqui empieza pagina ReservationsPage y es para mostrar la vista operativa de reservas-//
/**
 * Server Component que obtiene reservas del día y las presenta en la vista operativa.
 */
export default async function ReservationsPage() {
  const { reservations, totalCount } = await fetchTodayReservations();

  const totalGuests = reservations.reduce((sum, r) => sum + r.partySize, 0);

  const metrics = [
    { label: "Reservas de hoy", value: String(totalCount), caption: "activas en el sistema", tone: "primary" as const },
    { label: "Clientes previstos", value: String(totalGuests), caption: "personas esperadas hoy", tone: "secondary" as const },
  ] as const;

  const ledgerData = reservations.map((r) => ({
    id: r.id,
    guestFullName: r.guestFullName,
    guestPhone: r.guestPhone,
    partySize: r.partySize,
    startAt: r.startAt,
    status: r.status,
    specialRequests: r.specialRequests,
  }));

  return (
    <>
      <section className="flex flex-col gap-6 rounded-[28px] bg-surface-container-lowest p-8 shadow-sm md:flex-row md:items-end md:justify-between md:p-10">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
            <T>Reservas del restaurante</T>
          </p>
          <h2 className="mt-4 text-5xl font-black tracking-tighter text-primary md:text-6xl">
            <T>Gestiona el flujo de invitados de hoy.</T>
          </h2>
          <p className="mt-4 max-w-xl text-on-surface-variant md:text-lg md:leading-8">
            <T>
              Revisa las reservas activas, anticipa la ocupación y resuelve incidencias antes de que lleguen al salón.
            </T>
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <NewReservationButton />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <ReservationMetricCard
            caption={metric.caption}
            key={metric.label}
            label={metric.label}
            tone={metric.tone}
            value={metric.value}
          />
        ))}
      </section>

      <section className="flex flex-col gap-4">
        <ReservationsFilterSection allReservations={ledgerData} />
      </section>
    </>
  );
}
//-aqui termina pagina ReservationsPage-//
