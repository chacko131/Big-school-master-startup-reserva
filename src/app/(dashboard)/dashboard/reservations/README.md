# `reservations`

Sección interna para gestionar reservas del restaurante.

## Responsabilidad

Listar, filtrar y operar reservas desde el staff panel.

## Datos previstos

- reserva
- huésped
- estado
- hora
- party size
- notas
- asignación de mesa

---

## Changelog

### 2026-05-22 (UTC+02:00)

- **Bug fix — subscriber ID de Novu**: `createReservationAction` ahora inyecta `userRepository` en `CreateReservationFull` para que el trigger de notificación al crear una reserva use el `clerkId` del owner/manager (nombre real del buzón en Novu) en lugar del UUID interno de Prisma.
