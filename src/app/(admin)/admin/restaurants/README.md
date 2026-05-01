# `restaurants`

Sección del panel SaaS para administrar restaurantes tenants.

## Responsabilidad

Listar, auditar y supervisar los restaurantes de la plataforma.

## Datos previstos

- restaurante
- estado
- plan
- actividad reciente

## Log de cambios (2026-05-01)

- **Integración Real**: Conexión de la vista con `ListRestaurantsUseCase` para eliminar mocks y mostrar datos de producción.
- **Acciones de Servidor**: Implementación de `toggleRestaurantStatusAction` para persistir cambios de estado `isActive` directamente desde la tabla.
- **Métricas Dinámicas**: Sincronización de las tarjetas superiores con el conteo real de la base de datos.
- **Planificación de Onboarding**: Documentación visual de la lógica diferida para Auth/Billing (los restaurantes nacerán inactivos hasta completar el pago/registro).
- **Ficha de Restaurante (Vista Detalle)**: Se eliminaron los componentes visuales obsoletos (`RestaurantDetailMetricCard`) y se conectó el panel de "Contexto Operativo" con la BD mediante `GetRestaurantAdminDetailsUseCase`. Ahora muestra reglas de negocio reales (Aprobación, Ventana de Cancelación, Mesas).

