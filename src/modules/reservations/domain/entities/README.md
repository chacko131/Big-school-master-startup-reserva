# `reservations/domain/entities`

Contiene las entidades del dominio del módulo `reservations`.

## Qué son aquí

Las entidades representan conceptos como reserva, huésped y asignación con identidad y comportamiento propio.

## Para qué sirven

Sirven para modelar el negocio real del flujo de reservas.

## Qué deben hacer

- conservar sus reglas básicas
- validarse a sí mismas
- ofrecer métodos claros de cambio de estado

## Qué no deben hacer

- hablar con la base de datos
- depender de Prisma
- contener lógica de UI

## Estado actual

La carpeta ya contiene las entidades principales del flujo de reservas.
