---
description: Componentes de UI para el detalle específico de un restaurante tenant
---

_Fecha de actualización: 2026-05-01_

# Componentes de Admin - Detalle de Restaurante (ID)

Esta carpeta agrupa los componentes de UI que se utilizan exclusivamente en la pantalla de detalle de un restaurante específico (`/admin/restaurants/[restaurantId]`) en la plataforma SaaS.

## Responsabilidad

Al igual que el resto de componentes visuales, su función es estrictamente de presentación (UI). Muestran el detalle operativo, estado y configuración de un tenant particular en un formato legible para el Super Admin. 

## Estructura

- `RestaurantDetailMetricCard.tsx`: Tarjetas de métricas individuales que aplican a las características de un solo tenant (ej. estado de suscripción, riesgo).
- `RestaurantActivityRail.tsx`: Carril lateral para mostrar la línea de tiempo de la actividad o los eventos recientes de un tenant.
