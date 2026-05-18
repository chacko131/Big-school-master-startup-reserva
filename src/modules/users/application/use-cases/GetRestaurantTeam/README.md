# GetRestaurantTeam

Caso de uso que devuelve el equipo completo de un restaurante: todas sus memberships (cualquier estado) enriquecidas con los datos del usuario correspondiente.

## Entrada
- `restaurantId: string`

## Salida
- `Array<TeamMemberView>` — cada elemento combina los primitivos de la membership con `userFullName` y `userEmail`.

## Dependencias
- `MembershipRepository.findByRestaurantId`
- `UserRepository.findManyByIds`
