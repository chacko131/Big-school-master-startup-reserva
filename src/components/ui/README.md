# components/ui

Este directorio centraliza componentes de interfaz reutilizables que no dependen de un flujo específico (banners, controles, feedbacks, etc.). Cada archivo debe incluir su cabecera con responsabilidad y tipo, exponer props estrictamente tipadas y permanecer libre de efectos secundarios.

Convenciones:

1. Preferir funciones puras y composables (`@pure`).
2. Mantener clases utilitarias alineadas con el diseño del dashboard.
3. Documentar rápidamente nuevos bloques en este README si amplían la biblioteca.

Componentes registrados:

- `NotificationBanner`: Mensajes compactos de éxito, error o información para formularios y acciones inline.
