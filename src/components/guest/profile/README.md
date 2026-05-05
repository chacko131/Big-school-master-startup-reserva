# Restaurant Profile Components

Este directorio contiene los componentes modulares utilizados específicamente en la página de perfil público del restaurante (`src/app/(guest)/[restaurantSlug]/page.tsx`).

## Componentes

- **ProfileHero.tsx**: Sección principal con imagen de fondo, nombre y subtítulo.
- **RestaurantMenuSection.tsx**: Carta pública del restaurante con categorías y platos reales.
- **RestaurantGallery.tsx**: Cuadrícula de imágenes destacadas del establecimiento.
- **LocationAndHours.tsx**: Detalles de contacto, horarios y mapa de ubicación.
- **QuickReservationCard.tsx**: Formulario lateral para iniciar el flujo de reserva.
- **PrivateEventsCard.tsx**: Información promocional sobre eventos y celebraciones.
- **MobileReservationButton.tsx**: Botón flotante para facilitar la reserva en móviles.

## Responsabilidad
Estos componentes son puramente visuales (UI) y reciben los datos necesarios a través de `props` para mantener el desacoplamiento de la lógica de obtención de datos.

---

## Log de cambios — 05/05/2026 18:33

- **RestaurantMetrics.tsx**: Eliminado (código muerto). Reemplazado por `RestaurantMenuSection.tsx`.
- **RestaurantMenuSection.tsx**: Nuevo componente interactivo (`"use client"`) que muestra la carta del restaurante con:
  - Selector de categorías (tabs/pills).
  - Grid paginado de platos (6 por página, solo foto + nombre).
  - Visor fullscreen (portal en `document.body`) con navegación swipe tipo TikTok/Instagram Stories, flechas desktop y teclado.
  - Overlay semitransparente `bg-black/80 backdrop-blur-md` con `z-9999`.
- **QuickReservationCard.tsx**: Refactorizado para recibir `restaurantSlug`. El botón "Confirmar Reserva" ahora es un `<Link>` que navega a `/{slug}/reservar`.
- **PrivateEventsCard.tsx**: Refactorizado para recibir `phone`. "Solicitar información" ahora abre WhatsApp (`wa.me`) con mensaje predeterminado.
