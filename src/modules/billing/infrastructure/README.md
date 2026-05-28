# Capa de Infraestructura: Billing

Esta carpeta contiene las implementaciones técnicas concretas de los puertos de dominio para base de datos (Prisma) e integraciones externas (Stripe).

## Componentes
- **`repositories/prisma-subscription.repository.ts`**: Implementa `SubscriptionRepository` interactuando con la base de datos de Neon a través del Prisma Client generado.
- **`src/services/stripe.service.ts`**: Implementa `BillingService` envolviendo las llamadas HTTP y de SDK de Stripe.
- **`billing-infrastructure.ts`**: Contiene la factory para resolver y ensamblar las dependencias del módulo.
