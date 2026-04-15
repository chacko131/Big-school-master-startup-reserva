# `reservations/application`

Esta carpeta organiza las acciones del flujo de reservas.

## Qué hace esta capa

Aquí no se definen reglas puras del negocio, sino el proceso para ejecutar una acción concreta.

## Qué vivirá aquí

- casos de uso
- puertos
- DTOs
- orquestación de flujos críticos

## Ejemplos de acciones

- crear una reserva
- cancelar una reserva
- confirmar una reserva
- consultar una reserva
- asignar mesas

## Ejemplo mental

- la UI o la API llaman al caso de uso
- el caso de uso usa el dominio
- el caso de uso habla con puertos
- la infraestructura implementa esos puertos con Prisma

## Por qué existe esta capa

Porque separa el “qué hacer” del “cómo hacerlo técnicamente”.

## Estado actual

La carpeta ya está lista y el módulo comenzó a llenarse con los primeros flujos.
