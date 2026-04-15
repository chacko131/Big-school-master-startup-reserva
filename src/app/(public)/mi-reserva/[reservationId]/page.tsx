/**
 * Archivo: page.tsx
 * Responsabilidad: Renderizar la pantalla pública de gestión de una reserva existente.
 * Tipo: UI
 */

import Link from "next/link";
import { PublicCard } from "@/components/public/PublicCard";
import { PublicHero } from "@/components/public/PublicHero";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { PublicSection } from "@/components/public/PublicSection";
import { PublicTimeline } from "@/components/public/PublicTimeline";
import { getReservationContext, getReservationTimeline } from "@/lib/public/siteContent";

interface ReservationManagementPageProps {
  params: Promise<{
    reservationId: string;
  }>;
}

//-aqui empieza pagina publica de gestion de reserva-//
/**
 * Muestra la reserva pública con acciones de apoyo y estados visibles.
 */
export default async function ReservationManagementPage({ params }: ReservationManagementPageProps) {
  const { reservationId } = await params;
  const reservation = getReservationContext(reservationId);
  const timeline = getReservationTimeline();

  return (
    <PublicPageShell>
      <PublicHero
        eyebrow="Mi reserva"
        title={`Gestión pública de ${reservation.restaurantName}`}
        description={reservation.restaurantSubtitle}
        primaryAction={{ label: "Contactar al restaurante", href: "/contact", variant: "primary" }}
        secondaryAction={{ label: "Volver al inicio", href: "/", variant: "secondary" }}
        metrics={[
          {
            label: reservation.statusLabel,
            value: reservation.statusValue,
            hint: "Estado visible para el cliente final.",
          },
          {
            label: reservation.codeLabel,
            value: reservation.codeValue,
            hint: "Código de acceso para futuras interacciones.",
          },
          {
            label: reservation.dateLabel,
            value: reservation.dateValue,
            hint: "La fecha confirmada siempre debe quedar a la vista.",
          },
          {
            label: reservation.partyLabel,
            value: reservation.partyValue,
            hint: "Tamaño del grupo y contexto operativo.",
          },
        ]}
        aside={
          <div className="space-y-4">
            <PublicCard title="Acceso firmado" description="La experiencia pública debe proteger la reserva sin convertirla en un panel complejo." tone="primary" />
            <PublicCard title="Soporte directo" description="Acciones simples para resolver cambios o incidencias." tone="secondary" />
          </div>
        }
      />

      <PublicSection
        eyebrow="Estado y recorrido"
        title="La reserva necesita transparencia"
        description="El cliente debe ver el estado actual y entender qué viene después sin navegar demasiado."
      >
        <PublicTimeline
          title="Estado de la reserva"
          description="Representación simple del recorrido desde la solicitud hasta la llegada al restaurante."
          steps={timeline}
        />
      </PublicSection>

      <PublicSection
        eyebrow="Acciones permitidas"
        title="Qué puede hacer el cliente desde aquí"
        description="Las acciones públicas deben ser muy limitadas y fáciles de entender."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <PublicCard title="Ver detalles" description="Fechas, hora, grupo y código de reserva." tone="secondary" />
          <PublicCard title="Modificar petición" description="Actualizar notas o preferencias si el negocio lo permite." tone="tertiary" />
          <PublicCard title="Cancelar solicitud" description="Debe mostrarse solo si el negocio autoriza esa acción." tone="primary" />
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Link href={`/contact`} className="text-sm font-semibold text-secondary underline-offset-4 hover:underline">
            Solicitar ayuda
          </Link>
          <Link href={`/${reservation.restaurantName.toLowerCase().replaceAll(" ", "-")}`} className="text-sm font-semibold text-foreground underline-offset-4 hover:underline">
            Volver al restaurante
          </Link>
        </div>
      </PublicSection>
    </PublicPageShell>
  );
}
//-aqui termina pagina publica de gestion de reserva-//
