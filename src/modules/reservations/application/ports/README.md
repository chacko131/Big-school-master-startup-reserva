# `reservations/application/ports`

Contiene los puertos del módulo `reservations`.

## Qué son los puertos

Son contratos o interfaces que dicen qué necesita un caso de uso para trabajar con el exterior.

No dicen cómo se implementa eso, solo qué operaciones espera la capa de aplicación.

## Qué hacen aquí

Definen la forma en la que `application` habla con:

- repositorios
- servicios externos
- adaptadores técnicos

## Ejemplo mental

- `application` pide `findById`
- `infrastructure` responde usando Prisma
- `domain` sigue sin enterarse de Prisma

## Por qué son importantes

- desacoplan la lógica del negocio de la tecnología
- facilitan los tests
- permiten cambiar de base de datos o adaptador sin reescribir los casos de uso

## Estado actual

La carpeta está preparada para las interfaces del módulo.
