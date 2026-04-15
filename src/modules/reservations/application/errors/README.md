# `reservations/application/errors`

Esta carpeta contiene errores propios de la capa de aplicación del módulo de reservas.

## Qué son aquí

Son errores del flujo de trabajo, no de la regla pura del dominio.

## Para qué sirven

Se usan cuando un caso de uso no puede completar una operación, por ejemplo:

- no existe una reserva
- una acción no puede terminar por el estado actual
- falta información para continuar el flujo

## Qué no deben hacer

- no deben representar reglas puras del negocio
- no deben depender de Prisma
- no deben saber nada de la UI

## Estado actual

La carpeta ya está preparada y contiene los primeros errores de aplicación.
