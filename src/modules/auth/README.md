# `auth`

Módulo de autenticación y resolución del usuario activo de la plataforma.

## Responsabilidad

Puente entre Clerk (identity provider externo) y el módulo `users` (representación de negocio).
No gestiona login ni signup — eso lo hace Clerk. Aquí solo resolvemos quién es el usuario autenticado dentro del sistema.

## Archivos

- **`get-current-user.ts`** → exporta `getCurrentUser()` y `requireCurrentUser()`. Son los helpers que usan Server Components y Server Actions para obtener el `User` de negocio con su rol y sus memberships.
- **`get-restaurant-id.ts`** → exporta `getRestaurantIdFromSession()`. Devuelve el `restaurantId` de la membership activa del usuario. Redirige si no hay sesión o membership.
- **`get-service-session.ts`** → exporta `getServiceSession()`. Devuelve `{ restaurantId, userId, role }` en una sola llamada. Usado exclusivamente por el módulo de servicio independiente (`/service`).
- **`require-service-role.ts`** → exporta `requireServiceRole(allowedRoles)` y `resolveServiceRoute(role)`. Protege cada ruta del módulo de servicio verificando el rol antes de renderizar. Si el rol no está permitido, redirige automáticamente a la ruta correcta para ese usuario.

## Cómo usar

```ts
import { getCurrentUser, requireCurrentUser } from "@/modules/auth/get-current-user";

// En una página o layout que permite usuarios no autenticados:
const user = await getCurrentUser(); // puede ser null

// En una ruta que requiere autenticación obligatoria:
const user = await requireCurrentUser(); // lanza "UNAUTHENTICATED" si no hay sesión
```

## Estado

Implementado. Pendiente: migrar el layout del dashboard para reemplazar la cookie por `getCurrentUser()`.
