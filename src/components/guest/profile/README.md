# Restaurant Profile Components

Este directorio contiene los componentes modulares utilizados específicamente en la página de perfil público del restaurante (`src/app/(guest)/[restaurantSlug]/page.tsx`).

## Componentes

- **ProfileHero.tsx**: Sección principal con imagen de fondo, nombre y subtítulo.
- **RestaurantMetrics.tsx**: Tarjetas de información rápida (Reseñas, Precio, Especialidad, Ubicación).
- **RestaurantGallery.tsx**: Cuadrícula de imágenes destacadas del establecimiento.
- **LocationAndHours.tsx**: Detalles de contacto, horarios y mapa de ubicación.
- **QuickReservationCard.tsx**: Formulario lateral para iniciar el flujo de reserva.
- **PrivateEventsCard.tsx**: Información promocional sobre eventos y celebraciones.
- **MobileReservationButton.tsx**: Botón flotante para facilitar la reserva en móviles.

## Responsabilidad
Estos componentes son puramente visuales (UI) y reciben los datos necesarios a través de `props` para mantener el desacoplamiento de la lógica de obtención de datos.
