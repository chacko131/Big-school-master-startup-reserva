# `users/domain`

Corazón de negocio del módulo `users`. No tiene dependencias de Prisma, Clerk ni ningún framework.

## Qué hace esta capa

Define qué es un usuario en el sistema de negocio, qué reglas debe cumplir y cómo se vincula a los restaurantes.

## Qué vive aquí

- **`entities/`** → entidades `User` y `UserRestaurantMembership` con sus reglas e invariantes
- **`ports/`** → contratos de repositorio que la capa de aplicación e infraestructura deben cumplir
- **`errors/`** → errores de dominio tipados (validación, not found, duplicado)

## Reglas importantes

- El email `jesusnodarse7@gmail.com` recibe `SUPER_ADMIN` automáticamente al crear el usuario
- El `globalRole` no puede modificarse desde `updateProfile()` por seguridad
- Una membership en estado `PENDING` no da acceso al dashboard
- Un usuario puede pertenecer a varios restaurantes con roles distintos
