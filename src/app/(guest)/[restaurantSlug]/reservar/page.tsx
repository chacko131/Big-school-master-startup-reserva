/**
 * Archivo: page.tsx
 * Responsabilidad: Orquestar el flujo público de reserva para un restaurante concreto usando componentes de UI desacoplados.
 * Tipo: UI
 */

import { getRestaurantProfile } from "@/lib/public/siteContent";
import { PublicNavbar } from "@/components/guest/PublicNavbar";
import { PublicFooter } from "@/components/guest/PublicFooter";
import { ReservationHero } from "@/components/guest/ReservationHero";
import { PartySizePicker } from "@/components/guest/PartySizePicker";
import { DatePicker } from "@/components/guest/DatePicker";
import { TimeSlotPicker } from "@/components/guest/TimeSlotPicker";
import { ContactForm } from "@/components/guest/ContactForm";
import { ReservationSummary } from "@/components/guest/ReservationSummary";

interface ReservationFlowPageProps {
  params: Promise<{
    restaurantSlug: string;
  }>;
}

//-aqui empieza funcion ReservationFlowPage y es para orquestar el flujo público de reserva-//
/**
 * Renderiza el flujo público de reserva orquestando componentes de src/components/guest.
 * @pure
 */
export default async function ReservationFlowPage({ params }: ReservationFlowPageProps) {
  const { restaurantSlug } = await params;
  
  // TODO: Reemplazar por GetRestaurantPublicProfileUseCase cuando estemos listos para CRUD
  const restaurantProfile = getRestaurantProfile(restaurantSlug);
  const restaurantName = restaurantProfile.displayName;

  return (
    <main className="bg-surface text-on-surface selection:bg-secondary-container min-h-screen flex flex-col">
      <PublicNavbar restaurantSlug={restaurantSlug} />

      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-20 grow">
        <div className="flex flex-col gap-16 lg:flex-row">
          <div className="grow space-y-16 lg:max-w-2xl">
            <ReservationHero restaurantName={restaurantName} />
            <PartySizePicker />
            <DatePicker />
            <TimeSlotPicker />
            <ContactForm />
          </div>

          <div className="lg:w-96">
            <ReservationSummary restaurantName={restaurantName} />
          </div>
        </div>
      </div>

      <PublicFooter />
    </main>
  );
}
//-aqui termina funcion ReservationFlowPage-//
