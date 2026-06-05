# Módulo: service

Orquestación del servicio en sala: gestión de órdenes por mesa (POS camarero), colas de preparación por estación (KDS cocina/bar), costeo privado de platos (backoffice dueño/manager) y analítica de ventas y márgenes.

## Responsabilidades

- **domain/**: Entidades de negocio (`Order`, `OrderItem`, `MenuItemCosting`), enums de estado y puertos de repositorio.
- **application/use-cases/**: Casos de uso por actor:
  - Camarero: `CreateOrder`, `AddItemsToOrder`, `SubmitOrder`, `MarkItemServed`, `CloseOrder`.
  - Cocina/Bar: `PickItemForPrep`, `MarkItemReady`.
  - Dueño/Manager: `UpsertMenuItemCosting`, `GetDailySales`, `GetProfitByMenuItem`, `GetStaffPerformance`, `GetTablePerformance`.
- **infrastructure/repositories/**: Adaptadores Prisma de los puertos + publicador Novu.

## Reglas de dominio clave

1. No se puede abrir un pedido si el ítem activo no tiene `MenuItemCosting` configurado (costo + precio + área).
2. Los precios se copian (snapshot) en `OrderItem` al crear el pedido; cambiar el maestro de costos no altera el histórico.
3. Solo usuarios con Plan Pro pueden acceder a costing y analítica.
4. Los cambios de estado de `OrderItem` son unidireccionales: `QUEUED → PREPARING → READY → SERVED`.

## Dependencias de otros módulos

- `catalog/`: `MenuItem`, `DiningTable`, `MenuCategory` (solo lectura).
- `users/`: RBAC por `MembershipRole` y `GlobalRole`.
- `billing/`: Gating Pro en server actions y vistas.
- `notifications/`: Publicador Novu para notificaciones a cocina/bar y camareros.
