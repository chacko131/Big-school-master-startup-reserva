# Puertos de Dominio: Billing

Esta carpeta define las interfaces (puertos) que actúan como contratos de frontera entre las reglas de negocio del módulo y sus implementaciones técnicas concretas.

## Puertos
- **`SubscriptionRepository`**: Interfaz para operaciones CRUD sobre la suscripción en base de datos.
- **`BillingService`**: Interfaz para comunicación con el proveedor de pagos (Stripe).
