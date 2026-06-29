# service — Módulo de servicio independiente

Raíz del módulo de servicio. La página index (`page.tsx`) detecta el rol del usuario
autenticado y redirige automáticamente a su vista correspondiente.

## Rutas hijas
- `/service/floor` → Vista del mesero (mesas y órdenes)
- `/service/kds/kitchen` → KDS cocina (cola de preparación)
- `/service/kds/bar` → KDS barra (cola de bebidas)
- `/service/overview` → Vista de control total (dueño/manager)

## Acceso
Requiere sesión activa y membership en un restaurante. Sin sesión redirige a `/sign-in`.
