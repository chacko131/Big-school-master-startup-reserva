# `notifications/domain/ports`

Interfaces abstractas que definen lo que puede hacer un proveedor de notificaciones.

## Qué vivirá aquí

- `notification-provider.port.ts` — contrato que cualquier adaptador debe implementar

## Ejemplo

```
NotificationProvider {
  notifyMemberAccepted(...)
  notifyNewReservation(...)
}
```

La aplicación solo habla con esta interfaz, nunca con Novu directamente.
