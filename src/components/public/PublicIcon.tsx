/**
 * Archivo: PublicIcon.tsx
 * Responsabilidad: Renderizar iconos SVG locales reutilizables para la experiencia pública.
 * Tipo: UI
 */

interface PublicIconProps {
  name:
    | "arrowBack"
    | "menu"
    | "share"
    | "language"
    | "check"
    | "cancel"
    | "arrowForward"
    | "tableRestaurant"
    | "group"
    | "analytics"
    | "payments"
    | "shoppingCart"
    | "smartphone"
    | "checkCircle"
    | "timer"
    | "questionAnswer"
    | "autoAwesome"
    | "schedule"
    | "devices"
    | "architecture"
    | "favorite"
    | "precisionManufacturing"
    | "handshake"
    | "map"
    | "chatBubble"
    | "chevronRight"
    | "eventAvailable"
    | "restaurant"
    | "star"
    | "distance"
    | "locationOn"
    | "contactMail"
    | "pinDrop"
    | "calendarMonth"
    | "calendarAddOn"
    | "editCalendar"
    | "checkCircleFilled"
    | "expandMore"
    | "openInNew";
  className?: string;
}

const baseClassName = "h-6 w-6 shrink-0";

//-aqui empieza componente PublicIcon y es para reemplazar icon fonts externas-//
/**
 * Icono SVG local para evitar dependencia de fonts externas.
 */
export function PublicIcon({ name, className = "" }: PublicIconProps) {
  const svgClassName = `${baseClassName} ${className}`;

  switch (name) {
    case "arrowBack":
      return (
        <svg className={svgClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5" />
          <path d="m11 6-6 6 6 6" />
        </svg>
      );
    case "menu":
      return (
        <svg className={svgClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </svg>
      );
    case "share":
      return (
        <svg className={svgClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="2" />
          <circle cx="6" cy="12" r="2" />
          <circle cx="18" cy="19" r="2" />
          <path d="M8 11l8-4" />
          <path d="M8 13l8 4" />
        </svg>
      );
    case "language":
      return (
        <svg className={svgClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3c3 3 4.5 6 4.5 9S15 18 12 21c-3-3-4.5-6-4.5-9S9 6 12 3Z" />
        </svg>
      );
    case "check":
      return (
        <svg className={svgClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      );
    case "cancel":
      return (
        <svg className={svgClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M6 6l12 12" />
          <path d="M18 6 6 18" />
        </svg>
      );
    case "arrowForward":
      return (
        <svg className={svgClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </svg>
      );
    case "tableRestaurant":
      return (
        <svg className={svgClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12h16" />
          <path d="M7 12v6" />
          <path d="M17 12v6" />
          <path d="M6 6h12" />
          <path d="M10 6v6" />
          <path d="M14 6v6" />
        </svg>
      );
    case "group":
      return (
        <svg className={svgClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="8" r="3" />
          <path d="M4 20c.7-3.5 3.1-5.5 5-5.5S12.3 16.5 13 20" />
          <circle cx="17" cy="9" r="2.5" />
          <path d="M15.2 20c.4-2.3 1.9-3.8 3.5-3.8 1.3 0 2.6.9 3.3 3.8" />
        </svg>
      );
    case "analytics":
      return (
        <svg className={svgClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19V5" />
          <path d="M4 19h16" />
          <path d="M7 16v-4" />
          <path d="M12 16V8" />
          <path d="M17 16v-6" />
        </svg>
      );
    case "payments":
      return (
        <svg className={svgClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="6" width="16" height="12" rx="2" />
          <path d="M4 10h16" />
          <path d="M8 15h4" />
        </svg>
      );
    case "shoppingCart":
      return (
        <svg className={svgClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 6h2l2.5 10h8.5l2-7H8" />
          <circle cx="10" cy="19" r="1.5" />
          <circle cx="17" cy="19" r="1.5" />
        </svg>
      );
    case "smartphone":
      return (
        <svg className={svgClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="7" y="3" width="10" height="18" rx="2" />
          <path d="M10 7h4" />
          <circle cx="12" cy="18" r="0.5" fill="currentColor" stroke="none" />
        </svg>
      );
    case "checkCircle":
      return (
        <svg className={svgClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="m8.5 12.5 2.5 2.5 4.5-5" />
        </svg>
      );
    case "timer":
      return (
        <svg className={svgClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 3" />
          <path d="M12 3v2" />
          <path d="M19 12h2" />
        </svg>
      );
    case "questionAnswer":
      return (
        <svg className={svgClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 18h8" />
          <path d="M6 14h12" />
          <path d="M10 10h4" />
          <path d="M7 5h10a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3z" />
        </svg>
      );
    case "autoAwesome":
      return (
        <svg className={svgClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m12 3-1.5 4.5L6 9l3 3-1.5 4.5 4.5-3 4.5 3L15 12l3-3-4.5-1.5z" />
          <path d="M4 14l-1 3 3-1" />
          <path d="M20 14l1 3-3-1" />
        </svg>
      );
    case "schedule":
      return (
        <svg className={svgClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 3" />
        </svg>
      );
    case "devices":
      return (
        <svg className={svgClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="4" width="16" height="10" rx="2" />
          <path d="M8 21h8" />
          <path d="M12 17v4" />
        </svg>
      );
    case "architecture":
      return (
        <svg className={svgClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 20h16" />
          <path d="M6 20V8l6-4 6 4v12" />
          <path d="M9 20v-6h6v6" />
        </svg>
      );
    case "favorite":
      return (
        <svg className={svgClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 21s-6.5-4.2-9-8.5C1 9.2 3.1 5.5 7 5.5c2 0 3.4 1 5 2.7 1.6-1.7 3-2.7 5-2.7 3.9 0 6 3.7 4 7-2.5 4.3-9 8.5-9 8.5Z" />
        </svg>
      );
    case "precisionManufacturing":
      return (
        <svg className={svgClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3.5" />
          <path d="M12 2v3" />
          <path d="M12 19v3" />
          <path d="M2 12h3" />
          <path d="M19 12h3" />
          <path d="m4.9 4.9 2.1 2.1" />
          <path d="m17 17 2.1 2.1" />
          <path d="m4.9 19.1 2.1-2.1" />
          <path d="m17 7 2.1-2.1" />
        </svg>
      );
    case "handshake":
      return (
        <svg className={svgClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 12l2.5-2.5a2 2 0 0 1 2.8 0L14 11.2" />
          <path d="M10 14l1.5 1.5a2 2 0 0 0 2.8 0L18 12.8" />
          <path d="M4 12h3l2 2h3" />
          <path d="M20 12h-3l-2 2h-3" />
        </svg>
      );
    case "map":
      return (
        <svg className={svgClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m9 18 6 3 6-3V6l-6 3-6-3-6 3v12z" />
          <path d="M9 6v12" />
          <path d="M15 9v12" />
        </svg>
      );
    case "chatBubble":
      return (
        <svg className={svgClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 18l-3 3v-4a9 9 0 1 1 3 1z" />
          <path d="M8 12h8" />
          <path d="M8 9h5" />
        </svg>
      );
    case "chevronRight":
      return (
        <svg className={svgClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m9 6 6 6-6 6" />
        </svg>
      );
    case "eventAvailable":
      return (
        <svg className={svgClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="5" width="16" height="15" rx="2" />
          <path d="M8 3v4" />
          <path d="M16 3v4" />
          <path d="m9 13 2 2 4-4" />
        </svg>
      );
    case "restaurant":
      return (
        <svg className={svgClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 3v18" />
          <path d="M7 3c-1.7 0-3 1.3-3 3v4c0 1.7 1.3 3 3 3" />
          <path d="M11 3v7" />
          <path d="M11 10c0 1.7 1.3 3 3 3V3" />
          <path d="M17 3v18" />
        </svg>
      );
    case "star":
      return (
        <svg className={svgClassName} viewBox="0 0 24 24" fill="currentColor" stroke="none">
          <path d="m12 2 2.9 6 6.6.9-4.8 4.6 1.1 6.5L12 16.8 6.2 20l1.1-6.5L2.5 8.9 9.1 8z" />
        </svg>
      );
    case "distance":
      return (
        <svg className={svgClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 6h16" />
          <path d="M4 18h16" />
          <path d="m9 4 3-2 3 2" />
          <path d="m9 20 3 2 3-2" />
          <path d="M12 4v16" />
        </svg>
      );
    case "locationOn":
      return (
        <svg className={svgClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z" />
          <circle cx="12" cy="10" r="2" />
        </svg>
      );
    case "contactMail":
      return (
        <svg className={svgClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="5" width="16" height="14" rx="2" />
          <path d="m4 7 8 6 8-6" />
        </svg>
      );
    case "pinDrop":
      return (
        <svg className={svgClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 21s5-4.6 5-9a5 5 0 1 0-10 0c0 4.4 5 9 5 9Z" />
          <circle cx="12" cy="12" r="1.8" />
        </svg>
      );
    case "calendarMonth":
      return (
        <svg className={svgClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="5" width="16" height="15" rx="2" />
          <path d="M8 3v4" />
          <path d="M16 3v4" />
          <path d="M4 9h16" />
        </svg>
      );
    case "calendarAddOn":
      return (
        <svg className={svgClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="5" width="16" height="15" rx="2" />
          <path d="M8 3v4" />
          <path d="M16 3v4" />
          <path d="M4 9h16" />
          <path d="M12 13v4" />
          <path d="M10 15h4" />
        </svg>
      );
    case "editCalendar":
      return (
        <svg className={svgClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="5" width="16" height="15" rx="2" />
          <path d="M8 3v4" />
          <path d="M16 3v4" />
          <path d="M4 9h16" />
          <path d="m12.5 14.5 4-4a1.4 1.4 0 0 1 2 2l-4 4-3 1z" />
        </svg>
      );
    case "checkCircleFilled":
      return (
        <svg className={svgClassName} viewBox="0 0 24 24" fill="currentColor" stroke="none">
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm-1.1 14.1-3.6-3.6 1.4-1.4 2.2 2.2 4.9-4.9 1.4 1.4Z" />
        </svg>
      );
    case "expandMore":
      return (
        <svg className={svgClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
      );
    case "openInNew":
      return (
        <svg className={svgClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 5h5v5" />
          <path d="m10 14 9-9" />
          <path d="M19 13v6H5V5h6" />
        </svg>
      );
    default:
      return null;
  }
}
//-aqui termina componente PublicIcon-//
