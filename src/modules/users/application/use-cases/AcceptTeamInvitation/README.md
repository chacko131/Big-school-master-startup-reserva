# AcceptTeamInvitation

Valida el token de invitación y activa la membership del usuario en el restaurante.

## Reglas de negocio
- El token debe existir, no haber expirado y no haber sido usado.
- El usuario que acepta debe ser el mismo email que recibió la invitación.
- Si el usuario no existe en DB aún (registro reciente via Clerk), se crea la membership con userId correcto.
- El token se marca como usado (usedAt = now) tras aceptar.
- Si ya tiene membership ACTIVE en ese restaurante, se ignora silenciosamente (idempotente).

## Entrada
- `token` — UUID del token recibido en el email
- `acceptingUserId` — userId del usuario autenticado que acepta
- `acceptingUserEmail` — email del usuario autenticado (para validar que coincide)

## Salida
- `{ restaurantId: string }` — para redirigir al dashboard correcto
