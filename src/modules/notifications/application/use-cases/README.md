# `notifications/application/use-cases`

Casos de uso del módulo `notifications`.

## Qué vivirá aquí

Cada caso de uso vive en su propia carpeta con el mismo nombre en PascalCase:

```
use-cases/
├── NotifyMemberAccepted/
│   └── notify-member-accepted.use-case.ts
└── NotifyNewReservation/         ← futuro
    └── notify-new-reservation.use-case.ts
```

## Convención

- Carpeta en PascalCase, comenzando con verbo: `NotifyMemberAccepted`
- Archivo en kebab-case con sufijo `.use-case.ts`
- Cada caso de uso recibe el `NotificationProvider` por inyección de dependencias

## Estado actual

Estructura creada. `NotifyMemberAccepted` ya está implementado en `NotifyMemberAccepted/notify-member-accepted.use-case.ts` y su método `execute` delega el envío al `NotificationProvider`.
