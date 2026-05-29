# `reservations/application/dtos`

Contiene los DTOs del módulo `reservations`.

## Qué son aquí

Son los contratos de datos que entran o salen de los casos de uso.

## Para qué sirven

- hacer explícito qué datos necesita una acción
- evitar pasar objetos ambiguos
- mantener la capa de aplicación más clara y predecible

## Ejemplos

- datos para crear una reserva
- datos para cancelar una reserva
- datos para consultar una reserva

## Estado actual

La carpeta está lista para definir contratos de datos del flujo de reservas.

---

## Changelog

### 2026-05-05 21:10 (UTC+02:00)

- **`get-available-slots.dto.ts`**: nuevo DTO con `GetAvailableSlotsInput` (restaurantId, date, partySize), `AvailableSlot` (startAt, endAt, availableTables) y `GetAvailableSlotsOutput`.
- **`create-reservation-full.dto.ts`**: nuevo DTO con `CreateReservationFullInput` (datos del guest + partySize + startAt + specialRequests) y `CreateReservationFullOutput` (reservationId, guestId, status, startAt, endAt, cancellationDeadlineAt).

### 2026-05-29 (UTC+02:00)

- **`guest-crm.dto.ts`**: nuevo DTO que introduce `GuestCrmPrimitives` (huésped con métricas de reservas, no-shows reales y segmento de fidelidad) y los contratos de entrada/salida para el listado enriquecido de clientes.

