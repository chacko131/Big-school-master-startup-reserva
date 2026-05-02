# `catalog/infrastructure/repositories`

Contiene las implementaciones concretas de repositorios del módulo `catalog`.

## Qué hacen aquí

Estas clases implementan los puertos definidos en `application` y hablan con la base de datos.

## Para qué sirven

- guardar restaurantes
- recuperar mesas
- consultar configuraciones operativas

## Ejemplo mental

- `application` pide `findById`
- el repositorio ejecuta Prisma
- devuelve una entidad del dominio o `null`

## Estado actual

Ya existen repositorios concretos basados en Prisma para:

- `Restaurant`
- `DiningTable`
- `RestaurantSettings`

---
**Fecha y hora:** 02/05/2026 13:55:13
**Cambios:**
- Actualización de `prisma-restaurant.repository.ts` para soportar nuevos campos de catálogo.
- Creación de `prisma-business-hours.repository.ts` para persistencia de horarios.
- Creación de `prisma-menu.repository.ts` para persistencia de categorías y platos de la carta.

