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
