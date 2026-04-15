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
