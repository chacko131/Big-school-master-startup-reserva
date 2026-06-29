# layout — Headers del módulo de servicio

Componentes del header del módulo de servicio independiente.
El layout raíz (`/service/layout.tsx`) decide cuál mostrar según el rol.

## Archivos

- **`ServiceClock.tsx`** → Reloj HH:MM en vivo (client). Usado en ambos headers.
- **`ServiceViewSwitcher.tsx`** → Tabs Sala/Cocina/Barra (client). Solo para Manager/Owner.
- **`ServiceManagerHeader.tsx`** → Header completo para RESTAURANT_OWNER y MANAGER. Incluye logo, switcher, reloj y vuelta al dashboard.
- **`ServiceStaffHeader.tsx`** → Header minimalista para STAFF_WAITER, STAFF_KITCHEN y STAFF_BAR. Solo área y reloj.

## Regla
Solo el Manager y el Owner ven el `ServiceViewSwitcher`.
El staff solo ve su área — no puede navegar a otras vistas.
