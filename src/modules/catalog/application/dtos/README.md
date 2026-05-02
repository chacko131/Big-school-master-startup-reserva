# `catalog/application/dtos`

Contiene los DTOs del módulo `catalog`.

## Responsabilidad

Estandarizar la forma de entrada y salida de los casos de uso del catálogo.

## Qué son aquí

Son los objetos que definen **qué datos llegan** a un caso de uso o **qué datos devuelve**.

No contienen lógica de negocio; solo ayudan a que los contratos sean claros y tipados.

## Ejemplos

- datos para crear un restaurante
- datos para actualizar una mesa
- datos para modificar la configuración operativa

## Por qué son útiles

- hacen más legible la intención del caso de uso
- evitan pasar objetos ambiguos por toda la aplicación
- ayudan a validar mejor la entrada

## Estado actual

La carpeta está lista para definir los contratos de datos del catálogo.

---
**Fecha y hora:** 02/05/2026 15:50
**Cambios:**
- Actualización de `update-restaurant-profile.dto.ts` para recibir objetos `RestaurantImage` (con `url` y `publicId`) en lugar de strings planos para las fotos hero y de la galería.
