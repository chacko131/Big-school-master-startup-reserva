/**
 * Archivo: cancel-reservation.use-case.ts
 * Responsabilidad: Cancelar una reserva existente desde la capa de aplicación.
 * Tipo: lógica
 */

import { Reservation } from "../../domain/entities/reservation.entity";
import { ReservationNotFoundError } from "../errors/reservation-not-found.error";
import { CancelReservationDto } from "../dtos/cancel-reservation.dto";
import { ReservationRepository } from "../ports/reservation-repository.port";

export class CancelReservation {
  constructor(private readonly reservationRepository: ReservationRepository) {}

  //-aqui empieza funcion execute y es para cancelar y guardar una reserva existente-//
  /**
   * Ejecuta la cancelación de una reserva existente.
   * @pure
   */
  async execute(input: CancelReservationDto): Promise<Reservation> {
    const reservation = await this.reservationRepository.findById(input.reservationId);

    if (reservation === null) {
      throw new ReservationNotFoundError(input.reservationId);
    }

    const cancelledReservation = reservation.cancel();

    return this.reservationRepository.save(cancelledReservation);
  }
  //-aqui termina funcion execute y se va autilizar en application y controllers-//
}
