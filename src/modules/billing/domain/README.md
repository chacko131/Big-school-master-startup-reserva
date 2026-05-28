# Capa de Dominio: Billing

Esta carpeta contiene el núcleo de lógica de negocio pura para el módulo de facturación y planes SaaS.

## Responsabilidades
- **Entidades (`entities/`)**: Modelar el estado de la suscripción (`Subscription`) y sus límites de negocio de forma pura y robusta.
- **Puertos (`ports/`)**: Definir las interfaces requeridas para interactuar con la base de datos (`SubscriptionRepository`) y con pasarelas externas como Stripe (`BillingService`).
- **Errores (`errors/`)**: Centralizar excepciones de dominio relativas a la facturación y suscripciones.
