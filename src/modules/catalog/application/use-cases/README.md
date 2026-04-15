# `catalog/application/use-cases`

Contiene los casos de uso del módulo `catalog`.

## Qué hacen los casos de uso

Son las piezas que responden a la pregunta:

> ¿Qué quiere hacer el sistema?

No describen la base de datos ni la UI. Describen acciones de negocio.

## Para qué sirven aquí

Orquestan cosas como:

- crear un restaurante
- actualizar la configuración operativa
- activar o desactivar una mesa

## Cómo trabajan

- reciben un DTO
- usan las entidades del dominio
- llaman a puertos para guardar o leer datos
- devuelven un resultado claro

## Por qué son importantes

Porque mantienen la lógica del proceso separada de la lógica pura del dominio.
Así el negocio queda más fácil de mantener y de testear.

## Estado actual

La carpeta está preparada para los primeros casos de uso iniciales del catálogo.
