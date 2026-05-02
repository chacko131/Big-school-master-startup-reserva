/**
 * Archivo: page.tsx
 * Responsabilidad: Mostrar la confirmación pública de una reserva recién creada.
 * Tipo: UI
 */

import { PublicNavbar } from "@/components/guest/PublicNavbar";
import { PublicFooter } from "@/components/guest/PublicFooter";
import { ConfirmationHero } from "@/components/guest/reserva/ConfirmationHero";
import { ConfirmationSummaryCard } from "@/components/guest/reserva/ConfirmationSummaryCard";
import { ConfirmationLocationCard } from "@/components/guest/reserva/ConfirmationLocationCard";
import { ConfirmationActionButtons } from "@/components/guest/reserva/ConfirmationActionButtons";
import { ConfirmationPromoCard } from "@/components/guest/reserva/ConfirmationPromoCard";

//-aqui empieza funcion ReservationConfirmationPage y es para renderizar la pantalla de exito de la reserva-//
/**
 * Renderiza la confirmación pública orquestando componentes modulares.
 * @pure
 */
export default function ReservationConfirmationPage() {
  // Mock data (en el futuro vendrá de un servicio/action)
  const reservationData = {
    restaurantName: "La Hacienda",
    restaurantSlug: "la-hacienda",
    confirmedLabel: "Confirmado",
    dateLabel: "Fecha y Hora",
    dateValue: "24 Oct, 2024",
    timeValue: "20:30 hrs",
    partyLabel: "Personas",
    partyValue: "4 Personas",
    reservationIdLabel: "ID de Reserva",
    reservationIdValue: "#LH-8829",
    locationLabel: "Ubicación",
    locationValue: "Av. Paseo de la Reforma 250, Juárez, 06600 Ciudad de México, CDMX",
  };

  const actions = [
    {
      label: "Añadir al calendario",
      href: "#",
      icon: "calendarAddOn" as const,
    },
    {
      label: "Gestionar reserva",
      href: `/mi-reserva/${reservationData.reservationIdValue.replace("#", "")}`,
      icon: "editCalendar" as const,
    },
    {
      label: "Compartir detalles",
      href: "#",
      icon: "share" as const,
      primary: true,
    },
  ];

  return (
    <div className="min-h-screen bg-surface text-on-surface antialiased">
      <PublicNavbar 
        restaurantSlug={reservationData.restaurantSlug} 
        buttonText="Volver al Inicio"
        buttonHref="/"
      />

      <main className="pb-24">
        <ConfirmationHero restaurantName={reservationData.restaurantName} />

        <section className="mx-auto mt-16 max-w-5xl px-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            <ConfirmationSummaryCard 
              restaurantName={reservationData.restaurantName}
              confirmedLabel={reservationData.confirmedLabel}
              dateLabel={reservationData.dateLabel}
              dateValue={reservationData.dateValue}
              timeValue={reservationData.timeValue}
              partyLabel={reservationData.partyLabel}
              partyValue={reservationData.partyValue}
              reservationIdLabel={reservationData.reservationIdLabel}
              reservationIdValue={reservationData.reservationIdValue}
            />

            <ConfirmationLocationCard 
              locationLabel={reservationData.locationLabel}
              locationValue={reservationData.locationValue}
            />

            <ConfirmationActionButtons actions={actions} />
          </div>
        </section>

        <ConfirmationPromoCard />
      </main>

      <PublicFooter />
    </div>
  );
}
//-aqui termina funcion ReservationConfirmationPage-//
