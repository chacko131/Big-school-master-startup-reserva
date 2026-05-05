/**
 * Archivo: no-availability.error.ts
 * Responsabilidad: Representar el error de aplicación cuando no hay disponibilidad para una reserva.
 * Tipo: lógica
 */

export class NoAvailabilityError extends Error {
  constructor(public readonly requestedStart: Date) {
    super(
      `No availability for the requested time slot starting at ${requestedStart.toISOString()}.`
    );
    this.name = "NoAvailabilityError";
  }
}
