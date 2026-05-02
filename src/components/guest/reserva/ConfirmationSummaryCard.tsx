/**
 * Archivo: ConfirmationSummaryCard.tsx
 * Responsabilidad: Mostrar un resumen visual de la reserva confirmada.
 * Tipo: UI
 */

import { T } from "@/components/T";

interface ConfirmationSummaryCardProps {
  restaurantName: string;
  confirmedLabel: string;
  dateLabel: string;
  dateValue: string;
  timeValue: string;
  partyLabel: string;
  partyValue: string;
  reservationIdLabel: string;
  reservationIdValue: string;
  tableTypeLabel?: string;
  imageUrl?: string;
}

//-aqui empieza funcion ConfirmationSummaryCard y es para mostrar los detalles de la reserva-//
/**
 * @pure
 */
export function ConfirmationSummaryCard({
  restaurantName,
  confirmedLabel,
  dateLabel,
  dateValue,
  timeValue,
  partyLabel,
  partyValue,
  reservationIdLabel,
  reservationIdValue,
  tableTypeLabel = "Indoor Table",
  imageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuCIsJxqM6aUMRZrmmMXrMozJJKwtqQsF6RmiougkUqBdKqq9d2zpTY6dtDx98aLM3ZC-Nl85Hgm8tkmSu0GJoQWiPzvxqMPaOm_qxR7mISoBNtH_MKr30XFPZnExX_2408Z6WyFP8ppQq7KhHDeJFabZZbTrBdUJ2G-saYt-3qibgbiRgl1UmZOg_dosFw_9awA4Vshaj1GwjLu3be7KTZrACYA5MvGtUqSkrdy8xGTmfTcnvwipKS1VOEcWKn4kIULkW0UrnWdBxU",
}: ConfirmationSummaryCardProps) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-8 md:col-span-8">
      <div className="relative z-10 flex flex-col justify-between gap-8">
        <div>
          <div className="mb-6 flex items-center gap-2">
            <span className="rounded-full bg-secondary-container px-3 py-1 text-xs font-bold uppercase tracking-widest text-on-secondary-container">
              <T>{confirmedLabel}</T>
            </span>
          </div>
          <h2 className="mb-8 text-4xl font-bold">{restaurantName}</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-on-primary-container">
                <T>{dateLabel}</T>
              </p>
              <p className="text-xl font-bold">{dateValue}</p>
              <p className="text-lg text-on-surface-variant">{timeValue}</p>
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-on-primary-container">
                <T>{partyLabel}</T>
              </p>
              <p className="text-xl font-bold">{partyValue}</p>
              <p className="text-lg text-on-surface-variant">
                <T>{tableTypeLabel}</T>
              </p>
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-on-primary-container">
                <T>{reservationIdLabel}</T>
              </p>
              <p className="text-xl font-bold">{reservationIdValue}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute right-0 top-0 h-full w-1/3 opacity-10">
        <img
          alt="abstract background"
          className="h-full w-full object-cover"
          src={imageUrl}
        />
      </div>
    </div>
  );
}
//-aqui termina funcion ConfirmationSummaryCard-//
