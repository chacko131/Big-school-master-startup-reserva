# `notifications`

Este módulo gestiona el envío de notificaciones a usuarios del sistema.

## Qué resuelve

Aquí vive todo lo relacionado con:

- eventos que generan notificaciones
- contratos con proveedores externos (Novu, email, etc.)
- casos de uso de notificación
- adaptadores concretos de entrega

## Cómo fluye el trabajo aquí

1. `domain` define los puertos (qué puede hacer un proveedor de notificaciones).
2. `application` orquesta los casos de uso (cuándo y a quién notificar).
3. `infrastructure` conecta la lógica con Novu u otro proveedor real.

## Qué tipo de cosas irán aquí

- notificar al dueño cuando un miembro acepta la invitación al equipo
- notificar al staff cuando llega una nueva reserva
- cualquier evento futuro que requiera notificación

## Por qué existe como módulo separado

Porque la lógica de notificaciones no pertenece al módulo de usuarios ni al de reservas.
Separarlo permite cambiar de proveedor (Novu → otro) sin tocar el dominio.

## Estado actual

Estructura creada. Primer caso de uso planificado: `NotifyMemberAccepted`.
