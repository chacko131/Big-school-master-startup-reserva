# `sign-in`

Ruta pública de autenticación con Clerk.

## Responsabilidad

Renderizar el formulario real de login de Clerk para staff, dueños y administradores del SaaS.

## Estructura

Usa catch-all route `[[...rest]]/page.tsx` requerida por Clerk para su routing interno.

## Estado

Implementado. Usa el componente `<SignIn />` de `@clerk/nextjs`. Tras login redirige a `/dashboard`.
