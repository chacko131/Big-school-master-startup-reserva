# Caso de Uso: ChangeSubscriptionPlan

Esta carpeta sirve para albergar la lógica del caso de uso `ChangeSubscriptionPlan`.

## Propósito
Este caso de uso permite cambiar el plan de suscripción de un restaurante (Upgrade/Downgrade) de manera directa desde la interfaz del dashboard, en lugar de forzar al usuario a entrar al Portal de Clientes de Stripe. 

## Responsabilidades
- Validar que el restaurante cuente con una suscripción registrada en Stripe (`stripeSubscriptionId`).
- Resolver los IDs de precio correctos según las variables de entorno (`STRIPE_BASIC_PRICE_ID` y `STRIPE_PRO_PRICE_ID`).
- Invocar al adaptador de Stripe para actualizar la suscripción con prorrateo de cobro inmediato.
- Actualizar el estado de la suscripción local de inmediato con el nuevo plan y precio.
