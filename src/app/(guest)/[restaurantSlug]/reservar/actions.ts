"use server";

/**
 * Archivo: actions.ts
 * Responsabilidad: Server actions para el flujo público de reserva.
 *   Expone fetchAvailableSlots para que la página de reserva consulte slots reales del restaurante.
 * Tipo: servicio
 */

import { getCatalogInfrastructure } from "@/modules/catalog/infrastructure/catalog-infrastructure";
import { getReservationsInfrastructure } from "@/modules/reservations/infrastructure/reservations-infrastructure";
import { getUsersInfrastructure } from "@/modules/users/infrastructure/users-infrastructure";
import { getNotificationsInfrastructure } from "@/modules/notifications/infrastructure/notifications-infrastructure";
import { GetAvailableSlots } from "@/modules/reservations/application/use-cases/get-available-slots.use-case";
import { CreateReservationFull } from "@/modules/reservations/application/use-cases/create-reservation-full.use-case";
import { DuplicateReservationError } from "@/modules/reservations/application/errors/duplicate-reservation.error";
import { NoAvailabilityError } from "@/modules/reservations/application/errors/no-availability.error";
import { OutsideBusinessHoursError } from "@/modules/reservations/application/errors/outside-business-hours.error";

export interface FetchAvailableSlotsResult {
  slots: string[];
  closedDays: string[];
  error?: string;
}

//-aqui empieza funcion fetchAvailableSlots y es para obtener los horarios disponibles de un restaurante para una fecha y tamaño de grupo-//
/**
 * Resuelve el restaurantId por slug, llama a GetAvailableSlots y devuelve los slots como strings HH:mm.
 * @sideEffect
 */
export async function fetchAvailableSlots(
  restaurantSlug: string,
  date: string,
  partySize: number
): Promise<FetchAvailableSlotsResult> {
  const parsedDate = new Date(`${date}T00:00:00`);
  if (isNaN(parsedDate.getTime())) {
    return { slots: [], closedDays: [], error: "Fecha inválida." };
  }

  const { restaurantRepository } = getCatalogInfrastructure();
  const restaurant = await restaurantRepository.findBySlug(restaurantSlug);

  if (restaurant === null) {
    return { slots: [], closedDays: [], error: "Restaurante no encontrado." };
  }

  const {
    reservationRepository,
    diningTableRepository,
    restaurantSettingsRepository,
    businessHoursRepository,
  } = getReservationsInfrastructure();

  const allBusinessHours = await businessHoursRepository.findByRestaurantId(restaurant.id);
  const closedDays = allBusinessHours
    .filter((bh) => bh.isClosed)
    .map((bh) => bh.day);

  const useCase = new GetAvailableSlots(
    reservationRepository,
    diningTableRepository,
    restaurantSettingsRepository,
    businessHoursRepository
  );

  let result;
  try {
    result = await useCase.execute({
      restaurantId: restaurant.id,
      date: parsedDate,
      partySize,
    });
  } catch {
    return { slots: [], closedDays, error: "No se pudieron obtener los horarios disponibles." };
  }

  const slots = result.slots.map((slot) => {
    const h = String(slot.startAt.getHours()).padStart(2, "0");
    const m = String(slot.startAt.getMinutes()).padStart(2, "0");
    return `${h}:${m}`;
  });

  return { slots, closedDays };
}
//-aqui termina funcion fetchAvailableSlots-//

// ─── Create reservation ───────────────────────────────────────────────────────

export interface CreateGuestReservationResult {
  success: boolean;
  reservationId?: string;
  error?: string;
  alternativeSlots?: string[];
}

const MAX_PARTY_SIZE = 20;

//-aqui empieza funcion createGuestReservationAction y es para crear una reserva desde el flujo público guest-//
/**
 * Reutiliza CreateReservationFull igual que el dashboard pero resuelve restaurantId por slug.
 * @sideEffect
 */
export async function createGuestReservationAction(
  restaurantSlug: string,
  formData: FormData
): Promise<CreateGuestReservationResult> {
  const guestFullName = (formData.get("guestFullName") as string)?.trim() ?? "";
  const guestPhone    = (formData.get("guestPhone")    as string)?.trim() ?? "";
  const guestEmail    = (formData.get("guestEmail")    as string)?.trim() || null;
  const partySizeRaw  = formData.get("partySize")      as string;
  const dateRaw       = formData.get("date")           as string;
  const timeRaw       = formData.get("time")           as string;
  const specialRequests = (formData.get("specialRequests") as string)?.trim() || null;

  if (!guestFullName || !guestPhone || !partySizeRaw || !dateRaw || !timeRaw) {
    return { success: false, error: "Todos los campos obligatorios deben completarse." };
  }

  const partySize = parseInt(partySizeRaw, 10);
  if (isNaN(partySize) || partySize < 1) {
    return { success: false, error: "El número de personas debe ser al menos 1." };
  }
  if (partySize > MAX_PARTY_SIZE) {
    return { success: false, error: `Máximo ${MAX_PARTY_SIZE} personas por reserva online.` };
  }

  const startAt = new Date(`${dateRaw}T${timeRaw}:00`);
  if (isNaN(startAt.getTime())) {
    return { success: false, error: "La fecha y hora no son válidas." };
  }
  const MIN_ADVANCE_MS = 15 * 60 * 1000;
  if (startAt.getTime() < Date.now() + MIN_ADVANCE_MS) {
    return { success: false, error: "La reserva debe hacerse con al menos 15 minutos de antelación." };
  }

  const { restaurantRepository } = getCatalogInfrastructure();
  const restaurant = await restaurantRepository.findBySlug(restaurantSlug);
  if (restaurant === null) {
    return { success: false, error: "Restaurante no encontrado." };
  }

  try {
    const {
      reservationRepository,
      reservationTableRepository,
      guestRepository,
      restaurantSettingsRepository,
      diningTableRepository,
      businessHoursRepository,
    } = getReservationsInfrastructure();

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
      restaurantId: restaurant.id,
      guestFullName,
      guestPhone,
      guestEmail,
      partySize,
      startAt,
      specialRequests,
      origin: "PUBLIC",
    });

    return { success: true, reservationId: result.reservationId };
  } catch (error) {
    if (error instanceof NoAvailabilityError) {
      return {
        success: false,
        error: "No hay mesas disponibles para esa hora.",
        alternativeSlots: error.alternatives.map((d: Date) =>
          d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
        ),
      };
    }
    if (error instanceof OutsideBusinessHoursError) {
      return { success: false, error: "El restaurante no está abierto a esa hora." };
    }
    if (error instanceof DuplicateReservationError) {
      return { success: false, error: "Ya tienes una reserva activa en esa franja horaria." };
    }
    return { success: false, error: "Error inesperado al crear la reserva." };
  }
}
//-aqui termina funcion createGuestReservationAction-//
