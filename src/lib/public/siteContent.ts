/**
 * Archivo: siteContent.ts
 * Responsabilidad: Centralizar contenido estático, tipos y factories de datos para las primeras superficies públicas.
 * Tipo: lógica
 */

export type PublicTone = "primary" | "secondary" | "tertiary";
export type PublicActionVariant = "primary" | "secondary" | "ghost";
export type PublicReservationFieldType = "text" | "email" | "tel" | "date" | "time" | "number" | "textarea";
export type PublicTimelineStatus = "complete" | "active" | "pending";

export interface PublicMetric {
  label: string;
  value: string;
  hint: string;
}

export interface PublicFeature {
  title: string;
  description: string;
  tone: PublicTone;
}

export interface PublicSurfaceCard {
  title: string;
  description: string;
  note: string;
}

export interface PublicActionLink {
  label: string;
  href: string;
  variant: PublicActionVariant;
}

export interface PublicReservationField {
  name: string;
  label: string;
  placeholder: string;
  type: PublicReservationFieldType;
  helperText?: string;
  required?: boolean;
}

export interface PublicReservationFieldGroup {
  title: string;
  description: string;
  fields: PublicReservationField[];
}

export interface PublicTimelineStep {
  title: string;
  description: string;
  status: PublicTimelineStatus;
}

export interface PublicRestaurantProfile {
  slug: string;
  displayName: string;
  subtitle: string;
  description: string;
  cuisine: string;
  highlights: string[];
  metrics: PublicMetric[];
  features: PublicFeature[];
  serviceNotes: string[];
  reservationPolicies: string[];
}

export interface PublicReservationContext {
  restaurantName: string;
  restaurantSubtitle: string;
  codeLabel: string;
  codeValue: string;
  dateLabel: string;
  dateValue: string;
  timeLabel: string;
  timeValue: string;
  partyLabel: string;
  partyValue: string;
  statusLabel: string;
  statusValue: string;
}

const LANDING_METRICS: PublicMetric[] = [
  {
    label: "Superficies diseñadas",
    value: "4",
    hint: "Marketing, experiencia pública, operación y administración.",
  },
  {
    label: "Modelo de datos base",
    value: "6",
    hint: "Restaurant, settings, mesas, huéspedes y reservas.",
  },
  {
    label: "Idiomas soportados",
    value: "9",
    hint: "Traducción dinámica lista para escalar la captación.",
  },
  {
    label: "Fase actual",
    value: "UI foundation",
    hint: "Primeras páginas públicas con sistema visual compartido.",
  },
];

const LANDING_FEATURES: PublicFeature[] = [
  {
    title: "Diseño editorial con precisión operativa",
    description: "Una estética premium, sin ruido visual, pensada para experiencias de reserva rápidas y legibles.",
    tone: "primary",
  },
  {
    title: "Arquitectura modular por superficies",
    description: "Cada bloque visual está pensado para crecer sin romper la separación entre UI, datos y negocio.",
    tone: "secondary",
  },
  {
    title: "Internacionalización integrada",
    description: "La base de traducción automática ya está conectada para que la interfaz pueda escalar a varios mercados.",
    tone: "tertiary",
  },
];

const LANDING_SURFACES: PublicSurfaceCard[] = [
  {
    title: "Landing comercial",
    description: "Explora la propuesta del SaaS y la narrativa de producto.",
    note: "Primera impresión del sistema visual.",
  },
  {
    title: "Perfil público del restaurante",
    description: "Muestra identidad, horarios y contexto de reserva.",
    note: "Superficie crítica de conversión.",
  },
  {
    title: "Flujo de reserva",
    description: "Recoge datos del cliente y prepara la confirmación.",
    note: "Diseño centrado en fricción mínima.",
  },
  {
    title: "Gestión pública de reserva",
    description: "Permite revisar el estado de una reserva con acceso firmado.",
    note: "Capa post-reserva y soporte.",
  },
];

const RESERVATION_FIELD_GROUPS: PublicReservationFieldGroup[] = [
  {
    title: "Datos de la reserva",
    description: "Fecha, hora y tamaño del grupo.",
    fields: [
      {
        name: "date",
        label: "Fecha",
        placeholder: "Selecciona una fecha",
        type: "date",
        required: true,
      },
      {
        name: "time",
        label: "Hora",
        placeholder: "Selecciona una hora",
        type: "time",
        required: true,
      },
      {
        name: "partySize",
        label: "Personas",
        placeholder: "Número de personas",
        type: "number",
        required: true,
      },
    ],
  },
  {
    title: "Datos del huésped",
    description: "Información de contacto para confirmar la reserva.",
    fields: [
      {
        name: "guestName",
        label: "Nombre completo",
        placeholder: "Tu nombre y apellido",
        type: "text",
        required: true,
      },
      {
        name: "phone",
        label: "Teléfono",
        placeholder: "Número de contacto",
        type: "tel",
        required: true,
      },
      {
        name: "email",
        label: "Email",
        placeholder: "Correo electrónico",
        type: "email",
      },
    ],
  },
  {
    title: "Preferencias",
    description: "Notas opcionales para mejorar el servicio.",
    fields: [
      {
        name: "specialRequests",
        label: "Petición especial",
        placeholder: "Alergias, celebración, mesa preferida...",
        type: "textarea",
        helperText: "Opcional. Mantén el copy corto y claro.",
      },
    ],
  },
];

const RESERVATION_TIMELINE: PublicTimelineStep[] = [
  {
    title: "Reserva solicitada",
    description: "El cliente completó el formulario con los datos mínimos necesarios.",
    status: "complete",
  },
  {
    title: "Confirmación enviada",
    description: "El restaurante valida la disponibilidad y confirma la mesa.",
    status: "active",
  },
  {
    title: "Llegada al restaurante",
    description: "La experiencia se traslada al dashboard y al equipo de sala.",
    status: "pending",
  },
];

/**
 * Devuelve el contenido de la landing principal pública.
 * @pure
 */
export function getLandingContent(): {
  metrics: PublicMetric[];
  features: PublicFeature[];
  surfaces: PublicSurfaceCard[];
  primaryAction: PublicActionLink;
  secondaryAction: PublicActionLink;
} {
  return {
    metrics: LANDING_METRICS,
    features: LANDING_FEATURES,
    surfaces: LANDING_SURFACES,
    primaryAction: {
      label: "Ver restaurante de ejemplo",
      href: "/la-casa-del-puerto",
      variant: "primary",
    },
    secondaryAction: {
      label: "Ir al flujo de reserva",
      href: "/la-casa-del-puerto/reservar",
      variant: "secondary",
    },
  };
}

/**
 * Devuelve el contenido de un perfil público de restaurante a partir del slug.
 * @pure
 */
export function getRestaurantProfile(slug: string): PublicRestaurantProfile {
  const displayName = slugToDisplayName(slug);
  return {
    slug,
    displayName,
    subtitle: "Experiencia pública lista para convertir visitas en reservas.",
    description:
      "El restaurante muestra una identidad clara, disponibilidad visible y acceso directo al flujo de reserva sin fricción innecesaria.",
    cuisine: "Cocina latina contemporánea",
    highlights: [
      "Carta enfocada y visual limpia",
      "Horario operativo visible",
      "Reserva con acceso móvil primero",
      "Políticas claras para el cliente",
    ],
    metrics: [
      { label: "Tiempo de decisión", value: "< 60s", hint: "El usuario entiende qué hacer en la primera pantalla." },
      { label: "Canal principal", value: "Web", hint: "La conversión nace desde la experiencia pública." },
      { label: "Estado", value: "Disponible", hint: "Preparado para conectar disponibilidad real." },
      { label: "Idioma", value: "Auto", hint: "Adaptado al sistema de traducción automático." },
    ],
    features: [
      {
        title: "Identidad del restaurante",
        description: "Hero claro, copy breve y tono sofisticado para transmitir confianza.",
        tone: "primary",
      },
      {
        title: "Disponibilidad visible",
        description: "El cliente entiende rápidamente cuándo y cómo reservar.",
        tone: "secondary",
      },
      {
        title: "Contexto útil",
        description: "Horarios, políticas y notas importantes sin saturar la interfaz.",
        tone: "tertiary",
      },
    ],
    serviceNotes: [
      "Horario sujeto a la configuración del restaurante.",
      "La experiencia está preparada para multi-tenant por slug.",
      "La reserva pública debe enlazar con validación en servidor más adelante.",
    ],
    reservationPolicies: [
      "Las reservas se diseñan para reducir el número de pasos.",
      "El cliente siempre ve el resumen antes de confirmar.",
      "Las reglas de cancelación deben mostrarse con claridad.",
    ],
  };
}

/**
 * Devuelve el contexto visual de una reserva pública de ejemplo.
 * @pure
 */
export function getReservationContext(reservationId: string): PublicReservationContext {
  return {
    restaurantName: "La Casa del Puerto",
    restaurantSubtitle: "Reserva confirmada para una cena latina contemporánea.",
    codeLabel: "Código de reserva",
    codeValue: reservationId.toUpperCase(),
    dateLabel: "Fecha",
    dateValue: "Viernes, 22 de abril",
    timeLabel: "Hora",
    timeValue: "20:30",
    partyLabel: "Personas",
    partyValue: "4 invitados",
    statusLabel: "Estado",
    statusValue: "Confirmada",
  };
}

/**
 * Devuelve la configuración de los formularios de reserva pública.
 * @pure
 */
export function getReservationFieldGroups(): PublicReservationFieldGroup[] {
  return RESERVATION_FIELD_GROUPS;
}

/**
 * Devuelve los pasos visuales del flujo post-reserva.
 * @pure
 */
export function getReservationTimeline(): PublicTimelineStep[] {
  return RESERVATION_TIMELINE;
}

/**
 * Convierte un slug en un nombre legible para la vista pública.
 * @pure
 */
function slugToDisplayName(slug: string): string {
  const sanitizedSlug = slug.trim().replaceAll("-", " ").replaceAll("_", " ");
  if (!sanitizedSlug) {
    return "Reserva Latina";
  }

  return sanitizedSlug
    .split(" ")
    .filter(Boolean)
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(" ");
}
