# `catalog/domain/entities`

Contiene las entidades del dominio del módulo `catalog`.

## Qué son aquí

Las entidades representan los conceptos centrales del catálogo con identidad propia y comportamiento de negocio.

## Para qué sirven

Sirven para modelar cosas como:

- restaurante
- mesa
- configuración operativa

## Qué deben hacer

- conservar sus reglas básicas
- validarse a sí mismas
- ofrecer métodos claros de cambio de estado

## Qué no deben hacer

- hablar con la base de datos
- depender de Prisma
- contener lógica de UI

## Estado actual

La carpeta ya contiene las primeras entidades del catálogo y seguirá creciendo con el mismo estilo.

---
**Fecha y hora:** 02/05/2026 13:55:13
**Cambios:**
- Ampliación de `restaurant.entity.ts` con campos de perfil público (dirección, fotos, cocina, etc.).
- Creación de `business-hours.entity.ts` para gestionar horarios de apertura.
- Creación de `menu-category.entity.ts` y `menu-item.entity.ts` para modelar la carta del restaurante.
- Añadidos tests unitarios: `business-hours.entity.test.ts` y `menu-item.entity.test.ts`.

