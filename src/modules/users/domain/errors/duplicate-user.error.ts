/**
 * Archivo: duplicate-user.error.ts
 * Responsabilidad: Error de dominio cuando se intenta crear un User que ya existe.
 * Tipo: lógica
 */

//-aqui empieza clase DuplicateUserError y es para representar un usuario ya registrado-//
/**
 * Se lanza cuando se intenta sincronizar un User cuyo clerkId o email ya existe.
 * @pure
 */
export class DuplicateUserError extends Error {
  constructor(identifier: string) {
    super(`A user with identifier "${identifier}" already exists.`);
    this.name = "DuplicateUserError";
  }
}
//-aqui termina clase DuplicateUserError-//
