# `reservations/infrastructure`

Esta carpeta conecta el dominio con la tecnología real.

## Qué hace esta capa

Aquí viven las piezas que hablan con la base de datos, con Prisma o con cualquier servicio externo.

## Qué vivirá aquí

- repositorios
- adaptadores Prisma
- integraciones técnicas
- persistencia de reservas y huéspedes

## Ejemplo mental

- `application` pide guardar o consultar algo
- `infrastructure` usa Prisma o Neon para hacerlo
- el dominio no se mezcla con ese detalle técnico

## Por qué existe

Porque la aplicación debe poder cambiar de tecnología sin reescribir sus reglas de negocio.

## Estado actual

Ya existe un primer bloque real de infraestructura.

- repositorios Prisma para `Reservation`, `Guest`, `DiningTable`, `RestaurantSettings` y `BusinessHours`
- acceso al cliente Prisma compartido conectado a Neon
- una composición base para ensamblar los repositorios del módulo `reservations`

---

## Changelog

### 2026-05-05 21:10 (UTC+02:00)

- **`reservations-infrastructure.ts`**: añadido `businessHoursRepository` a la interfaz `ReservationsInfrastructure` y a las funciones de composición.
- **Repositorios actualizados**: `PrismaReservationRepository` (+2 queries), `PrismaGuestRepository` (+1 query). Nuevo `PrismaBusinessHoursRepository`.
