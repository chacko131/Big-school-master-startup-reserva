/**
 * Archivo: page.tsx
 * Responsabilidad: Renderizar la vista operativa de calendario y timeline del dashboard.
 * Tipo: UI
 */

import Link from "next/link";
import { T } from "@/components/T";
import { OnboardingIcon } from "@/components/onboarding/OnboardingIcon";
import { ScheduleTimelinePanel } from "@/components/schedule/ScheduleTimelinePanel";
import { fetchDailyTimeline, fetchWeeklySummary } from "./actions";

//-aqui empieza componente ScheduleToolbar y es para controlar la vista temporal-//
/**
 * Renderiza la cabecera hero de la pantalla de agenda.
 * @pure
 */
function ScheduleToolbar() {
  return (
    <section className="flex flex-col gap-6 rounded-[28px] bg-surface-container-lowest p-8 shadow-sm lg:flex-row lg:items-end lg:justify-between lg:p-10">
      <div className="max-w-2xl space-y-4">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
          <T>Calendario del restaurante</T>
        </p>
        <h2 className="text-5xl font-black tracking-tighter text-primary lg:text-6xl">
          <T>Controla la agenda de hoy por mesa y franja horaria.</T>
        </h2>
        <p className="max-w-xl text-on-surface-variant lg:text-lg lg:leading-8">
          <T>
            La vista tipo timeline ayuda a detectar picos, evitar solapamientos y preparar al equipo antes de que lleguen las reservas.
          </T>
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-surface-container-highest px-6 py-2.5 text-sm font-bold text-on-surface transition-colors hover:bg-surface-container-high"
          href="/dashboard/reservations"
        >
          <OnboardingIcon name="schedule" className="h-4 w-4" />
          <T>Ver reservas</T>
        </Link>
        <Link
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-on-primary transition-colors hover:opacity-90"
          href="/dashboard/tables"
        >
          <OnboardingIcon name="gridView" className="h-4 w-4" />
          <T>Ir al plano</T>
        </Link>
      </div>
    </section>
  );
}
//-aqui termina componente ScheduleToolbar-//

//-aqui empieza pagina SchedulePage y es para montar la vista de calendario del dashboard-//
interface SchedulePageProps {
  searchParams: Promise<{ date?: string; view?: string }>;
}

/**
 * Presenta la pantalla de agenda y timeline del restaurante.
 * Lee ?date=YYYY-MM-DD para mostrar un día específico, y ?view=day|week para el modo inicial.
 */
export default async function SchedulePage({ searchParams }: SchedulePageProps) {
  const params = await searchParams;

  const parsedDate = params.date !== undefined && /^\d{4}-\d{2}-\d{2}$/.test(params.date)
    ? new Date(`${params.date}T00:00:00`)
    : null;
  const selectedDate = parsedDate !== null && !isNaN(parsedDate.getTime()) ? parsedDate : new Date();

  const initialView = params.view === "week" ? "week" : "day";

  const [dailyData, weeklyData] = await Promise.all([
    fetchDailyTimeline(selectedDate),
    fetchWeeklySummary(selectedDate),
  ]);

  return (
    <>
      <ScheduleToolbar />
      <ScheduleTimelinePanel
        dailyData={dailyData}
        weeklyData={weeklyData}
        initialView={initialView}
      />
    </>
  );
}
//-aqui termina pagina SchedulePage-//
