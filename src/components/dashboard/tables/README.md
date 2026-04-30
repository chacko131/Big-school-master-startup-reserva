---
description: Componentes de UI del editor de mesas del dashboard
---

_Fecha de actualización: 2026-04-30_

Esta carpeta agrupa los componentes del editor de mesas del dashboard. La responsabilidad principal aquí es la UI del lienzo, las herramientas, las pestañas y el panel de propiedades.

## Qué ya hicimos (Últimas actualizaciones)

- Se conectó el canvas con las mesas reales del negocio usando persistencia en Prisma, eliminando los mocks.
- **Implementación de Zonas (Plantas)**: Se implementó `FloorPlanTabs` con un flujo para crear y eliminar zonas en la BD a través de Server Actions.
- Se implementó lógica de "Sin Zona" para manejar las mesas que aún no han sido asignadas a una zona.
- **Gestión Visual**: Las mesas ahora tienen propiedades de tamaño dinámico (`width`, `height`), forma (`ROUND`, `SQUARE`, `BAR`) y estado combinable editable en `FloorPlanPropertiesPanel`.
- **Rail de Mesas**: Se logró retirar mesas del lienzo de vuelta a `FloorPlanToolRail` al eliminar sus coordenadas `x` e `y`.
- **Sincronización en tiempo real con servidor**: Usando Server Actions (`saveFloorPlanAction`) con una lógica de actualización defensiva que previene errores de FK (Foreign Key constraint violations) frente a zonas posiblemente inexistentes.
- Las mesas que vienen por defecto de onboarding y no tienen zona son captadas correctamente en la UI.
- Se refactorizó `FloorPlanEditor.tsx` consolidándolo en un orquestador altamente reactivo.

## Próximos pasos (Roadmap propuesto)

1. **Elementos Decorativos**: Añadir muros, barras y plantas en la UI y sincronizarlos (`FloorPlanElement`) enviando la propiedad `elements` en la solicitud del `UpdateFloorPlanUseCase`.
2. **Reorganización en vivo de Zonas**: Drag and drop de mesas entre pestañas (zonas).
3. **Feedback visual mejorado**: Estados de loading más detallados durante el `useTransition` del guardado de zonas y planos.
4. **Validaciones de Superposición**: Prevenir (o alertar visualmente) si una mesa choca con un muro o con otra mesa.

## Nota de arquitectura

La UI debe seguir siendo ligera y predecible. La persistencia no debe vivir dentro de los componentes; debe ir por una capa de dominio o servicios, utilizando optimistically las actualizaciones cuando aplique, pero delegando toda validación dura al servidor.
