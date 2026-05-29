/**
 * Archivo: GuestsTable.tsx
 * Responsabilidad: Renderizar el listado estructurado de comensales en el CRM de clientes.
 * Tipo: UI (Client Component)
 */

"use client";

import { useState } from "react";
import { T } from "@/components/T";
import { type GuestCrmPrimitives } from "@/modules/reservations/application/dtos/guest-crm.dto";
import { NotesModal } from "./NotesModal";

interface GuestsTableProps {
  guests: GuestCrmPrimitives[];
}

interface GuestTableRowProps {
  guest: GuestCrmPrimitives;
  onReviewNotes: () => void;
}

//-aqui empieza funcion getGuestStatusToneClassName y es para pintar las etiquetas del CRM-//
/**
 * Devuelve las clases visuales del segmento de fidelidad del comensal.
 *
 * @pure
 */
function getGuestStatusToneClassName(loyaltySegment: GuestCrmPrimitives["loyaltySegment"]): string {
  if (loyaltySegment === "VIP") {
    return "bg-primary text-on-primary";
  }

  if (loyaltySegment === "Atención") {
    return "bg-tertiary-fixed text-on-tertiary-fixed";
  }

  if (loyaltySegment === "Frecuente") {
    return "bg-secondary-container text-on-secondary-container";
  }

  return "bg-surface-container-highest text-on-surface-variant";
}
//-aqui termina funcion getGuestStatusToneClassName-//

//-aqui empieza componente GuestTableRow y es para representar cada fila de cliente del CRM-//
/**
 * Renderiza una fila del CRM con los datos de visitas y contacto del huésped.
 *
 * @pure
 */
function GuestTableRow({ guest, onReviewNotes }: GuestTableRowProps) {
  const initials = guest.fullName
    .split(" ")
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();

  const formattedLastVisit = guest.lastVisitAt
    ? new Intl.DateTimeFormat("es-ES", {
        dateStyle: "short",
        timeStyle: "short",
      }).format(new Date(guest.lastVisitAt))
    : "Sin visitas registradas";

  const hasNotes = (guest.notes && guest.notes.trim().length > 0) || guest.historicalNotes.length > 0;
  const totalNotesCount = guest.historicalNotes.length + (guest.notes ? 1 : 0);

  return (
    <tr className="transition-colors hover:bg-surface-container-high/60">
      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-container-high text-xs font-black text-on-surface-variant">
            {initials || "?"}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-on-surface">
              {guest.fullName}
            </p>
            {guest.email && (
              <p className="truncate mt-1 text-xs text-on-surface-variant">
                {guest.email}
              </p>
            )}
          </div>
        </div>
      </td>
      <td className="px-6 py-5 text-sm text-on-surface-variant">
        {guest.phone}
      </td>
      <td className="px-6 py-5 text-sm font-medium text-on-surface">
        {formattedLastVisit}
      </td>
      <td className="px-6 py-5 text-sm font-medium text-on-surface">
        {guest.totalReservationsCount}
      </td>
      <td className="px-6 py-5 text-sm font-medium text-on-surface">
        {guest.noShowsCalculated}
      </td>
      <td className="px-6 py-5 text-sm">
        {hasNotes ? (
          <button
            onClick={onReviewNotes}
            className="inline-flex items-center gap-1.5 rounded-lg bg-surface-container-high px-3 py-1.5 text-xs font-bold text-primary hover:bg-surface-container-highest transition-colors"
            type="button"
          >
            <span>👁</span>
            <T>Revisar notas</T>
            <span className="ml-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary">
              {totalNotesCount}
            </span>
          </button>
        ) : (
          <span className="text-on-surface-variant/40 italic">
            <T>Sin notas</T>
          </span>
        )}
      </td>
      <td className="px-6 py-5">
        <span
          className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${getGuestStatusToneClassName(
            guest.loyaltySegment
          )}`}
        >
          <T>{guest.loyaltySegment}</T>
        </span>
      </td>
    </tr>
  );
}
//-aqui termina componente GuestTableRow-//

//-aqui empieza componente GuestsTable y es para agrupar el listado CRM principal-//
/**
 * Renderiza la tabla principal del CRM de clientes con soporte para visualización de notas.
 *
 */
export function GuestsTable({ guests }: GuestsTableProps) {
  const [selectedGuest, setSelectedGuest] = useState<GuestCrmPrimitives | null>(null);

  return (
    <section className="overflow-hidden rounded-[28px] bg-surface-container-lowest shadow-sm">
      <div className="flex items-center justify-between gap-4 border-b border-outline-variant/10 bg-surface-container-low px-6 py-5">
        <div>
          <h3 className="text-lg font-black tracking-tight text-primary lg:text-xl">
            <T>Base de clientes</T>
          </h3>
          <p className="mt-1 text-sm text-on-surface-variant">
            <T>Consulta historial, preferencias y ausencias reales en una sola vista.</T>
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        {guests.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-on-surface-variant">
            <p className="text-sm font-semibold">
              <T>No se encontraron clientes con los filtros aplicados.</T>
            </p>
          </div>
        ) : (
          <table className="w-full min-w-[1000px] border-collapse text-left">
            <thead className="bg-surface-container-low">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                  <T>Cliente</T>
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                  <T>Contacto</T>
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                  <T>Última visita</T>
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                  <T>Reservas</T>
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                  <T>No-shows</T>
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                  <T>Notas de preferencia</T>
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                  <T>Estado</T>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {guests.map((guest) => (
                <GuestTableRow
                  guest={guest}
                  key={guest.id}
                  onReviewNotes={() => setSelectedGuest(guest)}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedGuest !== null && (
        <NotesModal
          guest={selectedGuest}
          onClose={() => setSelectedGuest(null)}
        />
      )}
    </section>
  );
}
//-aqui termina componente GuestsTable-//
