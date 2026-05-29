/**
 * Archivo: actions.ts
 * Responsabilidad: Server actions para la página de reservas del dashboard.
 * Tipo: servicio
 */

"use server";

import { getRestaurantIdFromSession } from "@/modules/auth/get-restaurant-id";
import { revalidatePath } from "next/cache";
import { assertCanWrite } from "@/modules/billing/infrastructure/write-access-guard";
import { getCatalogInfrastructure } from "@/modules/catalog/infrastructure/catalog-infrastructure";
import { getReservationsInfrastructure } from "@/modules/reservations/infrastructure/reservations-infrastructure";
import { getUsersInfrastructure } from "@/modules/users/infrastructure/users-infrastructure";
import { getNotificationsInfrastructure } from "@/modules/notifications/infrastructure/notifications-infrastructure";
import { GetTodayReservations } from "@/modules/reservations/application/use-cases/get-today-reservations.use-case";
import { CreateReservationFull } from "@/modules/reservations/application/use-cases/create-reservation-full.use-case";
import { type GetTodayReservationsOutput } from "@/modules/reservations/application/dtos/get-today-reservations.dto";
import { DuplicateReservationError } from "@/modules/reservations/application/errors/duplicate-reservation.error";
import { NoAvailabilityError } from "@/modules/reservations/application/errors/no-availability.error";
import { OutsideBusinessHoursError } from "@/modules/reservations/application/errors/outside-business-hours.error";


//-aqui empieza funcion fetchTodayReservations y es para obtener reservas del dia desde el servidor-//
/**
 * Obtiene las reservas del día actual para el restaurante en sesión.
 * @sideEffect
 */
export async function fetchTodayReservations(): Promise<GetTodayReservationsOutput> {
  const restaurantId = await getRestaurantIdFromSession();

  const { reservationRepository, guestRepository } = getReservationsInfrastructure();
  const useCase = new GetTodayReservations(reservationRepository, guestRepository);

  return useCase.execute({
    restaurantId,
    date: new Date(),
  });
}
//-aqui termina funcion fetchTodayReservations y se va autilizar en la pagina de reservas del dashboard-//

//-aqui empieza funcion fetchReservationsByDate y es para obtener reservas de un dia especifico desde el cliente-//
/**
 * Server Action que recibe una fecha YYYY-MM-DD del cliente y devuelve
 * solo las reservas de ese día para el restaurante en sesión.
 * @sideEffect
 */
export async function fetchReservationsByDate(dateStr: string): Promise<GetTodayReservationsOutput> {
  const restaurantId = await getRestaurantIdFromSession();

  const date = new Date(`${dateStr}T12:00:00`);

  const { reservationRepository, guestRepository } = getReservationsInfrastructure();
  const useCase = new GetTodayReservations(reservationRepository, guestRepository);

  return useCase.execute({ restaurantId, date });
}
//-aqui termina funcion fetchReservationsByDate-//

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
  const restaurantId = await assertCanWrite();

  const guestFullName = (formData.get("guestFullName") as string)?.trim() ?? "";
  const guestPhone = (formData.get("guestPhone") as string)?.trim() ?? "";
  const guestEmail = (formData.get("guestEmail") as string)?.trim() || null;
  const partySizeRaw = formData.get("partySize") as string;
  const dateRaw = formData.get("date") as string;
  const timeRaw = formData.get("time") as string;
  const specialRequests = (formData.get("specialRequests") as string)?.trim() || null;

  if (guestFullName.length === 0 || guestPhone.length === 0 || !partySizeRaw || !dateRaw || !timeRaw) {
    return { success: false, error: "Todos los campos obligatorios deben completarse." };
  }

  const partySize = parseInt(partySizeRaw, 10);

  if (isNaN(partySize) || partySize < 1) {
    return { success: false, error: "El número de personas debe ser al menos 1." };
  }

  if (partySize > MAX_PARTY_SIZE) {
    return { success: false, error: `El número máximo de personas por reserva online es ${MAX_PARTY_SIZE}. Para grupos más grandes, contacta directamente con el restaurante.` };
  }

  const startAt = new Date(`${dateRaw}T${timeRaw}:00`);

  if (isNaN(startAt.getTime())) {
    return { success: false, error: "La fecha y hora no son válidas." };
  }

  const now = new Date();
  if (startAt.getTime() <= now.getTime()) {
    return { success: false, error: "No se pueden crear reservas en una fecha y hora pasadas." };
  }

  try {
    const { reservationRepository, reservationTableRepository, guestRepository, restaurantSettingsRepository, diningTableRepository, businessHoursRepository } = getReservationsInfrastructure();
    const { restaurantRepository } = getCatalogInfrastructure();
    const { membershipRepository, userRepository } = getUsersInfrastructure();
    const { notificationProvider } = getNotificationsInfrastructure();

    const useCase = new CreateReservationFull(
      reservationRepository,
      guestRepository,
      restaurantSettingsRepository,
      diningTableRepository,
      businessHoursRepository,
      reservationTableRepository,
      restaurantRepository,
      membershipRepository,
      userRepository,
      notificationProvider
    );

    const result = await useCase.execute({
      restaurantId,
      guestFullName,
      guestPhone,
      guestEmail,
      partySize,
      startAt,
      specialRequests,
      origin: "DASHBOARD",
    });

    revalidatePath("/dashboard/reservations");

    return { success: true, reservationId: result.reservationId };
  } catch (error) {
    if (error instanceof NoAvailabilityError) {
      const alternativeSlots = error.alternatives.map((d: Date) =>
        d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
      );
      return {
        success: false,
        error: "No hay mesas disponibles para esa hora.",
        alternativeSlots,
      };
    }

    if (error instanceof OutsideBusinessHoursError) {
      return {
        success: false,
        error: "El restaurante no está abierto a esa hora. Consulta nuestro horario y selecciona un horario válido.",
      };
    }

    if (error instanceof DuplicateReservationError) {
      return {
        success: false,
        error: "Ya tienes una reserva activa en esa franja horaria. Cancela la anterior o elige otro horario.",
      };
    }

    return { success: false, error: "Error inesperado al crear la reserva." };
  }
}
//-aqui termina funcion createReservationAction y se va autilizar en el modal de nueva reserva-//

export interface UpdateReservationActionResult {
  success: boolean;
  error?: string;
}

//-aqui empieza funcion updateReservationAction y es para editar los campos operativos de una reserva existente-//
/**
 * Server action para editar partySize, fecha/hora y specialRequests de una reserva.
 * Valida ownership del restaurante antes de persistir.
 * @sideEffect
 */
const MAX_PARTY_SIZE_EDIT = 20;

export async function updateReservationAction(
  reservationId: string,
  formData: FormData
): Promise<UpdateReservationActionResult> {
  const restaurantId = await assertCanWrite();

  const partySizeRaw = (formData.get("partySize") as string)?.trim();
  const dateRaw = (formData.get("date") as string)?.trim();
  const timeRaw = (formData.get("time") as string)?.trim();
  const specialRequests = (formData.get("specialRequests") as string)?.trim() || null;
  const internalNotes = (formData.get("internalNotes") as string)?.trim() || null;

  if (!partySizeRaw || !dateRaw || !timeRaw) {
    return { success: false, error: "Todos los campos obligatorios deben completarse." };
  }

  const partySize = parseInt(partySizeRaw, 10);
  if (isNaN(partySize) || partySize < 1) {
    return { success: false, error: "El número de personas debe ser al menos 1." };
  }
  if (partySize > MAX_PARTY_SIZE_EDIT) {
    return { success: false, error: `El número máximo de personas por reserva es ${MAX_PARTY_SIZE_EDIT}.` };
  }

  const startAt = new Date(`${dateRaw}T${timeRaw}:00`);
  if (isNaN(startAt.getTime())) {
    return { success: false, error: "La fecha y hora no son válidas." };
  }

  const now = new Date();
  if (startAt.getTime() <= now.getTime()) {
    return { success: false, error: "No se pueden mover reservas a una fecha y hora pasadas." };
  }

  try {
    const { reservationRepository, restaurantSettingsRepository } = getReservationsInfrastructure();

    const reservation = await reservationRepository.findById(reservationId);
    if (reservation === null) {
      return { success: false, error: "Reserva no encontrada." };
    }
    if (reservation.restaurantId !== restaurantId) {
      return { success: false, error: "No tienes permiso para modificar esta reserva." };
    }

    // endAt se calcula desde settings del restaurante; si no hay settings, mantiene la duración original
    const originalDurationMs = reservation.endAt.getTime() - reservation.startAt.getTime();
    const settings = await restaurantSettingsRepository.findByRestaurantId(restaurantId);
    const durationMs = settings !== null
      ? settings.toPrimitives().defaultReservationDurationMinutes * 60 * 1000
      : originalDurationMs;
    const endAt = new Date(startAt.getTime() + durationMs);

    const updated = reservation.reschedule({
      partySize,
      startAt,
      endAt,
      specialRequests,
      internalNotes,
    });

    await reservationRepository.save(updated);
    revalidatePath("/dashboard/reservations");

    return { success: true };
  } catch (err) {
    if (err instanceof Error && err.name === "ReservationValidationError") {
      return { success: false, error: "No se puede modificar una reserva en ese estado." };
    }
    return { success: false, error: "Error inesperado al actualizar la reserva." };
  }
}
//-aqui termina funcion updateReservationAction-//

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
  const restaurantId = await assertCanWrite();

  const { reservationRepository } = getReservationsInfrastructure();

  const reservation = await reservationRepository.findById(reservationId);

  if (reservation === null) {
    return { success: false, error: "Reserva no encontrada." };
  }

  //-aqui empieza verificacion de ownership-//
  if (reservation.restaurantId !== restaurantId) {
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
        return { success: false, error: `Transición a estado "${targetStatus}" no soportada.` };
    }

    await reservationRepository.save(updated);

    revalidatePath("/dashboard/reservations");

    return { success: true };
  } catch (err) {
    const userMessage = mapDomainErrorToUserMessage(err);
    return { success: false, error: userMessage };
  }
}
//-aqui termina funcion updateReservationStatusAction y se va autilizar en ReservationStatusSelect-//
