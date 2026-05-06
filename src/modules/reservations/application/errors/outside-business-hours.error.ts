/**
 * Archivo: outside-business-hours.error.ts
 * Responsabilidad: Representar el error cuando se intenta reservar fuera del horario de apertura del restaurante.
 * Tipo: lógica
 */

export class OutsideBusinessHoursError extends Error {
  constructor(public readonly requestedStart: Date) {
    super(
      `The requested time ${requestedStart.toISOString()} is outside the restaurant's business hours.`
    );
    this.name = "OutsideBusinessHoursError";
  }
}
