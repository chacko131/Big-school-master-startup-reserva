# Mapa de superficies y páginas de `Reserva Latina`

Este documento define la arquitectura visible del producto para diseñar la interfaz completa de `Reserva Latina`, cruzando lo ya validado en negocio, arquitectura y modelo de datos actual.

## 1. Base de decisión usada para este mapa

Este mapa se apoya en:

- Notion `🏗️ Arquitectura del SaaS: Reserva Latina`
- Notion `📐 Estructura Completa: Arquitectura Reserva Latina`
- Notion `Paradigmas del Proyecto`
- Notion `fases del proyecto`
- `prisma/schema.prisma`
- módulos actuales `catalog` y `reservations`

## 2. Qué es `Reserva Latina` a nivel de producto

`Reserva Latina` es un SaaS B2B2C para restaurantes de comida latina.

- El cliente final **no paga** la reserva.
- El que paga es el restaurante mediante **suscripción B2B**.
- La app debe cubrir todo el ecosistema:
  - marketing y captación
  - experiencia pública de reserva
  - backoffice del restaurante
  - administración del SaaS
  - autenticación y onboarding
  - billing y áreas futuras como notificaciones e integraciones

## 3. Actores del sistema

### 3.1 Actores públicos

- Visitante anónimo
- Cliente final / comensal

### 3.2 Actores del restaurante

- Dueño del restaurante
- Manager
- Host / recepcionista
- Staff operativo

### 3.3 Actores del SaaS

- Super admin de plataforma

## 4. Niveles de acceso

### 4.1 Pública

No requiere login.

### 4.2 Pública con acceso firmado

No requiere sesión tradicional, pero sí enlace firmado, token o verificación por email / teléfono.

### 4.3 Protegida por autenticación

Requiere sesión válida.

### 4.4 Protegida por tenant

Requiere sesión y pertenecer al restaurante correcto.

### 4.5 Protegida por rol

Requiere sesión, tenant correcto y permisos internos.

### 4.6 Protegida por `SUPER_ADMIN`

Solo accesible desde el panel interno del SaaS.

## 5. Estado real del proyecto hoy

### 5.1 Ya respaldado por dominio + application + infrastructure

Estas áreas ya tienen base real en el proyecto:

- restaurante
- ajustes del restaurante
- mesas
- huéspedes
- reservas
- asignación de mesas
- cancelación de reservas

### 5.2 Aún no modelado en el esquema real, pero sí previsto en arquitectura

Estas áreas deben diseñarse, pero hoy son roadmap funcional:

- autenticación productiva con Clerk
- membresías internas / equipo del restaurante
- suscripciones SaaS
- notificaciones
- integraciones externas
- analítica
- auditoría / observabilidad visible en UI

## 6. Modelo de datos real disponible hoy

Del `schema.prisma` actual, las entidades reales son:

- `Restaurant`
- `RestaurantSettings`
- `DiningTable`
- `Guest`
- `Reservation`
- `ReservationTable`

### 6.1 Campos importantes por entidad

#### `Restaurant`

- `id`
- `name`
- `slug`
- `timezone`
- `phone`
- `email`
- `isActive`
- `version`
- `createdAt`
- `updatedAt`

#### `RestaurantSettings`

- `restaurantId`
- `reservationApprovalMode`
- `waitlistMode`
- `defaultReservationDurationMinutes`
- `reservationBufferMinutes`
- `cancellationWindowHours`
- `allowTableCombination`
- `enableAutoTableAssignment`

#### `DiningTable`

- `restaurantId`
- `name`
- `capacity`
- `isActive`
- `isCombinable`
- `sortOrder`

#### `Guest`

- `restaurantId`
- `fullName`
- `phone`
- `email`
- `notes`
- `noShowCount`

#### `Reservation`

- `restaurantId`
- `guestId`
- `status`
- `partySize`
- `startAt`
- `endAt`
- `cancellationDeadlineAt`
- `cancelledAt`
- `checkedInAt`
- `completedAt`
- `noShowMarkedAt`
- `specialRequests`
- `internalNotes`

#### `ReservationTable`

- `reservationId`
- `tableId`
- `assignedSeats`
- `assignedAt`

## 7. Mapa maestro de superficies

## 7.1 Superficie A — Marketing y captación

Objetivo: vender el SaaS al restaurante.

### Páginas obligatorias

#### `/`

- **Tipo**: pública
- **Actor**: visitante / lead / restaurante potencial
- **Objetivo**: landing principal del producto
- **Datos**:
  - propuesta de valor
  - beneficios
  - módulos del sistema
  - testimonios / prueba social
  - CTA a demo / registro
- **Secciones**:
  - hero
  - problema / solución
  - beneficios operativos
  - cómo funciona
  - módulos principales
  - pricing teaser
  - CTA final

#### `/pricing`

- **Tipo**: pública
- **Actor**: dueño del restaurante
- **Objetivo**: explicar planes SaaS
- **Datos**:
  - nombre de planes
  - precio mensual / anual
  - límites
  - FAQs comerciales
- **Estado de datos**: roadmap funcional, no respaldado todavía por esquema actual

#### `/demo`

- **Tipo**: pública
- **Actor**: lead
- **Objetivo**: solicitar demo o ver recorrido del producto
- **Datos**:
  - formulario comercial
  - nombre del restaurante
  - ciudad
  - tamaño del equipo
  - volumen estimado de reservas

#### `/contact`

- **Tipo**: pública
- **Actor**: lead o soporte
- **Objetivo**: contacto general
- **Datos**:
  - nombre
  - email
  - teléfono
  - mensaje
  - tipo de consulta

### Páginas recomendadas

#### `/about`

- **Tipo**: pública
- **Objetivo**: explicar misión / posicionamiento de marca

#### `/faq`

- **Tipo**: pública
- **Objetivo**: resolver dudas antes del alta

## 7.2 Superficie B — Experiencia pública del restaurante

Objetivo: permitir que el cliente final descubra un restaurante y reserve.

### Páginas obligatorias

#### `/[restaurantSlug]`

- **Tipo**: pública
- **Actor**: cliente final
- **Objetivo**: perfil público del restaurante
- **Datos reales hoy**:
  - `Restaurant.name`
  - `Restaurant.slug`
  - `Restaurant.phone`
  - `Restaurant.email`
  - `Restaurant.timezone`
  - estado activo
- **Datos futuros recomendados**:
  - portada
  - dirección
  - horarios
  - cocina / tags
  - galería
  - mapa
- **Secciones**:
  - hero del restaurante
  - datos principales
  - horario / disponibilidad general
  - CTA reservar
  - FAQs cortas

#### `/[restaurantSlug]/reservar`

- **Tipo**: pública
- **Actor**: cliente final
- **Objetivo**: crear una reserva
- **Datos de entrada**:
  - fecha
  - hora
  - tamaño del grupo
  - nombre del huésped
  - teléfono
  - email opcional
  - peticiones especiales
- **Datos leídos desde backend**:
  - `Restaurant`
  - `RestaurantSettings`
  - disponibilidad derivada de `DiningTable` + `Reservation`
- **Acciones**:
  - crear huésped si no existe
  - crear reserva
  - mostrar estado inicial `PENDING` o `CONFIRMED` según reglas futuras

#### `/reserva/confirmacion`

- **Tipo**: pública con contexto de operación
- **Actor**: cliente final
- **Objetivo**: confirmar que la reserva fue creada
- **Datos**:
  - resumen de reserva
  - restaurante
  - fecha / hora
  - tamaño del grupo
  - estado
  - CTA a gestionar reserva

### Páginas recomendadas

#### `/mi-reserva/[reservationId]`

- **Tipo**: pública con acceso firmado
- **Actor**: cliente final
- **Objetivo**: consultar, modificar o cancelar una reserva
- **Datos reales hoy**:
  - `Reservation`
  - `Guest`
  - `Restaurant`
  - `ReservationTable` si existiera asignación
- **Acciones**:
  - ver estado
  - cancelar reserva
  - ver instrucciones del restaurante
- **Protección recomendada**:
  - token firmado por email/SMS o acceso tras OTP

## 7.3 Superficie C — Auth y onboarding

Objetivo: alta y entrada del cliente B2B.

## Importante

Estas páginas son obligatorias para el producto, pero **no están respaldadas aún** por un módulo real en el proyecto actual.

### Páginas obligatorias

#### `/sign-in`

- **Tipo**: pública
- **Actor**: dueño / manager / staff / admin SaaS
- **Protección**: manejada por Clerk

#### `/sign-up`

- **Tipo**: pública
- **Actor**: dueño del restaurante
- **Objetivo**: alta inicial del negocio

#### `/onboarding`

- **Tipo**: protegida por auth
- **Actor**: dueño del restaurante
- **Objetivo**: completar configuración inicial

#### `/onboarding/restaurant`

- **Tipo**: protegida por auth
- **Objetivo**: recoger datos base del restaurante
- **Datos**:
  - nombre
  - slug
  - timezone
  - teléfono
  - email

#### `/onboarding/settings`

- **Tipo**: protegida por auth
- **Objetivo**: configuración inicial de reservas
- **Datos**:
  - approval mode
  - waitlist mode
  - duración por defecto
  - buffer
  - ventana de cancelación
  - combinación de mesas
  - auto-asignación

#### `/onboarding/tables`

- **Tipo**: protegida por auth
- **Objetivo**: alta inicial de mesas
- **Datos**:
  - nombre
  - capacidad
  - combinable o no
  - orden visual

#### `/onboarding/plan`

- **Tipo**: protegida por auth
- **Objetivo**: seleccionar plan SaaS
- **Estado**: roadmap funcional

#### `/onboarding/success`

- **Tipo**: protegida por auth
- **Objetivo**: confirmar que el restaurante está listo

## 7.4 Superficie D — Dashboard del restaurante

Objetivo: operación diaria del restaurante.

### Layout base

Ruta agrupada prevista en arquitectura:

- `(dashboard)`
- `layout` con auth + tenant guard

### Páginas obligatorias

#### `/dashboard`

- **Tipo**: protegida por auth + tenant
- **Actor**: dueño / manager / host / staff
- **Objetivo**: vista general operativa
- **Datos reales hoy**:
  - reservas del día
  - próximas reservas
  - mesas activas
  - settings principales
- **Widgets recomendados**:
  - reservas hoy por estado
  - próximos turnos
  - capacidad estimada
  - incidencias / alertas

#### `/dashboard/reservations`

- **Tipo**: protegida por auth + tenant
- **Objetivo**: listado de reservas
- **Datos reales hoy**:
  - `Reservation`
  - `Guest`
  - `Restaurant`
  - `ReservationTable`
- **Filtros**:
  - fecha
  - estado
  - tamaño de grupo
  - nombre del huésped
- **Acciones**:
  - crear manualmente
  - ver detalle
  - cancelar
  - confirmar
  - check-in
  - marcar no-show
- **Nota**:
  - algunas acciones aún son diseño objetivo, no implementación actual

#### `/dashboard/reservations/new`

- **Tipo**: protegida por auth + tenant
- **Objetivo**: crear reserva desde staff
- **Datos**:
  - guest
  - fecha / hora
  - party size
  - notas
  - requests especiales

#### `/dashboard/reservations/[reservationId]`

- **Tipo**: protegida por auth + tenant
- **Objetivo**: detalle operativo de una reserva
- **Datos reales hoy**:
  - reserva completa
  - huésped asociado
  - asignación de mesas si existe
- **Secciones**:
  - resumen
  - estado
  - huésped
  - notas internas
  - historial de acciones
  - asignación de mesas

#### `/dashboard/guests`

- **Tipo**: protegida por auth + tenant
- **Objetivo**: CRM simple de huéspedes
- **Datos reales hoy**:
  - `Guest.fullName`
  - `Guest.phone`
  - `Guest.email`
  - `Guest.notes`
  - `Guest.noShowCount`
  - reservas asociadas
- **Acciones**:
  - buscar
  - editar notas
  - ver historial

#### `/dashboard/guests/[guestId]`

- **Tipo**: protegida por auth + tenant
- **Objetivo**: detalle de huésped
- **Datos**:
  - datos de contacto
  - notas internas
  - número de no-shows
  - reservas pasadas y futuras

#### `/dashboard/tables`

- **Tipo**: protegida por auth + tenant
- **Objetivo**: gestionar mesas
- **Datos reales hoy**:
  - `DiningTable.name`
  - `capacity`
  - `isActive`
  - `isCombinable`
  - `sortOrder`
- **Acciones**:
  - alta / edición / activación
  - orden visual
  - combinar lógicamente en diseño futuro

#### `/dashboard/schedule`

- **Tipo**: protegida por auth + tenant
- **Objetivo**: vista visual de reservas por franja
- **Datos reales hoy**:
  - reservas por `startAt` / `endAt`
  - estado
  - mesas activas
  - asignaciones
- **Vista recomendada**:
  - timeline o grid por hora y mesa

#### `/dashboard/settings`

- **Tipo**: protegida por auth + tenant
- **Objetivo**: configuración del restaurante
- **Datos reales hoy**:
  - `Restaurant`
  - `RestaurantSettings`
- **Subsecciones recomendadas**:
  - perfil del restaurante
  - reglas de reserva
  - política de cancelación
  - reglas de auto-asignación

#### `/dashboard/billing`

- **Tipo**: protegida por auth + tenant + rol dueño/manager
- **Objetivo**: gestión de suscripción SaaS
- **Estado**: roadmap funcional
- **Datos esperados**:
  - plan actual
  - estado de suscripción
  - próximo cobro
  - método de pago
  - historial de facturas

### Páginas recomendadas

#### `/dashboard/team`

- **Tipo**: protegida por auth + tenant + rol dueño/manager
- **Estado**: roadmap
- **Objetivo**: invitar y gestionar usuarios internos

#### `/dashboard/notifications`

- **Tipo**: protegida por auth + tenant
- **Estado**: roadmap
- **Objetivo**: centro de notificaciones y plantillas

#### `/dashboard/integrations`

- **Tipo**: protegida por auth + tenant + rol dueño/manager
- **Estado**: roadmap
- **Objetivo**: conectar WhatsApp, email, POS u otras integraciones

#### `/dashboard/analytics`

- **Tipo**: protegida por auth + tenant + rol dueño/manager
- **Estado**: roadmap
- **Objetivo**: métricas operativas y comerciales

## 7.5 Superficie E — Admin del SaaS

Objetivo: operar la plataforma como negocio.

### Layout base

Ruta agrupada prevista en arquitectura:

- `(admin)`
- `layout` con guard `SUPER_ADMIN`

### Páginas obligatorias

#### `/admin`

- **Tipo**: protegida `SUPER_ADMIN`
- **Objetivo**: resumen de plataforma
- **Datos esperados**:
  - restaurantes activos
  - nuevos registros
  - churn / morosidad
  - incidencias
- **Estado**: diseño objetivo

#### `/admin/restaurants`

- **Tipo**: protegida `SUPER_ADMIN`
- **Objetivo**: listado de restaurantes tenant
- **Datos reales parciales hoy**:
  - `Restaurant`
  - potencialmente settings
- **Acciones**:
  - ver ficha
  - activar / desactivar
  - auditar estado

#### `/admin/restaurants/[restaurantId]`

- **Tipo**: protegida `SUPER_ADMIN`
- **Objetivo**: detalle de tenant
- **Datos**:
  - perfil de restaurante
  - settings
  - uso estimado
  - reservas recientes
  - estado de suscripción

#### `/admin/subscriptions`

- **Tipo**: protegida `SUPER_ADMIN`
- **Objetivo**: control de billing B2B
- **Estado**: roadmap funcional
- **Datos esperados**:
  - suscripción
  - plan
  - invoices
  - cobros fallidos

### Páginas recomendadas

#### `/admin/users`

- **Tipo**: protegida `SUPER_ADMIN`
- **Estado**: roadmap
- **Objetivo**: vista consolidada de usuarios y membresías

#### `/admin/incidents`

- **Tipo**: protegida `SUPER_ADMIN`
- **Estado**: roadmap
- **Objetivo**: errores críticos, webhooks fallidos, problemas operativos

#### `/admin/feature-flags`

- **Tipo**: protegida `SUPER_ADMIN`
- **Estado**: roadmap
- **Objetivo**: habilitación progresiva de módulos o features

## 7.6 Superficie F — Páginas transversales y utilitarias

### Públicas

#### `/403`

- acceso denegado

#### `/404`

- no encontrado

#### `/500`

- error general

### Protegidas o contextuales

#### `/maintenance`

- modo mantenimiento

#### `/invitation/accept`

- aceptar invitación de equipo
- roadmap

#### `/webhook-status`

- solo staff interno / admin
- roadmap

## 8. Matriz resumida de rutas y protección

| Ruta | Superficie | Protección | Actor principal | Estado |
| --- | --- | --- | --- | --- |
| `/` | marketing | pública | visitante | recomendada |
| `/pricing` | marketing | pública | dueño potencial | recomendada |
| `/demo` | marketing | pública | lead | recomendada |
| `/contact` | marketing | pública | lead | recomendada |
| `/[restaurantSlug]` | público restaurante | pública | cliente final | obligatoria |
| `/[restaurantSlug]/reservar` | público restaurante | pública | cliente final | obligatoria |
| `/reserva/confirmacion` | cliente final | pública contextual | cliente final | obligatoria |
| `/mi-reserva/[reservationId]` | cliente final | acceso firmado | cliente final | recomendada |
| `/sign-in` | auth | pública | todos los autenticados | obligatoria |
| `/sign-up` | auth | pública | dueño | obligatoria |
| `/onboarding/*` | onboarding | auth | dueño | obligatoria |
| `/dashboard` | restaurante | auth + tenant | dueño/manager/host/staff | obligatoria |
| `/dashboard/reservations` | restaurante | auth + tenant | operación | obligatoria |
| `/dashboard/reservations/[id]` | restaurante | auth + tenant | operación | obligatoria |
| `/dashboard/guests` | restaurante | auth + tenant | operación | obligatoria |
| `/dashboard/tables` | restaurante | auth + tenant | operación | obligatoria |
| `/dashboard/schedule` | restaurante | auth + tenant | operación | obligatoria |
| `/dashboard/settings` | restaurante | auth + tenant | dueño/manager | obligatoria |
| `/dashboard/billing` | restaurante | auth + tenant + rol | dueño/manager | obligatoria |
| `/dashboard/team` | restaurante | auth + tenant + rol | dueño/manager | recomendada |
| `/dashboard/notifications` | restaurante | auth + tenant | operación | recomendada |
| `/dashboard/integrations` | restaurante | auth + tenant + rol | dueño/manager | recomendada |
| `/dashboard/analytics` | restaurante | auth + tenant + rol | dueño/manager | recomendada |
| `/admin` | SaaS | `SUPER_ADMIN` | admin plataforma | obligatoria |
| `/admin/restaurants` | SaaS | `SUPER_ADMIN` | admin plataforma | obligatoria |
| `/admin/restaurants/[id]` | SaaS | `SUPER_ADMIN` | admin plataforma | obligatoria |
| `/admin/subscriptions` | SaaS | `SUPER_ADMIN` | admin plataforma | obligatoria |
| `/admin/users` | SaaS | `SUPER_ADMIN` | admin plataforma | recomendada |
| `/admin/incidents` | SaaS | `SUPER_ADMIN` | admin plataforma | recomendada |

## 9. Datos que debe manejar cada módulo visual

## 9.1 Módulo visual `Catalog`

Pantallas que dependen principalmente de:

- `Restaurant`
- `RestaurantSettings`
- `DiningTable`

Páginas:

- onboarding del restaurante
- perfil público del restaurante
- dashboard settings
- dashboard tables
- dashboard schedule
- admin restaurants detail

## 9.2 Módulo visual `Reservations`

Pantallas que dependen principalmente de:

- `Guest`
- `Reservation`
- `ReservationTable`
- `DiningTable`
- `RestaurantSettings`

Páginas:

- reservar
- confirmación de reserva
- mi reserva
- dashboard reservations
- dashboard guests
- dashboard reservation detail
- dashboard schedule

## 9.3 Módulo visual `Billing`

Pantallas previstas, pero no modeladas aún en el esquema:

- pricing
- onboarding plan
- dashboard billing
- admin subscriptions

## 9.4 Módulo visual `Users / Access`

Pantallas previstas, pero no modeladas aún:

- sign in
- sign up
- onboarding
- dashboard team
- admin users

## 9.5 Módulo visual `Notifications / Integrations`

Pantallas previstas, pero no modeladas aún:

- dashboard notifications
- dashboard integrations
- admin incidents

## 10. Orden correcto para diseñar las pantallas

Para no diseñar sin base, este debería ser el orden:

### Bloque 1 — Público y reserva

- `/`
- `/[restaurantSlug]`
- `/[restaurantSlug]/reservar`
- `/reserva/confirmacion`
- `/mi-reserva/[reservationId]`

### Bloque 2 — Dashboard operativo del restaurante

- `/dashboard`
- `/dashboard/reservations`
- `/dashboard/reservations/[reservationId]`
- `/dashboard/guests`
- `/dashboard/tables`
- `/dashboard/schedule`
- `/dashboard/settings`

### Bloque 3 — Onboarding y auth

- `/sign-in`
- `/sign-up`
- `/onboarding/restaurant`
- `/onboarding/settings`
- `/onboarding/tables`
- `/onboarding/plan`

### Bloque 4 — Billing y panel SaaS

- `/pricing`
- `/dashboard/billing`
- `/admin`
- `/admin/restaurants`
- `/admin/restaurants/[restaurantId]`
- `/admin/subscriptions`

## 11. Qué no conviene diseñar todavía como definitivo

No te recomiendo fijar al 100% estas áreas como si ya existieran en backend:

- team management detallado
- analytics profunda
- incident management avanzado
- integraciones complejas
- feature flags

Lo correcto es diseñarlas como:

- **placeholder funcional serio**
- pero marcadas como **roadmap / siguiente fase**

## 12. Conclusión operativa

La UI completa de `Reserva Latina` debe dividirse en cuatro grandes mundos:

- captación del SaaS
- experiencia pública de reserva
- operación diaria del restaurante
- administración interna de la plataforma

Si quieres diseñar bien y no rehacer después, el centro de gravedad visual debe salir de estos módulos:

- `catalog`
- `reservations`
- auth / onboarding
- billing
- admin SaaS

El backend real hoy ya soporta el núcleo operativo de restaurante y reservas. Todo lo demás debe diseñarse desde ahora, pero marcado según si ya está respaldado por dominio real o si sigue siendo roadmap.
