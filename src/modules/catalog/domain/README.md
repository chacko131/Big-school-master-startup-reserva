# `catalog/domain`

Esta carpeta contiene el corazón de negocio del módulo `catalog`.

## Qué hace esta capa

Aquí definimos qué es un restaurante, qué es una mesa y qué reglas operativas deben cumplirse.

La idea es que esta capa no sepa nada de Prisma, Next.js, controladores ni base de datos.

## Qué vivirá aquí

- entidades del restaurante
- reglas de configuración operativa
- invariantes del negocio
- errores de dominio

## Ejemplos de reglas que pueden vivir aquí

- un nombre no puede estar vacío
- una mesa debe tener capacidad válida
- la configuración de reservas debe usar valores coherentes

## Por qué es importante

Porque si la regla está en el dominio, la protege todo el sistema.
No importa si la acción viene desde la UI, un test o una futura API móvil: la regla sigue siendo la misma.

## Estado actual

Esta carpeta ya contiene entidades del dominio y sigue siendo el lugar donde se concentran las reglas puras del catálogo.
