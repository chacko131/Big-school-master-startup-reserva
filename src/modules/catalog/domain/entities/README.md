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
