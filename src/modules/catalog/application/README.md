# `catalog/application`

Esta carpeta organiza las acciones del módulo `catalog`.

## Qué hace esta capa

Aquí no se definen reglas puras del negocio, sino el **proceso** para ejecutar una acción.

Por ejemplo:

- crear un restaurante
- actualizar la configuración de reservas
- activar o desactivar una mesa

## Qué vivirá aquí

- casos de uso
- puertos
- DTOs
- coordinación de reglas del negocio

## Ejemplo mental

- la UI o la API envían datos
- el caso de uso los recibe
- el dominio valida las reglas
- la infraestructura persiste la información

## Por qué existe esta capa

Porque permite separar el “qué quiero hacer” del “cómo lo guardo” y del “cómo lo muestro”.

## Estado actual

La carpeta ya está preparada para empezar a construir los primeros flujos del catálogo.
