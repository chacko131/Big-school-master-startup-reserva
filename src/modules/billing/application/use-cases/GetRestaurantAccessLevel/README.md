# GetRestaurantAccessLevel

Caso de uso que consulta la suscripción de un restaurante en base de datos y calcula su nivel de acceso actual.

Es el **único punto de entrada** que la app usa para saber qué puede hacer un restaurante. El layout del dashboard, los server actions y la página pública consultan este use case.
