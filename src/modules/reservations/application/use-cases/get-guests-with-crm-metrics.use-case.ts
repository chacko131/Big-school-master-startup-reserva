/**
 * Archivo: get-guests-with-crm-metrics.use-case.ts
 * Responsabilidad: Caso de uso para obtener los huéspedes con sus métricas operacionales del CRM.
 * Tipo: lógica
 */

import { type GuestRepository } from "../ports/guest-repository.port";
import {
  type GetGuestsWithCrmMetricsInput,
  type GetGuestsWithCrmMetricsOutput,
  type GuestCrmPrimitives,
} from "../dtos/guest-crm.dto";

export class GetGuestsWithCrmMetrics {
  constructor(private readonly guestRepository: GuestRepository) {}

  //-aqui empieza funcion execute y es para obtener los huespedes enriquecidos para el CRM-//
  /**
   * Ejecuta la extracción de clientes y calcula sus métricas y lealtad.
   * @sideEffect
   */
  async execute(input: GetGuestsWithCrmMetricsInput): Promise<GetGuestsWithCrmMetricsOutput> {
    const records = await this.guestRepository.findGuestsWithReservations(
      input.restaurantId,
      input.query
    );

    const guests: GuestCrmPrimitives[] = records.map(({ guest, reservations }) => {
      const primitives = guest.toPrimitives();
      const totalReservationsCount = reservations.length;
      
      const noShowsCalculated = reservations.filter(
        (r) => r.status === "NO_SHOW"
      ).length;

      // Buscar la última visita: reserva más reciente COMPLETED o CHECKED_IN
      const completedOrCheckedIn = reservations.filter(
        (r) => r.status === "COMPLETED" || r.status === "CHECKED_IN"
      );
      const lastVisitAt = completedOrCheckedIn.length > 0
        ? completedOrCheckedIn[0]!.startAt
        : null;

      const historicalNotes = reservations
        .filter((r) => r.specialRequests !== null && r.specialRequests.trim().length > 0)
        .map((r) => ({
          startAt: r.startAt,
          specialRequests: r.specialRequests!,
        }));

      // Calcular segmento de lealtad (loyaltySegment)
      let loyaltySegment: GuestCrmPrimitives["loyaltySegment"] = "Nuevo";
      const hasAnyNotes = (primitives.notes !== null && primitives.notes.trim().length > 0) || historicalNotes.length > 0;

      if (noShowsCalculated > 0 || primitives.noShowCount > 0) {
        loyaltySegment = "Atención";
      } else if (
        totalReservationsCount >= 10 ||
        hasAnyNotes
      ) {
        loyaltySegment = "VIP";
      } else if (totalReservationsCount >= 3) {
        loyaltySegment = "Frecuente";
      } else if (totalReservationsCount >= 1) {
        loyaltySegment = "Ocasional";
      }

      return {
        id: primitives.id,
        fullName: primitives.fullName,
        phone: primitives.phone,
        email: primitives.email,
        notes: primitives.notes,
        noShowCount: primitives.noShowCount,
        totalReservationsCount,
        noShowsCalculated,
        lastVisitAt,
        loyaltySegment,
        historicalNotes,
        createdAt: primitives.createdAt,
      };
    });

    return { guests };
  }
  //-aqui termina funcion execute y se va autilizar en las server actions del CRM-//
}
