# kds — Componentes del Kitchen Display System

Componentes de presentación para las vistas `/service/kds/kitchen` y `/service/kds/bar`.
Fondo negro total, scroll horizontal de comandas, modo urgente en rojo.

## Archivos

- **`KdsAutoRefresh.tsx`** → Client component que llama a `router.refresh()` cada 30 segundos para mantener los datos actualizados sin websockets.
- **`KdsOrderCard.tsx`** → Tarjeta de una comanda completa. Calcula tiempo transcurrido y activa modo urgente (>15 min) con borde rojo pulsante.
- **`KdsOrderItem.tsx`** → Fila de un ítem dentro de la comanda. Muestra estado (QUEUED/PREPARING) y botones de acción via form actions (sin JS requerido).

## Flujo de estados
QUEUED → (botón "Tomar") → PREPARING → (botón "Listo") → READY
