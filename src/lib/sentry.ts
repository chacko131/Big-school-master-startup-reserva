/**
 * Archivo: sentry.ts
 * Responsabilidad: Helper centralizado para capturar excepciones inesperadas en Sentry.
 *   Solo captura errores que NO son errores de dominio conocidos (negocio esperado).
 * Tipo: utilidad
 */

import * as Sentry from "@sentry/nextjs";

//-aqui empieza funcion captureUnexpectedError y es para reportar a Sentry solo errores genuinamente inesperados-//
/**
 * Envía el error a Sentry únicamente si no es un error de dominio conocido.
 * Los errores de dominio (NoAvailabilityError, DuplicateReservationError, etc.)
 * son flujos de negocio esperados y no deben generar ruido en el monitoreo.
 *
 * @pure false — efecto secundario: envía datos a Sentry
 */
export function captureUnexpectedError(error: unknown, context?: Record<string, unknown>): void {
  if (isKnownDomainError(error)) return;

  Sentry.captureException(error, {
    extra: context,
  });
}
//-aqui termina funcion captureUnexpectedError-//

//-aqui empieza funcion isKnownDomainError y es para identificar errores de dominio conocidos que no deben reportarse-//
/**
 * Devuelve true si el error es un error de negocio esperado y controlado.
 * Estos errores se muestran al usuario como mensajes amigables y no son bugs.
 * @pure
 */
function isKnownDomainError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;

  const knownNames = [
    "NoAvailabilityError",
    "DuplicateReservationError",
    "OutsideBusinessHoursError",
    "ReservationValidationError",
    "UserValidationError",
    "UserNotFoundError",
    "DuplicateUserError",
    "PlanLimitExceededError",
    "FeatureNotAvailableError",
  ];

  return knownNames.includes(error.name);
}
//-aqui termina funcion isKnownDomainError-//
