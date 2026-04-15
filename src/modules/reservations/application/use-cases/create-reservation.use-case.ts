/**
 * Archivo: create-reservation.use-case.ts
 * Responsabilidad: Orquestar la creación de una reserva usando el dominio y el puerto de persistencia.
 * Tipo: lógica
 */

import { Reservation } from "../../domain/entities/reservation.entity";
import { CreateReservationDto } from "../dtos/create-reservation.dto";
import { ReservationRepository } from "../ports/reservation-repository.port";

export class CreateReservation {
  constructor(private readonly reservationRepository: ReservationRepository) {}

  //-aqui empieza funcion execute y es para crear y guardar una reserva-//
  /**
   * Ejecuta el caso de uso de creación de reserva.
   * @pure
   */
  async execute(input: CreateReservationDto): Promise<Reservation> {
    const reservation = Reservation.create({
      id: input.id,
      restaurantId: input.restaurantId,
      guestId: input.guestId,
      partySize: input.partySize,
      startAt: input.startAt,
      endAt: input.endAt,
      cancellationDeadlineAt: input.cancellationDeadlineAt ?? null,
      specialRequests: input.specialRequests ?? null,
      internalNotes: input.internalNotes ?? null,
    });

    return this.reservationRepository.save(reservation);
  }
  //-aqui termina funcion execute y se va autilizar en application y controllers-//
}
