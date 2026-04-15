# `reservations/infrastructure/repositories`

Contiene las implementaciones concretas de repositorios del módulo `reservations`.

## Qué hacen aquí

Estas clases implementan los puertos definidos en `application` y hablan con la base de datos.

## Para qué sirven

- guardar reservas
- recuperar huéspedes
- consultar asignaciones de mesas

## Ejemplo mental

- `application` pide `findById`
- el repositorio ejecuta Prisma
- devuelve una entidad del dominio o `null`

## Estado actual

La carpeta está preparada para repositorios concretos.
