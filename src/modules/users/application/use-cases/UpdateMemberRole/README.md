# UpdateMemberRole

Caso de uso que permite al `RESTAURANT_OWNER` cambiar el rol de cualquier miembro de su equipo.

## Reglas de negocio
- Solo puede ejecutarlo quien tenga rol `RESTAURANT_OWNER` en ese restaurante.
- El owner no puede cambiar su propio rol.
- El nuevo rol no puede ser `RESTAURANT_OWNER` (hay un solo owner por restaurante).

## Entrada
- `requesterId: string` — userId del que ejecuta la acción (debe ser owner)
- `membershipId: string` — ID de la membership a modificar
- `newRole: MembershipRole`

## Salida
- `void` — lanza error si las reglas no se cumplen
