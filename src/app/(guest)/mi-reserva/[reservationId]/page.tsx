/**
 * Archivo: page.tsx
 * Responsabilidad: Renderizar la vista pública firmada para consultar o gestionar una reserva concreta.
 * Tipo: UI
 */

import { getReservationContext } from "@/lib/public/siteContent";
import { MyReservationHeader } from "@/components/guest/mi-reserva/MyReservationHeader";
import { MyReservationHero } from "@/components/guest/mi-reserva/MyReservationHero";
import { MyReservationDetails } from "@/components/guest/mi-reserva/MyReservationDetails";
import { AssignedTableCard } from "@/components/guest/mi-reserva/AssignedTableCard";
import { MapPreviewCard } from "@/components/guest/mi-reserva/MapPreviewCard";
import { ReservationManagementActions } from "@/components/guest/mi-reserva/ReservationManagementActions";
import { MyReservationFooter } from "@/components/guest/mi-reserva/MyReservationFooter";
import { MobileMyReservationActions } from "@/components/guest/mi-reserva/MobileMyReservationActions";

interface ReservationDetailPageProps {
  params:
    | {
        reservationId: string;
      }
    | Promise<{
        reservationId: string;
      }>;
}

const reservationFieldDefinitions = [
  {
    label: "Invitado",
    value: "Alejandro Silva",
  },
  {
    label: "Teléfono",
    value: "+34 612 345 678",
  },
  {
    label: "Fecha",
    value: "Sábado, 14 Oct",
  },
  {
    label: "Hora",
    value: "21:30",
  },
] as const;

const reservationHeroStatDefinitions = [
  {
    label: "Estado",
    value: "Confirmada",
    description: "La reserva está activa y lista para el servicio.",
    tone: "ghost",
  },
  {
    label: "Mesa",
    value: "12",
    description: "Asignación visible cuando exista disponibilidad fija.",
    tone: "mint",
  },
  {
    label: "Canal",
    value: "Web",
    description: "Procede de la experiencia pública del restaurante.",
    tone: "light",
  },
  {
    label: "Acceso",
    value: "Firmado",
    description: "La consulta debe protegerse más adelante con backend real.",
    tone: "ghost",
  },
] as const;

const reservationActionDefinitions = [
  {
    title: "Ver mapa de localización",
    description: "Abre la ubicación del restaurante y la ruta para llegar sin fricción.",
    icon: "map",
    tone: "primary",
  },
  {
    title: "Contactar restaurante",
    description: "Inicia una conversación rápida si necesitas aclarar algo de la reserva.",
    icon: "chatBubble",
    tone: "secondary",
  },
  {
    title: "Cancelar reserva",
    description: "Libera la mesa si la ventana de cancelación sigue permitiéndolo.",
    icon: "cancel",
    tone: "surface",
  },
] as const;

const reservationFooterLinks = [
  {
    label: "Política de Privacidad",
    href: "#",
  },
  {
    label: "Términos de Servicio",
    href: "#",
  },
  {
    label: "Configuración de Cookies",
    href: "#",
  },
] as const;

//-aqui empieza pagina ReservationDetailPage y es para mostrar la gestion publica de una reserva-
/**
 * Renderiza la vista pública de gestión de una reserva concreta.
 */
export default async function ReservationDetailPage({ params }: ReservationDetailPageProps) {
  const { reservationId } = await params;
  const reservationContext = getReservationContext(reservationId);
  const reservationHeroStatus = "Confirmada";
  const reservationReference = `#${reservationContext.codeValue}`;
  const reservationSpecialRequest = "Mesa cerca de la ventana si es posible, es para un aniversario.";
  const assignedTable = "T-14";
  const assignedZone = "Zona Terraza Central";

  return (
    <main className="min-h-screen bg-background text-on-surface">
      <div className="mx-auto min-h-screen max-w-4xl px-4 py-6 pb-28 sm:px-6 sm:py-10 md:px-8 md:pb-12">
        <MyReservationHeader 
          restaurantName={reservationContext.restaurantName}
          reservationReference={reservationReference}
        />

        <MyReservationHero 
          status={reservationHeroStatus}
          restaurantSubtitle={reservationContext.restaurantSubtitle}
          stats={reservationHeroStatDefinitions}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <MyReservationDetails 
            fields={reservationFieldDefinitions}
            specialRequest={reservationSpecialRequest}
          />

          <div className="flex flex-col gap-6">
            <AssignedTableCard 
              tableNumber={assignedTable}
              zoneName={assignedZone}
            />

            <MapPreviewCard address="Calle de Serrano, 45, Madrid" />
          </div>
        </div>

        <ReservationManagementActions actions={reservationActionDefinitions} />

        <MyReservationFooter 
          restaurantName={reservationContext.restaurantName}
          links={reservationFooterLinks}
        />
      </div>

      <MobileMyReservationActions />
    </main>
  );
}
//-aqui termina pagina ReservationDetailPage-
