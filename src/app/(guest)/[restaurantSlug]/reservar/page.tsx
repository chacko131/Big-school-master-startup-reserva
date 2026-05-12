/**
 * Archivo: page.tsx
 * Responsabilidad: Orquestar el flujo público de reserva para un restaurante concreto usando componentes de UI desacoplados.
 * Tipo: UI
 */

import { getRestaurantProfile } from "@/lib/public/siteContent";
import { PublicNavbar } from "@/components/guest/PublicNavbar";
import { PublicFooter } from "@/components/guest/PublicFooter";
import { ReservationHero } from "@/components/guest/ReservationHero";
import { ReservationForm } from "@/components/guest/reservar/ReservationForm";
import { fetchAvailableSlots } from "@/app/(guest)/[restaurantSlug]/reservar/actions";

// ─── Helpers de parseo ───────────────────────────────────────────────────────

//-aqui empieza funcion parsePartySize y es para validar y parsear el param partySize de la URL-//
/** @pure */
function parsePartySize(raw: string | undefined): number | undefined {
  if (raw === undefined) return undefined;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n >= 1 && n <= 20 ? n : undefined;
}
//-aqui termina funcion parsePartySize-//

//-aqui empieza funcion parseDate y es para validar el param date de la URL en formato YYYY-MM-DD-//
/** @pure */
function parseDate(raw: string | undefined): string | undefined {
  if (raw === undefined) return undefined;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return undefined;
  const [y, m, d] = raw.split("-").map(Number);
  const dateUtc = Date.UTC(y, m - 1, d);
  if (isNaN(dateUtc)) return undefined;
  const now = new Date();
  const todayUtc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return dateUtc >= todayUtc ? raw : undefined;
}
//-aqui termina funcion parseDate-//

//-aqui empieza funcion parseTime y es para validar el param time de la URL en formato HH:mm-//
/** @pure */
function parseTime(raw: string | undefined): string | undefined {
  if (raw === undefined) return undefined;
  if (!/^([01]?\d|2[0-3]):[0-5]\d$/.test(raw)) return undefined;
  return raw;
}
//-aqui termina funcion parseTime-//

// ─── Props ────────────────────────────────────────────────────────────────────

interface ReservationFlowPageProps {
  params: Promise<{ restaurantSlug: string }>;
  searchParams: Promise<{ partySize?: string; date?: string; time?: string }>;
}

//-aqui empieza funcion ReservationFlowPage y es para orquestar el flujo público de reserva-//
/**
 * Renderiza el flujo público de reserva orquestando componentes de src/components/guest.
 * Lee partySize, date y time de searchParams para prellenar los pickers desde el sidebar.
 * @pure
 */
export default async function ReservationFlowPage({ params, searchParams }: ReservationFlowPageProps) {
  const { restaurantSlug } = await params;
  const sp = await searchParams;

  // TODO: Reemplazar por GetRestaurantPublicProfileUseCase cuando estemos listos para CRUD
  const restaurantProfile = getRestaurantProfile(restaurantSlug);
  const restaurantName = restaurantProfile.displayName;

  const defaultPartySize = parsePartySize(sp.partySize) ?? 2;
  const defaultDate = parseDate(sp.date);
  const defaultTime = parseTime(sp.time);

  // Fecha efectiva para consultar slots: la del param o hoy
  const today = new Date();
  const effectiveDateStr = defaultDate ?? `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  let availableSlots: string[] = [];
  let closedDays: string[] = [];
  try {
    const slotsResult = await fetchAvailableSlots(restaurantSlug, effectiveDateStr, defaultPartySize);
    availableSlots = slotsResult.slots;
    closedDays = slotsResult.closedDays;
  } catch (err) {
    console.error("[ReservationFlowPage] fetchAvailableSlots falló:", err);
  }

  return (
    <main className="bg-surface text-on-surface selection:bg-secondary-container min-h-screen flex flex-col">
      <PublicNavbar restaurantSlug={restaurantSlug} restaurantName={restaurantName} />

      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-20 grow">
        <ReservationHero restaurantName={restaurantName} />
        <div className="mt-16">
          <ReservationForm
            restaurantSlug={restaurantSlug}
            restaurantName={restaurantName}
            availableSlots={availableSlots}
            closedDays={closedDays}
            defaultPartySize={defaultPartySize}
            defaultDate={defaultDate}
            defaultTime={defaultTime}
          />
        </div>
      </div>

      <PublicFooter />
    </main>
  );
}
//-aqui termina funcion ReservationFlowPage-//
