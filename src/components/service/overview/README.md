# overview — Componentes de la vista de control total

Componentes de presentación para `/service/overview`.
Exclusivo para RESTAURANT_OWNER y MANAGER.
Muestra el estado global del turno: métricas, plano de sala, cola de cocina y barra.

## Archivos

- **`OverviewMetricBar.tsx`** → Fila de 5 KPIs operativos del turno (mesas libres, órdenes activas, cocina, barra, platos listos).
- **`OverviewFloorPlan.tsx`** → Grid de mesas en modo supervisión (read-only, sin panel lateral). Muestra estado visual de cada mesa.
- **`OverviewTableCard.tsx`** → Tarjeta de mesa simplificada para la vista del manager (sin acciones de mesero).
- **`OverviewKdsSummary.tsx`** → Resumen compacto de la cola de cocina y barra con contadores de ítems QUEUED/PREPARING.

## Diferencia con FloorTableGrid
El overview es read-only para el manager: ve el estado sin poder abrir/cerrar órdenes.
Las acciones operativas siguen siendo de los meseros desde /service/floor.
