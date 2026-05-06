/**
 * Archivo: no-availability.error.ts
 * Responsabilidad: Representar el error de aplicación cuando no hay disponibilidad para una reserva,
 *   incluyendo horarios alternativos sugeridos.
 * Tipo: lógica
 */

export class NoAvailabilityError extends Error {
  public readonly alternatives: Date[];

  constructor(public readonly requestedStart: Date, alternatives: Date[] = []) {
    super(
      `No availability for the requested time slot starting at ${requestedStart.toISOString()}.`
    );
    this.name = "NoAvailabilityError";
    this.alternatives = alternatives;
  }
}
