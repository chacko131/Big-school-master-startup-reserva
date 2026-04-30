# `catalog/application`

_Fecha de actualización: 2026-04-30_

Esta carpeta organiza las acciones y casos de uso principales del módulo `catalog`.

## Qué hace esta capa

Aquí no se definen reglas puras del negocio, sino el **proceso** para ejecutar una acción. Gestiona la coordinación entre la UI/API y la infraestructura para preservar las reglas del dominio de catálogo y mesas.

## Qué vivirá aquí

- **casos de uso**: La lógica orquestadora (`AddDiningTable`, `CreateZone`, `DeleteZone`, `UpdateFloorPlanUseCase`, `EnsureDefaultZone`, etc.).
- **puertos**: Interfaces que la infraestructura implementará (repositorios para `DiningTable`, `FloorPlanElement`, `RestaurantZone`).
- **DTOs**: Tipos que entran y salen de los casos de uso.

## Qué ya hicimos (Última actualización)

- Implementamos la **gestión de Zonas** mediante casos de uso: crear (`CreateZone`), listar (`GetZonesByRestaurant`) y eliminar zonas (`DeleteZone`).
- Añadimos protección y migraciones automáticas (`EnsureDefaultZone`) para que, al acceder por primera vez al dashboard, el restaurante tenga garantizada su zona "Salón principal" y las mesas huérfanas se asignen ahí.
- Se consolidó la lógica de actualizar el editor completo (`UpdateFloorPlanUseCase`), permitiendo actualizar mesas y decoraciones con `deleteMissingByRestaurantId` para evitar dejar basura en BD.
- Ajustamos los guardados de mesas (`AddDiningTable`) a través del onboarding con validación idempotente.

## Ejemplo mental

1. El Server Action recibe un submit de la interfaz.
2. Construye el DTO y llama al `Execute` del caso de uso.
3. El caso de uso consulta un repositorio, modifica las entidades mediante reglas de dominio, y usa el puerto del repositorio para guardar en Prisma.

## Estado actual

La arquitectura cuenta con la base estructural lista para escalar con nuevos elementos de sala (plantas, barras, sillas) y mantiene defensivamente las relaciones de FK con zonas y restaurantes.
