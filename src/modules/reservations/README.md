# `reservations`

Este módulo contiene el corazón funcional de la aplicación: el flujo de reservas.

## Qué resuelve

Aquí vive todo lo relacionado con:

- huéspedes
- reservas
- estados de reserva
- asignación de mesas
- cancelaciones
- confirmaciones

## Cómo fluye el trabajo aquí

1. `domain` define las reglas puras del negocio.
2. `application` orquesta los casos de uso.
3. `infrastructure` conecta la lógica con Prisma y la base de datos.
4. `schemas` valida la información que llega desde fuera.

## Qué tipo de cosas irán aquí

- crear reservas
- consultar una reserva
- cancelar una reserva
- confirmar una reserva
- asignar mesas
- registrar ausencias de huéspedes

## Por qué existe como módulo separado

Porque la reserva es una parte central del negocio y no debe mezclarse con la configuración operativa del restaurante.

## Estado actual

La estructura ya está preparada y el dominio base está modelado; ahora se está construyendo la capa de aplicación.
