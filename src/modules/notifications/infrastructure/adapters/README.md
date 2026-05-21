# `notifications/infrastructure/adapters`

Implementaciones concretas de los puertos de notificación.

## Qué vivirá aquí

- `novu-notification.adapter.ts` — implementa `NotificationProvider` usando el SDK de Novu

## Convención

- Nombre del adaptador: `[Proveedor]NotificationAdapter`
- Implementa la interfaz `NotificationProvider` definida en `domain/ports`
- No contiene lógica de negocio, solo traducción al SDK del proveedor

## Estado actual

Pendiente de implementar: `NovuNotificationAdapter`.
