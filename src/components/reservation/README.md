# `components/reservation`

Componentes reutilizables del módulo de reservas para el dashboard.

## Qué contiene

- **ReservationMetricCard** — tarjeta de métrica (reservas hoy, ocupación, no-shows, etc.)
- **ReservationsToolbar** — barra de filtros (fecha, estado, mesa)
- **ReservationsLedger** — tabla principal de reservas con paginación
- **ReservationsPacingPanel** — gráfico de barras de ritmo de servicio
- **ReservationsOccupancyPanel** — resumen de ocupación activa por zonas
- **ReservationsAlertStack** — alertas operativas del turno

## Uso

Estos componentes se usan en `/dashboard/reservations` y potencialmente en `/dashboard/schedule`.
Reciben datos vía props — no hacen fetch ni acceden a la base de datos directamente.

## Estado actual

Componentes extraídos de `page.tsx` monolítico. Aún consumen datos estáticos, pendiente conectar a use cases reales.

---

## Changelog

### 2026-05-05 21:40 (UTC+02:00)

- Extracción inicial de 6 componentes desde `dashboard/reservations/page.tsx`.
- Todos reciben datos por props (presentacionales puros).
