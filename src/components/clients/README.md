# Componentes de Clientes (`src/components/clients`)

Esta carpeta contiene todos los componentes de interfaz de usuario (UI) dedicados a la visualización y gestión de clientes (huéspedes) del restaurante.

## Responsabilidad de la Carpeta
Renderizar la información del CRM de clientes (CRM de Huéspedes) de forma interactiva y modular, conectando los datos procesados en la capa del backend con la interfaz del dashboard.

## Componentes Incluidos
- **`GuestMetricCard`**: Tarjetas visuales de métricas clave (clientes activos, VIPs identificados y ausencias recurrentes).
- **`GuestsSearchInput`**: Campo de búsqueda reactivo con debounce de entrada que sincroniza el parámetro `q` en los search parameters de la URL.
- **`GuestsTable`**: Tabla y filas dinámicas para listar a los comensales, mostrando sus iniciales, contacto, última visita, reservas registradas, no-shows reales y su segmento de lealtad.
- **`NotesModal`**: Modal interactivo de revisión que despliega el historial completo de peticiones especiales de reservas previas y notas fijas de la ficha de un cliente.
