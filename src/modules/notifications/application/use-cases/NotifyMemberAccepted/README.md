# `NotifyMemberAccepted`

Caso de uso que notifica al dueño del restaurante cuando un miembro acepta su invitación al equipo.

## Cuándo se dispara

Cuando `AcceptTeamInvitation` se ejecuta con éxito y la membership pasa a `ACTIVE`.

## A quién notifica

Al dueño del restaurante (el usuario que envió la invitación, identificado por `invitedById`).

## Qué información lleva la notificación

- nombre del nuevo miembro
- rol asignado (MANAGER, STAFF_WAITER, etc.)

## Canal

In-App (Inbox del dashboard via Novu).

## Estado actual

Implementado en `notify-member-accepted.use-case.ts`. El método `execute` recibe los datos del dueño y del nuevo miembro, y delega el envío de la notificación al `NotificationProvider`.
