# `sign-up`

Ruta pública de registro con Clerk.

## Responsabilidad

Renderizar el formulario real de registro de Clerk para el alta de nuevos restaurantes en la plataforma.

## Estructura

Usa catch-all route `[[...rest]]/page.tsx` requerida por Clerk para su routing interno.

## Estado

Implementado. Usa el componente `<SignUp />` de `@clerk/nextjs`. Tras registro redirige a `/onboarding/restaurant`.
