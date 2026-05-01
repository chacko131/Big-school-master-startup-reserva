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

---

## Estado final del módulo — 2026-05-01

Esta sección documenta el estado del módulo `tables` tal como quedó cerrada su primera fase de desarrollo. El módulo pasa build de producción limpio sin errores de TypeScript.

### Inventario de archivos activos

| Archivo                            | Responsabilidad                                                                                                                                                           |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `FloorPlanEditor.tsx`              | Orquestador principal. Gestiona todo el estado del editor (mesas, elementos, zonas, selección, notificaciones, guardado).                                                 |
| `FloorPlanCanvas.tsx`              | Renderizado visual del plano con Konva. Drag & drop de mesas y elementos decorativos. 3 cards de stats reales debajo del canvas.                                          |
| `FloorPlanPropertiesPanel.tsx`     | Panel lateral derecho. Edita propiedades de la mesa/elemento seleccionado con scroll interno. Botones de guardar y eliminar conectados a notificaciones.                  |
| `FloorPlanToolRail.tsx`            | Rail lateral izquierdo. Bandeja de mesas sin colocar y selector de herramientas decorativas.                                                                              |
| `FloorPlanTablesRail.tsx`          | Lista de mesas disponibles para arrastrar al canvas desde el rail izquierdo.                                                                                              |
| `FloorPlanDecorationsRail.tsx`     | Elementos decorativos arrastrables (muro horizontal, muro vertical, planta).                                                                                              |
| `FloorPlanTabs.tsx`                | Navegación entre zonas (plantas del restaurante). Crear y eliminar zonas.                                                                                                 |
| `FloorPlanHero.tsx`                | Encabezado de la página con botón "Guardar cambios" conectado al estado del editor.                                                                                       |
| `FloorPlanAuditLogPlaceholder.tsx` | Placeholder visual (TODO) para el historial de cambios del plano. Se activará cuando el sistema de reservas y usuarios esté operativo.                                    |
| `floorPlanMocks.ts`                | Únicamente tipos e interfaces de dominio UI (`FloorPlanTable`, `DiningTableLayoutDefinition`, `FloorPlanToolDefinition`, `floorPlanToolDefinitions`). **Sin datos mock.** |
| `floorPlanStyles.ts`               | Funciones puras de estilo: `getFloorPlanToolKindClassName`, `getPropertyIndicatorClassName`, `getTableSizeLabel`.                                                         |

### Archivos eliminados (deuda técnica saldada)

- `FloorPlanInsights.tsx` — Contenía "Estado del plano", "Cambios recientes" y grid de tarjetas de mesas, todos con datos hardcodeados. Eliminado.
- `FloorPlanWorkspace.tsx` — Re-exportaba `FloorPlanEditor` sin añadir nada. Sin consumidor activo. Eliminado.
- `diningTableLayoutDefinitions`, `floorPlanInsightDefinitions`, `floorPlanChangeDefinitions`, `selectedTableIdMock` — Datos mock estáticos eliminados de `floorPlanMocks.ts`.
- `getDiningTableStatusClassName`, `getDiningTableShapeClassName` — Funciones de estilo sin consumidor activo eliminadas de `floorPlanStyles.ts`.

### Qué funciona a fecha de hoy

- ✅ Drag & drop de mesas desde el rail al canvas con persistencia en BD.
- ✅ Drag & drop de elementos decorativos (muros horizontal/vertical, planta) con persistencia en BD.
- ✅ Edición de propiedades de mesa (nombre, capacidad, forma, tamaño, combinable, activa/inactiva).
- ✅ Eliminación de mesas con confirmación visual vía `NotificationBanner`.
- ✅ Guardado global del plano desde el Hero y desde el panel de propiedades.
- ✅ Gestión de zonas (crear / eliminar / cambiar entre zonas).
- ✅ Stats reales debajo del canvas (mesas activas, capacidad total, combinables).
- ✅ Visibilidad inteligente de textos en el canvas según tamaño de la mesa (evita desbordamiento).
- ✅ Scroll interno en el panel de propiedades sin truncar elementos.

### Pendiente (TODO)

- 🔲 **Audit log**: Historial de cambios (quién movió qué y cuándo). Requiere sistema de usuarios y reservas. Ver `FloorPlanAuditLogPlaceholder.tsx`.
- 🔲 **Estado de disponibilidad en canvas**: Conectar el color/estado de cada mesa al sistema de reservas activo. Actualmente el status es siempre "activo/inactivo" sin información en tiempo real.
- 🔲 **Validación de superposición**: Detectar y alertar cuando una mesa colisiona con otra o con un elemento decorativo.
