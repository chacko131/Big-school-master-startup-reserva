# `notifications/infrastructure`

Esta carpeta conecta el módulo de notificaciones con el proveedor técnico real.

## Qué hace esta capa

Aquí viven las implementaciones concretas de los puertos definidos en `domain/ports`.
Es el único lugar del módulo que sabe que usamos Novu.

## Qué vivirá aquí

- adaptadores que implementan `NotificationProvider` usando Novu
- `notifications-infrastructure.ts` — composition root del módulo

## Ejemplo mental

- `application` llama a `NotificationProvider.notifyMemberAccepted(...)`
- `NovuNotificationAdapter` implementa ese método usando el SDK de Novu
- si mañana cambias de Novu a otro proveedor, solo cambias este adaptador

## Por qué existe

Porque la aplicación debe poder cambiar de proveedor de notificaciones sin reescribir sus reglas de negocio.

## Estado actual

Estructura creada. Pendiente de implementar: `NovuNotificationAdapter` y `notifications-infrastructure.ts`.
