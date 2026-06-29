# service — Componentes de analíticas de servicio

Componentes de presentación para la página `/dashboard/analytics/service`.

## Archivos

- **`ServiceAnalyticsPeriodToolbar.tsx`** → Selector Hoy/Semana/Mes. Client component que escribe en la URL para que el Server Component recargue los datos.
- **`ServiceAnalyticsKpiGrid.tsx`** → Fila de 5 tarjetas KPI (revenue, costo, margen, órdenes, ticket promedio).
- **`ServiceAnalyticsChartPanel.tsx`** → Columna izquierda: gráfico de barras de revenue por hora + tabla top 10 platos.
- **`ServiceAnalyticsInsightPanel.tsx`** → Columna derecha: plato estrella, hora pico y heatmap de intensidad por hora.

## Patrón
Todos reciben datos como props desde el Server Component. Sin fetch propio, sin estado de servidor.
