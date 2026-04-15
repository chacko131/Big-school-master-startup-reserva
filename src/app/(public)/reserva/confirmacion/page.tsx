/**
 * Archivo: page.tsx
 * Responsabilidad: Renderizar la pantalla pública de confirmación de reserva.
 * Tipo: UI
 */

import Link from "next/link";
import { PublicCard } from "@/components/public/PublicCard";
import { PublicHero } from "@/components/public/PublicHero";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { PublicSection } from "@/components/public/PublicSection";
import { PublicTimeline } from "@/components/public/PublicTimeline";
import { getReservationContext, getReservationTimeline } from "@/lib/public/siteContent";

const reservationContext = getReservationContext("rl-2048");
const reservationTimeline = getReservationTimeline();

//-aqui empieza pagina publica de confirmacion-//
/**
 * Cierra el flujo de reserva con un resumen claro y un camino hacia la gestión.
 */
export default function ReservationConfirmationPage() {
  return (
    <PublicPageShell>
      <PublicHero
        eyebrow="Reserva confirmada"
        title="Tu mesa quedó lista."
        description="La confirmación debe tranquilizar al usuario, resumir los datos importantes y mostrar los siguientes pasos sin ruido visual."
        primaryAction={{ label: "Gestionar mi reserva", href: `/mi-reserva/${reservationContext.codeValue.toLowerCase()}`, variant: "primary" }}
        secondaryAction={{ label: "Volver al restaurante", href: "/la-casa-del-puerto", variant: "secondary" }}
        metrics={[
          {
            label: reservationContext.statusLabel,
            value: reservationContext.statusValue,
            hint: "Estado visible para reducir soporte y dudas.",
          },
          {
            label: reservationContext.dateLabel,
            value: reservationContext.dateValue,
            hint: "La fecha debe ser legible de inmediato.",
          },
          {
            label: reservationContext.timeLabel,
            value: reservationContext.timeValue,
            hint: "La hora confirmada se destaca en toda la pantalla.",
          },
          {
            label: reservationContext.partyLabel,
            value: reservationContext.partyValue,
            hint: "El tamaño del grupo debe quedar claro.",
          },
        ]}
        aside={
          <div className="space-y-4">
            <PublicCard title="Código de reserva" description={reservationContext.codeValue} tone="primary" />
            <PublicCard
              title="Qué hacer ahora"
              description="Guardar el código, revisar la hora y llegar unos minutos antes de la reserva."
              tone="secondary"
            />
          </div>
        }
      />

      <PublicTimeline
        title="Qué ocurre después"
        description="La pantalla post-reserva debe explicar el viaje del usuario hasta la llegada al restaurante."
        steps={reservationTimeline}
      />

      <PublicSection
        eyebrow="Acciones de apoyo"
        title="La confirmación también puede resolver dudas"
        description="El diseño debe dejar espacio para las acciones de soporte más probables."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <PublicCard title="Modificar reserva" description="Acceso rápido para revisar horario o detalles." tone="secondary" />
          <PublicCard title="Contactar al restaurante" description="Canal simple para incidencias o peticiones especiales." tone="tertiary" />
        </div>
        <div className="mt-6">
          <Link href={`/mi-reserva/${reservationContext.codeValue.toLowerCase()}`} className="text-sm font-semibold text-secondary underline-offset-4 hover:underline">
            Ir a mi reserva
          </Link>
        </div>
      </PublicSection>
    </PublicPageShell>
  );
}
//-aqui termina pagina publica de confirmacion-//
