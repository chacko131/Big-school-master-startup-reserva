# InviteTeamMember

Genera un token de invitación, lo persiste y envía el email al invitado.

## Reglas de negocio
- Solo el `RESTAURANT_OWNER` puede invitar miembros.
- No se puede invitar al propio owner.
- No se puede invitar con rol `RESTAURANT_OWNER`.
- Si ya existe un token pendiente para ese email+restaurante, se invalida antes de generar uno nuevo.
- Si el email ya tiene una membership ACTIVE en ese restaurante, no se envía invitación.

## Entrada
- `requesterId` — userId del owner
- `restaurantId`
- `restaurantName` — para el email
- `inviterName` — para el email
- `email` — del invitado
- `role` — rol a asignar

## Salida
- `void`
