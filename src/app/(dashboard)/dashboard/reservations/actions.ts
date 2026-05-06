/**
 * Archivo: actions.ts
 * Responsabilidad: Server actions para la página de reservas del dashboard.
 * Tipo: servicio
 */

"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getReservationsInfrastructure } from "@/modules/reservations/infrastructure/reservations-infrastructure";
import { GetTodayReservations } from "@/modules/reservations/application/use-cases/get-today-reservations.use-case";
import { CreateReservationFull } from "@/modules/reservations/application/use-cases/create-reservation-full.use-case";
import { type GetTodayReservationsOutput } from "@/modules/reservations/application/dtos/get-today-reservations.dto";
import { NoAvailabilityError } from "@/modules/reservations/application/errors/no-availability.error";

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

//-aqui empieza funcion fetchTodayReservations y es para obtener reservas del dia desde el servidor-//
/**
 * Obtiene las reservas del día actual para el restaurante en sesión.
 * @sideEffect
 */
export async function fetchTodayReservations(): Promise<GetTodayReservationsOutput> {
  const restaurantId = await getRestaurantId();

  console.log("[action:fetchTodayReservations] iniciando para restaurantId=", restaurantId);

  const { reservationRepository, guestRepository } = getReservationsInfrastructure();
  const useCase = new GetTodayReservations(reservationRepository, guestRepository);

  const result = await useCase.execute({
    restaurantId,
    date: new Date(),
  });

  console.log(`[action:fetchTodayReservations] completado → ${result.totalCount} reservas`);

  return result;
}
//-aqui termina funcion fetchTodayReservations y se va autilizar en la pagina de reservas del dashboard-//

export interface CreateReservationActionResult {
  success: boolean;
  error?: string;
  reservationId?: string;
  alternativeSlots?: string[];
}

//-aqui empieza funcion createReservationAction y es para crear una reserva desde el dashboard-//
/**
 * Server action para crear una reserva desde el modal del dashboard.
 * @sideEffect
 */
export async function createReservationAction(formData: FormData): Promise<CreateReservationActionResult> {
  const restaurantId = await getRestaurantId();

  const guestFullName = (formData.get("guestFullName") as string)?.trim() ?? "";
  const guestPhone = (formData.get("guestPhone") as string)?.trim() ?? "";
  const guestEmail = (formData.get("guestEmail") as string)?.trim() || null;
  const partySizeRaw = formData.get("partySize") as string;
  const dateRaw = formData.get("date") as string;
  const timeRaw = formData.get("time") as string;
  const specialRequests = (formData.get("specialRequests") as string)?.trim() || null;

  console.log("[action:createReservation] datos recibidos del formulario →", {
    restaurantId,
    guestFullName,
    guestPhone,
    guestEmail,
    partySize: partySizeRaw,
    date: dateRaw,
    time: timeRaw,
    specialRequests,
  });

  if (guestFullName.length === 0 || guestPhone.length === 0 || !partySizeRaw || !dateRaw || !timeRaw) {
    console.warn("[action:createReservation] VALIDACIÓN FALLIDA → campos obligatorios incompletos");
    return { success: false, error: "Todos los campos obligatorios deben completarse." };
  }

  const partySize = parseInt(partySizeRaw, 10);

  if (isNaN(partySize) || partySize < 1) {
    console.warn("[action:createReservation] VALIDACIÓN FALLIDA → partySize inválido:", partySizeRaw);
    return { success: false, error: "El número de personas debe ser al menos 1." };
  }

  const startAt = new Date(`${dateRaw}T${timeRaw}:00`);

  if (isNaN(startAt.getTime())) {
    console.warn("[action:createReservation] VALIDACIÓN FALLIDA → fecha/hora inválida:", dateRaw, timeRaw);
    return { success: false, error: "La fecha y hora no son válidas." };
  }

  console.log("[action:createReservation] validación OK → ejecutando use case");

  try {
    const { reservationRepository, guestRepository, restaurantSettingsRepository, diningTableRepository } = getReservationsInfrastructure();
    const useCase = new CreateReservationFull(reservationRepository, guestRepository, restaurantSettingsRepository, diningTableRepository);

    const result = await useCase.execute({
      restaurantId,
      guestFullName,
      guestPhone,
      guestEmail,
      partySize,
      startAt,
      specialRequests,
    });

    console.log("[action:createReservation] SUCCESS →", {
      reservationId: result.reservationId,
      status: result.status,
      startAt: result.startAt.toISOString(),
    });

    revalidatePath("/dashboard/reservations");

    return { success: true, reservationId: result.reservationId };
  } catch (error) {
    if (error instanceof NoAvailabilityError) {
      const alternativeSlots = error.alternatives.map((d: Date) =>
        d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
      );
      console.warn("[action:createReservation] NoAvailabilityError → sin disponibilidad para", startAt.toISOString(), "| alternativos:", alternativeSlots);
      return {
        success: false,
        error: "No hay mesas disponibles para esa hora.",
        alternativeSlots,
      };
    }

    console.error("[action:createReservation] ERROR inesperado:", error);
    return { success: false, error: "Error inesperado al crear la reserva." };
  }
}
//-aqui termina funcion createReservationAction y se va autilizar en el modal de nueva reserva-//
