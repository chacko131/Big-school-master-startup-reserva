/**
 * Archivo: page.tsx
 * Responsabilidad: Mostrar la confirmación pública de una reserva recién creada con datos reales.
 * Tipo: UI
 */

import { notFound } from "next/navigation";
import { PublicNavbar } from "@/components/guest/PublicNavbar";
import { PublicFooter } from "@/components/guest/PublicFooter";
import { ConfirmationHero } from "@/components/guest/reserva/ConfirmationHero";
import { ConfirmationSummaryCard } from "@/components/guest/reserva/ConfirmationSummaryCard";
import { ConfirmationLocationCard } from "@/components/guest/reserva/ConfirmationLocationCard";
import { ConfirmationActionButtons } from "@/components/guest/reserva/ConfirmationActionButtons";
import { getReservationsInfrastructure } from "@/modules/reservations/infrastructure/reservations-infrastructure";
import { getCatalogInfrastructure } from "@/modules/catalog/infrastructure/catalog-infrastructure";
import { GetReservation } from "@/modules/reservations/application/use-cases/get-reservation.use-case";
import { ReservationNotFoundError } from "@/modules/reservations/application/errors/reservation-not-found.error";

// ─── Props ────────────────────────────────────────────────────────────────────

interface ReservationConfirmationPageProps {
  searchParams: Promise<{ reservationId?: string }>;
}

//-aqui empieza funcion ReservationConfirmationPage y es para renderizar la pantalla de exito de la reserva-//
/**
 * Obtiene reserva, guest y restaurante reales desde los repositorios usando reservationId del searchParam.
 * @sideEffect
 */
export default async function ReservationConfirmationPage({ searchParams }: ReservationConfirmationPageProps) {
  const { reservationId } = await searchParams;

  if (!reservationId) {
    notFound();
  }

  const { reservationRepository, guestRepository } = getReservationsInfrastructure();
  const { restaurantRepository } = getCatalogInfrastructure();

  // --- Obtener reserva ---
  let reservation;
  try {
    const useCase = new GetReservation(reservationRepository);
    reservation = await useCase.execute({ reservationId });
  } catch (error) {
    if (error instanceof ReservationNotFoundError) notFound();
    throw error;
  }

  const r = reservation.toPrimitives();

  // --- Obtener guest y restaurante en paralelo ---
  const [guest, restaurant] = await Promise.all([
    guestRepository.findById(r.guestId),
    restaurantRepository.findById(r.restaurantId),
  ]);

  if (restaurant === null) notFound();

  const restaurantPrimitives = restaurant.toPrimitives();

  // --- Formatear datos para la UI ---
  const startAt = new Date(r.startAt);
  const dateValue = startAt.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
  const timeValue = startAt.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }) + " hrs";
  const partyValue = `${r.partySize} ${r.partySize === 1 ? "Persona" : "Personas"}`;
  const locationParts = [restaurantPrimitives.address, restaurantPrimitives.city].filter(Boolean);
  const locationValue = locationParts.join(", ") || "Consultar con el restaurante";
  const directionsUrl = locationParts.length > 0
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationParts.join(", "))}`
    : undefined;
  const guestName = guest?.toPrimitives().fullName;

  const actions = [
    {
      label: "Gestionar reserva",
      href: `/${restaurantPrimitives.slug}#contacto`,
      icon: "editCalendar" as const,
    },
    {
      label: "Volver al restaurante",
      href: `/${restaurantPrimitives.slug}`,
      icon: "share" as const,
      primary: true,
    },
  ];

  return (
    <div className="min-h-screen bg-surface text-on-surface antialiased">
      <PublicNavbar
        restaurantSlug={restaurantPrimitives.slug}
        restaurantName={restaurantPrimitives.name}
        buttonText="Volver al Inicio"
        buttonHref="/"
      />

      <main className="pb-24">
        <ConfirmationHero restaurantName={restaurantPrimitives.name} />

        <section className="mx-auto mt-16 max-w-5xl px-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            <ConfirmationSummaryCard
              restaurantName={guestName !== undefined ? `Para ${guestName}` : restaurantPrimitives.name}
              confirmedLabel={r.status === "CONFIRMED" ? "Confirmado" : "Pendiente"}
              dateLabel="Fecha y Hora"
              dateValue={dateValue}
              timeValue={timeValue}
              partyLabel="Personas"
              partyValue={partyValue}
              reservationIdLabel=""
              reservationIdValue=""
            />

            <ConfirmationLocationCard
              locationLabel="Ubicación"
              locationValue={locationValue}
              directionsUrl={directionsUrl}
            />

            <ConfirmationActionButtons actions={actions} />
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
//-aqui termina funcion ReservationConfirmationPage-//
