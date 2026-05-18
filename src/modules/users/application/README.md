# `users/application`

Casos de uso del módulo `users`. Orquestan las entidades de dominio y los puertos para cumplir una operación de negocio concreta.

## Qué vive aquí

- **`use-cases/`** → un directorio por caso de uso, con el archivo principal del use case

## Casos de uso actuales

- **`SyncUserFromClerk`** → crea o actualiza un `User` en la DB a partir de los datos que envía Clerk via webhook. Es el punto de entrada cuando alguien se registra o actualiza su perfil en Clerk.

## Regla

Los casos de uso solo dependen de puertos (interfaces). Nunca importan Prisma, Clerk SDK ni nada de infraestructura directamente.
