# components/team

Componentes de UI reutilizables para la pantalla `/dashboard/team`.

Todos son Server Components puros (sin `"use client"`). Actualmente renderizan datos mock; cuando se implemente el dominio de invitaciones recibirán props reales desde `page.tsx`.

## Componentes

- **TeamToolbar** — cabecera con título y botón de acción principal (invitar miembro)
- **TeamMetricsGrid** — cuatro tarjetas de métricas (miembros, roles, invitaciones, permisos)
- **TeamMembersPanel** — lista de miembros activos con rol, estado y permisos
- **TeamInvitationPanel** — invitaciones pendientes y formulario de envío
- **TeamActivityRail** — registro de actividad reciente del equipo
