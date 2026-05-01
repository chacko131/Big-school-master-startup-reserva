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

## Actualización 2026-05-01 (Tarde)

- **StatusToggle.tsx**: Implementación de un switch visual premium para gestionar el estado `isActive`.
- **RestaurantTenantRow.tsx**: Refactorizado para usar datos reales, layout de contacto mejorado (email/teléfono en líneas separadas) y soporte de toggles.
- **RestaurantTasksRail.tsx**: Evolucionado a un panel de Roadmap (TODO) para visibilizar futuras implementaciones de alertas de onboarding y salud del tenant.
- **RestaurantMetricCard.tsx**: Conectado a la lógica real de conteo dinámico de tenants.

