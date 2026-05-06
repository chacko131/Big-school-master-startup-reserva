/**
 * Archivo: ReservationsLedger.tsx
 * Responsabilidad: Renderizar la tabla principal de reservas con datos reales del dominio.
 * Tipo: UI
 */

import { T } from "@/components/T";
import { OnboardingIcon } from "@/components/onboarding/OnboardingIcon";
import { NewReservationButton } from "@/components/reservation/NewReservationButton";
import { ReservationStatusSelect } from "@/components/reservation/ReservationStatusSelect";
import { type ReservationStatus } from "@/modules/reservations/domain/entities/reservation.entity";

export interface ReservationRowData {
  id: string;
  guestFullName: string;
  guestPhone: string;
  partySize: number;
  startAt: Date;
  status: ReservationStatus;
  specialRequests: string | null;
}

interface ReservationsLedgerProps {
  reservations: ReadonlyArray<ReservationRowData>;
  totalCount: number;
}

//-aqui empieza funcion getStatusBadge y es para resolver el estilo y label del badge de estado-//
/** @pure */
function getStatusBadge(status: ReservationStatus): { label: string; className: string } {
  switch (status) {
    case "CONFIRMED":
      return { label: "Confirmada", className: "bg-secondary-container text-on-secondary-container" };
    case "PENDING":
      return { label: "Pendiente", className: "bg-tertiary-fixed text-on-tertiary-fixed" };
    case "CHECKED_IN":
      return { label: "En sala", className: "bg-primary/10 text-primary" };
    case "COMPLETED":
      return { label: "Completada", className: "bg-surface-container-highest text-on-surface-variant" };
    case "CANCELLED":
      return { label: "Cancelada", className: "bg-error-container text-on-error-container" };
    case "NO_SHOW":
      return { label: "No-show", className: "bg-error-container text-on-error-container" };
    case "WAITLISTED":
      return { label: "En espera", className: "bg-surface-container-high text-on-surface-variant" };
    default:
      return { label: status, className: "bg-surface-container-highest text-on-surface-variant" };
  }
}
//-aqui termina funcion getStatusBadge-//

//-aqui empieza funcion formatTime y es para formatear hora de una Date-//
/** @pure */
function formatTime(date: Date): string {
  return date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
}
//-aqui termina funcion formatTime-//

//-aqui empieza funcion getInitials y es para obtener las iniciales del nombre del guest-//
/** @pure */
function getInitials(fullName: string): string {
  return fullName
    .split(" ")
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}
//-aqui termina funcion getInitials-//

//-aqui empieza componente ReservationsLedger y es para mostrar la tabla principal de reservas-//
/**
 * Renderiza el listado operativo de reservas del día.
 *
 * @pure
 */
export function ReservationsLedger({ reservations, totalCount }: ReservationsLedgerProps) {
  if (reservations.length === 0) {
    return (
      <section className="overflow-hidden rounded-2xl border border-outline-variant/10 bg-surface-container-lowest p-12 text-center shadow-sm">
        <OnboardingIcon name="schedule" className="mx-auto h-12 w-12 text-on-surface-variant/40" />
        <h3 className="mt-4 text-lg font-bold text-on-surface">
          <T>Sin reservas para hoy</T>
        </h3>
        <p className="mt-2 text-sm text-on-surface-variant">
          <T>Cuando se creen reservas para esta fecha, aparecerán aquí.</T>
        </p>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-outline-variant/10 bg-surface-container-lowest shadow-sm">
      <div className="flex items-center justify-between gap-4 border-b border-outline-variant/10 px-6 py-5">
        <div>
          <h3 className="text-lg font-bold tracking-tight text-primary md:text-xl">
            <T>Reservas próximas</T>
          </h3>
          <p className="mt-1 text-sm text-on-surface-variant">
            <T>Gestiona la afluencia del servicio y revisa el estado de cada reserva.</T>
          </p>
        </div>
        <NewReservationButton />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead className="bg-surface-container-low">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                <T>Invitado</T>
              </th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                <T>Personas</T>
              </th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                <T>Hora</T>
              </th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                <T>Estado</T>
              </th>
              <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                <T>Acciones</T>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {reservations.map((reservation) => {
              const badge = getStatusBadge(reservation.status);

              return (
                <tr className="transition-colors hover:bg-surface-container-high" key={reservation.id}>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-high text-[10px] font-black text-on-surface-variant">
                        {getInitials(reservation.guestFullName)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-on-surface">
                          {reservation.guestFullName}
                        </p>
                        <p className="text-xs text-on-surface-variant">
                          {reservation.guestPhone}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm font-medium text-on-surface">
                    {reservation.partySize}
                  </td>
                  <td className="px-6 py-5 text-sm font-medium text-on-surface">
                    <span className="inline-flex rounded-md bg-surface-container-high px-2.5 py-1 text-sm font-bold text-on-surface">
                      {formatTime(reservation.startAt)}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${badge.className}`}>
                      {badge.label}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <ReservationStatusSelect
                      reservationId={reservation.id}
                      currentStatus={reservation.status}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-outline-variant/10 bg-surface-container-low px-6 py-4">
        <p className="text-xs font-medium text-on-surface-variant">
          <T>{`Mostrando ${reservations.length} de ${totalCount} reservas`}</T>
        </p>
        <div className="flex gap-2">
          <button className="rounded-lg p-2 text-sm text-on-surface-variant transition-colors hover:bg-surface-container-high disabled:cursor-not-allowed disabled:opacity-30" type="button" disabled aria-label="Anterior">
            ‹
          </button>
          <button className="rounded-lg p-2 text-sm text-on-surface-variant transition-colors hover:bg-surface-container-high" type="button" aria-label="Siguiente">
            ›
          </button>
        </div>
      </div>
    </section>
  );
}
//-aqui termina componente ReservationsLedger-//
