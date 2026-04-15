/**
 * Archivo: page.tsx
 * Responsabilidad: Renderizar el perfil público de un restaurante.
 * Tipo: UI
 */

import Link from "next/link";
import { PublicCard } from "@/components/public/PublicCard";
import { PublicHero } from "@/components/public/PublicHero";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { PublicSection } from "@/components/public/PublicSection";
import { PublicStatGrid } from "@/components/public/PublicStatGrid";
import { getRestaurantProfile } from "@/lib/public/siteContent";

interface RestaurantPageProps {
  params: Promise<{
    restaurantSlug: string;
  }>;
}

//-aqui empieza pagina publica de restaurante-//
/**
 * Muestra el escaparate público del restaurante antes de entrar al flujo de reserva.
 */
export default async function RestaurantProfilePage({ params }: RestaurantPageProps) {
  const { restaurantSlug } = await params;
  const restaurant = getRestaurantProfile(restaurantSlug);

  return (
    <PublicPageShell>
      <PublicHero
        eyebrow={restaurant.cuisine}
        title={restaurant.displayName}
        description={`${restaurant.subtitle} ${restaurant.description}`}
        primaryAction={{ label: "Reservar ahora", href: `/${restaurant.slug}/reservar`, variant: "primary" }}
        secondaryAction={{ label: "Explorar detalles", href: "/contact", variant: "secondary" }}
        metrics={restaurant.metrics}
        aside={
          <div className="space-y-4">
            <PublicCard
              title="Resumen de la experiencia"
              description="Una presentación breve, cálida y enfocada en la conversión del visitante en reserva."
              tone="primary"
            />
            <div className="rounded-[24px] bg-surface-container-lowest p-5 shadow-[0_20px_40px_rgba(26,28,28,0.04)]">
              <ul className="space-y-3 text-sm leading-6 text-foreground/72">
                {restaurant.highlights.map((highlight) => (
                  <li key={highlight} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-secondary" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        }
      />

      <PublicSection
        eyebrow="Detalles de servicio"
        title="Lo que el cliente necesita saber antes de reservar"
        description="La ficha pública debe resolver dudas antes de que el usuario llegue al formulario."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <PublicCard title="Notas del servicio" description="Información útil para la experiencia de reserva." tone="secondary">
            <ul className="space-y-2 text-sm leading-6 text-foreground/72">
              {restaurant.serviceNotes.map((note) => (
                <li key={note} className="flex gap-3">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-tertiary" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </PublicCard>
          <PublicCard title="Políticas visibles" description="Reglas claras para reducir fricción y soporte posterior." tone="tertiary">
            <ul className="space-y-2 text-sm leading-6 text-foreground/72">
              {restaurant.reservationPolicies.map((policy) => (
                <li key={policy} className="flex gap-3">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <span>{policy}</span>
                </li>
              ))}
            </ul>
          </PublicCard>
        </div>
      </PublicSection>

      <PublicSection
        eyebrow="Enfoque visual"
        title="Qué debe comunicar esta pantalla"
        description="El perfil público no es un catálogo largo: es una puerta de entrada clara hacia la reserva."
      >
        <PublicStatGrid items={restaurant.metrics} />
      </PublicSection>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] bg-surface-container-low p-6 shadow-[0_20px_40px_rgba(26,28,28,0.06)]">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">¿Listo para reservar?</h2>
          <p className="text-sm leading-6 text-foreground/72">El siguiente paso lleva directamente al formulario público del restaurante.</p>
        </div>
        <Link
          href={`/${restaurant.slug}/reservar`}
          className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-background transition-colors hover:bg-primary/90"
        >
          Reservar ahora
        </Link>
      </div>
    </PublicPageShell>
  );
}
//-aqui termina pagina publica de restaurante-//
