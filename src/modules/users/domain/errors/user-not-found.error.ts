/**
 * Archivo: user-not-found.error.ts
 * Responsabilidad: Error de dominio cuando un User no existe en el sistema.
 * Tipo: lógica
 */

//-aqui empieza clase UserNotFoundError y es para representar la ausencia de un usuario-//
/**
 * Se lanza cuando se busca un User que no existe en el repositorio.
 * @pure
 */
export class UserNotFoundError extends Error {
  constructor(identifier: string) {
    super(`User not found for identifier: "${identifier}".`);
    this.name = "UserNotFoundError";
  }
}
//-aqui termina clase UserNotFoundError-//
