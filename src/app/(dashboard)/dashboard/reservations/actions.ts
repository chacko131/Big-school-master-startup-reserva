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
import { DuplicateReservationError } from "@/modules/reservations/application/errors/duplicate-reservation.error";
import { NoAvailabilityError } from "@/modules/reservations/application/errors/no-availability.error";
import { OutsideBusinessHoursError } from "@/modules/reservations/application/errors/outside-business-hours.error";

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
const MAX_PARTY_SIZE = 20;

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

  if (partySize > MAX_PARTY_SIZE) {
    console.warn(`[action:createReservation] VALIDACIÓN FALLIDA → partySize ${partySize} supera el máximo permitido (${MAX_PARTY_SIZE})`);
    return { success: false, error: `El número máximo de personas por reserva online es ${MAX_PARTY_SIZE}. Para grupos más grandes, contacta directamente con el restaurante.` };
  }

  const startAt = new Date(`${dateRaw}T${timeRaw}:00`);

  if (isNaN(startAt.getTime())) {
    console.warn("[action:createReservation] VALIDACIÓN FALLIDA → fecha/hora inválida:", dateRaw, timeRaw);
    return { success: false, error: "La fecha y hora no son válidas." };
  }

  const now = new Date();
  if (startAt.getTime() <= now.getTime()) {
    console.warn("[action:createReservation] VALIDACIÓN FALLIDA → fecha en el pasado:", startAt.toISOString());
    return { success: false, error: "No se pueden crear reservas en una fecha y hora pasadas." };
  }

  console.log("[action:createReservation] validación OK → ejecutando use case");

  try {
    const { reservationRepository, guestRepository, restaurantSettingsRepository, diningTableRepository, businessHoursRepository } = getReservationsInfrastructure();
    const useCase = new CreateReservationFull(reservationRepository, guestRepository, restaurantSettingsRepository, diningTableRepository, businessHoursRepository);

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

    if (error instanceof OutsideBusinessHoursError) {
      console.warn("[action:createReservation] OutsideBusinessHoursError → hora fuera de horario de negocio:", startAt.toISOString());
      return {
        success: false,
        error: "El restaurante no está abierto a esa hora. Consulta nuestro horario y selecciona un horario válido.",
      };
    }

    if (error instanceof DuplicateReservationError) {
      console.warn("[action:createReservation] DuplicateReservationError → reserva duplicada para guest:", error.guestId);
      return {
        success: false,
        error: "Ya tienes una reserva activa en esa franja horaria. Cancela la anterior o elige otro horario.",
      };
    }

    console.error("[action:createReservation] ERROR inesperado:", error);
    return { success: false, error: "Error inesperado al crear la reserva." };
  }
}
//-aqui termina funcion createReservationAction y se va autilizar en el modal de nueva reserva-//

export interface UpdateStatusActionResult {
  success: boolean;
  error?: string;
}

//-aqui empieza funcion updateReservationStatusAction y es para cambiar el estado de una reserva desde el dashboard-//
/**
 * Server action para cambiar el estado de una reserva usando los métodos del dominio.
 * Aplica la transición correcta según el estado destino solicitado.
 * @sideEffect
 */
//-aqui empieza funcion mapDomainErrorToUserMessage y es para convertir errores de dominio en mensajes amigables-//
/**
 * Mapea errores de dominio a mensajes amigables para el usuario.
 * @pure
 */
function mapDomainErrorToUserMessage(err: unknown): string {
  if (err instanceof Error) {
    if (err.name === "ReservationValidationError") {
      return "No se puede realizar esa transición de estado para la reserva.";
    }
    if (err.message?.includes("only CONFIRMED reservations can be checked in")) {
      return "Solo se puede hacer check-in de reservas confirmadas.";
    }
    if (err.message?.includes("only CHECKED_IN reservations can be completed")) {
      return "Solo se pueden completar reservas que ya han hecho check-in.";
    }
    if (err.message?.includes("only CONFIRMED reservations can be marked as no-show")) {
      return "Solo se pueden marcar como no-show las reservas confirmadas.";
    }
    if (err.message?.includes("only PENDING reservations can be confirmed")) {
      return "Solo se pueden confirmar reservas pendientes.";
    }
    if (err.message?.includes("only PENDING reservations can be cancelled")) {
      return "Solo se pueden cancelar reservas pendientes.";
    }
  }
  return "Ocurrió un error al actualizar la reserva.";
}
//-aqui termina funcion mapDomainErrorToUserMessage-//

export async function updateReservationStatusAction(
  reservationId: string,
  targetStatus: string
): Promise<UpdateStatusActionResult> {
  const restaurantId = await getRestaurantId();

  console.log("[action:updateReservationStatus] reservationId=", reservationId, "targetStatus=", targetStatus, "restaurantId=", restaurantId);

  const { reservationRepository } = getReservationsInfrastructure();

  const reservation = await reservationRepository.findById(reservationId);

  if (reservation === null) {
    console.warn("[action:updateReservationStatus] reserva no encontrada:", reservationId);
    return { success: false, error: "Reserva no encontrada." };
  }

  //-aqui empieza verificacion de ownership-//
  if (reservation.restaurantId !== restaurantId) {
    console.warn("[action:updateReservationStatus] intento de acceso no autorizado:", { reservationId, restaurantId, reservationRestaurantId: reservation.restaurantId });
    return { success: false, error: "No tienes permiso para modificar esta reserva." };
  }
  //-aqui termina verificacion de ownership-//

  try {
    let updated = reservation;

    switch (targetStatus) {
      case "CONFIRMED":
        updated = reservation.confirm();
        break;
      case "CANCELLED":
        updated = reservation.cancel();
        break;
      case "CHECKED_IN":
        updated = reservation.checkIn();
        break;
      case "COMPLETED":
        updated = reservation.complete();
        break;
      case "NO_SHOW":
        updated = reservation.markNoShow();
        break;
      default:
        console.warn("[action:updateReservationStatus] transición no soportada:", targetStatus);
        return { success: false, error: `Transición a estado "${targetStatus}" no soportada.` };
    }

    await reservationRepository.save(updated);

    console.log("[action:updateReservationStatus] estado actualizado →", { reservationId, targetStatus });

    revalidatePath("/dashboard/reservations");

    return { success: true };
  } catch (err) {
    const originalMessage = err instanceof Error ? err.message : "Error desconocido.";
    const userMessage = mapDomainErrorToUserMessage(err);
    console.error("[action:updateReservationStatus] ERROR de dominio:", originalMessage);
    return { success: false, error: userMessage };
  }
}
//-aqui termina funcion updateReservationStatusAction y se va autilizar en ReservationStatusSelect-//
