# `reservations/domain`

Esta carpeta contiene el dominio del módulo `reservations`.

## Qué hace esta capa

Aquí definimos el concepto de reserva, huésped, estados y reglas de negocio sin depender de la UI ni de la infraestructura.

## Qué vivirá aquí

- entidades del dominio
- reglas de disponibilidad
- estados de reserva
- invariantes del negocio
- errores de dominio

## Ejemplos de reglas que pueden vivir aquí

- una reserva no puede tener fechas invertidas
- una mesa asignada debe ser válida
- un grupo debe tener un tamaño lógico
- un huésped debe tener datos mínimos correctos

## Por qué es importante

Porque el dominio protege el negocio aunque cambie la UI, la base de datos o la tecnología.

## Estado actual

La carpeta ya contiene el dominio base y sigue lista para seguir creciendo con reglas más finas.
