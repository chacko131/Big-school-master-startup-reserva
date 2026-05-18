/**
 * Archivo: user-validation.error.ts
 * Responsabilidad: Error de dominio para validaciones fallidas de la entidad User.
 * Tipo: lógica
 */

//-aqui empieza clase UserValidationError y es para representar errores de validacion de dominio-//
/**
 * Se lanza cuando un campo obligatorio de User no cumple las reglas del dominio.
 * @pure
 */
export class UserValidationError extends Error {
  readonly field: string;

  constructor(field: string) {
    super(`User validation failed: "${field}" is required and cannot be empty.`);
    this.name = "UserValidationError";
    this.field = field;
  }
}
//-aqui termina clase UserValidationError-//
