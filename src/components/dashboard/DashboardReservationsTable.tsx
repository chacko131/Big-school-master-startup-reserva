/**
 * Archivo: DashboardReservationsTable.tsx
 * Responsabilidad: Renderizar el listado de reservas de hoy en una tabla estilizada.
 * Tipo: UI
 */

import Link from "next/link";
import { T } from "@/components/T";
import { type ReservationWithGuest } from "@/modules/reservations/application/dtos/get-today-reservations.dto";

export interface DashboardReservationsTableProps {
  reservations: ReservationWithGuest[];
}

//-aqui empieza funcion getStatusLabelAndTone y es para traducir los estados del backend al formato de UI-//
/**
 * Traduce el estado de la reserva del dominio a etiquetas y tonos para el componente visual.
 *
 * @pure
 */
function getStatusLabelAndTone(status: string): { label: string; statusTone: "confirmed" | "warning" | "pending" } {
  switch (status) {
    case "CONFIRMED":
      return { label: "Confirmada", statusTone: "confirmed" };
    case "CHECKED_IN":
      return { label: "En mesa", statusTone: "confirmed" };
    case "COMPLETED":
      return { label: "Completada", statusTone: "confirmed" };
    case "PENDING":
      return { label: "Pendiente", statusTone: "pending" };
    case "WAITLISTED":
      return { label: "Lista de espera", statusTone: "pending" };
    case "CANCELLED":
      return { label: "Cancelada", statusTone: "warning" };
    case "NO_SHOW":
      return { label: "No se presentó", statusTone: "warning" };
    default:
      return { label: status, statusTone: "pending" };
  }
}
//-aqui termina funcion getStatusLabelAndTone-//

//-aqui empieza componente DashboardReservationsTable y es para mostrar la agenda del servicio-//
/**
 * Renderiza la tabla de reservas próximas del día actual.
 *
 * @pure
 */
export function DashboardReservationsTable({ reservations }: DashboardReservationsTableProps) {
  if (reservations.length === 0) {
    return (
      <section className="space-y-6">
        <div className="flex items-center justify-between gap-4 px-2">
          <h3 className="text-xl font-bold tracking-tight text-primary md:text-2xl">
            <T>Próximas reservas</T>
          </h3>
          <Link
            className="inline-flex items-center gap-1 text-sm font-bold text-on-surface-variant transition-colors hover:text-primary"
            href="/dashboard/reservations"
          >
            <T>Ver todo</T>
            <span aria-hidden="true">›</span>
          </Link>
        </div>
        <div className="flex flex-col items-center justify-center rounded-2xl bg-surface-container-lowest py-16 px-6 text-center shadow-sm">
          <p className="text-lg font-bold text-on-surface">
            <T>No hay reservas programadas para hoy</T>
          </p>
          <p className="mt-1 text-sm text-on-surface-variant">
            <T>Las nuevas reservas creadas para el día de hoy aparecerán en esta lista.</T>
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-4 px-2">
        <h3 className="text-xl font-bold tracking-tight text-primary md:text-2xl">
          <T>Próximas reservas</T>
        </h3>
        <Link
          className="inline-flex items-center gap-1 text-sm font-bold text-on-surface-variant transition-colors hover:text-primary"
          href="/dashboard/reservations"
        >
          <T>Ver todo</T>
          <span aria-hidden="true">›</span>
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm">
        <table className="w-full border-collapse text-left">
          <thead className="bg-surface-container-low">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                <T>Invitado</T>
              </th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                <T>Hora</T>
              </th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                <T>Comensales</T>
              </th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                <T>Estado</T>
              </th>
              <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                <T>Acción</T>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {reservations.map((reservation) => {
              const { label: statusLabel, statusTone } = getStatusLabelAndTone(reservation.status);
              const statusClassName =
                statusTone === "confirmed"
                  ? "bg-secondary-container text-on-secondary-container"
                  : statusTone === "warning"
                    ? "bg-tertiary-fixed text-on-tertiary-fixed"
                    : "bg-surface-container-highest text-on-surface-variant";

              const timeStr = new Date(reservation.startAt).toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              });

              const initials = reservation.guestFullName
                ? reservation.guestFullName
                    .split(" ")
                    .slice(0, 2)
                    .map((word) => word.charAt(0))
                    .join("")
                    .toUpperCase()
                : "?";

              return (
                <tr
                  className="transition-colors hover:bg-surface-container-high"
                  key={reservation.id}
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-high text-[10px] font-black text-on-surface-variant">
                        {initials}
                      </div>
                      <p className="text-sm font-bold text-on-surface">
                        <T>{reservation.guestFullName}</T>
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm font-medium text-on-surface">
                    <T>{timeStr}</T>
                  </td>
                  <td className="px-6 py-5 text-sm font-medium text-on-surface">
                    <T>{reservation.partySize.toString()}</T>
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${statusClassName}`}
                    >
                      <T>{statusLabel}</T>
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <Link
                      className="text-xl leading-none text-on-surface-variant transition-colors hover:text-primary"
                      href={`/dashboard/reservations?q=${encodeURIComponent(reservation.guestFullName)}`}
                      aria-label="Más acciones"
                    >
                      ⋯
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
//-aqui termina componente DashboardReservationsTable-//
