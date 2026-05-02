# My Reservation Components

Este directorio contiene los componentes modulares utilizados en la página de consulta y gestión de reservas por parte del cliente (`src/app/(guest)/mi-reserva/[reservationId]/page.tsx`).

## Componentes

- **MyReservationHeader.tsx**: Título del restaurante, referencia de reserva y botón de retorno.
- **MyReservationHero.tsx**: Sección destacada con el estado actual de la reserva y métricas clave (Mesa, Canal, etc.).
- **MyReservationDetails.tsx**: Listado de campos de la reserva (nombre, fecha, hora) y sección de peticiones especiales.
- **AssignedTableCard.tsx**: Tarjeta visual que muestra el número de mesa y la zona asignada.
- **MapPreviewCard.tsx**: Widget con previsualización de mapa y dirección física del local.
- **ReservationManagementActions.tsx**: Botones de acción para contactar, ver mapa completo o cancelar.
- **MyReservationFooter.tsx**: Pie de página con enlaces legales y nombre del restaurante.
- **MobileMyReservationActions.tsx**: Barra de acciones flotante optimizada para dispositivos móviles.

## Responsabilidad
Estos componentes encapsulan la complejidad visual de la página de gestión de reservas, permitiendo que la página principal se centre en la orquestación de datos y el manejo de estados.
