# `src/modules`

Aquí viven los módulos funcionales de la aplicación, organizados por **bounded context**.

## Qué significa esto

Cada módulo representa una parte del negocio con sus propias reglas, sus propios casos de uso y su propia infraestructura.

La idea no es juntar todo en una sola carpeta grande, sino separar el negocio por responsabilidades para que sea más fácil de leer, probar y ampliar.

## Cómo se lee esta estructura

- `catalog` contiene la parte operativa del restaurante.
- `reservations` contiene el flujo de reservas y huéspedes.

Cada módulo repite la misma idea interna:

- `domain`
- `application`
- `infrastructure`
- `schemas`

## Qué ganas con esta organización

- más claridad mental
- menos acoplamiento
- tests más simples
- cambios más localizados
- posibilidad de crecer sin romper todo el proyecto

## Estado actual

En esta fase ya están preparados `catalog` y `reservations`, y cada uno va avanzando capa por capa.
