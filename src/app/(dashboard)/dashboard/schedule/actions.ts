/**
 * Archivo: actions.ts
 * Responsabilidad: Server actions para la página de schedule del dashboard.
 * Tipo: servicio
 */

"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getReservationsInfrastructure } from "@/modules/reservations/infrastructure/reservations-infrastructure";
import { GetDailyTimeline } from "@/modules/reservations/application/use-cases/get-daily-timeline.use-case";
import { GetWeeklySummary } from "@/modules/reservations/application/use-cases/get-weekly-summary.use-case";
import { type GetDailyTimelineOutput } from "@/modules/reservations/application/dtos/get-daily-timeline.dto";
import { type GetWeeklySummaryOutput } from "@/modules/reservations/application/dtos/get-weekly-summary.dto";

const RESTAURANT_ID_COOKIE = "onboarding_restaurant_id";

//-aqui empieza funcion getRestaurantId y es para obtener el restaurantId de la cookie de sesion-//
/** @sideEffect */
async function getRestaurantId(): Promise<string> {
  const cookieStore = await cookies();
  const restaurantId = cookieStore.get(RESTAURANT_ID_COOKIE)?.value?.trim() ?? "";

  if (restaurantId.length === 0) {
    redirect("/onboarding/restaurant");
  }

  return restaurantId;
}
//-aqui termina funcion getRestaurantId-//

//-aqui empieza funcion fetchDailyTimeline y es para obtener el timeline de mesas del dia desde el servidor-//
/**
 * Obtiene todas las mesas activas con sus reservas del día para el restaurante en sesión.
 * @sideEffect
 */
export async function fetchDailyTimeline(date?: Date): Promise<GetDailyTimelineOutput> {
  const restaurantId = await getRestaurantId();

  const {
    diningTableRepository,
    reservationRepository,
    reservationTableRepository,
    guestRepository,
    businessHoursRepository,
  } = getReservationsInfrastructure();

  const useCase = new GetDailyTimeline(
    diningTableRepository,
    reservationRepository,
    reservationTableRepository,
    guestRepository,
    businessHoursRepository
  );

  return useCase.execute({ restaurantId, date: date ?? new Date() });
}
//-aqui termina funcion fetchDailyTimeline-//

//-aqui empieza funcion fetchWeeklySummary y es para obtener el resumen semanal de reservas por mesa-//
/**
 * Obtiene el resumen semanal de reservas por mesa para el restaurante en sesión.
 * @sideEffect
 */
export async function fetchWeeklySummary(referenceDate?: Date): Promise<GetWeeklySummaryOutput> {
  const restaurantId = await getRestaurantId();

  const {
    diningTableRepository,
    reservationRepository,
    businessHoursRepository,
    reservationTableRepository,
  } = getReservationsInfrastructure();

  const useCase = new GetWeeklySummary(
    diningTableRepository,
    reservationRepository,
    businessHoursRepository,
    reservationTableRepository
  );

  return useCase.execute({ restaurantId, referenceDate: referenceDate ?? new Date() });
}
//-aqui termina funcion fetchWeeklySummary-//
