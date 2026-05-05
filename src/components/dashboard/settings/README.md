# `dashboard/settings`

Componentes reutilizables de la vista operativa de configuración del restaurante dentro del dashboard.

## Responsabilidad

Agrupar la UI del área de configuración para que la página principal quede como composición y la lógica futura de `catalog` pueda conectarse sin mezclar presentación con negocio.

## Estado

Base visual con datos mock mientras se prepara la integración real.

---

## Log de cambios — 05/05/2026 16:10

- **SettingsMenuPanel.tsx**: Implementación completa del CRUD de categorías y platos con subida de imágenes a Cloudinary.
- **Formulario categoría colapsable**: Botón verde `+ Nueva categoría` que abre/cierra el form.
- **Categorías plegables**: Toggle expand/collapse con indicador de platos.
- **Buscador de platos**: Input de búsqueda en tiempo real por nombre dentro de cada categoría.
- **Botón `+ Plato` en header**: Permite añadir plato sin desplegar la categoría.
- **Formulario nuevo plato arriba**: Se muestra debajo del buscador, no al final.
- **Códigos de colores**: Botones con colores semánticos de la app (primary, tertiary, error).
- **Icono basura**: Reemplazo de la × por SVG de papelera para eliminar platos.
- **Precio con badge**: Precio mostrado con pill verde para mayor visibilidad.
- **Eliminación de console.log/console.error**: Limpieza total de logs en componente.
