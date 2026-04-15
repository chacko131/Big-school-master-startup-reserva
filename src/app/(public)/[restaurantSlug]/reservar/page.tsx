/**
 * Archivo: page.tsx
 * Responsabilidad: Renderizar el formulario público de reserva para un restaurante.
 * Tipo: UI
 */

import Link from "next/link";
import { PublicCard } from "@/components/public/PublicCard";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { PublicReservationForm } from "@/components/public/PublicReservationForm";
import { PublicSection } from "@/components/public/PublicSection";
import { getRestaurantProfile, getReservationFieldGroups } from "@/lib/public/siteContent";

interface RestaurantReservationPageProps {
  params: Promise<{
    restaurantSlug: string;
  }>;
}

//-aqui empieza pagina publica de reserva-//
/**
 * Crea el esqueleto visual del formulario público de reserva.
 */
export default async function RestaurantReservationPage({ params }: RestaurantReservationPageProps) {
  const { restaurantSlug } = await params;
  const restaurant = getRestaurantProfile(restaurantSlug);
  const groups = getReservationFieldGroups();

  return (
    <PublicPageShell>
      <PublicSection
        eyebrow={restaurant.displayName}
        title="Reserva tu mesa"
        description="El formulario debe ser breve, claro y preparar la confirmación sin distraer al cliente."
        actions={
          <Link href={`/${restaurant.slug}`} className="text-sm font-medium text-secondary underline-offset-4 hover:underline">
            Volver al perfil del restaurante
          </Link>
        }
      >
        <div className="grid gap-4 md:grid-cols-3">
          {restaurant.highlights.map((highlight) => (
            <PublicCard key={highlight} title={highlight} tone="secondary" />
          ))}
        </div>
      </PublicSection>

      <PublicReservationForm
        title="Datos de la reserva"
        description="La interfaz se construye por grupos claros para reducir fricción y facilitar la traducción automática."
        groups={groups}
        primaryActionLabel="Enviar solicitud de reserva"
        secondaryNote="El botón final es intencionalmente simple: el flujo real se conectará cuando exista la acción en servidor."
        summaryTitle="Antes de enviar"
        summaryItems={restaurant.reservationPolicies}
      />
    </PublicPageShell>
  );
}
//-aqui termina pagina publica de reserva-//
