# `reservations/domain/errors`

Contiene los errores de dominio del módulo `reservations`.

## Qué son aquí

Son errores de negocio claros para reglas como disponibilidad, cancelación o no-show.

## Para qué sirven

Por ejemplo, si:

- una reserva tiene fechas invertidas
- el tamaño del grupo es inválido
- una mesa asignada no cumple la regla

entonces el dominio lanza un error explícito y fácil de entender.

## Por qué son importantes

- hacen el fallo más legible
- ayudan a testear mejor
- permiten tratar cada problema con precisión

## Estado actual

La carpeta ya está preparada y algunas validaciones del dominio usan estos errores.
