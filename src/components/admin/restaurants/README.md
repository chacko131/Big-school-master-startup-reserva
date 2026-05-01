---
description: Componentes de UI para la gestión de restaurantes en el panel SaaS
---

_Fecha de actualización: 2026-05-01_

# Componentes de Admin - Restaurantes

Esta carpeta contiene los componentes de UI reutilizables y específicos para la vista principal de gestión de restaurantes (tenants) dentro de la superficie `(admin)` de Reserva Latina.

## Responsabilidad

La responsabilidad de estos componentes es puramente presentacional. Reciben datos (como definiciones o mocks actuales) y los renderizan en la interfaz del listado general de tenants. No deben contener lógica de persistencia ni acceso directo a base de datos.

## Estructura

- `RestaurantMetricCard.tsx`: Muestra métricas agregadas del estado general de todos los tenants (ej. activos, en onboarding).
- `RestaurantTasksRail.tsx`: Carril lateral para mostrar recordatorios o acciones operativas del día para el administrador de la plataforma.
- `RestaurantTenantRow.tsx`: Fila individual para renderizar el resumen de un restaurante en la tabla/lista principal.
- `id/`: Subcarpeta que contiene componentes específicos para la vista de detalle de un restaurante en particular.
