# `notifications/domain`

Esta carpeta contiene los puertos del módulo `notifications`.

## Qué hace esta capa

Aquí se define el contrato abstracto que cualquier proveedor de notificaciones debe cumplir.
No sabe nada de Novu, ni de email, ni de ninguna tecnología concreta.

## Qué vivirá aquí

- puertos (interfaces) que definen qué puede hacer un proveedor de notificaciones
- tipos de dominio propios del módulo si fueran necesarios

## Ejemplo mental

- el puerto dice "puedo notificar que un miembro fue aceptado"
- la infraestructura implementa ese puerto usando Novu
- si mañana cambias a otro proveedor, solo cambias la infraestructura

## Por qué es importante

Porque desacopla el negocio del proveedor técnico.
El dominio no sabe si usamos Novu, SendGrid o cualquier otra herramienta.

## Estado actual

Estructura creada. Pendiente de implementar el primer puerto: `NotificationProvider`.
