# `users`

Módulo de usuarios, roles y memberships de la plataforma Reserva Latina.

## Responsabilidad

Gestionar la identidad de negocio de cada usuario: quién es, qué rol tiene globalmente en la plataforma y a qué restaurantes pertenece con qué permisos.

La autenticación real (login/logout/MFA) la delega a Clerk. Este módulo se ocupa de la representación de negocio una vez que Clerk confirma la identidad.

## Estructura

```
users/
  domain/         → entidades, puertos y errores (sin dependencias externas)
  infrastructure/ → implementaciones Prisma de los repositorios
```

## Roles globales

- `SUPER_ADMIN` → dueño de la startup, acceso total a todos los restaurantes
- `USER` → cualquier usuario autenticado sin privilegios globales

## Roles por restaurante (MembershipRole)

- `RESTAURANT_OWNER` → dueño del restaurante
- `MANAGER` → gerente
- `STAFF_WAITER` → mesero
- `STAFF_KITCHEN` → cocina
- `STAFF_BAR` → barra

## Estado

Dominio e infraestructura implementados (Tandas 1-3).
Pendiente: integración con Clerk (Tanda 4 — módulo auth).

## Changelog

### 2026-05-21 17:30
- `User` entity: añadido campo `novuSyncedAt` para registrar si el usuario ya fue identificado en Novu como subscriber.
- `User.markNovuSynced()`: nuevo método que devuelve una nueva instancia con `novuSyncedAt = now()`.
- `SyncUserFromClerk`: ahora acepta `NotificationProvider` opcional. Si se inyecta, identifica al subscriber en Novu la primera vez que el usuario hace login (solo una vez, garantizado por `novuSyncedAt`).
- `AcceptTeamInvitation`: refactorizado a patrón `deps`. Acepta `UserRepository`, `RestaurantRepository` y `NotificationProvider` opcionales. Cuando un miembro acepta la invitación, notifica al owner via `NotifyMemberAccepted`.
- `PrismaUserRepository`: actualizado para mapear y persistir `novuSyncedAt`.
- `get-current-user.ts`: ruta rápida si `novuSyncedAt !== null`; ruta de sync si es `null`.
