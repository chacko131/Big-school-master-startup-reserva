# `catalog/application/errors`

Esta carpeta contiene errores propios de la capa de aplicación del módulo `catalog`.

## Qué son aquí

Son errores del flujo de trabajo, no de la regla pura del dominio.

## Para qué sirven

Se usan cuando un caso de uso no puede completar una operación, por ejemplo:

- no existe un restaurante
- no existe una configuración operativa
- no se puede continuar un flujo por falta de contexto

## Qué no deben hacer

- no deben representar reglas puras del negocio
- no deben depender de Prisma
- no deben saber nada de la UI
