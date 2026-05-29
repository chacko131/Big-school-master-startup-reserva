/**
 * Archivo: AnalyticsInsightRail.tsx
 * Responsabilidad: Generar y mostrar hallazgos y decisiones recomendadas basadas en los datos analíticos del restaurante.
 * Tipo: UI
 */

import { T } from "@/components/T";
import {
  type RestaurantAnalyticsSummary,
  type TemporalMetric,
  type GuestRecurrenceMetric,
} from "@/modules/reservations/application/dtos/get-restaurant-analytics.dto";

export interface AnalyticsInsightRailProps {
  summary: RestaurantAnalyticsSummary;
  byDayOfWeek: TemporalMetric[];
  guestsRecurrence: GuestRecurrenceMetric;
}

interface AnalyticsDynamicInsight {
  timeLabel: string;
  title: string;
  description: string;
}

//-aqui empieza componente AnalyticsInsightRail y es para resumir alertas y hallazgos-//
/**
 * Renderiza el rail lateral con hallazgos recientes automatizados.
 *
 * @pure
 */
export function AnalyticsInsightRail({
  summary,
  byDayOfWeek,
  guestsRecurrence,
}: AnalyticsInsightRailProps) {
  const insights: AnalyticsDynamicInsight[] = [];

  // 1. Día pico de afluencia
  const sortedDays = [...byDayOfWeek].sort((a, b) => b.coversCount - a.coversCount);
  const peakDay = sortedDays[0];
  if (peakDay && peakDay.coversCount > 0) {
    insights.push({
      timeLabel: "Pico",
      title: `Día de mayor demanda: ${peakDay.key}`,
      description: `El ${peakDay.key} es el día con mayor volumen de comensales sentados, acumulando un total de ${peakDay.coversCount} personas.`,
    });
  }

  // 2. Comportamiento de antelación
  const leadTimeText = summary.averageLeadTimeDays === 0
    ? "Los clientes suelen reservar el mismo día o con muy pocas horas de antelación."
    : `Los comensales programan su reserva con un promedio de ${summary.averageLeadTimeDays} días de antelación.`;
  insights.push({
    timeLabel: "Antelación",
    title: "Planificación de reservas",
    description: leadTimeText,
  });

  // 3. Fidelización y tasa de retorno
  insights.push({
    timeLabel: "Lealtad",
    title: `Tasa de retorno: ${guestsRecurrence.repeatRate}%`,
    description: `Tienes un registro de ${guestsRecurrence.repeatGuestsCount} clientes VIP/recurrentes con más de una reserva exitosa.`,
  });

  // 4. Diagnóstico de No-shows
  if (summary.noShowRate >= 10) {
    insights.push({
      timeLabel: "Alerta",
      title: "Tasa de No-show crítica",
      description: `La tasa de inasistencia está en un ${summary.noShowRate}%. Se aconseja reforzar confirmaciones manuales o activar políticas de prepago.`,
    });
  } else {
    insights.push({
      timeLabel: "Salud",
      title: "Control de No-shows",
      description: `Tasa de no-show controlada en un ${summary.noShowRate}%. La eficiencia de sala y rotación de mesas es óptima.`,
    });
  }

  return (
    <section className="rounded-[28px] bg-primary p-8 text-on-primary shadow-sm">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/60">
          <T>Hallazgos</T>
        </p>
        <h3 className="mt-3 text-3xl font-black tracking-tight">
          <T>Decisiones rápidas</T>
        </h3>
        <p className="mt-3 text-sm leading-7 text-white/75">
          <T>Resumen ejecutivo automatizado para validar prioridades sin necesidad de herramientas externas.</T>
        </p>
      </div>

      <div className="mt-6 space-y-4 rounded-[24px] bg-white/10 p-5 backdrop-blur-sm">
        {insights.map((insight) => (
          <div className="flex gap-4" key={insight.title}>
            <div className="w-16 shrink-0 rounded-full bg-white/10 px-3 py-2 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
              {insight.timeLabel}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-white">
                <T>{insight.title}</T>
              </p>
              <p className="mt-1 text-sm leading-6 text-white/70">
                <T>{insight.description}</T>
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
//-aqui termina componente AnalyticsInsightRail-//
