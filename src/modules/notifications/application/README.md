# `notifications/application`

Esta carpeta organiza los casos de uso del módulo `notifications`.

## Qué hace esta capa

Aquí se orquesta cuándo y a quién se notifica, usando los puertos del dominio.
No sabe cómo se entrega la notificación, solo sabe qué tiene que pasar.

## Qué vivirá aquí

- casos de uso de notificación
- DTOs de entrada y salida

## Ejemplos de acciones

- notificar al dueño cuando un miembro acepta la invitación
- notificar al staff cuando llega una nueva reserva

## Ejemplo mental

- el use case de `AcceptTeamInvitation` llama a `NotifyMemberAccepted`
- `NotifyMemberAccepted` habla con el puerto `NotificationProvider`
- la infraestructura implementa ese puerto con Novu

## Por qué existe esta capa

Porque separa el "cuándo notificar" del "cómo entregar la notificación técnicamente".

## Estado actual

Estructura creada. Primer caso de uso planificado: `NotifyMemberAccepted`.
