# `catalog/domain/errors`

Contiene los errores de dominio del módulo `catalog`.

## Qué son aquí

Son errores explícitos del negocio que ayudan a entender por qué una regla no se pudo cumplir.

## Para qué sirven

Por ejemplo, si:

- un nombre está vacío
- una mesa tiene capacidad inválida
- una configuración de reservas no es coherente

entonces el dominio puede lanzar un error claro y específico.

## Por qué son mejores que un `Error` genérico

- hacen el fallo más legible
- ayudan a testear mejor
- permiten tratar cada problema con precisión

## Estado actual

La carpeta ya está preparada y algunas validaciones del dominio usan estos errores.
