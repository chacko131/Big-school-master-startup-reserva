# admin/subscriptions

Esta carpeta contiene componentes de interfaz para la vista de suscripciones del panel de administración.

## Responsabilidad

- Presentar métricas, paneles y mensajes de estado de billing.
- Mantener la UI separada de cualquier lógica de negocio o acceso a datos.
- Servir como punto de reutilización para futuras pantallas administrativas relacionadas con suscripciones.

## Importante

No debe contener lógica de backend, consultas Prisma ni server actions.
Los datos que aún no existen en servidor deben mostrarse como `TODO` en la interfaz.
