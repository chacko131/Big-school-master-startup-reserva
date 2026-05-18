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
