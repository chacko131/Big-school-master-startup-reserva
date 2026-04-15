# Prompt maestro para Google Stitch

Usa este prompt como base para generar las páginas de `Reserva Latina` con coherencia de producto, UX y arquitectura.

```text
Quiero diseñar la interfaz completa de un producto SaaS llamado “Reserva Latina”.

Contexto del producto:
- Es un SaaS B2B2C para restaurantes de comida latina.
- El cliente final NO paga por reservar.
- El restaurante sí paga una suscripción B2B al SaaS.
- El producto debe cubrir cuatro superficies:
  1. marketing y captación del SaaS
  2. experiencia pública del cliente final para reservar
  3. dashboard interno del restaurante
  4. panel admin del SaaS

Contexto técnico:
- Arquitectura: Monolito Modular + Clean Architecture.
- Stack principal: Next.js App Router, TypeScript, Tailwind CSS, Prisma, Neon.
- Multi-tenant por restaurante.
- Autenticación prevista con Clerk.
- Billing previsto con Stripe Billing.
- Diseño server-first, muy poco cliente, UI limpia y profesional.

Estilo visual deseado:
- moderno, premium, claro, elegante y usable
- estética SaaS profesional con enfoque hospitality / restaurantes
- visualmente cálido, con acentos latinos sofisticados, sin caer en clichés folclóricos
- UX muy clara para operación rápida en restaurante
- diseño responsive mobile-first pero muy sólido en desktop
- componentes pequeños, consistentes y reutilizables
- tablas, filtros, formularios y vistas de calendario muy cuidados
- usar jerarquía visual clara, buen whitespace, badges de estado y tarjetas limpias

Reglas UX:
- la navegación pública debe ser simple y comercial
- la navegación de cliente final debe minimizar fricción para reservar
- el dashboard del restaurante debe priorizar velocidad operativa
- el panel admin SaaS debe ser analítico y sobrio
- separar claramente las superficies públicas de las protegidas
- usar estados vacíos, loading, error y éxito bien pensados
- mostrar datos sensibles solo en pantallas protegidas

Quiero que diseñes las siguientes páginas.
Para cada página, incluye:
- layout general
- secciones
- componentes clave
- jerarquía visual
- datos mostrados
- CTAs principales
- notas de UX

========================
1. SUPERFICIE MARKETING
========================

Página 1: Landing `/`
Objetivo:
- vender el producto a dueños de restaurantes
Secciones:
- hero con propuesta de valor
- problema y solución
- beneficios operativos
- módulos del producto
- cómo funciona
- prueba social / testimonios
- CTA a demo y registro
- footer completo

Página 2: Pricing `/pricing`
Objetivo:
- explicar planes del SaaS B2B
Secciones:
- resumen de planes
- comparativa
- FAQ comercial
- CTA a demo / registro

Página 3: Demo `/demo`
Objetivo:
- solicitar demo comercial
Secciones:
- intro corta
- beneficios de agendar demo
- formulario comercial

Página 4: Contacto `/contact`
Objetivo:
- contacto comercial o soporte
Secciones:
- formulario
- canales de contacto
- preguntas frecuentes breves

========================
2. SUPERFICIE PÚBLICA DEL RESTAURANTE
========================

Página 5: Perfil público del restaurante `/[restaurantSlug]`
Objetivo:
- presentar el restaurante y llevar a reservar
Datos a mostrar:
- nombre del restaurante
- descripción corta
- teléfono
- email
- horario
- ubicación
- galería / portada
- CTA reservar
Secciones:
- hero restaurante
- información principal
- horarios
- fotos
- preguntas frecuentes
- CTA fija reservar

Página 6: Reserva pública `/[restaurantSlug]/reservar`
Objetivo:
- permitir crear una reserva rápida
Campos:
- fecha
- hora
- número de personas
- nombre
- teléfono
- email opcional
- peticiones especiales
UX:
- flujo corto
- selector de fecha/hora claro
- resumen previo al envío
- estados de éxito y error impecables

Página 7: Confirmación de reserva `/reserva/confirmacion`
Objetivo:
- confirmar la creación de reserva
Datos:
- restaurante
- fecha y hora
- party size
- estado
- instrucciones posteriores

Página 8: Gestión de reserva `/mi-reserva/[reservationId]`
Objetivo:
- consultar y gestionar una reserva existente
Datos:
- estado
- datos del huésped
- fecha / hora
- peticiones especiales
- mesa asignada si existe
Acciones:
- cancelar reserva
- ver detalles
- instrucciones del restaurante

========================
3. AUTH Y ONBOARDING
========================

Página 9: Sign in `/sign-in`
Objetivo:
- acceso para staff y admins
Diseño:
- limpio, premium, simple, con branding SaaS

Página 10: Sign up `/sign-up`
Objetivo:
- registro inicial del restaurante

Página 11: Onboarding restaurante `/onboarding/restaurant`
Campos:
- nombre del restaurante
- slug
- timezone
- teléfono
- email

Página 12: Onboarding settings `/onboarding/settings`
Campos:
- approval mode
- waitlist mode
- duración por defecto
- buffer
- ventana de cancelación
- permitir combinación de mesas
- autoasignación

Página 13: Onboarding mesas `/onboarding/tables`
Campos:
- nombre de la mesa
- capacidad
- combinable
- orden

Página 14: Onboarding plan `/onboarding/plan`
Objetivo:
- seleccionar plan del SaaS

Página 15: Onboarding completado `/onboarding/success`
Objetivo:
- dejar claro el siguiente paso para entrar al dashboard

========================
4. DASHBOARD DEL RESTAURANTE
========================

Este dashboard está protegido por auth + tenant guard.
Actores:
- dueño
- manager
- host
- staff

Página 16: Dashboard home `/dashboard`
Objetivo:
- resumen operativo del día
Widgets:
- reservas hoy
- próximas reservas
- mesas activas
- estado general del restaurante
- alertas operativas

Página 17: Reservas `/dashboard/reservations`
Objetivo:
- listado central de reservas
Diseño:
- tabla poderosa con filtros
- búsqueda por huésped
- filtros por estado y fecha
- badges de estado
- CTA crear reserva

Página 18: Nueva reserva `/dashboard/reservations/new`
Objetivo:
- crear reserva manual desde staff

Página 19: Detalle de reserva `/dashboard/reservations/[reservationId]`
Objetivo:
- ver y operar una reserva
Secciones:
- resumen
- estado
- huésped
- notas internas
- asignación de mesas
- historial
Acciones:
- confirmar
- cancelar
- check-in
- marcar no-show

Página 20: Huéspedes `/dashboard/guests`
Objetivo:
- CRM simple de clientes
Diseño:
- tabla / cards con búsqueda
- filtros y quick actions

Página 21: Detalle de huésped `/dashboard/guests/[guestId]`
Objetivo:
- ver historial del huésped
Secciones:
- datos de contacto
- notas
- no-show count
- historial de reservas

Página 22: Mesas `/dashboard/tables`
Objetivo:
- gestionar mesas
Diseño:
- lista editable o grid visual
- capacidad
- estado activa/inactiva
- combinable
- orden

Página 23: Schedule `/dashboard/schedule`
Objetivo:
- vista visual de reservas por tiempo y mesa
Diseño:
- timeline o grid tipo agenda
- reservas por franja horaria
- estado visual por colores

Página 24: Settings `/dashboard/settings`
Objetivo:
- configurar restaurante y reglas de reserva
Secciones:
- perfil restaurante
- reglas de reservas
- cancelaciones
- autoasignación

Página 25: Billing `/dashboard/billing`
Objetivo:
- ver plan, facturas y suscripción SaaS
Diseño:
- resumen del plan actual
- próxima factura
- método de pago
- historial
- CTA cambiar plan

Página 26: Team `/dashboard/team`
Objetivo:
- gestionar miembros del restaurante
Diseño:
- invitaciones
- roles
- estado de acceso

Página 27: Notifications `/dashboard/notifications`
Objetivo:
- centro de notificaciones y plantillas

Página 28: Integrations `/dashboard/integrations`
Objetivo:
- conectar servicios externos

Página 29: Analytics `/dashboard/analytics`
Objetivo:
- ver KPIs del restaurante
Widgets:
- reservas por período
- cancelaciones
- no-shows
- horas pico

========================
5. PANEL ADMIN DEL SAAS
========================

Este panel está protegido por SUPER_ADMIN.

Página 30: Admin home `/admin`
Objetivo:
- visión global de la plataforma
Widgets:
- restaurantes activos
- nuevas altas
- suscripciones activas
- incidencias
- cobros fallidos

Página 31: Restaurantes `/admin/restaurants`
Objetivo:
- listar tenants
Diseño:
- tabla avanzada con filtros
- estado
- plan
- actividad

Página 32: Detalle de restaurante `/admin/restaurants/[restaurantId]`
Objetivo:
- inspeccionar tenant
Secciones:
- perfil restaurante
- settings
- actividad reciente
- reservas recientes
- estado de cuenta

Página 33: Suscripciones `/admin/subscriptions`
Objetivo:
- operar billing del SaaS
Diseño:
- tabla de suscripciones
- estado de pago
- plan
- próximo cobro

Página 34: Usuarios `/admin/users`
Objetivo:
- ver usuarios globales y acceso

Página 35: Incidentes `/admin/incidents`
Objetivo:
- monitorear errores críticos, fallos de webhook y problemas operativos

========================
6. REGLAS DE PROTECCIÓN
========================

Clasifica visualmente las páginas así:
- públicas
- públicas con acceso firmado
- autenticadas
- autenticadas + tenant
- autenticadas + tenant + rol
- SUPER_ADMIN

========================
7. DATOS REALES DEL DOMINIO ACTUAL
========================

Ten en cuenta que hoy existen estas entidades reales:
- Restaurant
- RestaurantSettings
- DiningTable
- Guest
- Reservation
- ReservationTable

Campos importantes disponibles:
- Restaurant: id, name, slug, timezone, phone, email, isActive
- RestaurantSettings: reservationApprovalMode, waitlistMode, defaultReservationDurationMinutes, reservationBufferMinutes, cancellationWindowHours, allowTableCombination, enableAutoTableAssignment
- DiningTable: name, capacity, isActive, isCombinable, sortOrder
- Guest: fullName, phone, email, notes, noShowCount
- Reservation: status, partySize, startAt, endAt, cancellationDeadlineAt, cancelledAt, checkedInAt, completedAt, noShowMarkedAt, specialRequests, internalNotes
- ReservationTable: assignedSeats, assignedAt

Usa esos datos como base de las pantallas operativas.
Para billing, users, notifications e integrations puedes diseñar estructuras futuras coherentes, pero marcadas como roadmap visual del producto.

========================
8. ENTREGABLE ESPERADO
========================

Genera una propuesta de diseño completa y coherente para todas estas páginas, con estilo SaaS premium, operativo y escalable.
Prioriza:
- claridad
- jerarquía visual
- rapidez operativa
- consistencia de componentes
- separaciones limpias entre superficies públicas y privadas
- una UX excelente para crear y gestionar reservas
```
