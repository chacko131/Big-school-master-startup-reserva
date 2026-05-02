# `catalog/application/ports`

Contiene los puertos del módulo `catalog`.

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

La carpeta está lista para las interfaces del módulo.

---
**Fecha y hora:** 02/05/2026 13:55:13
**Cambios:**
- Creación de `business-hours-repository.port.ts`: Contrato para la persistencia de horarios de apertura.
- Creación de `menu-repository.port.ts`: Contrato para la persistencia de la carta (categorías y platos).

