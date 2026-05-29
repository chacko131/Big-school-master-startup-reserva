# `reservations`

Este módulo contiene el corazón funcional de la aplicación: el flujo de reservas.

## Qué resuelve

Aquí vive todo lo relacionado con:

- huéspedes
- reservas
- estados de reserva
- asignación de mesas
- cancelaciones
- confirmaciones

## Cómo fluye el trabajo aquí

1. `domain` define las reglas puras del negocio.
2. `application` orquesta los casos de uso.
3. `infrastructure` conecta la lógica con Prisma y la base de datos.
4. `schemas` valida la información que llega desde fuera.

## Qué tipo de cosas irán aquí

- crear reservas
- consultar una reserva
- cancelar una reserva
- confirmar una reserva
- asignar mesas
- registrar ausencias de huéspedes

## Por qué existe como módulo separado

Porque la reserva es una parte central del negocio y no debe mezclarse con la configuración operativa del restaurante.

## Estado actual

La estructura ya está preparada y el dominio base está modelado; ahora se está construyendo la capa de aplicación.

---

## Changelog

### 2026-05-05 21:10 (UTC+02:00)

- **Entidad `Reservation`**: añadidos métodos `checkIn()` y `complete()` con guards de estado. Reforzado `markNoShow()` para solo aceptar reservas CONFIRMED. Añadidos getters `startAt`, `endAt`, `cancellationDeadlineAt`.
- **Puertos extendidos**: `ReservationRepository` (+`findByRestaurantAndDateRange`, +`findByGuestId`), `GuestRepository` (+`findByRestaurantAndPhone`). Nuevo puerto `BusinessHoursRepository`.
- **Nuevos use cases**: `GetAvailableSlots` (cálculo de disponibilidad cruzando horarios, mesas y reservas existentes), `CreateReservationFull` (flujo completo: find-or-create guest → validar disponibilidad → crear reserva → auto-confirmar si aplica).
- **Nuevos DTOs**: `GetAvailableSlotsInput/Output`, `CreateReservationFullInput/Output`.
- **Nuevo error**: `NoAvailabilityError`.
- **Infraestructura**: nuevos métodos en `PrismaReservationRepository` y `PrismaGuestRepository`. Nuevo `PrismaBusinessHoursRepository`. Composición actualizada en `reservations-infrastructure.ts`.
- **Tests**: 19/19 pasan. 7 nuevos tests para transiciones de estado (confirm, checkIn, complete, markNoShow + guards).

### 2026-05-29 (UTC+02:00)

- **DTO de CRM**: Creado `GuestCrmPrimitives` y contratos en `guest-crm.dto.ts` para exponer huéspedes con métricas agregadas operacionales calculadas en el servidor.
- **Puerto `GuestRepository`**: Añadido método de lectura enriquecida `findGuestsWithReservations` para extraer comensales con su historial de visitas detallado.
- **Caso de uso `GetGuestsWithCrmMetrics`**: Creado caso de uso para calcular visitas, total de inasistencias reales y el segmento de lealtad de los clientes en tiempo real.
- **Adaptador de Prisma**: Implementado el método `findGuestsWithReservations` realizando cargas eficientes en base de datos.
- **Tests**: Añadidos 6 tests unitarios dedicados a las métricas del CRM; 96/96 tests pasando con éxito.

