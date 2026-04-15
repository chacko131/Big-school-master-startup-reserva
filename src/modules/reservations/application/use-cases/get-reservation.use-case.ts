/**
 * Archivo: get-reservation.use-case.ts
 * Responsabilidad: Obtener una reserva existente desde la capa de aplicación.
 * Tipo: lógica
 */

import { Reservation } from "../../domain/entities/reservation.entity";
import { ReservationNotFoundError } from "../errors/reservation-not-found.error";
import { GetReservationDto } from "../dtos/get-reservation.dto";
import { ReservationRepository } from "../ports/reservation-repository.port";

export class GetReservation {
  constructor(private readonly reservationRepository: ReservationRepository) {}

  //-aqui empieza funcion execute y es para recuperar una reserva por id-//
  /**
   * Ejecuta la obtención de una reserva existente.
   * @pure
   */
  async execute(input: GetReservationDto): Promise<Reservation> {
    const reservation = await this.reservationRepository.findById(input.reservationId);

    if (reservation === null) {
      throw new ReservationNotFoundError(input.reservationId);
    }

    return reservation;
  }
  //-aqui termina funcion execute y se va autilizar en application y controllers-//
}
