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

Ya existen repositorios concretos basados en Prisma para:

- `Reservation`
- `Guest`
- consultas de `DiningTable` activas
- consultas de `RestaurantSettings`
- consultas de `BusinessHours`

---

## Changelog

### 2026-05-05 21:10 (UTC+02:00)

- **`prisma-reservation.repository.ts`**: añadidos `findByRestaurantAndDateRange()` (excluye CANCELLED y NO_SHOW) y `findByGuestId()` (historial ordenado por fecha desc).
- **`prisma-guest.repository.ts`**: añadido `findByRestaurantAndPhone()` usando el constraint unique `restaurantId_phone`.
- **`prisma-business-hours.repository.ts`**: nuevo repositorio que consulta los horarios de apertura del restaurante.
