# Componentes Guest (Públicos)

Esta carpeta contiene los componentes de UI utilizados en las superficies públicas del sistema (perfil del restaurante, flujo de reserva, etc.).

## Responsabilidad
- Renderizar la interfaz que ven los clientes finales.
- Mantener la coherencia visual con la marca "Reserva Latina".
- Separar la lógica de presentación de la lógica de negocio y datos.

## Estructura
- `/ReservationHero.tsx`: Encabezado del flujo de reserva.
- `/PartySizePicker.tsx`: Selector de número de comensales.
- `/DatePicker.tsx`: Calendario para selección de fecha.
- `/TimeSlotPicker.tsx`: Selector de franjas horarias disponibles.
- `/ContactForm.tsx`: Formulario de datos del cliente.
- `/ReservationSummary.tsx`: Panel lateral con el resumen de la reserva.
- `/PublicNavbar.tsx`: Barra de navegación pública.
- `/PublicFooter.tsx`: Pie de página público.

---

## Log de cambios — 05/05/2026 16:10

- **ReservationSummary.tsx**: Migración de `<img>` a `<Image>` de Next.js con width/height explícitos.
- **profile/LocationAndHours.tsx**: Migración de `<img>` a `<Image>`.
- **profile/ProfileHero.tsx**: Migración de `<img>` a `<Image>`.
- **profile/RestaurantGallery.tsx**: Migración de `<img>` a `<Image>`.
- **reserva/ConfirmationLocationCard.tsx**: Migración de `<img>` a `<Image>`.
- **reserva/ConfirmationPromoCard.tsx**: Migración de `<img>` a `<Image>`.
- **reserva/ConfirmationSummaryCard.tsx**: Migración de `<img>` a `<Image>`.
- **reservar/ReservationSummary.tsx**: Migración de `<img>` a `<Image>`.
