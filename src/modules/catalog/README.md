# `catalog`

Este módulo contiene la parte operativa del restaurante.

## Qué resuelve

Aquí vive todo lo que ayuda a configurar cómo funciona un restaurante por dentro:

- datos del restaurante
- mesas
- ajustes de reservas

## Cómo fluye el trabajo aquí

1. `domain` define las reglas puras del negocio.
2. `application` organiza los casos de uso.
3. `infrastructure` conecta esas reglas con Prisma, Neon u otros servicios.
4. `schemas` valida entradas externas con Zod.

## Qué tipo de cosas irán aquí

- crear o actualizar restaurantes
- activar o desactivar mesas
- cambiar la configuración de reservas
- consultar datos operativos del restaurante

## Por qué existe como módulo separado

Porque el catálogo tiene reglas propias y merece vivir aislado de la lógica de reservas.
Así evitamos mezclar conceptos y hacemos más fácil mantener el sistema.

## Estado actual

La base del módulo ya está creada y se está modelando poco a poco con una estructura limpia.

---
**Fecha y hora:** 02/05/2026 13:55:13
**Cambios:**
- Implementación completa de la infraestructura para el perfil público del restaurante.
- Añadido soporte para Horarios de Apertura y Carta del Menú (Categorías y Platos).
- Preparado para servir datos dinámicos a la vista pública del cliente.

---
**Fecha y hora:** 05/05/2026 16:10
**Cambios:**
- **menu-item.entity.ts**: Añadido campo `imagePublicId` a `MenuItemPrimitives` y `CreateMenuItemProps`.
- **prisma-menu.repository.ts**: Mapping de `imagePublicId` en mapper, create y update.
- **add-menu-item.dto.ts / update-menu-item.dto.ts**: Añadido `imagePublicId` a ambos DTOs.
- **add-menu-item.use-case.ts / update-menu-item.use-case.ts**: Propagación de `imagePublicId`.
- **get-restaurant-public-profile.use-case.test.ts**: Corrección de mocks para nuevos métodos del repositorio.
- **always-allowed-feature-gate.ts**: Supresión de lint warning `@typescript-eslint/no-unused-vars`.
