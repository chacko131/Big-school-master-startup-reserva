# floor — Componentes de la vista de sala del mesero

Componentes de presentación para `/service/floor`.
Permiten al mesero ver el estado de todas las mesas, abrir órdenes, añadir ítems,
enviarlas a cocina y cerrar mesas.

## Archivos

- **`FloorMetrics.tsx`** → Barra de 5 métricas operativas calculadas a partir de las mesas (libres, activas, comandas cocina, comandas barra, platos listos).
- **`FloorFilterBar.tsx`** → Tabs del mesero (Todas, Libres, Con orden, Platos listos). Client component.
- **`FloorStatusBadge.tsx`** → Badge de color del estado de una mesa (Libre / Orden abierta / En cocina).
- **`FloorTableCard.tsx`** → Tarjeta individual de una mesa con estado, capacidad, pax, tiempo y badge de platos listos.
- **`FloorTableGrid.tsx`** → Grid de tarjetas. Abre el panel lateral al pulsar una mesa.
- **`FloorOrderPanel.tsx`** → Panel lateral deslizante (slide-over) para gestionar la orden de una mesa.
- **`FloorMenuBook.tsx`** → Carta de ítems organizada por categorías con buscador y selector de cantidades. Reutilizable dentro del panel.

## Flujo de mesa
Libre → (Abrir mesa) → OPEN → (Añadir ítems + Enviar) → SUBMITTED → (Cerrar mesa) → CLOSED
