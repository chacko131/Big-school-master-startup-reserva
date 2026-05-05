# `[restaurantSlug]`

Perfil público del restaurante dentro de la experiencia del cliente final.

## Responsabilidad

Presentar el restaurante y dirigir al usuario hacia la reserva.

## Datos previstos

- nombre del restaurante
- contacto
- horarios
- información general
- galería o portada
- CTA a reservar

---

## Log de cambios — 05/05/2026 18:33

- **page.tsx**: Eliminado `getRestaurantProfile` y mock de métricas. Ahora todos los datos vienen de `GetRestaurantPublicProfileUseCase`.
- **Carta del restaurante**: Se muestra la carta real desde BD con `RestaurantMenuSection` (categorías, platos, fotos).
- **Galería**: Usa imágenes reales de BD con fallback a mock si no existen.
- **Ubicación y Horarios**: Datos reales (dirección, teléfono, email, business hours) desde BD.
- **QuickReservationCard**: Botón navega a `/{slug}/reservar`.
- **PrivateEventsCard**: Enlace a WhatsApp con número del restaurante.
- **Código muerto eliminado**: `getRestaurantMetricDefinitions`, import de `siteContent`.
