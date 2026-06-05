# /dashboard/service

Panel de servicio en tiempo real para el personal del restaurante.

## Rutas

- `/dashboard/service` — landing con visión general de mesas y su estado
- `/dashboard/service/pos` — POS camarero: abrir orden, añadir platos, enviar a cocina
- `/dashboard/service/kds` — KDS cocina/bar: cola de ítems por estación

## Permisos

Visible para todos los roles: RESTAURANT_OWNER, MANAGER, STAFF_WAITER, STAFF_KITCHEN, STAFF_BAR.
La vista concreta dentro de cada subruta puede filtrar por rol.

## Archivos

- `actions.ts` — server actions: fetchServiceOverview, createOrderAction, addItemsToOrderAction, submitOrderAction
- `page.tsx` — landing con grid de mesas y estado de órdenes activas
