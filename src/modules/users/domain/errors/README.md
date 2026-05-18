# `users/domain/errors`

Errores de dominio tipados del módulo `users`.

## Archivos

- **`user-validation.error.ts`** → se lanza cuando un campo obligatorio de `User` no cumple las reglas del dominio (campo vacío, email sin `@`, etc.)
- **`user-not-found.error.ts`** → se lanza cuando se busca un usuario que no existe en el repositorio
- **`duplicate-user.error.ts`** → se lanza cuando se intenta crear un usuario cuyo `clerkId` o `email` ya existe

## Uso

Los casos de uso capturan estos errores y los traducen en respuestas comprensibles para la UI o el webhook.
Nunca lanzar excepciones genéricas de JavaScript desde el dominio; siempre usar estos errores tipados.
