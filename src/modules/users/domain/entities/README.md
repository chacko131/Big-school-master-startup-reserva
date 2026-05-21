# `users/domain/entities`

Entidades de dominio del módulo `users`. Son clases puras sin dependencias externas.

## Archivos

- **`user.entity.ts`** → representa un usuario de la plataforma con su rol global (`SUPER_ADMIN` o `USER`)
- **`user-restaurant-membership.entity.ts`** → representa el vínculo entre un usuario y un restaurante, con su rol dentro del restaurante y su estado (`PENDING`, `ACTIVE`, `REVOKED`)

## Cómo usarlas

Siempre construir con el factory `create()` para que se apliquen las validaciones del dominio.
Para rehidratar desde DB usar `fromPrimitives()`.
Para persistir usar `toPrimitives()`.

## Inmutabilidad

Todos los métodos de negocio (`activate`, `revoke`, `updateProfile`) devuelven una nueva instancia.
Nunca mutan el estado interno.

## Changelog

### 2026-05-21 17:30
- `User`: añadido campo `novuSyncedAt: Date | null` en `UserPrimitives` y `CreateUserProps`.
- `User.markNovuSynced()`: nuevo método puro que devuelve una nueva instancia con `novuSyncedAt = new Date()`.
- `PrismaUserRepository`: `mapRecordToEntity` y `save` actualizados para incluir `novuSyncedAt`.
