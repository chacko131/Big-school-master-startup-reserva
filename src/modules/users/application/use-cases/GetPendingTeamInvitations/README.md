# GetPendingTeamInvitations

Esta carpeta contiene el caso de uso encargado de recuperar las invitaciones pendientes activas de un restaurante.

## Responsabilidad
- Consultar los tokens de invitación que siguen vigentes.
- Transformarlos en un DTO simple para la UI.

## Uso
Se usa desde el dashboard del equipo para mostrar la sección de "Invitaciones pendientes" con datos reales, sin acceder directamente a Prisma desde la vista.
