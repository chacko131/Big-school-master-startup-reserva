# `settings`

Sección interna para la configuración del restaurante.

## Responsabilidad

Editar el perfil del restaurante y sus reglas de reserva.

## Datos previstos

- nombre
- slug
- timezone
- teléfono
- email
- política de aprobación
- waitlist
- buffer
- ventana de cancelación
- autoasignación

---

## Log de cambios — 05/05/2026 16:10

- **menu-actions.ts**: Creación de server actions completas para CRUD de categorías y platos del menú.
- **Integración Cloudinary**: Eliminación de imágenes huérfanas al actualizar/borrar platos o categorías completas.
- **page.tsx**: Integración de `SettingsMenuPanel` con prop `generateSignatureAction` para subida de fotos.
- **imagePublicId**: Propagación del campo a través de DTOs y use cases para tracking de imágenes.
- **Eliminación de console.log/console.error**: Limpieza total de logs en server actions.

---

## Log de cambios — 05/05/2026 18:33

- **SettingsBusinessHoursPanel**: Nuevo panel para gestionar horarios de apertura (7 días, open/close, checkbox cerrado).
- **saveBusinessHoursAction**: Server action para persistir horarios via `SaveBusinessHours` use case.
- **SaveBusinessHours use case**: Reemplaza atómicamente todos los horarios de un restaurante.
- **Carga inicial de horarios**: Se cargan desde BD al abrir settings y se mapean como `initialValues`.
- **Feedback**: Mensajes de éxito/error via `searchParams` (`hoursError`, `hoursSaved`).
