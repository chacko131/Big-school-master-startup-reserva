# `users/domain/ports`

Contratos (interfaces) que definen cómo la capa de dominio espera que se comporten los repositorios.

## Archivos

- **`user.repository.port.ts`** → contrato para persistir y buscar usuarios (`findById`, `findByClerkId`, `findByEmail`, `save`)
- **`membership.repository.port.ts`** → contrato para gestionar los vínculos usuario-restaurante (`findActiveByUserAndRestaurant`, `findActiveByUserId`, `findByRestaurantId`, `save`)

## Por qué existen aquí

El dominio no puede depender de Prisma. Los puertos son la frontera: el dominio define el contrato, la infraestructura lo implementa.
Esto permite cambiar la base de datos en el futuro sin tocar ninguna regla de negocio.
