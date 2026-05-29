# `reservations/application/use-cases`

Contiene los casos de uso del módulo `reservations`.

## Qué hacen los casos de uso

Son las piezas que responden a esta pregunta:

> ¿Qué quiere hacer el sistema?

No describen la base de datos ni la UI. Describen acciones de negocio.

## Para qué sirven aquí

Orquestan cosas como:

- crear una reserva
- cancelar una reserva
- confirmar una reserva
- consultar una reserva
- asignar mesas

## Cómo trabajan

- reciben un DTO
- usan las entidades del dominio
- llaman a puertos para guardar o leer datos
- devuelven un resultado claro

## Por qué son importantes

Porque mantienen la lógica del proceso separada de la lógica pura del dominio.
Así el negocio queda más fácil de mantener y de testear.

## Estado actual

La carpeta está preparada para los primeros casos de uso del flujo de reservas.

---

## Changelog

### 2026-05-05 21:10 (UTC+02:00)

- **`get-available-slots.use-case.ts`**: nuevo use case que calcula slots horarios disponibles cruzando horarios de apertura, mesas activas, reservas existentes y configuración del restaurante (duración, buffer, combinación de mesas).
- **`create-reservation-full.use-case.ts`**: nuevo use case que orquesta el flujo completo de creación de reserva desde el lado público: find-or-create guest → validar disponibilidad → crear reserva → auto-confirmar si `approvalMode === AUTO` → calcular deadline de cancelación.

### 2026-05-22 (UTC+02:00)

- **`create-reservation-full.use-case.ts`**: añadido `UserRepository` al constructor. Tras filtrar los owners/managers activos del restaurante, el use case ahora resuelve sus `clerkId` vía `findManyByIds` antes de disparar el trigger de Novu, corrigiendo el mismatch entre el UUID interno de Prisma y el identificador de subscriber registrado en Novu.

### 2026-05-29 (UTC+02:00)

- **`get-guests-with-crm-metrics.use-case.ts`**: nuevo caso de uso que orquesta la lectura de clientes de la base de datos de Prisma y procesa dinámicamente sus ausencias reales, total de reservas, fecha de última visita y determina su segmento de lealtad (`loyaltySegment`) en base a reglas de negocio del CRM.

