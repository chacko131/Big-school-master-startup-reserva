# `SyncUserFromClerk`

Caso de uso que sincroniza un usuario de Clerk con la base de datos de la plataforma.

## Cuándo se ejecuta

Desde el webhook de Clerk (`/api/webhooks/clerk`) ante los eventos `user.created` y `user.updated`.

## Qué hace

1. Busca si ya existe un `User` con ese `clerkId`
2. Si existe → actualiza `email` y `fullName`
3. Si no existe → crea un nuevo `User` con `crypto.randomUUID()` como ID interno

## Nota sobre el SUPER_ADMIN

La asignación del rol `SUPER_ADMIN` al email `jesusnodarse7@gmail.com` ocurre automáticamente dentro de `User.create()` en el dominio. Este caso de uso no necesita saberlo.
