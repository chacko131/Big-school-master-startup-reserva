# `reservar`

Flujo público para crear una reserva.

## Responsabilidad

Permitir que el cliente final reserve una mesa de forma rápida y clara.

## Datos previstos

- fecha
- hora
- número de personas
- nombre
- teléfono
- email opcional
- peticiones especiales

## Resultado esperado

- reserva creada
- confirmación visible
- acceso posterior a la gestión de reserva

---

## Changelog

### 2026-05-22 (UTC+02:00)

- **Bug fix — zona horaria**: las fechas en `fetchAvailableSlots` y `createGuestReservationAction` se construían con sufijo `Z` (UTC), lo que desplazaba la hora 2h al usar métodos de hora local (`getHours`, `getDay`) en el dominio. Eliminado el sufijo `Z` para que operen en hora local del servidor, alineándose con toda la lógica de `get-available-slots.use-case.ts` e `isWithinBusinessHours`.
- **Bug fix — subscriber ID de Novu**: `createGuestReservationAction` ahora inyecta `userRepository` en `CreateReservationFull` para que el trigger de notificación use el `clerkId` (nombre del buzón en Novu) en lugar del UUID interno de Prisma.
