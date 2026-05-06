/**
 * Archivo: duplicate-reservation.error.ts
 * Responsabilidad: Representar el error cuando un guest ya tiene una reserva activa en la misma franja horaria.
 * Tipo: lógica
 */

export class DuplicateReservationError extends Error {
  constructor(
    public readonly guestId: string,
    public readonly conflictingReservationId: string
  ) {
    super(
      `Guest ${guestId} already has an active reservation (${conflictingReservationId}) in the requested time slot.`
    );
    this.name = "DuplicateReservationError";
  }
}
