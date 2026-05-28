# Capa de Aplicación: Billing

Esta carpeta contiene los casos de uso (orquestación y flujos de negocio) del módulo de facturación.

## Casos de Uso
- **`StartTrialSubscription`**: Inicializa la suscripción de prueba gratuita de 60 días sin tarjeta para un restaurante en el onboarding.
- **`CreateCheckoutSession`**: Inicia el flujo de Stripe Checkout para comprar planes Basic/Pro.
- **`CreateCustomerPortalSession`**: Crea el portal de Stripe para la gestión de métodos de pago y facturas.
- **`SyncStripeWebhook`**: Sincroniza eventos asíncronos recibidos desde el webhook de Stripe.
- **`GetCurrentPlanForRestaurant`**: Obtiene el plan y estado activo de facturación del restaurante para la UI.
- **`GetBillingHistoryForRestaurant`**: Obtiene el historial de facturación del restaurante para mostrar facturas y cargos pasados.
