# `users/infrastructure`

Implementaciones concretas de los puertos del módulo `users` usando Prisma y Neon DB.

## Qué hace esta capa

Traduce las operaciones del dominio (`save`, `findByClerkId`, etc.) a queries reales contra la base de datos PostgreSQL de Neon.

## Archivos

- **`users-infrastructure.ts`** → punto de entrada del módulo. Exporta `getUsersInfrastructure()` que ensambla los repositorios con el cliente Prisma compartido
- **`repositories/`** → implementaciones concretas de `UserRepository` y `MembershipRepository`

## Cómo usar

```ts
import { getUsersInfrastructure } from "@/modules/users/infrastructure/users-infrastructure";

const { userRepository, membershipRepository } = getUsersInfrastructure();
```

## Regla importante

Solo los casos de uso de `application/` y los server actions deben importar desde aquí.
Nunca importar repositorios Prisma directamente desde componentes o páginas.
