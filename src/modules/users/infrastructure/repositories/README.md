# `users/infrastructure/repositories`

Repositorios Prisma que implementan los puertos definidos en `domain/ports`.

## Archivos

- **`prisma-user.repository.ts`** → implementa `UserRepository`. Usa upsert por `id` para insert/update. Busca por `clerkId` (la búsqueda principal en autenticación) y por `email`
- **`prisma-membership.repository.ts`** → implementa `MembershipRepository`. Gestiona los vínculos usuario-restaurante filtrando por `status` para separar accesos activos de revocados o pendientes

## Patrón

Cada repositorio recibe el `PrismaClient` por constructor para facilitar el testing.
La función `mapRecordToEntity()` al final de cada archivo convierte el registro Prisma en entidad de dominio usando `fromPrimitives()`.
